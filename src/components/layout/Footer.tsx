import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Download, Instagram, MessageCircle, Facebook, Linkedin, Twitter, Youtube, Pin } from "lucide-react";
import { footerService } from "@/services/footer";
import { useQuery } from "@tanstack/react-query";
import { legalService } from "@/services/legal";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";



const ICON_MAP: Record<string, any> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  whatsapp: MessageCircle,
  pinterest: Pin,
};

const quickLinks = [
  { name: "About Us", path: "/about" },
  { name: "Our Philosophy", path: "/philosophy" },
  { name: "Materials & Finishes", path: "/materials" },
  { name: "Quality Assurance", path: "/quality" },
  { name: "All Products", path: "/products" },
  { name: "Contact Us", path: "/contact" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const { data: legalPages } = useQuery({
    queryKey: ['footer-legal-pages'],
    queryFn: legalService.getPublishedPages
  });

  const { data: socialLinks } = useQuery({
    queryKey: ['footer-links-public'],
    queryFn: footerService.getFooterLinks
  });

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand & About */}
          <div className="space-y-4">
            <div>
              <img
                src={logo}
                alt="Dipak Furniture"
                className="h-16 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/80">
              Designing Comfort. Delivering Quality. Premium office and
              institutional furniture crafted for Indian workspaces since
              decades.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
              <Clock className="h-4 w-4" />
              Mon - Sat: 9:00 AM - 7:00 PM
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-accent bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <a href="/Dipak_Furniture_Catalog.pdf" download="Dipak-Furniture-Catalog.pdf">
                <Download className="mr-2 h-4 w-4" />
                Download Catalogue
              </a>
            </Button>


            {/* Social Media Icons */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks?.map((link) => {
                const Icon = ICON_MAP[link.icon] || MessageCircle;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-all hover:bg-white hover:text-primary hover:scale-110"
                    aria-label={`Follow us on ${link.platform}`}
                    title={link.platform}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Products Placeholder - Dynamic content to be added later */}
          {/* Information & Legal */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Information</h4>
            <ul className="space-y-2">
              {legalPages && legalPages.length > 0 ? (
                legalPages.map((page) => (
                  <li key={page.slug}>
                    <Link
                      to={`/legal/${page.slug}`}
                      className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                    >
                      {page.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm text-primary-foreground/50 italic">
                  No pages available
                </li>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+919824044585"
                  className="flex items-start gap-3 text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                  +91 98240 44585
                </a>
              </li>
              <li>
                <a
                  href="mailto:dipaksteel@gmail.com"
                  className="flex items-start gap-3 text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                  dipaksteel@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Plot-4, No. 2 Bhagirath Estate,
                  <br />
                  Opp. Jawaharnagar, Near Gulabnagar Char Rasta,
                  <br />
                  Amraiwadi, Ahmedabad - 380026
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-primary-foreground/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="text-sm text-primary-foreground/60">
              © {currentYear} Dipak Steel Furniture. All rights reserved.
            </p>
            <p className="text-sm text-primary-foreground/60">
              Made with pride in Ahmedabad, India 🇮🇳
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
