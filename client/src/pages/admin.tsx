import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, RefreshCw, Plus, Eye, Edit, Car, Upload, CheckCircle, AlertCircle, DollarSign, Clock, Trash2, ArrowRight, Star, FileSpreadsheet, Smartphone, Camera, FileText, Users, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HistoryReportManager from "@/components/history-report-manager";
import VehicleImageUploader from "@/components/vehicle-image-uploader";
import SystemStatus from "@/components/system-status";
import DriveImagePreview from "@/components/drive-image-preview";
import MobileVehicleForm from "@/components/mobile-vehicle-form";
import DriveFolderScanner from "@/components/drive-folder-scanner";

interface Vehicle {
  id: number;
  title: string;
  make: string;
  model: string;
  year: string;
  price: number;
  status: string;
  mileage: string;
  vin: string;
  stockNumber: string;
  exteriorColor: string;
  interiorColor: string;
  description: string;
  notes: string;
  images?: string[];
  carfaxEmbedCode?: string | null;
  autoCheckUrl?: string | null;
  vehicleHistoryScore?: number | null;
  accidentHistory?: number;
  previousOwners?: number;
  serviceRecords?: number;
  titleStatus?: string;
  lastHistoryUpdate?: string | null;
  bannerReduced?: boolean;
  bannerSold?: boolean;
  bannerGreatDeal?: boolean;
}

interface CustomerApplication {
  id: number;
  status: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
  borrowerFirstName: string;
  borrowerLastName: string;
  borrowerEmail: string;
  borrowerPhone: string;
  borrowerDob?: string;
  borrowerSsn?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  priorAddress?: string;
  livingSituation?: string;
  residenceDuration?: string;
  monthlyPayment?: number;
  employer?: string;
  yearsEmployed?: string;
  employerPhone?: string;
  monthlyGrossIncome?: number;
  bankName?: string;
  accountType?: string;
  coBorrowerFirstName?: string;
  coBorrowerLastName?: string;
  coBorrowerEmail?: string;
  coBorrowerPhone?: string;
  coBorrowerDob?: string;
  coBorrowerSsn?: string;
  notes?: string;
  consentToSms?: boolean;
  interestedVehicle?: number;
}

interface PendingChange {
  type: 'new' | 'price_update' | 'status_update';
  vehicle: any;
  oldValue?: any;
  newValue?: any;
}

