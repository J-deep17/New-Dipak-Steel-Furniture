
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService, Review } from "@/services/reviews";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, X, Trash2, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const AdminReviews = () => {
    const queryClient = useQueryClient();
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    const { data: reviews, isLoading } = useQuery({
        queryKey: ['admin-reviews'],
        queryFn: reviewService.getAllReviews
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' }) =>
            reviewService.updateStatus(id, status),
        onSuccess: () => {
            toast.success("Review status updated");
            queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
        },
        onError: () => toast.error("Failed to update status")
    });

    const deleteMutation = useMutation({
        mutationFn: reviewService.deleteReview,
        onSuccess: () => {
            toast.success("Review deleted");
            queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
        },
        onError: () => toast.error("Failed to delete review")
    });

    const handleStatusUpdate = (id: string, status: 'approved' | 'rejected') => {
        updateStatusMutation.mutate({ id, status });
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this review?")) {
            deleteMutation.mutate(id);
        }
    };

    const filteredReviews = reviews?.filter(review =>
        filterStatus === 'all' ? true : review.status === filterStatus
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
            case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
            default: return <Badge variant="secondary">Pending</Badge>;
        }
    };

    if (isLoading) return <div>Loading reviews...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Product Reviews</h1>
                <Select
                    value={filterStatus}
                    onValueChange={(v: any) => setFilterStatus(v)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Reviews</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Review</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredReviews?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                    No reviews found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredReviews?.map((review) => (
                                <TableRow key={review.id}>
                                    <TableCell className="font-medium max-w-[200px] truncate">
                                        {review.product?.title || 'Unknown Product'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm">User ID: {review.user_id.slice(0, 8)}...</span>
                                            {/* Ideally showing name/email if available */}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-yellow-500">
                                            {review.rating} <Star className="h-3 w-3 ml-1 fill-current" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[300px]">
                                        <div className="font-medium">{review.title}</div>
                                        <div className="text-sm text-muted-foreground truncate">{review.comment}</div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {format(new Date(review.created_at), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(review.status)}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {review.status === 'pending' && (
                                            <>
                                                <Button size="icon" variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleStatusUpdate(review.id, 'approved')}>
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleStatusUpdate(review.id, 'rejected')}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                        {review.status === 'rejected' && (
                                            <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(review.id, 'approved')}>
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {review.status === 'approved' && (
                                            <Button size="icon" variant="ghost" className="text-red-600" onClick={() => handleStatusUpdate(review.id, 'rejected')}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={() => handleDelete(review.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminReviews;
