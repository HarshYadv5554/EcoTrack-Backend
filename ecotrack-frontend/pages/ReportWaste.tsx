import { useState, useRef } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useWasteReports } from "@/contexts/waste-reports-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  MapPin,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  Navigation,
  Clock,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

export default function ReportWaste() {
  const { user } = useAuth();
  const { addReport } = useWasteReports();

  const [images, setImages] = useState<File[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [wasteType, setWasteType] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [contactName, setContactName] = useState(user?.name || "");
  const [contactPhone, setContactPhone] = useState(user?.phone || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wasteTypes = [
    "Plastic Bottles",
    "Food Waste",
    "Paper/Cardboard",
    "Glass",
    "Metal Cans",
    "Electronics",
    "Hazardous Materials",
    "General Waste",
    "Other",
  ];

  const severityLevels = [
    {
      value: "low",
      label: "Low - Small amount",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "medium",
      label: "Medium - Moderate amount",
      color: "bg-orange-100 text-orange-800",
    },
    {
      value: "high",
      label: "High - Large amount",
      color: "bg-red-100 text-red-800",
    },
    {
      value: "critical",
      label: "Critical - Hazardous",
      color: "bg-red-200 text-red-900",
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // In a real app, you would use a geocoding service like Google Maps API
          // For now, we'll simulate it
          const address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

          setLocation({
            latitude,
            longitude,
            address,
          });
        } catch (error) {
          console.error("Error getting address:", error);
          setLocation({
            latitude,
            longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });
        }

        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Please try again.");
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user || !location) {
      setIsSubmitting(false);
      return;
    }

    // Convert images to URLs (in real app, you'd upload to a server)
    const imageUrls = images.map((image) => URL.createObjectURL(image));

    // Create the waste report
    const reportData = {
      userId: user.id,
      userName: user.name,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address || "",
      },
      wasteType,
      severity: severity as "low" | "medium" | "high" | "critical",
      description,
      images: imageUrls,
      contactName,
      contactPhone,
    };

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Add the report to context via API
    const result = await addReport(reportData);
    console.log("Report submission result:", result);

    if (result.success) {
      setSubmitSuccess(true);
      setIsSubmitting(false);

      // Show points earned if available
      if (result.pointsEarned) {
        console.log(`Earned ${result.pointsEarned} eco points!`);
      }
    } else {
      alert("Failed to submit report. Please try again.");
      setIsSubmitting(false);
      return;
    }

    // Reset form after success
    setTimeout(() => {
      setSubmitSuccess(false);
      setImages([]);
      setLocation(null);
      setWasteType("");
      setSeverity("");
      setDescription("");
      setContactName("");
      setContactPhone("");
      (e.target as HTMLFormElement).reset();
    }, 3000);
  };

  if (submitSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-900 mb-2">
                  Report Submitted Successfully!
                </h2>
                <p className="text-green-700 mb-6">
                  Thank you for helping keep our community clean. You've earned
                  50 eco points!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => window.location.reload()}>
                    Report Another Issue
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.history.back()}
                  >
                    Go Back
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Report Waste</h1>
          <p className="text-muted-foreground">
            Help keep your community clean by reporting waste that needs
            attention.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Photo Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Photos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Upload photos of the waste (up to 5 images)
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Photos
                    </Button>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-6 w-6 p-0"
                            onClick={() => removeImage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="w-full"
                  >
                    {isGettingLocation ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Current Location
                      </>
                    )}
                  </Button>

                  {location && (
                    <Alert>
                      <MapPin className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Location captured:</strong>
                        <br />
                        {location.address}
                        <br />
                        <span className="text-sm text-muted-foreground">
                          Lat: {location.latitude.toFixed(6)}, Lng:{" "}
                          {location.longitude.toFixed(6)}
                        </span>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <Label htmlFor="address">Manual Address (Optional)</Label>
                    <Input
                      id="address"
                      placeholder="Enter specific address or landmark"
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Waste Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Waste Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="wasteType">Type of Waste</Label>
                    <Select
                      value={wasteType}
                      onValueChange={setWasteType}
                      required
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select waste type" />
                      </SelectTrigger>
                      <SelectContent>
                        {wasteTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="severity">Severity Level</Label>
                    <Select
                      value={severity}
                      onValueChange={setSeverity}
                      required
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        {severityLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <div className="flex items-center gap-2">
                              <Badge className={level.color}>
                                {level.label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the waste situation in detail..."
                      className="mt-1"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactName">Your Name</Label>
                    <Input
                      id="contactName"
                      placeholder="Your name"
                      className="mt-1"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPhone">
                      Phone Number (Optional)
                    </Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="Your phone number"
                      className="mt-1"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {!location && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please capture your location for accurate waste reporting.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={!location || isSubmitting || images.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Submitting Report...
                  </>
                ) : (
                  "Submit Waste Report"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
