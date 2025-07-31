import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { ArrowLeft, Shield, Clock, FileText } from "lucide-react";

interface ApplicationFormData {
  borrowerFirstName: string;
  borrowerLastName: string;
  borrowerEmail: string;
  borrowerPhone: string;
  borrowerDob: string;
  borrowerSsn: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  priorAddress: string;
  livingSituation: string;
  residenceDuration: string;
  monthlyPayment: string;
  employer: string;
  yearsEmployed: string;
  employerPhone: string;
  monthlyGrossIncome: string;
  bankName: string;
  accountType: string;
  coBorrowerFirstName: string;
  coBorrowerLastName: string;
  coBorrowerEmail: string;
  coBorrowerPhone: string;
  coBorrowerDob: string;
  coBorrowerSsn: string;
  notes: string;
  consentToSms: boolean;
}

export default function Application() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ApplicationFormData>({
    borrowerFirstName: "",
    borrowerLastName: "",
    borrowerEmail: "",
    borrowerPhone: "",
    borrowerDob: "",
    borrowerSsn: "",
    streetAddress: "",
    city: "",
    state: "",
    country: "United States",
    postalCode: "",
    priorAddress: "",
    livingSituation: "",
    residenceDuration: "",
    monthlyPayment: "",
    employer: "",
    yearsEmployed: "",
    employerPhone: "",
    monthlyGrossIncome: "",
    bankName: "",
    accountType: "",
    coBorrowerFirstName: "",
    coBorrowerLastName: "",
    coBorrowerEmail: "",
    coBorrowerPhone: "",
    coBorrowerDob: "",
    coBorrowerSsn: "",
    notes: "",
    consentToSms: false,
  });

  const submitApplication = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          monthlyPayment: data.monthlyPayment ? parseInt(data.monthlyPayment) * 100 : null, // Convert to cents
          monthlyGrossIncome: data.monthlyGrossIncome ? parseInt(data.monthlyGrossIncome) * 100 : null, // Convert to cents
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit application");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Application Submitted Successfully!",
        description: `Your application (#${data.applicationId}) has been received. We'll contact you within 24 hours.`,
      });
      setFormData({
        borrowerFirstName: "",
        borrowerLastName: "",
        borrowerEmail: "",
        borrowerPhone: "",
        borrowerDob: "",
        borrowerSsn: "",
        streetAddress: "",
        city: "",
        state: "",
        country: "United States",
        postalCode: "",
        priorAddress: "",
        livingSituation: "",
        residenceDuration: "",
        monthlyPayment: "",
        employer: "",
        yearsEmployed: "",
        employerPhone: "",
        monthlyGrossIncome: "",
        bankName: "",
        accountType: "",
        coBorrowerFirstName: "",
        coBorrowerLastName: "",
        coBorrowerEmail: "",
        coBorrowerPhone: "",
        coBorrowerDob: "",
        coBorrowerSsn: "",
        notes: "",
        consentToSms: false,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitApplication.mutate(formData);
  };

  const handleInputChange = (field: keyof ApplicationFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Credit Application</h1>
          <p className="text-gray-600 mt-2">
            Complete our simple application below to get pre-qualified for your next vehicle purchase. 
            It only takes a few minutes, and you'll receive a response quickly.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Primary Borrower Information */}
          <Card>
            <CardHeader>
              <CardTitle>Primary Borrower Information</CardTitle>
              <CardDescription>
                Please provide your basic contact and personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="borrowerFirstName">First Name *</Label>
                  <Input
                    id="borrowerFirstName"
                    value={formData.borrowerFirstName}
                    onChange={(e) => handleInputChange("borrowerFirstName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="borrowerLastName">Last Name *</Label>
                  <Input
                    id="borrowerLastName"
                    value={formData.borrowerLastName}
                    onChange={(e) => handleInputChange("borrowerLastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="borrowerEmail">Email *</Label>
                  <Input
                    id="borrowerEmail"
                    type="email"
                    value={formData.borrowerEmail}
                    onChange={(e) => handleInputChange("borrowerEmail", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="borrowerPhone">Phone *</Label>
                  <Input
                    id="borrowerPhone"
                    type="tel"
                    value={formData.borrowerPhone}
                    onChange={(e) => handleInputChange("borrowerPhone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="borrowerDob">Date of Birth</Label>
                  <Input
                    id="borrowerDob"
                    type="date"
                    value={formData.borrowerDob}
                    onChange={(e) => handleInputChange("borrowerDob", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="borrowerSsn">Social Security Number</Label>
                  <Input
                    id="borrowerSsn"
                    value={formData.borrowerSsn}
                    onChange={(e) => handleInputChange("borrowerSsn", e.target.value)}
                    placeholder="XXX-XX-XXXX"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consentToSms"
                  checked={formData.consentToSms}
                  onCheckedChange={(checked) => handleInputChange("consentToSms", checked as boolean)}
                />
                <Label htmlFor="consentToSms" className="text-sm">
                  I consent to receive SMS notifications, alerts & occasional marketing communication. 
                  Message frequency varies. Message & data rates may apply. You can reply STOP to unsubscribe.
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  id="streetAddress"
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange("streetAddress", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="priorAddress">Prior Address (if less than 2 years at current)</Label>
                <Input
                  id="priorAddress"
                  value={formData.priorAddress}
                  onChange={(e) => handleInputChange("priorAddress", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Living Situation */}
          <Card>
            <CardHeader>
              <CardTitle>Current Living Situation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="livingSituation">Do you Own, Rent, or Live Rent-Free?</Label>
                  <Select onValueChange={(value) => handleInputChange("livingSituation", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="own">Own</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="lend">Live Rent-Free</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="residenceDuration">How long at current residence?</Label>
                  <Input
                    id="residenceDuration"
                    value={formData.residenceDuration}
                    onChange={(e) => handleInputChange("residenceDuration", e.target.value)}
                    placeholder="e.g., 2 years, 6 months"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="monthlyPayment">Monthly Housing Payment (Rent/Mortgage)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="monthlyPayment"
                    type="number"
                    value={formData.monthlyPayment}
                    onChange={(e) => handleInputChange("monthlyPayment", e.target.value)}
                    className="pl-7"
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Employment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employer">Employer</Label>
                  <Input
                    id="employer"
                    value={formData.employer}
                    onChange={(e) => handleInputChange("employer", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="yearsEmployed">Years Employed</Label>
                  <Input
                    id="yearsEmployed"
                    value={formData.yearsEmployed}
                    onChange={(e) => handleInputChange("yearsEmployed", e.target.value)}
                    placeholder="e.g., 3 years, 18 months"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employerPhone">Employer Phone</Label>
                  <Input
                    id="employerPhone"
                    type="tel"
                    value={formData.employerPhone}
                    onChange={(e) => handleInputChange("employerPhone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyGrossIncome">Monthly Gross Income</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="monthlyGrossIncome"
                      type="number"
                      value={formData.monthlyGrossIncome}
                      onChange={(e) => handleInputChange("monthlyGrossIncome", e.target.value)}
                      className="pl-7"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Banking Information */}
          <Card>
            <CardHeader>
              <CardTitle>Banking Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange("bankName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select onValueChange={(value) => handleInputChange("accountType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Co-Borrower Information */}
          <Card>
            <CardHeader>
              <CardTitle>Co-Borrower Information</CardTitle>
              <CardDescription>Optional - Complete only if applying with a co-borrower</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="coBorrowerFirstName">Co-Borrower First Name</Label>
                  <Input
                    id="coBorrowerFirstName"
                    value={formData.coBorrowerFirstName}
                    onChange={(e) => handleInputChange("coBorrowerFirstName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="coBorrowerLastName">Co-Borrower Last Name</Label>
                  <Input
                    id="coBorrowerLastName"
                    value={formData.coBorrowerLastName}
                    onChange={(e) => handleInputChange("coBorrowerLastName", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="coBorrowerEmail">Co-Borrower Email</Label>
                  <Input
                    id="coBorrowerEmail"
                    type="email"
                    value={formData.coBorrowerEmail}
                    onChange={(e) => handleInputChange("coBorrowerEmail", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="coBorrowerPhone">Co-Borrower Phone</Label>
                  <Input
                    id="coBorrowerPhone"
                    type="tel"
                    value={formData.coBorrowerPhone}
                    onChange={(e) => handleInputChange("coBorrowerPhone", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="coBorrowerDob">Co-Borrower Date of Birth</Label>
                  <Input
                    id="coBorrowerDob"
                    type="date"
                    value={formData.coBorrowerDob}
                    onChange={(e) => handleInputChange("coBorrowerDob", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="coBorrowerSsn">Co-Borrower Social Security Number</Label>
                  <Input
                    id="coBorrowerSsn"
                    value={formData.coBorrowerSsn}
                    onChange={(e) => handleInputChange("coBorrowerSsn", e.target.value)}
                    placeholder="XXX-XX-XXXX"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="notes">Additional Notes or Comments</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Tell us about any special circumstances, specific vehicle interests, or other relevant information..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={submitApplication.isPending}
              >
                {submitApplication.isPending ? "Submitting Application..." : "Submit Application"}
              </Button>
            </CardContent>
          </Card>
        </form>

        {/* What to Expect Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Secure Application</h3>
              <p className="text-sm text-gray-600">
                Your information is protected with industry-standard security measures. 
                We never share your personal data with unauthorized third parties.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Quick Process</h3>
              <p className="text-sm text-gray-600">
                Our streamlined application typically takes less than 5 minutes to complete. 
                Get a decision faster and shop with confidence.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">What You'll Need</h3>
              <ul className="text-sm text-gray-600 text-left">
                <li>• Valid driver's license</li>
                <li>• Proof of income</li>
                <li>• Proof of residence</li>
                <li>• Social security number</li>
                <li>• Basic contact information</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Footer Contact Info */}
        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">
            <strong>Office:</strong> 1300 South 9th St, Richmond, IN 47374
          </p>
          <p className="mb-2">
            <strong>Call:</strong> 765-238-2887 | 
            <strong> Email:</strong> info@trexmotors.com
          </p>
          <p className="text-sm">
            After submitting your application, our financing team will review your information 
            and contact you within 24 hours to discuss the next steps.
          </p>
        </div>
      </div>
    </div>
  );
}