export default function AdminDashboard() {
  // Detect if user is on mobile device
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      setIsMobile(mobileRegex.test(userAgent.toLowerCase()) || window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  // Utility function to convert Google Drive URLs to direct image URLs
  const getDirectImageUrl = (url: string): string => {
    if (!url) return '';
    
    // Handle Google Drive sharing URLs
    if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match) {
        return `https://drive.google.com/uc?id=${match[1]}`;
      }
    }
    
    // Handle Google Drive uc URLs (already direct)
    if (url.includes('drive.google.com/uc?id=')) {
      return url;
    }
    
    // Return original URL for other formats
    return url;
  };

  // Enhanced function for thumbnails with better error handling
  const getThumbnailUrl = (url: string): string => {
    if (!url) return '';
    
    // Handle Google Drive URLs - use thumbnail parameter for smaller images
    if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w150`;
      }
    }
    
    // Handle Google Drive uc URLs - add thumbnail parameter
    if (url.includes('drive.google.com/uc?id=')) {
      const urlObj = new URL(url);
      const id = urlObj.searchParams.get('id');
      if (id) {
        return `https://drive.google.com/thumbnail?id=${id}&sz=w150`;
      }
    }
    
    // Return processed URL for other formats
    return getDirectImageUrl(url);
  };

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddVehicleDialogOpen, setIsAddVehicleDialogOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState('root');
  const [folderPath, setFolderPath] = useState<{id: string, name: string}[]>([{id: 'root', name: 'My Drive'}]);
  const [isRowUploaderOpen, setIsRowUploaderOpen] = useState(false);
  const [pastedRowData, setPastedRowData] = useState('');
  const [parsedVehicleData, setParsedVehicleData] = useState<any>(null);
  const [vehicleCreationStep, setVehicleCreationStep] = useState<'paste' | 'preview' | 'create'>('paste');
  const [selectedImages, setSelectedImages] = useState<{ url: string; featured: boolean }[]>([]);
  const [isVehicleWorkflowOpen, setIsVehicleWorkflowOpen] = useState(false);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [isDrivePreviewOpen, setIsDrivePreviewOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    title: "",
    make: "",
    model: "",
    year: "",
    price: 0,
    status: "for-sale",
    mileage: "",
    vin: "",
    stockNumber: "",
    exteriorColor: "",
    interiorColor: "",
    engine: "",
    transmission: "",
    driveType: "FWD",
    description: "",
    images: [] as string[],
    keyFeatures: [] as string[],
    carfaxEmbedCode: "",
    bannerReduced: false,
    bannerSold: false,
    bannerGreatDeal: false,
    bannerNew: false
  });


  // Spreadsheet column mapping based on T-Rex Motors format
  const spreadsheetColumns = [
    'status', 'stockNumber', 'vin', 'year', 'make', 'model', 'miles', 'price',
    'exteriorColor', 'interiorColor', 'description', 'notes', 'featuredImage',
    'image2', 'image3', 'image4', 'image5', 'image6', 'image7', 'code'
  ];

  // Parse pasted row data into vehicle object
  const parseRowData = (rawData: string) => {
    try {
      // Split by tabs (from Excel/Google Sheets copy)
      const cells = rawData.split('\t').map(cell => cell.trim());
      
      if (cells.length < 8) {
        throw new Error('Insufficient data - need at least Status, Stock#, VIN, Year, Make, Model, Miles, Price');
      }

      // Map cells to vehicle data
      const vehicleData = {
        status: cells[0]?.toLowerCase().replace(/\s+/g, '-') || 'for-sale',
        stockNumber: cells[1] || '',
        vin: cells[2]?.toUpperCase() || '',
        year: cells[3] || '',
        make: cells[4] || '',
        model: cells[5] || '',
        mileage: cells[6] || '',
        price: parseInt(cells[7]?.replace(/[^0-9]/g, '')) || 0,
        exteriorColor: cells[8] || '',
        interiorColor: cells[9] || '',
        description: cells[10] || '',
        notes: cells[11] || '',
        images: [
          cells[12], // Featured image
          cells[13], // Image 2
          cells[14], // Image 3
          cells[15], // Image 4
          cells[16], // Image 5
          cells[17], // Image 6
          cells[18]  // Image 7
        ].filter(img => img && img.trim()), // Remove empty images
        title: `${cells[3]} ${cells[4]} ${cells[5]}`.trim(),
        engine: 'Not specified',
        transmission: 'Not specified',
        driveType: 'FWD',
        keyFeatures: [],
        carfaxEmbedCode: '',
        bannerReduced: false,
        bannerSold: false,
        bannerGreatDeal: false
      };

      return vehicleData;
    } catch (error) {
      throw new Error(`Failed to parse row data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Handle row data parsing
  const handleRowParse = () => {
    try {
      const parsed = parseRowData(pastedRowData);
      setParsedVehicleData(parsed);
      toast({ 
        title: "Row Parsed Successfully", 
        description: `Vehicle: ${parsed.title} - Ready for image upload and saving` 
      });
    } catch (error) {
      toast({ 
        title: "Parse Error", 
        description: error instanceof Error ? error.message : 'Unknown error', 
        variant: "destructive" 
      });
    }
  };

  // Start staged vehicle creation workflow
  const startVehicleWorkflow = () => {
    if (parsedVehicleData) {
      setVehicleCreationStep('preview');
      setIsRowUploaderOpen(false);
      setIsVehicleWorkflowOpen(true);
      toast({ 
        title: "Data Parsed Successfully", 
        description: "Now preview and select vehicle images." 
      });
    }
  };

  // Handle image selection from Drive preview
  const handleImageSelection = (images: { url: string; featured: boolean }[]) => {
    setSelectedImages(images);
  };

  // Proceed to vehicle creation with selected images
  const proceedToVehicleCreation = () => {
    if (parsedVehicleData && selectedImages.length > 0) {
      // Update parsed data with selected images
      const updatedVehicle = {
        ...parsedVehicleData,
        images: selectedImages.map(img => img.url),
        bannerNew: true, // Mark as NEW
      };
      setNewVehicle(updatedVehicle);
      setVehicleCreationStep('create');
      toast({ 
        title: "Images Selected", 
        description: `${selectedImages.length} images ready. Complete vehicle details.` 
      });
    }
  };

  // Create vehicle with NEW banner
  // Handle mobile vehicle submission
  const handleMobileVehicleSubmit = async (mobileVehicleData: any) => {
    try {
      const vehicleData = {
        slug: `${mobileVehicleData.year}-${mobileVehicleData.make}-${mobileVehicleData.model}-${mobileVehicleData.vin?.slice(-6) || 'auction'}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: `${mobileVehicleData.year} ${mobileVehicleData.make} ${mobileVehicleData.model}`,
        description: mobileVehicleData.description || `Quality ${mobileVehicleData.year} ${mobileVehicleData.make} ${mobileVehicleData.model} with ${mobileVehicleData.mileage} miles. Added from auction.`,
        price: parseFloat(mobileVehicleData.price) || 0,
        status: 'for-sale',
        mileage: mobileVehicleData.mileage || '0 miles',
        year: mobileVehicleData.year.toString(),
        make: mobileVehicleData.make,
        model: mobileVehicleData.model,
        vin: mobileVehicleData.vin || '',
        stockNumber: mobileVehicleData.stockNumber || '',
        engine: 'Not specified',
        transmission: 'Not specified',
        driveType: 'Not specified',
        exteriorColor: mobileVehicleData.exteriorColor || 'Not specified',
        interiorColor: mobileVehicleData.interiorColor || 'Not specified',
        images: mobileVehicleData.images || [],
        keyFeatures: [],
        metaTitle: `${mobileVehicleData.year} ${mobileVehicleData.make} ${mobileVehicleData.model} - T-Rex Motors`,
        metaDescription: `${mobileVehicleData.year} ${mobileVehicleData.make} ${mobileVehicleData.model} with ${mobileVehicleData.mileage} miles for sale at T-Rex Motors in Richmond, IN.`,
        carfaxEmbedCode: '',
        bannerNew: true, // Always mark as NEW for mobile additions
        bannerReduced: false,
        bannerSold: false,
        bannerGreatDeal: false,
        notes: `Added from mobile at auction. ${mobileVehicleData.auctionHouse ? `Auction: ${mobileVehicleData.auctionHouse}` : ''} ${mobileVehicleData.auctionLot ? `Lot: ${mobileVehicleData.auctionLot}` : ''} ${mobileVehicleData.location ? `Location: ${mobileVehicleData.location.lat}, ${mobileVehicleData.location.lng}` : ''} ${mobileVehicleData.notes || ''}`
      };

      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicleData)
      });

      if (!response.ok) throw new Error("Failed to create vehicle");
      
      const createdVehicle = await response.json();
      
      // Refetch vehicles to show the new one
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      
      toast({ 
        title: "Vehicle Added from Mobile!", 
        description: `${mobileVehicleData.year} ${mobileVehicleData.make} ${mobileVehicleData.model} added successfully from auction.`
      });
      
      setShowMobileForm(false);
      
    } catch (error) {
      console.error('Error creating mobile vehicle:', error);
      toast({ 
        title: "Error", 
        description: "Failed to add vehicle from mobile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const createVehicle = async () => {
    try {
      const vehicleData = {
        slug: `${newVehicle.year}-${newVehicle.make}-${newVehicle.model}-${newVehicle.vin?.slice(-6) || 'new'}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: `${newVehicle.year} ${newVehicle.make} ${newVehicle.model}`,
        description: newVehicle.description || `Quality ${newVehicle.year} ${newVehicle.make} ${newVehicle.model} with ${newVehicle.mileage} miles.`,
        price: newVehicle.price,
        status: newVehicle.status || 'for-sale',
        mileage: newVehicle.mileage || '0 miles',
        year: newVehicle.year.toString(),
        make: newVehicle.make,
        model: newVehicle.model,
        vin: newVehicle.vin || '',
        stockNumber: newVehicle.stockNumber || '',
        engine: newVehicle.engine || 'Not specified',
        transmission: newVehicle.transmission || 'Automatic',
        driveType: newVehicle.driveType || 'FWD',
        exteriorColor: newVehicle.exteriorColor || 'Not specified',
        interiorColor: newVehicle.interiorColor || 'Not specified',
        images: newVehicle.images || [],
        keyFeatures: newVehicle.keyFeatures || [],
        metaTitle: `${newVehicle.year} ${newVehicle.make} ${newVehicle.model} - T-Rex Motors`,
        metaDescription: `${newVehicle.year} ${newVehicle.make} ${newVehicle.model} with ${newVehicle.mileage} miles for sale at T-Rex Motors in Richmond, IN.`,
        carfaxEmbedCode: newVehicle.carfaxEmbedCode || '',
        bannerNew: true, // Always mark as NEW for this workflow
        bannerReduced: false,
        bannerSold: false,
        bannerGreatDeal: false
      };

      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicleData)
      });

      if (!response.ok) throw new Error("Failed to create vehicle");
      
      const createdVehicle = await response.json();
      
      // Reset form and close dialogs
      setNewVehicle({
        title: "",
        make: "",
        model: "",
        year: "",
        price: 0,
        status: "for-sale",
        mileage: "",
        vin: "",
        stockNumber: "",
        exteriorColor: "",
        interiorColor: "",
        engine: "",
        transmission: "",
        driveType: "FWD",
        description: "",
        images: [],
        keyFeatures: [],
        carfaxEmbedCode: "",
        bannerReduced: false,
        bannerSold: false,
        bannerGreatDeal: false,
        bannerNew: false
      });
      
      setParsedVehicleData(null);
      setSelectedImages([]);
      setVehicleCreationStep('paste');
      setIsVehicleWorkflowOpen(false);
      setPastedRowData('');
      
      // Refetch vehicles to show the new one
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      
      toast({ 
        title: "Vehicle Created Successfully!", 
        description: `${createdVehicle.title} has been added with NEW banner and will appear on the website.` 
      });

      // Automatically redirect to admin dashboard after 2 seconds
      setTimeout(() => {
        // Reset all workflow states
        setVehicleCreationStep('paste');
        setIsVehicleWorkflowOpen(false);
        setIsRowUploaderOpen(false);
        
        // Show success message about the listing
        toast({
          title: "Listing Created!",
          description: `Vehicle is now live on the website with NEW banner. Check the Vehicles tab to manage it.`
        });
      }, 2000);
    } catch (error) {
      toast({ 
        title: "Error Creating Vehicle", 
        description: error instanceof Error ? error.message : 'Unknown error', 
        variant: "destructive" 
      });
    }
  };

  // Image upload functions
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + uploadedFiles.length > 5) {
      toast({ title: "Too many files", description: "Maximum 5 images allowed", variant: "destructive" });
      return;
    }
    
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "File too large", description: `${file.name} is over 10MB`, variant: "destructive" });
        return false;
      }
      return true;
    });
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
    
    // Convert files to URLs for preview
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewVehicle(prev => ({
            ...prev,
            images: [...prev.images, event.target!.result as string]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setNewVehicle(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeImage = (index: number) => {
    setNewVehicle(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Authentication
  const handleLogin = () => {
    if (password === "admin") {
      setIsAuthenticated(true);
      toast({ title: "Welcome to T-Rex Motors Admin", description: "You can now manage your vehicle inventory" });
    } else {
      toast({ title: "Access Denied", description: "Incorrect password", variant: "destructive" });
    }
  };

  // Auto-refresh Google Sheets every 30 seconds
  const { data: sheetData, isLoading: sheetLoading } = useQuery({
    queryKey: ["/api/admin/sheet-data"],
    enabled: isAuthenticated,
    refetchInterval: 30000,
    queryFn: async () => {
      const response = await fetch("/api/admin/sheet-data");
      if (!response.ok) throw new Error("Failed to fetch sheet data");
      return response.json();
    }
  });

  // Current vehicles in database
  const { data: vehicles, isLoading: vehiclesLoading, error: vehiclesError } = useQuery({
    queryKey: ["/api/vehicles"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch("/api/vehicles");
      if (!response.ok) throw new Error("Failed to fetch vehicles");
      return response.json();
    }
  });

  // Customer applications
  const { data: customerApplications, isLoading: applicationsLoading } = useQuery({
    queryKey: ["/api/admin/applications"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch("/api/admin/applications");
      if (!response.ok) throw new Error("Failed to fetch applications");
      return response.json();
    }
  });

  // Google Drive folders
  const { data: driveFolders, isLoading: foldersLoading } = useQuery({
    queryKey: ["/api/admin/browse-folders", currentFolderId],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch(`/api/admin/browse-folders?parentId=${currentFolderId}`);
      if (!response.ok) throw new Error("Failed to fetch folders");
      return response.json();
    }
  });

  // Google Drive files (when folder is selected)
  const { data: driveFiles, isLoading: filesLoading } = useQuery({
    queryKey: ["/api/admin/browse-files", currentFolderId],
    enabled: isAuthenticated && currentFolderId !== 'root',
    queryFn: async () => {
      const response = await fetch(`/api/admin/browse-files/${currentFolderId}`);
      if (!response.ok) throw new Error("Failed to fetch files");
      return response.json();
    }
  });

  // Detect changes automatically
  useEffect(() => {
    if (sheetData && vehicles) {
      const changes: PendingChange[] = [];

      sheetData.forEach((sheetVehicle: any) => {
        const existingVehicle = vehicles.find((v: Vehicle) => 
          v.vin === sheetVehicle.vin || v.stockNumber === sheetVehicle.stockNumber
        );

        if (!existingVehicle) {
          // New vehicle
          changes.push({
            type: 'new',
            vehicle: sheetVehicle
          });
        } else {
          // Check for price changes
          if (existingVehicle.price !== sheetVehicle.price) {
            changes.push({
              type: 'price_update',
              vehicle: { ...existingVehicle, newPrice: sheetVehicle.price },
              oldValue: existingVehicle.price,
              newValue: sheetVehicle.price
            });
          }
          
          // Check for status changes
          const normalizedSheetStatus = sheetVehicle.status.toLowerCase().replace(' ', '-');
          if (existingVehicle.status !== normalizedSheetStatus) {
            changes.push({
              type: 'status_update',
              vehicle: { ...existingVehicle, newStatus: normalizedSheetStatus },
              oldValue: existingVehicle.status,
              newValue: normalizedSheetStatus
            });
          }
        }
      });

      setPendingChanges(changes);
    }
  }, [sheetData, vehicles]);

  // Add new vehicle
  const addVehicleMutation = useMutation({
    mutationFn: async (vehicleData: any) => {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: `${vehicleData.year}-${vehicleData.make}-${vehicleData.model}-${vehicleData.vin.slice(-6)}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`,
          description: vehicleData.description || '',
          price: vehicleData.price,
          status: vehicleData.status.toLowerCase().replace(' ', '-'),
          mileage: vehicleData.miles.toString(),
          year: vehicleData.year.toString(),
          make: vehicleData.make,
          model: vehicleData.model,
          vin: vehicleData.vin,
          stockNumber: vehicleData.stockNumber,
          engine: 'Not specified',
          transmission: 'Not specified',
          driveType: 'Not specified',
          exteriorColor: vehicleData.exteriorColor || '',
          interiorColor: vehicleData.interiorColor || '',
          images: [],
          keyFeatures: [],
          metaTitle: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model} - T-Rex Motors`,
          metaDescription: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model} with ${vehicleData.miles} miles.`,
          notes: vehicleData.notes || ''
        })
      });
      if (!response.ok) throw new Error("Failed to add vehicle");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Vehicle Added", description: "New vehicle added to inventory successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
    }
  });

  // Update vehicle
  const updateVehicleMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number, updates: any }) => {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error("Failed to update vehicle");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Vehicle Updated", description: "Vehicle updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      setIsEditDialogOpen(false);
      setEditingVehicle(null);
    }
  });

  // Delete vehicle
  const deleteVehicleMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete vehicle");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Vehicle Deleted", description: "Vehicle removed from inventory successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
    }
  });

  // Apply all pending changes
  const applyAllChangesMutation = useMutation({
    mutationFn: async (changes: PendingChange[]) => {
      for (const change of changes) {
        if (change.type === 'new') {
          await addVehicleMutation.mutateAsync(change.vehicle);
        } else if (change.type === 'price_update') {
          await updateVehicleMutation.mutateAsync({
            id: change.vehicle.id,
            updates: { price: change.newValue }
          });
        } else if (change.type === 'status_update') {
          await updateVehicleMutation.mutateAsync({
            id: change.vehicle.id,
            updates: { status: change.newValue }
          });
        }
      }
    },
    onSuccess: () => {
      toast({ title: "All Changes Applied", description: "All pending changes have been applied successfully" });
      setPendingChanges([]);
    }
  });

  // Apply single change
  const applySingleChange = (change: PendingChange) => {
    if (change.type === 'new') {
      addVehicleMutation.mutate(change.vehicle);
    } else if (change.type === 'price_update') {
      updateVehicleMutation.mutate({
        id: change.vehicle.id,
        updates: { price: change.newValue }
      });
    } else if (change.type === 'status_update') {
      updateVehicleMutation.mutate({
        id: change.vehicle.id,
        updates: { status: change.newValue }
      });
    }
    setPendingChanges(prev => prev.filter(c => c !== change));
  };

  // Customer Application Mutations
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error("Failed to update application");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      toast({ title: "Application updated successfully!" });
    }
  });

  const deleteApplicationMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete application");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      toast({ title: "Application deleted successfully!" });
    }
  });

  // Save new vehicle
  const handleSaveNewVehicle = () => {
    const vehicleData = {
      ...newVehicle,
      slug: `${newVehicle.year}-${newVehicle.make}-${newVehicle.model}-${newVehicle.vin.slice(-6)}`.toLowerCase().replace(/\s+/g, '-'),
      metaTitle: `${newVehicle.year} ${newVehicle.make} ${newVehicle.model} - T-Rex Motors`,
      metaDescription: `${newVehicle.year} ${newVehicle.make} ${newVehicle.model} with ${newVehicle.mileage} miles. ${newVehicle.description.slice(0, 100)}...`
    };
    
    addVehicleMutation.mutate(vehicleData);
    setIsAddVehicleDialogOpen(false);
    setNewVehicle({
      title: "",
      make: "",
      model: "",
      year: "",
      price: 0,
      status: "for-sale",
      mileage: "",
      vin: "",
      stockNumber: "",
      exteriorColor: "",
      interiorColor: "",
      engine: "",
      transmission: "",
      driveType: "FWD",
      description: "",
      images: [],
      keyFeatures: [],
      carfaxEmbedCode: "",
      bannerReduced: false,
      bannerSold: false,
      bannerGreatDeal: false,
      bannerNew: false
    });
  };

  // Save vehicle edits
  const handleSaveVehicle = () => {
    if (editingVehicle) {
      updateVehicleMutation.mutate({
        id: editingVehicle.id,
        updates: {
          title: editingVehicle.title,
          price: editingVehicle.price,
          status: editingVehicle.status,
          mileage: editingVehicle.mileage,
          description: editingVehicle.description,
          notes: editingVehicle.notes,
          exteriorColor: editingVehicle.exteriorColor,
          interiorColor: editingVehicle.interiorColor
        }
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">🦖 T-Rex Motors</div>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter admin password to manage inventory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter admin password"
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Access Admin Dashboard
            </Button>
          </CardContent>
        </Card>
        
        {/* Developer Credit - Moved to separate container */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Website designed and hosted by{' '}
                <a 
                  href="https://keanonbiz.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 underline transition-colors"
                >
                  keanonbiz.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">T-Rex Motors Admin Dashboard</h1>
          <p className="text-gray-600">Manage your vehicle inventory with ease</p>
        </div>

        {/* Hidden: System Status - keeping simple for manual entry */}

        {/* Pending Changes Alert */}
        {/* Hidden: Google Sheets Pending Changes - functionality preserved but hidden for simple manual entry */}
        {false && pendingChanges.length > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertCircle className="h-5 w-5" />
                {pendingChanges.length} Pending Changes from Google Sheets
              </CardTitle>
              <CardDescription>
                Your Google Sheet has been updated. Review and apply changes below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingChanges.map((change, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      {change.type === 'new' && <Plus className="h-4 w-4 text-green-600" />}
                      {change.type === 'price_update' && <DollarSign className="h-4 w-4 text-blue-600" />}
                      {change.type === 'status_update' && <Clock className="h-4 w-4 text-purple-600" />}
                      
                      <div>
                        <div className="font-medium">
                          {change.type === 'new' && `Add: ${change.vehicle.year} ${change.vehicle.make} ${change.vehicle.model}`}
                          {change.type === 'price_update' && `Price Update: ${change.vehicle.title}`}
                          {change.type === 'status_update' && `Status Update: ${change.vehicle.title}`}
                        </div>
                        <div className="text-sm text-gray-600">
                          {change.type === 'new' && `Stock #${change.vehicle.stockNumber} • $${change.vehicle.price.toLocaleString()}`}
                          {change.type === 'price_update' && `$${change.oldValue?.toLocaleString()} → $${change.newValue?.toLocaleString()}`}
                          {change.type === 'status_update' && `${change.oldValue} → ${change.newValue}`}
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => applySingleChange(change)}
                      disabled={addVehicleMutation.isPending || updateVehicleMutation.isPending}
                    >
                      Apply
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button 
                  onClick={() => applyAllChangesMutation.mutate(pendingChanges)}
                  disabled={applyAllChangesMutation.isPending}
                  className="w-full"
                >
                  Apply All Changes ({pendingChanges.length})
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="vehicles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vehicles">Vehicle Inventory ({vehicles?.length || 0})</TabsTrigger>
            <TabsTrigger value="applications">Credit Applications ({customerApplications?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Current Vehicle Inventory</CardTitle>
                  <CardDescription>Vehicles currently listed on your website</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button 
                    onClick={() => setIsAddVehicleDialogOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
                    size="default"
                  >
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="hidden sm:inline">Add Vehicle with Google Drive Links</span>
                    <span className="sm:hidden">Add Vehicle</span>
                  </Button>
                  <Button 
                    onClick={() => setShowMobileForm(true)}
                    variant={isMobile ? "default" : "outline"}
                    className={`px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base ${
                      isMobile 
                        ? "bg-green-600 hover:bg-green-700 text-white" 
                        : "border-green-600 text-green-600 hover:bg-green-50"
                    }`}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{isMobile ? "Quick Entry" : "Mobile Entry"}</span>
                    <span className="sm:hidden">Mobile Entry</span>
                  </Button>

                  {/* Drive Folder Scanner */}
                  <Dialog open={isDrivePreviewOpen} onOpenChange={setIsDrivePreviewOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
                      >
                        <FolderOpen className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Bulk Import Images</span>
                        <span className="sm:hidden">Bulk Import</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Bulk Import Vehicle Images</DialogTitle>
                        <DialogDescription>
                          Automatically scan your Google Drive folder and match vehicle photos to your inventory
                        </DialogDescription>
                      </DialogHeader>
                      <DriveFolderScanner onImagesMatched={async (matches) => {
                        console.log('Images matched:', matches);
                        
                        // Apply the matches to update vehicles
                        try {
                          const response = await fetch('/api/admin/apply-drive-matches', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ matches })
                          });
                          
                          if (response.ok) {
                            const results = await response.json();
                            toast({
                              title: "Images Applied Successfully!",
                              description: `Updated ${results.totalUpdated} vehicles with images`,
                            });
                            
                            // Refresh vehicle data
                            queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
                          } else {
                            throw new Error('Failed to apply matches');
                          }
                        } catch (error) {
                          toast({
                            title: "Error Applying Images",
                            description: "Failed to update vehicles with matched images",
                            variant: "destructive"
                          });
                        }
                        
                        setIsDrivePreviewOpen(false);
                      }} />
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isVehicleWorkflowOpen} onOpenChange={setIsVehicleWorkflowOpen}>
                    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Vehicle Creation Workflow</DialogTitle>
                        <DialogDescription>
                          {vehicleCreationStep === 'preview' && "Step 2: Preview and select vehicle images"}
                          {vehicleCreationStep === 'create' && "Step 3: Complete vehicle details and save"}
                        </DialogDescription>
                      </DialogHeader>

                      {vehicleCreationStep === 'preview' && parsedVehicleData && (
                        <div className="space-y-6">
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="font-medium text-blue-900 mb-2">Vehicle Information</h4>
                            <div className="text-sm text-blue-800 grid grid-cols-2 gap-4">
                              <div>
                                <p><strong>Vehicle:</strong> {parsedVehicleData.title}</p>
                                <p><strong>Price:</strong> ${parsedVehicleData.price.toLocaleString()}</p>
                              </div>
                              <div>
                                <p><strong>Miles:</strong> {parsedVehicleData.mileage}</p>
                                <p><strong>VIN:</strong> {parsedVehicleData.vin}</p>
                              </div>
                            </div>
                          </div>

                          <DriveImagePreview
                            imageLinks={parsedVehicleData.images}
                            onImageSelect={handleImageSelection}
                            className="mt-6"
                          />

                          <div className="flex justify-between pt-4">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setVehicleCreationStep('paste');
                                setIsVehicleWorkflowOpen(false);
                                setIsRowUploaderOpen(true);
                              }}
                            >
                              Back to Paste
                            </Button>
                            <Button
                              onClick={proceedToVehicleCreation}
                              disabled={selectedImages.length === 0}
                              className="btn-primary-green"
                            >
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Continue to Create Vehicle
                            </Button>
                          </div>
                        </div>
                      )}

                      {vehicleCreationStep === 'create' && (
                        <div className="space-y-6">
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h4 className="font-medium text-green-900 mb-2">Ready to Create Vehicle</h4>
                            <div className="text-sm text-green-800 space-y-1">
                              <p><strong>Vehicle:</strong> {newVehicle.title}</p>
                              <p><strong>Images Selected:</strong> {selectedImages.length} images</p>
                              <p><strong>Featured Image:</strong> {selectedImages.find(img => img.featured) ? 'Set' : 'None'}</p>
                              <p><strong>NEW Banner:</strong> Will be automatically added</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="make">Make *</Label>
                                <Input
                                  id="make"
                                  value={newVehicle.make}
                                  onChange={(e) => setNewVehicle(prev => ({ ...prev, make: e.target.value, title: `${e.target.value} ${prev.model}`.trim() }))}
                                  placeholder="e.g., Toyota"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="model">Model *</Label>
                                <Input
                                  id="model"
                                  value={newVehicle.model}
                                  onChange={(e) => setNewVehicle(prev => ({ ...prev, model: e.target.value, title: `${prev.make} ${e.target.value}`.trim() }))}
                                  placeholder="e.g., Camry"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="year">Year *</Label>
                                <Input
                                  id="year"
                                  value={newVehicle.year}
                                  onChange={(e) => setNewVehicle(prev => ({ ...prev, year: e.target.value }))}
                                  placeholder="e.g., 2020"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="price">Price *</Label>
                                <Input
                                  id="price"
                                  type="number"
                                  value={newVehicle.price}
                                  onChange={(e) => setNewVehicle(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                                  placeholder="e.g., 25000"
                                />
                              </div>
                            </div>

                            {/* Additional Details */}
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                  id="description"
                                  value={newVehicle.description}
                                  onChange={(e) => setNewVehicle(prev => ({ ...prev, description: e.target.value }))}
                                  placeholder="Describe the vehicle's condition, features, etc."
                                  rows={4}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="exteriorColor">Exterior Color</Label>
                                <Input
                                  id="exteriorColor"
                                  value={newVehicle.exteriorColor}
                                  onChange={(e) => setNewVehicle(prev => ({ ...prev, exteriorColor: e.target.value }))}
                                  placeholder="e.g., Silver"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="interiorColor">Interior Color</Label>
                                <Input
                                  id="interiorColor"
                                  value={newVehicle.interiorColor}
                                  onChange={(e) => setNewVehicle(prev => ({ ...prev, interiorColor: e.target.value }))}
                                  placeholder="e.g., Black"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="carfaxEmbedCode">CARFAX Embed Code (optional)</Label>
                                <Textarea
                                  id="carfaxEmbedCode"
                                  value={newVehicle.carfaxEmbedCode}
                                  onChange={(e) => setNewVehicle(prev => ({ ...prev, carfaxEmbedCode: e.target.value }))}
                                  placeholder="Paste CARFAX embed code here..."
                                  rows={3}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setVehicleCreationStep('preview')}
                            >
                              Back to Images
                            </Button>
                            <Button
                              onClick={createVehicle}
                              className="btn-primary-green"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Create Vehicle with NEW Banner
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isAddVehicleDialogOpen} onOpenChange={setIsAddVehicleDialogOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Vehicle</DialogTitle>
                      <DialogDescription>
                        Enter all vehicle details including images and specifications
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="make">Make *</Label>
                          <Input
                            id="make"
                            value={newVehicle.make}
                            onChange={(e) => setNewVehicle(prev => ({ ...prev, make: e.target.value, title: `${e.target.value} ${prev.model}`.trim() }))}
                            placeholder="e.g., Toyota"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="model">Model *</Label>
                          <Input
                            id="model"
                            value={newVehicle.model}
                            onChange={(e) => setNewVehicle(prev => ({ ...prev, model: e.target.value, title: `${prev.make} ${e.target.value}`.trim() }))}
                            placeholder="e.g., Camry"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="year">Year *</Label>
                          <Input
                            id="year"
                            value={newVehicle.year}
                            onChange={(e) => setNewVehicle(prev => ({ ...prev, year: e.target.value }))}
                            placeholder="e.g., 2020"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="price">Price *</Label>
                          <Input
                            id="price"
                            type="number"
                            value={newVehicle.price}
                            onChange={(e) => setNewVehicle(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                            placeholder="e.g., 25000"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="mileage">Mileage *</Label>
                          <Input
                            id="mileage"
                            value={newVehicle.mileage}
                            onChange={(e) => setNewVehicle(prev => ({ ...prev, mileage: e.target.value }))}
                            placeholder="e.g., 50000"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="vin">VIN *</Label>
                          <Input
                            id="vin"
                            value={newVehicle.vin}
                            onChange={(e) => setNewVehicle(prev => ({ ...prev, vin: e.target.value.toUpperCase() }))}
                            placeholder="e.g., 1HGBH41JXMN109186"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="stockNumber">Stock Number *</Label>
                          <Input
                            id="stockNumber"
                            value={newVehicle.stockNumber}
                            onChange={(e) => setNewVehicle(prev => ({ ...prev, stockNumber: e.target.value }))}
                            placeholder="e.g., TC001"
                          />
                        </div>
                      </div>
                      
                      {/* Vehicle Details */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="exteriorColor">Exterior Color *</Label>
                          <Input
                            id="exteriorColor"
                            value={newVehicle.exteriorColor}
                            onChange={(e) => setNewVehicle(prev => ({ ...prev, exteriorColor: e.target.value }))}
                            placeholder="e.g., Blue"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="interiorColor">Interior Color *</Label>
                          <Input
                            id="interiorColor"
                            value={newVehicle.interiorColor}
                            onChange={(e) => setNewVehicle(prev => ({ ...prev, interiorColor: e.target.value }))}
                            placeholder="e.g., Black"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="engine">Engine *</Label>
                          <Input
                            id="engine"
                            value={newVehicle.engine}
                            onChange={(e) => setNewVehicle(prev => ({ ...prev, engine: e.target.value }))}
                            placeholder="e.g., 2.5L 4-Cylinder"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="transmission">Transmission *</Label>
                          <Input
                            id="transmission"
                            value={newVehicle.transmission}
                            onChange={(e) => setNewVehicle(prev => ({ ...prev, transmission: e.target.value }))}
                            placeholder="e.g., CVT Automatic"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="driveType">Drive Type *</Label>
                          <Select value={newVehicle.driveType} onValueChange={(value) => setNewVehicle(prev => ({ ...prev, driveType: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select drive type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FWD">Front-Wheel Drive</SelectItem>
                              <SelectItem value="RWD">Rear-Wheel Drive</SelectItem>
                              <SelectItem value="AWD">All-Wheel Drive</SelectItem>
                              <SelectItem value="4WD">Four-Wheel Drive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="status">Status *</Label>
                          <Select value={newVehicle.status} onValueChange={(value) => setNewVehicle(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="for-sale">For Sale</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="sold">Sold</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <Label htmlFor="description">Description *</Label>
                          <Textarea
                            id="description"
                            value={newVehicle.description}
                            onChange={(e) => setNewVehicle(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Detailed description of the vehicle..."
                            rows={4}
                          />
                        </div>
                        
                        {/* Images Section with Upload and Preview */}
                        <div>
                          <Label>Vehicle Images</Label>
                          <div className="space-y-6">
                            {/* Upload Method Selection */}
                            <div className="flex gap-4 mb-4">
                              <Button
                                type="button"
                                variant={uploadMethod === 'url' ? 'default' : 'outline'}
                                onClick={() => setUploadMethod('url')}
                                size="sm"
                              >
                                URL Input
                              </Button>
                              <Button
                                type="button"
                                variant={uploadMethod === 'file' ? 'default' : 'outline'}
                                onClick={() => setUploadMethod('file')}
                                size="sm"
                              >
                                File Upload
                              </Button>
                            </div>

                            {uploadMethod === 'url' ? (
                              // Enhanced URL Input Method
                              <div className="space-y-4">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                  <h4 className="font-medium text-green-900 mb-2">📸 Google Drive Link Instructions</h4>
                                  <div className="text-sm text-green-800 space-y-2">
                                    <p><strong>Step 1:</strong> In Google Drive, right-click your vehicle image → "Get link"</p>
                                    <p><strong>Step 2:</strong> Change permissions to "Anyone with the link can view"</p>
                                    <p><strong>Step 3:</strong> Copy and paste the full link below</p>
                                    <p><strong>✓ Format:</strong> https://drive.google.com/file/d/FILE_ID/view</p>
                                    <p><strong>🏠 Note:</strong> First image shows on homepage and vehicle listings</p>
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="featuredImage">Main Image URL (Shows on homepage) *</Label>
                                  <Input
                                    id="featuredImage"
                                    value={newVehicle.images[0] || ""}
                                    onChange={(e) => {
                                      const newImages = [...newVehicle.images];
                                      newImages[0] = e.target.value;
                                      setNewVehicle(prev => ({ ...prev, images: newImages }));
                                    }}
                                    placeholder="https://drive.google.com/file/d/YOUR_FILE_ID/view"
                                  />
                                </div>
                                
                                {/* Bulk Paste Option */}
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                  <Label htmlFor="bulkPaste">💡 Quick Tip: Bulk Paste Multiple Links</Label>
                                  <Textarea
                                    id="bulkPaste"
                                    placeholder="Paste multiple Google Drive links here (one per line) and click 'Import Links' to auto-fill all fields"
                                    rows={3}
                                    className="mt-2 mb-2"
                                    // No onChange needed - just for pasting
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const textarea = document.getElementById('bulkPaste') as HTMLTextAreaElement;
                                      if (textarea?.value) {
                                        const links = textarea.value.split('\n').filter(link => link.trim());
                                        setNewVehicle(prev => ({ ...prev, images: links }));
                                        textarea.value = '';
                                        toast({
                                          title: "Links Imported",
                                          description: `${links.length} image links imported successfully`
                                        });
                                      }
                                    }}
                                  >
                                    Import Links
                                  </Button>
                                </div>
                                
                                {Array.from({ length: Math.max(4, newVehicle.images.length - 1) }, (_, i) => i + 1).map((index) => (
                                  <div key={index} className="flex gap-2">
                                    <div className="flex-1">
                                      <Label htmlFor={`additionalImage${index}`}>Additional Image {index} URL</Label>
                                      <Input
                                        id={`additionalImage${index}`}
                                        value={newVehicle.images[index] || ""}
                                        onChange={(e) => {
                                          const newImages = [...newVehicle.images];
                                          if (e.target.value) {
                                            newImages[index] = e.target.value;
                                          } else {
                                            newImages.splice(index, 1);
                                          }
                                          setNewVehicle(prev => ({ ...prev, images: newImages }));
                                        }}
                                        placeholder={`https://drive.google.com/file/d/YOUR_FILE_ID/view`}
                                      />
                                    </div>
                                    {newVehicle.images[index] && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newImages = [...newVehicle.images];
                                          newImages.splice(index, 1);
                                          setNewVehicle(prev => ({ ...prev, images: newImages }));
                                        }}
                                        className="mt-6"
                                      >
                                        Remove
                                      </Button>
                                    )}
                                  </div>
                                ))}
                                
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                      const newImages = [...newVehicle.images, ""];
                                      setNewVehicle(prev => ({ ...prev, images: newImages }));
                                    }}
                                    className="flex-1"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Another Image URL
                                  </Button>
                                  
                                  {newVehicle.images.filter(img => img).length >= 4 && (
                                    <div className="flex items-center bg-green-100 px-3 py-2 rounded-lg">
                                      <span className="text-green-700 text-sm font-medium">360° Ready!</span>
                                    </div>
                                  )}
                                </div>

                                {/* URL Preview Section */}
                                {newVehicle.images.filter(img => img).length > 0 && (
                                  <div className="mt-6">
                                    <Label>Image Preview</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                                      {newVehicle.images.filter(img => img).map((imageUrl, index) => (
                                        <div key={index} className="relative">
                                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                                            <img 
                                              src={imageUrl.includes('drive.google.com') 
                                                ? imageUrl.replace('/view', '/preview').replace('file/d/', 'uc?id=').replace(/\/view.*/, '') 
                                                : imageUrl
                                              }
                                              alt={`Vehicle image ${index + 1}`}
                                              className="w-full h-full object-cover"
                                              onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5VjEzTTEyIDE3SDE2TTggMTdIMTJNOCAxM0gxNk04IDlIMTYiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
                                              }}
                                            />
                                          </div>
                                          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                            {index === 0 ? 'Main' : index + 1}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              // File Upload Method
                              <div className="space-y-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                  <div className="space-y-2">
                                    <Label htmlFor="imageUpload" className="cursor-pointer">
                                      <span className="text-blue-600 hover:text-blue-500">Click to upload images</span>
                                      <span className="text-gray-500"> or drag and drop</span>
                                    </Label>
                                    <Input
                                      id="imageUpload"
                                      type="file"
                                      multiple
                                      accept="image/*"
                                      onChange={handleFileUpload}
                                      className="hidden"
                                    />
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                                  </div>
                                </div>
                                
                                {uploadedFiles.length > 0 && (
                                  <div>
                                    <Label>Uploaded Files ({uploadedFiles.length}/5)</Label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                      {uploadedFiles.map((file, index) => (
                                        <div key={index} className="relative">
                                          <div className="text-xs text-gray-600 truncate">{file.name}</div>
                                          <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute -top-1 -right-1 h-6 w-6 p-0"
                                            onClick={() => removeUploadedFile(index)}
                                          >
                                            ×
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Image Preview Section */}
                            {newVehicle.images.length > 0 && (
                              <div className="space-y-3">
                                <Label>Image Preview</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                  {newVehicle.images.filter(img => img).map((imageUrl, index) => (
                                    <div key={index} className="relative group">
                                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                          src={imageUrl}
                                          alt={`Vehicle image ${index + 1}`}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                                            if (nextSibling) nextSibling.style.display = 'flex';
                                          }}
                                        />
                                        <div
                                          className="hidden w-full h-full items-center justify-center text-gray-400 text-sm"
                                        >
                                          Failed to load image
                                        </div>
                                      </div>
                                      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                        {index === 0 ? 'Featured' : `Image ${index + 1}`}
                                      </div>
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeImage(index)}
                                      >
                                        ×
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Key Features */}
                        <div>
                          <Label htmlFor="keyFeatures">Key Features (comma-separated)</Label>
                          <Input
                            id="keyFeatures"
                            value={newVehicle.keyFeatures.join(", ")}
                            onChange={(e) => setNewVehicle(prev => ({ ...prev, keyFeatures: e.target.value.split(",").map(f => f.trim()).filter(f => f) }))}
                            placeholder="e.g., Low Mileage, Bluetooth, Backup Camera"
                          />
                        </div>

                        {/* CarFax Embed Code */}
                        <div>
                          <Label htmlFor="carfaxEmbedCode">CarFax Embed Code (optional)</Label>
                          <Textarea
                            id="carfaxEmbedCode"
                            value={newVehicle.carfaxEmbedCode}
                            onChange={(e) => setNewVehicle(prev => ({ ...prev, carfaxEmbedCode: e.target.value }))}
                            placeholder="Paste CarFax embed code here..."
                            rows={3}
                          />
                        </div>

                        {/* Banner Options */}
                        <div className="space-y-3">
                          <Label>Banner Options</Label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="bannerReduced"
                                checked={newVehicle.bannerReduced}
                                onChange={(e) => setNewVehicle(prev => ({ ...prev, bannerReduced: e.target.checked }))}
                                className="rounded border-gray-300"
                              />
                              <Label htmlFor="bannerReduced" className="text-sm font-normal">
                                <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs mr-2">💰 REDUCED</span>
                                Price Reduced Banner
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="bannerSold"
                                checked={newVehicle.bannerSold}
                                onChange={(e) => setNewVehicle(prev => ({ ...prev, bannerSold: e.target.checked }))}
                                className="rounded border-gray-300"
                              />
                              <Label htmlFor="bannerSold" className="text-sm font-normal">
                                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs mr-2">✅ SOLD</span>
                                Sold Banner
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="bannerGreatDeal"
                                checked={newVehicle.bannerGreatDeal}
                                onChange={(e) => setNewVehicle(prev => ({ ...prev, bannerGreatDeal: e.target.checked }))}
                                className="rounded border-gray-300"
                              />
                              <Label htmlFor="bannerGreatDeal" className="text-sm font-normal">
                                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs mr-2">🔥 GREAT DEAL</span>
                                Great Deal Banner
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-6">
                      <Button variant="outline" onClick={() => setIsAddVehicleDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSaveNewVehicle}
                        disabled={addVehicleMutation.isPending}
                        className="btn-primary-green"
                      >
                        {addVehicleMutation.isPending ? "Adding..." : "Add Vehicle"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {vehiclesLoading ? (
                  <div className="text-center py-8">Loading vehicles...</div>
                ) : !vehicles || vehicles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div>No vehicles in inventory yet. Add vehicles from Google Sheets or manually.</div>

                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Stock #</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Miles</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vehicles?.map((vehicle: Vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell>
                            <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden border">
                              {vehicle.images && vehicle.images.length > 0 ? (
                                <img 
                                  src={getThumbnailUrl(vehicle.images[0])} 
                                  alt={vehicle.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    console.log('Thumbnail failed to load:', target.src);
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>';
                                    }
                                  }}
                                  onLoad={() => {
                                    console.log('Thumbnail loaded successfully');
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                  No Image
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{vehicle.title}</div>
                              <div className="text-sm text-gray-600">VIN: {vehicle.vin}</div>
                            </div>
                          </TableCell>
                          <TableCell>{vehicle.stockNumber}</TableCell>
                          <TableCell>${vehicle.price.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={vehicle.status === 'for-sale' ? 'default' : 'secondary'}>
                              {vehicle.status.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{parseInt(vehicle.mileage).toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingVehicle(vehicle);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ${vehicle.title}? This action cannot be undone.`)) {
                                    deleteVehicleMutation.mutate(vehicle.id);
                                  }
                                }}
                                disabled={deleteVehicleMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hidden: Google Sheets Tab - functionality preserved but hidden */}
          {false && (
            <TabsContent value="sheets">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sheet className="h-5 w-5" />
                    Google Sheets Data
                  </CardTitle>
                </CardHeader>
              </Card>
            </TabsContent>
          )}

          {/* Customer Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer Credit Applications
                </CardTitle>
                <CardDescription>
                  Review and manage customer financing applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applicationsLoading ? (
                  <div className="text-center py-8">Loading applications...</div>
                ) : customerApplications?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No credit applications submitted yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerApplications?.map((application: CustomerApplication) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div className="font-medium">
                              {application.borrowerFirstName} {application.borrowerLastName}
                            </div>
                            {application.coBorrowerFirstName && (
                              <div className="text-sm text-gray-600">
                                Co-Borrower: {application.coBorrowerFirstName} {application.coBorrowerLastName}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{application.borrowerEmail}</TableCell>
                          <TableCell>{application.borrowerPhone}</TableCell>
                          <TableCell>
                            <Badge variant={
                              application.status === 'approved' ? 'default' : 
                              application.status === 'denied' ? 'destructive' : 
                              application.status === 'reviewing' ? 'secondary' : 
                              'outline'
                            }>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(application.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Credit Application #{application.id}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Complete application details for {application.borrowerFirstName} {application.borrowerLastName}
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="space-y-6">
                                    {/* Application Status Section */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                      <h3 className="font-semibold mb-3">Application Status</h3>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Current Status</Label>
                                          <Select 
                                            value={application.status} 
                                            onValueChange={(value) => {
                                              updateApplicationMutation.mutate({
                                                id: application.id,
                                                updates: { status: value, reviewedBy: 'Admin' }
                                              });
                                            }}
                                          >
                                            <SelectTrigger className="mt-1">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="pending">Pending Review</SelectItem>
                                              <SelectItem value="reviewing">Under Review</SelectItem>
                                              <SelectItem value="approved">Approved</SelectItem>
                                              <SelectItem value="denied">Denied</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <Label>Submitted</Label>
                                          <div className="mt-1 text-sm text-gray-600">
                                            {new Date(application.submittedAt).toLocaleString()}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="mt-4">
                                        <Label>Admin Notes</Label>
                                        <Textarea
                                          placeholder="Add internal notes about this application..."
                                          defaultValue={application.adminNotes || ''}
                                          onBlur={(e) => {
                                            if (e.target.value !== (application.adminNotes || '')) {
                                              updateApplicationMutation.mutate({
                                                id: application.id,
                                                updates: { adminNotes: e.target.value }
                                              });
                                            }
                                          }}
                                          className="mt-1"
                                          rows={3}
                                        />
                                      </div>
                                    </div>

                                    {/* Primary Borrower Info */}
                                    <div>
                                      <h3 className="font-semibold mb-3">Primary Borrower Information</h3>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Name</Label>
                                          <div className="mt-1 text-sm">
                                            {application.borrowerFirstName} {application.borrowerLastName}
                                          </div>
                                        </div>
                                        <div>
                                          <Label>Email</Label>
                                          <div className="mt-1 text-sm">{application.borrowerEmail}</div>
                                        </div>
                                        <div>
                                          <Label>Phone</Label>
                                          <div className="mt-1 text-sm">{application.borrowerPhone}</div>
                                        </div>
                                        {application.borrowerDob && (
                                          <div>
                                            <Label>Date of Birth</Label>
                                            <div className="mt-1 text-sm">
                                              {new Date(application.borrowerDob).toLocaleDateString()}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Address Information */}
                                    {application.streetAddress && (
                                      <div>
                                        <h3 className="font-semibold mb-3">Address Information</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label>Street Address</Label>
                                            <div className="mt-1 text-sm">{application.streetAddress}</div>
                                          </div>
                                          <div>
                                            <Label>City, State, ZIP</Label>
                                            <div className="mt-1 text-sm">
                                              {application.city}, {application.state} {application.postalCode}
                                            </div>
                                          </div>
                                          <div>
                                            <Label>Living Situation</Label>
                                            <div className="mt-1 text-sm capitalize">{application.livingSituation}</div>
                                          </div>
                                          {application.monthlyPayment && (
                                            <div>
                                              <Label>Monthly Housing Payment</Label>
                                              <div className="mt-1 text-sm">
                                                ${(application.monthlyPayment / 100).toLocaleString()}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Employment Information */}
                                    {application.employer && (
                                      <div>
                                        <h3 className="font-semibold mb-3">Employment Information</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label>Employer</Label>
                                            <div className="mt-1 text-sm">{application.employer}</div>
                                          </div>
                                          <div>
                                            <Label>Years Employed</Label>
                                            <div className="mt-1 text-sm">{application.yearsEmployed}</div>
                                          </div>
                                          {application.employerPhone && (
                                            <div>
                                              <Label>Employer Phone</Label>
                                              <div className="mt-1 text-sm">{application.employerPhone}</div>
                                            </div>
                                          )}
                                          {application.monthlyGrossIncome && (
                                            <div>
                                              <Label>Monthly Gross Income</Label>
                                              <div className="mt-1 text-sm">
                                                ${(application.monthlyGrossIncome / 100).toLocaleString()}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Banking Information */}
                                    {application.bankName && (
                                      <div>
                                        <h3 className="font-semibold mb-3">Banking Information</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label>Bank Name</Label>
                                            <div className="mt-1 text-sm">{application.bankName}</div>
                                          </div>
                                          <div>
                                            <Label>Account Type</Label>
                                            <div className="mt-1 text-sm capitalize">{application.accountType}</div>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Co-Borrower Information */}
                                    {application.coBorrowerFirstName && (
                                      <div>
                                        <h3 className="font-semibold mb-3">Co-Borrower Information</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label>Name</Label>
                                            <div className="mt-1 text-sm">
                                              {application.coBorrowerFirstName} {application.coBorrowerLastName}
                                            </div>
                                          </div>
                                          {application.coBorrowerEmail && (
                                            <div>
                                              <Label>Email</Label>
                                              <div className="mt-1 text-sm">{application.coBorrowerEmail}</div>
                                            </div>
                                          )}
                                          {application.coBorrowerPhone && (
                                            <div>
                                              <Label>Phone</Label>
                                              <div className="mt-1 text-sm">{application.coBorrowerPhone}</div>
                                            </div>
                                          )}
                                          {application.coBorrowerDob && (
                                            <div>
                                              <Label>Date of Birth</Label>
                                              <div className="mt-1 text-sm">
                                                {new Date(application.coBorrowerDob).toLocaleDateString()}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Additional Notes */}
                                    {application.notes && (
                                      <div>
                                        <h3 className="font-semibold mb-3">Customer Notes</h3>
                                        <div className="bg-gray-50 p-3 rounded-lg text-sm">
                                          {application.notes}
                                        </div>
                                      </div>
                                    )}

                                    {/* Consent Information */}
                                    <div>
                                      <h3 className="font-semibold mb-3">Consent & Preferences</h3>
                                      <div className="text-sm">
                                        <div className="flex items-center gap-2">
                                          <span className={`w-2 h-2 rounded-full ${application.consentToSms ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                          SMS Notifications: {application.consentToSms ? 'Consented' : 'Not Consented'}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
                                    deleteApplicationMutation.mutate(application.id);
                                  }
                                }}
                                disabled={deleteApplicationMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hidden: Google Sheets Tab - functionality preserved but hidden */}
          {false && (
            <TabsContent value="sheets">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sheet className="h-5 w-5" />
                    Google Sheets Data
                  </CardTitle>
                </CardHeader>
              </Card>
            </TabsContent>
          )}

          {/* Hidden: Google Drive Tab - functionality preserved but hidden */}
          {false && (
            <TabsContent value="drive">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Google Drive Browser
                  </CardTitle>
                </CardHeader>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Edit Vehicle Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Vehicle</DialogTitle>
              <DialogDescription>
                Update vehicle information and pricing
              </DialogDescription>
            </DialogHeader>
            {editingVehicle && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingVehicle.title}
                    onChange={(e) => setEditingVehicle({...editingVehicle, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editingVehicle.price}
                    onChange={(e) => setEditingVehicle({...editingVehicle, price: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={editingVehicle.status} 
                    onValueChange={(value) => setEditingVehicle({...editingVehicle, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="for-sale">For Sale</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">Mileage</Label>
                  <Input
                    id="mileage"
                    value={editingVehicle.mileage}
                    onChange={(e) => setEditingVehicle({...editingVehicle, mileage: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exteriorColor">Exterior Color</Label>
                  <Input
                    id="exteriorColor"
                    value={editingVehicle.exteriorColor}
                    onChange={(e) => setEditingVehicle({...editingVehicle, exteriorColor: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interiorColor">Interior Color</Label>
                  <Input
                    id="interiorColor"
                    value={editingVehicle.interiorColor}
                    onChange={(e) => setEditingVehicle({...editingVehicle, interiorColor: e.target.value})}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingVehicle.description}
                    onChange={(e) => setEditingVehicle({...editingVehicle, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={editingVehicle.notes || ""}
                    onChange={(e) => setEditingVehicle({...editingVehicle, notes: e.target.value})}
                    rows={2}
                  />
                </div>

                {/* CarFax Embed Code */}
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="carfaxEmbedCode">CarFax Embed Code</Label>
                  <Textarea
                    id="carfaxEmbedCode"
                    value={editingVehicle.carfaxEmbedCode || ""}
                    onChange={(e) => setEditingVehicle({...editingVehicle, carfaxEmbedCode: e.target.value})}
                    placeholder="Paste CarFax embed code here..."
                    rows={3}
                  />
                </div>

                {/* Banner Options */}
                <div className="col-span-2 space-y-3">
                  <Label>Banner Options</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="editBannerReduced"
                        checked={editingVehicle.bannerReduced || false}
                        onChange={(e) => setEditingVehicle({...editingVehicle, bannerReduced: e.target.checked} as Vehicle)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="editBannerReduced" className="text-sm font-normal">
                        <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs mr-2">💰 REDUCED</span>
                        Price Reduced
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="editBannerSold"
                        checked={editingVehicle.bannerSold || false}
                        onChange={(e) => setEditingVehicle({...editingVehicle, bannerSold: e.target.checked} as Vehicle)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="editBannerSold" className="text-sm font-normal">
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs mr-2">✅ SOLD</span>
                        Sold Banner
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="editBannerGreatDeal"
                        checked={editingVehicle.bannerGreatDeal || false}
                        onChange={(e) => setEditingVehicle({...editingVehicle, bannerGreatDeal: e.target.checked} as Vehicle)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="editBannerGreatDeal" className="text-sm font-normal">
                        <span className="bg-green-500 text-white px-2 py-1 rounded text-xs mr-2">🔥 GREAT DEAL</span>
                        Great Deal
                      </Label>
                    </div>
                  </div>
                </div>
                
                {/* Vehicle Image Management */}
                <div className="col-span-2 space-y-4">
                  <div className="border-t pt-4">
                    <Label className="text-base font-semibold">Vehicle Images</Label>
                    <VehicleImageUploader
                      vehicleId={editingVehicle.id}
                      vehicleTitle={editingVehicle.title}
                      currentImages={editingVehicle.images || []}
                      onImagesUpdated={(images) => {
                        setEditingVehicle({...editingVehicle, images});
                        queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
                      }}
                    />
                  </div>
                </div>
                
                {/* Vehicle History Reports */}
                <div className="col-span-2 space-y-4">
                  <div className="border-t pt-4">
                    <Label className="text-base font-semibold">Vehicle History Reports</Label>
                    <HistoryReportManager
                      vehicle={editingVehicle}
                      onUpdate={() => {
                        queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
                      }}
                    />
                  </div>
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveVehicle} disabled={updateVehicleMutation.isPending}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Mobile Vehicle Form */}
        {showMobileForm && (
          <div className="fixed inset-0 z-50 bg-white">
            <MobileVehicleForm
              onSubmit={handleMobileVehicleSubmit}
              onClose={() => setShowMobileForm(false)}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}