import { Star, Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { testimonialsService } from "@/services/testimonials";

const CustomerReviews = () => {
  const { data: testimonials } = useQuery({
    queryKey: ['testimonials-public'],
    queryFn: testimonialsService.getTestimonials
  });

  // Fallback or Loading state could be handled, but user asked for graceful empty handling.
  // If no testimonials, we can hide the section or show nothing. 
  // However, plan said "Fetch only testimonials...". 
  // Let's use the fetched data if available.

  if (testimonials && testimonials.length === 0) {
    return null; // Gracefully handle empty state
  }

  const reviews = testimonials || []; // If loading or undefined, show empty or handle loading. 
  // Actually, creating a skeleton or just not rendering until loaded is better.
  // Given the requirement "Gracefully handle empty states", returning null if no data is a valid strategy.


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
              className="relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col h-full"
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
              <p className="mb-6 text-muted-foreground flex-grow">"{review.review_text}"</p>

              {/* Reviewer Info */}
              <div className="border-t border-border pt-4 mt-auto">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  {review.photo_url ? (
                    <img
                      src={review.photo_url}
                      alt={review.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold">
                      {review.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-foreground text-base testimonial-name">{review.name}</p>
                    {(review.designation || review.company) && (
                      <p className="text-sm text-muted-foreground font-normal testimonial-role">
                        {review.designation}
                        {review.designation && review.company && ", "}
                        {review.company}
                      </p>
                    )}
                    {review.city && (
                      <p className="text-[13px] text-accent font-medium uppercase tracking-wide testimonial-location">{review.city}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
