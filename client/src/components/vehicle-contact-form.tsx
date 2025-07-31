import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle } from "lucide-react";
import type { Vehicle } from "@shared/schema";

interface VehicleContactFormProps {
  vehicle: Vehicle;
}

export default function VehicleContactForm({ vehicle }: VehicleContactFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    inquiryType: "information",
    message: `I'm interested in the ${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''}. Please contact me with more information.`
  });
  
  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          vehicleId: vehicle.id,
          vehicleInfo: `${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''} - Stock #${vehicle.stockNumber || ''} - VIN: ${vehicle.vin || ''}`
        })
      });
      if (!response.ok) throw new Error("Failed to submit inquiry");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "We'll contact you within 2 hours about this vehicle."
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        inquiryType: "information",
        message: `I'm interested in the ${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''}. Please contact me with more information.`
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hidden fields for vehicle information */}
        <input type="hidden" value={vehicle.id || ""} />
        <input type="hidden" value={vehicle.stockNumber || ""} />
        <input type="hidden" value={vehicle.vin || ""} />
        <input type="hidden" value={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-gray-700">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-gray-700">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-gray-700">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-gray-700">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <Label htmlFor="inquiryType" className="text-gray-700">I'm interested in *</Label>
          <Select value={formData.inquiryType} onValueChange={(value) => setFormData(prev => ({ ...prev, inquiryType: value }))}>
            <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="information">More Information</SelectItem>
              <SelectItem value="testdrive">Schedule Test Drive</SelectItem>
              <SelectItem value="financing">Financing Options</SelectItem>
              <SelectItem value="tradein">Trade-In Value</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="message" className="text-gray-700">Message</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            rows={4}
            placeholder="Tell us more about what you're looking for..."
          />
        </div>

        <Button 
          type="submit" 
          disabled={submitMutation.isPending}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          {submitMutation.isPending ? (
            "Sending..."
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </>
          )}
        </Button>

        <div className="text-center text-sm text-gray-600">
          Vehicle: <span className="font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</span> • Stock #{vehicle.stockNumber}
        </div>
      </form>
    </div>
  );
}