import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { FAQData } from "@/services/cms";

interface FAQSectionProps {
  faqs?: FAQData[];
}

const defaultFaqs = [
  {
    id: "default-1",
    question: "What is the best office chair for long hours?",
    answer:
      "The best office chair for long hours is an ergonomic chair with proper lumbar support, adjustable height, and breathable mesh back. At Dipak Furniture, we recommend our Executive Director Chairs and Ergonomic Mesh Chairs that feature high-back design, adjustable headrest, and premium cushioning for 8+ hours of comfortable seating. These chairs are specifically designed to reduce fatigue and prevent back pain during extended work sessions.",
  },
  {
    id: "default-2",
    question: "Which office chair is best for back pain?",
    answer:
      "For back pain relief, choose an ergonomic office chair with built-in lumbar support, adjustable seat height, and proper spine alignment. Our Ergonomic Task Chairs and Director Chairs with contoured backrests are ideal for those suffering from back pain. Features like adjustable armrests, seat depth adjustment, and high-density foam cushioning help maintain proper posture and reduce strain on your lower back.",
  },
  {
    id: "default-3",
    question: "How to choose an ergonomic office chair?",
    answer:
      "When choosing an ergonomic office chair, consider these factors: 1) Adjustable seat height to keep feet flat on the floor, 2) Lumbar support for lower back, 3) Adjustable armrests at elbow height, 4) Seat depth adjustment, 5) Breathable material like mesh for ventilation, 6) Swivel base for easy movement. Visit our showroom in Ahmedabad or contact us for personalized recommendations based on your body type and work requirements.",
  },
  {
    id: "default-4",
    question: "Where to buy office furniture in Ahmedabad?",
    answer:
      "Dipak Furniture is a leading office furniture manufacturer in Ahmedabad with over 25 years of experience. Visit our showroom at Amraiwadi, Ahmedabad to explore our complete range of executive chairs, task chairs, visitor chairs, office tables, steel almirahs, and institutional furniture. We offer factory-direct prices, bulk order discounts, and free delivery across Gujarat. Call +91 98240 44585 for enquiries.",
  },
  {
    id: "default-5",
    question: "What types of office furniture does Dipak Furniture manufacture?",
    answer:
      "We manufacture a comprehensive range of office and institutional furniture including: Executive & Director Chairs, Task & Staff Chairs, Visitor & Reception Chairs, Office Tables & Workstations, Steel Almirahs & Storage Cabinets, School & Classroom Furniture, Public & Institutional Seating, Metal Beds, Dining Sets, and Office Sofas. All products are made with premium materials and carry our quality warranty.",
  },
  {
    id: "default-6",
    question: "Do you offer bulk discounts for office furniture orders?",
    answer:
      "Yes! We are a wholesale office furniture supplier offering competitive bulk discounts for large orders. Whether you're furnishing a new office, school, hospital, or government institution, we provide special pricing for bulk purchases. Contact our sales team for a customized quote based on your quantity requirements.",
  },
  {
    id: "default-7",
    question: "What warranty do you provide on office chairs?",
    answer:
      "We provide warranty on selected products, with coverage varying by model and up to a maximum of 2 years. Warranty terms are mentioned on each product page.",
  },
  {
    id: "default-8",
    question: "Do you deliver office furniture across India?",
    answer:
      "Yes, we deliver office furniture across all major cities in India including Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, and all cities in Gujarat. We have an efficient logistics network ensuring safe and timely delivery. Local delivery in Ahmedabad and Gujarat is typically faster with installation support available.",
  },
];

const FAQSection = ({ faqs }: FAQSectionProps) => {
  // Use CMS FAQs if available, otherwise use defaults
  const displayFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-accent">
            Frequently Asked Questions
          </p>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Office Furniture Buying Guide
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Get answers to common questions about choosing the right office
            furniture for your workspace.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {displayFaqs.map((faq, index) => (
              <AccordionItem
                key={faq.id || index}
                value={`item-${faq.id || index}`}
                className="rounded-lg border border-border bg-card px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-accent hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-10 text-center">
          <p className="mb-4 text-muted-foreground">
            Have more questions? We're here to help!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Contact Us
            </Link>
            <a
              href="https://wa.me/919824044585?text=Hi%2C%20I%20have%20a%20question%20about%20your%20office%20furniture."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[#25D366] bg-transparent px-6 py-3 font-medium text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white"
            >
              WhatsApp Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
