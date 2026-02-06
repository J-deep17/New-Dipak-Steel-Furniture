import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  message?: string;
  productName?: string;
}

const WhatsAppButton = ({ message, productName }: WhatsAppButtonProps) => {
  const phoneNumber = "919824044585";
  
  const getWhatsAppMessage = () => {
    if (productName) {
      return encodeURIComponent(
        `Hi, I'm interested in ${productName} from Dipak Steel Furniture. Please share more details.`
      );
    }
    if (message) {
      return encodeURIComponent(message);
    }
    return encodeURIComponent(
      "Hi, I'm interested in your furniture products. Please share more details."
    );
  };

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${getWhatsAppMessage()}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl md:h-16 md:w-16"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7 md:h-8 md:w-8" />
    </a>
  );
};

export default WhatsAppButton;
