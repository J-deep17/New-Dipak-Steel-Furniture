
import { Review } from "@/services/reviews";
import { Star } from "lucide-react";
import { format } from "date-fns";

interface ReviewsListProps {
    reviews: Review[];
}

const ReviewsList = ({ reviews }: ReviewsListProps) => {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No reviews yet. Be the first to review this product!
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-200"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="font-semibold">{review.title}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {format(new Date(review.created_at), 'MMM d, yyyy')}
                        </span>
                    </div>
                    <p className="text-gray-600 mb-2">{review.comment}</p>
                    <div className="text-xs text-muted-foreground">
                        Verified User
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewsList;
