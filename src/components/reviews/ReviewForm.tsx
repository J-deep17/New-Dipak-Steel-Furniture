
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { reviewService } from "@/services/reviews";
import { useAuth } from "@/contexts/AuthContext";

interface ReviewFormProps {
    productId: string;
    onSuccess: () => void;
}

interface FormData {
    title: string;
    comment: string;
}

const ReviewForm = ({ productId, onSuccess }: ReviewFormProps) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

    if (!user) {
        return (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-600 mb-4">Please log in to write a review.</p>
                <Button variant="outline" asChild>
                    <a href="/login">Log In</a>
                </Button>
            </div>
        );
    }

    const onSubmit = async (data: FormData) => {
        if (rating === 0) {
            toast({
                title: "Rating required",
                description: "Please select a star rating.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await reviewService.submitReview({
                product_id: productId,
                user_id: user.id,
                rating,
                title: data.title,
                comment: data.comment
            });

            toast({
                title: "Review submitted",
                description: "Your review is pending approval."
            });
            reset();
            setRating(0);
            onSuccess();
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to submit review. You may have already reviewed this product.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold">Write a Review</h3>

            <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            type="button"
                            key={star}
                            className="focus:outline-none transition-colors"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                className={`w-6 h-6 ${(hoverRating || rating) >= star
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                    placeholder="Brief summary of your review"
                    {...register("title", { required: "Title is required" })}
                />
                {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Review</label>
                <Textarea
                    placeholder="Share your experience with this product"
                    className="min-h-[100px]"
                    {...register("comment", { required: "Comment is required" })}
                />
                {errors.comment && <span className="text-red-500 text-xs">{errors.comment.message}</span>}
            </div>

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
        </form>
    );
};

export default ReviewForm;
