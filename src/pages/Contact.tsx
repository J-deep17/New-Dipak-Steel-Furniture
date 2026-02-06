import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/products";
import { cmsPagesService, ContactPageContent } from "@/services/cmsPages";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone: z
    .string()
    .trim()
    .min(10, { message: "Please enter a valid phone number" })
    .max(15, { message: "Phone number must be less than 15 characters" })
    .regex(/^[0-9+\-\s]+$/, { message: "Please enter a valid phone number" }),
  interest: z.string().min(1, { message: "Please select a category" }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Default CMS content for fallback
const defaultContent: ContactPageContent = {
  hero: {
    heading: "Contact Dipak Furniture – Office Furniture Shop in Ahmedabad",
    subheading: "Get in touch for enquiries, quotes, or visit our showroom. We're here to help you find the perfect office furniture solution."
  },
  contact_info: {
    heading: "Get In Touch – Office Furniture Near You",
    description: "We'd love to hear from you. Whether you're looking for <strong>office chairs</strong>, <strong>steel almirahs</strong>, or <strong>institutional furniture</strong>, reach out through any of the channels below or fill out the contact form."
  },
  address: {
    line1: "Plot-4, No. 2 Bhagirath Estate,",
    line2: "Opp. Jawaharnagar, Near Gulabnagar Char Rasta,",
    line3: "Amraiwadi, Ahmedabad, Gujarat – 380026"
  },
  business_hours: {
    weekdays: "Monday - Saturday: 9:00 AM - 7:00 PM",
    sunday: "Sunday: Closed"
  },
  map_heading: "Visit Our Office Furniture Showroom in Ahmedabad",
  form_heading: "Request a Free Quote"
};

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: productService.getCategories
  });

  const { data: cmsContent } = useQuery({
    queryKey: ['cms-page', 'contact_page'],
    queryFn: () => cmsPagesService.getPageContent<ContactPageContent>('contact_page')
  });

  // Use CMS content or fallback to default
  const content = cmsContent || defaultContent;

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      interest: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent!",
      description:
        "Thank you for reaching out. Our team will contact you within 24 hours.",
    });

    form.reset();
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <SEOHead
        title="Contact Dipak Furniture | Office Furniture Shop Ahmedabad | Get Quote"
        description="Contact Dipak Furniture for office chairs, steel almirahs & institutional furniture. Visit our showroom in Amraiwadi, Ahmedabad or call +91 98240 44585. Get free quotes for bulk orders."
        keywords="contact dipak furniture, office furniture shop ahmedabad, office furniture near me, furniture store ahmedabad, buy office chairs ahmedabad"
      />

      {/* Hero Section */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-primary-foreground md:text-5xl">
              {content.hero.heading}
            </h1>
            <p className="text-lg text-primary-foreground/80">
              {content.hero.subheading}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                {content.contact_info.heading}
              </h2>
              <p className="mb-8 text-muted-foreground" dangerouslySetInnerHTML={{ __html: content.contact_info.description }} />

              <div className="space-y-6">
                <a
                  href="tel:+919824044585"
                  className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:border-accent/50"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Call Now</p>
                    <p className="text-muted-foreground">+91 98240 44585</p>
                    <p className="text-sm text-accent">Click to call</p>
                  </div>
                </a>

                <a
                  href="mailto:dipaksteel@gmail.com"
                  className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:border-accent/50"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email Us</p>
                    <p className="text-muted-foreground">dipaksteel@gmail.com</p>
                    <p className="text-sm text-accent">Click to email</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/919824044585?text=Hi%2C%20I%27m%20interested%20in%20your%20furniture%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:border-accent/50"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#25D366]/10 text-[#25D366]">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">WhatsApp Now</p>
                    <p className="text-muted-foreground">+91 98240 44585</p>
                    <p className="text-sm text-[#25D366]">Chat on WhatsApp</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 rounded-lg border border-border p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Visit Our Showroom</p>
                    <p className="text-muted-foreground">
                      {content.address.line1}
                      <br />
                      {content.address.line2}
                      <br />
                      {content.address.line3}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg border border-border p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Business Hours
                    </p>
                    <p className="text-muted-foreground">
                      {content.business_hours.weekdays}
                      <br />
                      {content.business_hours.sunday}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-8">
                <h3 className="mb-4 font-semibold text-foreground">Browse Our Products</h3>
                <div className="flex flex-wrap gap-2">
                  {categories?.slice(0, 6).map((category) => (
                    <Link
                      key={category.id}
                      to={`/products/${category.slug}`}
                      className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-xl border border-border bg-card p-6 md:p-8">
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                {content.form_heading}
              </h2>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+91 98765 43210"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="interest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Interest</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={category.slug}>
                                {category.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="bulk-order">
                              Bulk / Wholesale Order
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your requirements..."
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Get Free Quote
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-16">
        <div className="container">
          <h2 className="mb-6 text-2xl font-bold text-foreground text-center">
            {content.map_heading}
          </h2>
          <div className="relative overflow-hidden rounded-xl border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.6891861654985!2d72.6074897!3d23.0302844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e87d3c1234567%3A0x1234567890abcdef!2sDipak%20Steel%20Furniture!5e0!3m2!1sen!2sin!4v1706012345678!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Dipak Furniture Location - Office Furniture Shop Ahmedabad"
            />
            <div className="absolute bottom-4 right-4">
              <a
                href="https://maps.app.goo.gl/qVGfeiJaKjF6URHU8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-lg transition-colors hover:bg-accent/90"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
