import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import DOMPurify from "dompurify";

interface CarFaxButtonProps {
  embedCode?: string | null;
  vehicleTitle: string;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export default function CarFaxButton({ embedCode, vehicleTitle, className, size = "default" }: CarFaxButtonProps) {
  const handleCarFaxClick = () => {
    if (embedCode) {
      // Sanitize the embed code to prevent XSS attacks
      const sanitizedHTML = DOMPurify.sanitize(embedCode, {
        ALLOWED_TAGS: ['div', 'iframe', 'script'],
        ALLOWED_ATTR: ['src', 'id', 'class', 'width', 'height', 'frameborder'],
        ALLOW_DATA_ATTR: false
      });
      
      // Create a container for the sanitized embed code
      const container = document.createElement('div');
      container.innerHTML = sanitizedHTML;
      document.body.appendChild(container);
      
      // Safely execute only external scripts with src attributes
      const scripts = container.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src) {
          const newScript = document.createElement('script');
          newScript.src = scripts[i].src;
          document.body.appendChild(newScript);
        }
        // Note: Inline scripts are not executed for security reasons
      }
    } else {
      // Fallback to CarFax website if no embed code
      window.open('https://www.carfax.com/', '_blank');
    }
  };

  return (
    <Button 
      onClick={handleCarFaxClick}
      variant="outline" 
      size={size}
      className={`border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-600 transition-colors ${className}`}
    >
      <FileText className="w-4 h-4 mr-2" />
      {embedCode ? "View CarFax Report" : "Get CarFax Report"}
    </Button>
  );
}