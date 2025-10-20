import React, { useState, useCallback } from "react";
import GoogleMap from "./GoogleMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Check } from "lucide-react";

interface LocationPickerProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  selectedLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  selectedLocation,
}) => {
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [tempLocation, setTempLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleMapClick = useCallback(
    (location: { lat: number; lng: number }) => {
      setTempLocation(location);
    },
    [],
  );

  const confirmLocation = async () => {
    if (!tempLocation) return;

    try {
      // Use reverse geocoding to get address
      const apiKey =
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
        "AIzaSyB4-B2A3F7Kl8Z9QxYv2UwX1Nt6MhG8PqL";
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${tempLocation.lat},${tempLocation.lng}&key=${apiKey}`,
      );
      const data = await response.json();

      let address = `${tempLocation.lat.toFixed(6)}, ${tempLocation.lng.toFixed(6)}`;
      if (data.results && data.results[0]) {
        address = data.results[0].formatted_address;
      }

      onLocationSelect({
        latitude: tempLocation.lat,
        longitude: tempLocation.lng,
        address,
      });

      setIsPickingLocation(false);
      setTempLocation(null);
    } catch (error) {
      console.error("Error getting address:", error);
      // Fallback to coordinates
      onLocationSelect({
        latitude: tempLocation.lat,
        longitude: tempLocation.lng,
        address: `${tempLocation.lat.toFixed(6)}, ${tempLocation.lng.toFixed(6)}`,
      });

      setIsPickingLocation(false);
      setTempLocation(null);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Get address for current location
          const apiKey =
            import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
            "AIzaSyB4-B2A3F7Kl8Z9QxYv2UwX1Nt6MhG8PqL";
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`,
          );
          const data = await response.json();

          let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          if (data.results && data.results[0]) {
            address = data.results[0].formatted_address;
          }

          onLocationSelect({
            latitude,
            longitude,
            address,
          });
        } catch (error) {
          console.error("Error getting address:", error);
          onLocationSelect({
            latitude,
            longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Please try again.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  if (isPickingLocation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Select Location on Map
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Click on the map to select the exact location of the waste
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-80 rounded-lg overflow-hidden border">
            <GoogleMap
              reports={[]}
              onLocationSelect={handleMapClick}
              center={
                selectedLocation
                  ? {
                      lat: selectedLocation.latitude,
                      lng: selectedLocation.longitude,
                    }
                  : undefined
              }
            />
          </div>

          {tempLocation && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Selected Location:</strong>
                <br />
                {tempLocation.lat.toFixed(6)}, {tempLocation.lng.toFixed(6)}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={confirmLocation}
              disabled={!tempLocation}
              className="flex-1"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirm Location
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsPickingLocation(false);
                setTempLocation(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button
            onClick={getCurrentLocation}
            variant="outline"
            className="w-full"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Use Current Location
          </Button>
          <Button
            onClick={() => setIsPickingLocation(true)}
            variant="outline"
            className="w-full"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Pick on Map
          </Button>
        </div>

        {selectedLocation && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-green-900 text-sm">
                  Location Selected
                </p>
                <p className="text-green-700 text-sm">
                  {selectedLocation.address}
                </p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {selectedLocation.latitude.toFixed(6)},{" "}
                  {selectedLocation.longitude.toFixed(6)}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationPicker;
