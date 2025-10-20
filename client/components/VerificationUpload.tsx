import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFeed } from "@/contexts/feed-context";
import { useAuth } from "@/contexts/auth-context";
import {
  Camera,
  MapPin,
  Upload,
  CheckCircle,
  Loader2,
  X,
  Satellite,
} from "lucide-react";

interface VerificationUploadProps {
  wasteReportId?: string;
  wasteType: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  reportImages?: string[]; // Images from the original waste report
  onSuccess?: (pointsEarned: number) => void;
  onCancel?: () => void;
}

export function VerificationUpload({
  wasteReportId,
  wasteType,
  location,
  reportImages,
  onSuccess,
  onCancel,
}: VerificationUploadProps) {
  const { createCleanupActivity } = useFeed();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [description, setDescription] = useState("");
  const [beforeImage, setBeforeImage] = useState<string>(
    reportImages && reportImages.length > 0 ? reportImages[0] : "",
  );
  const [afterImage, setAfterImage] = useState<string>("");
  const [verificationImage, setVerificationImage] = useState<string>("");

  const beforeImageRef = useRef<HTMLInputElement>(null);
  const afterImageRef = useRef<HTMLInputElement>(null);
  const verificationImageRef = useRef<HTMLInputElement>(null);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Please enable location services.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  const handleImageUpload = (
    file: File,
    setImage: (url: string) => void,
  ): Promise<void> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        resolve();
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: (url: string) => void,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleImageUpload(file, setImage);
    }
  };

  const handleSubmit = async () => {
    if (!verificationImage) {
      alert("Please upload a verification photo with GPS location");
      return;
    }

    if (!currentLocation) {
      alert("Please get your current GPS location first");
      return;
    }

    if (!description.trim()) {
      alert("Please provide a description of your cleanup activity");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createCleanupActivity({
        wasteReportId,
        wasteType,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        address: location.address,
        description: description.trim(),
        beforeImage: beforeImage || undefined,
        afterImage: afterImage || undefined,
        verificationImage,
      });

      if (result.success) {
        onSuccess?.(result.pointsEarned || 0);
      } else {
        alert("Failed to submit cleanup verification. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting verification:", error);
      alert("Failed to submit cleanup verification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Verify Cleanup Activity
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload photos and GPS verification to confirm your cleanup and earn
          eco points!
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Waste Info */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{wasteType}</Badge>
            <Badge variant="outline" className="text-xs">
              <MapPin className="w-3 h-3 mr-1" />
              {location.address}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Cleanup verification for reported waste location
          </p>
        </div>

        {/* GPS Location */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Satellite className="w-4 h-4" />
            Current GPS Location
          </Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              className="flex-shrink-0"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Get Current Location
            </Button>
            {currentLocation && (
              <Badge variant="secondary" className="text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                {currentLocation.latitude.toFixed(6)},{" "}
                {currentLocation.longitude.toFixed(6)}
              </Badge>
            )}
          </div>
          {!currentLocation && (
            <p className="text-xs text-muted-foreground">
              GPS location is required to verify your cleanup activity
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Cleanup Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe what you cleaned, how much waste was removed, and any other details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Before Image */}
        <div className="space-y-2">
          <Label>
            Before Photo
            {reportImages && reportImages.length > 0 && (
              <span className="text-xs text-muted-foreground ml-2">
                (Auto-filled from original report)
              </span>
            )}
          </Label>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => beforeImageRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              {beforeImage ? "Change Before Photo" : "Upload Before Photo"}
            </Button>
            <input
              ref={beforeImageRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, setBeforeImage)}
            />
            {beforeImage && (
              <div className="relative">
                <img
                  src={beforeImage}
                  alt="Before"
                  className="w-16 h-16 object-cover rounded"
                />
                {!(reportImages && reportImages.includes(beforeImage)) && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0"
                    onClick={() =>
                      setBeforeImage(
                        reportImages && reportImages.length > 0
                          ? reportImages[0]
                          : "",
                      )
                    }
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
          {reportImages &&
            reportImages.length > 0 &&
            beforeImage === reportImages[0] && (
              <p className="text-xs text-muted-foreground">
                Using original waste report photo as the "before" image
              </p>
            )}
        </div>

        {/* After Image */}
        <div className="space-y-2">
          <Label>After Photo (Optional)</Label>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => afterImageRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload After Photo
            </Button>
            <input
              ref={afterImageRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, setAfterImage)}
            />
            {afterImage && (
              <div className="relative">
                <img
                  src={afterImage}
                  alt="After"
                  className="w-16 h-16 object-cover rounded"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 p-0"
                  onClick={() => setAfterImage("")}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Verification Image */}
        <div className="space-y-2">
          <Label>GPS Verification Photo *</Label>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => verificationImageRef.current?.click()}
              className="border-primary"
            >
              <Camera className="w-4 h-4 mr-2" />
              Take GPS Verification Photo
            </Button>
            <input
              ref={verificationImageRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFileChange(e, setVerificationImage)}
            />
            {verificationImage && (
              <div className="relative">
                <img
                  src={verificationImage}
                  alt="Verification"
                  className="w-16 h-16 object-cover rounded"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 p-0"
                  onClick={() => setVerificationImage("")}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            This photo with your current GPS location is required to verify your
            cleanup activity
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !verificationImage ||
              !currentLocation ||
              !description.trim()
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify Cleanup
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
