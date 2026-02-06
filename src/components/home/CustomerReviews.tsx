import { Star, Quote } from "lucide-react";
import { TestimonialData } from "@/services/cms";

interface CustomerReviewsProps {
  testimonials?: TestimonialData[];
}

const defaultReviews = [
  {
    id: "default-1",
    name: "Rajesh Patel",
    message:
      "Excellent quality executive chairs! We ordered 50 chairs for our new office and the durability is outstanding. Highly recommend Dipak Steel Furniture.",
    rating: 5,
  },
  {
    id: "default-2",
    name: "Priya Sharma",
    message:
      "We furnished our entire school with their classroom benches and chairs. The build quality is perfect for heavy daily use. Great value for money!",
    rating: 5,
  },
  {
    id: "default-3",
    name: "Dr. Amit Desai",
    message:
      "The institutional seating and steel beds we purchased are exactly what we needed. Durable, easy to clean, and very comfortable for patients.",
    rating: 5,
  },
  {
    id: "default-4",
    name: "Meera Joshi",
    message:
      "I've been recommending Dipak Steel Furniture to all my clients. Their sofa sets and almirahs are stylish and built to last. Excellent craftsmanship!",
    rating: 5,
  },
  {
    id: "default-5",
    name: "Vikram Singh",
    message:
      "Our startup ordered task chairs and workstations for 100+ employees. The ergonomic design has really improved employee comfort and productivity.",
    rating: 5,
  },
  {
    id: "default-6",
    name: "Anita Mehta",
    message:
      "The dining sets and cafe chairs are perfect for our restaurants. Easy maintenance and they look great even after years of heavy use.",
    rating: 5,
  },
];

const CustomerReviews = ({ testimonials }: CustomerReviewsProps) => {
  // Use CMS testimonials if available, otherwise use defaults
  const reviews = testimonials && testimonials.length > 0 ? testimonials : defaultReviews;

  return (
    <section className="bg-secondary/50 py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-accent">
            Testimonials
          </p>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Trusted by offices, schools, hospitals, and homes across Gujarat and
            India for quality furniture solutions.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Quote Icon */}
              <Quote className="absolute right-4 top-4 h-8 w-8 text-accent/20" />

              {/* Rating */}
              <div className="mb-4 flex gap-1">
                {[...Array(review.rating || 5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="mb-6 text-muted-foreground">"{review.message}"</p>

              {/* Reviewer Info */}
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">{review.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
