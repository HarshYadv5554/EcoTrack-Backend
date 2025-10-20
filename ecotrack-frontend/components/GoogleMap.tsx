import React, { useEffect, useRef, useState, useCallback } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { WasteReport } from "@/contexts/waste-reports-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CleanupVerificationModal } from "./CleanupVerificationModal";
import { useAuth } from "@/contexts/auth-context";
import {
  MapPin,
  Navigation,
  Clock,
  AlertTriangle,
  CheckCircle,
  Circle,
} from "lucide-react";

// Get Google Maps API key from environment variable
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface GoogleMapProps {
  reports: WasteReport[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
}

interface MapComponentProps extends GoogleMapProps {
  style: React.CSSProperties;
}

const MapComponent: React.FC<MapComponentProps> = ({
  reports,
  center = { lat: 40.7589, lng: -73.9851 }, // Default to NYC
  zoom = 12,
  style,
  onLocationSelect,
}) => {
  // Calculate center from reports if available
  const mapCenter =
    reports.length > 0
      ? (() => {
          const avgLat =
            reports.reduce((sum, report) => sum + report.location.latitude, 0) /
            reports.length;
          const avgLng =
            reports.reduce(
              (sum, report) => sum + report.location.longitude,
              0,
            ) / reports.length;
          return { lat: avgLat, lng: avgLng };
        })()
      : center;

  const { user } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(
    null,
  );
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // Initialize map
  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new google.maps.Map(ref.current, {
        center: mapCenter,
        zoom: reports.length > 0 ? 10 : zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      setMap(newMap);

      // Add click listener for location selection
      newMap.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng && onLocationSelect) {
          onLocationSelect({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          });
        }
      });
    }
  }, [ref, map, center, zoom, onLocationSelect]);

  // Re-center map when center prop changes
  useEffect(() => {
    if (map && center) {
      map.setCenter(center);
      map.setZoom(20); // More zoomed in
    }
  }, [map, center]);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);

        if (map) {
          map.setCenter(location);
          map.setZoom(15);

          // Add user location marker
          new google.maps.Marker({
            position: location,
            map,
            title: "Your Location",
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="#ffffff" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" fill="#ffffff"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(24, 24),
            },
          });
        }
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
  }, [map]);

  // Handle cleanup verification
  const handleMarkAsCleanedClick = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setIsVerificationModalOpen(true);
    }
  };

  const handleVerificationSuccess = (pointsEarned: number) => {
    // Show success message or notification
    console.log(`Cleanup verified! Earned ${pointsEarned} points`);
    // Optionally refresh the reports data here
    // You could call a parent callback here to refresh the reports
  };

  // Make the function globally available for info window buttons
  useEffect(() => {
    (window as any).handleMarkAsCleanedClick = handleMarkAsCleanedClick;
    return () => {
      delete (window as any).handleMarkAsCleanedClick;
    };
  }, [reports]);

  // Add markers for waste reports
  useEffect(() => {
    if (!map) return;

    // Debug: Log reports being processed
    console.log("GoogleMap: Processing", reports.length, "reports for markers");
    console.log("GoogleMap: Reports data:", reports);

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    reports.forEach((report, index) => {
      console.log(`GoogleMap: Creating marker ${index + 1} for report:`, {
        id: report.id,
        wasteType: report.wasteType,
        lat: report.location.latitude,
        lng: report.location.longitude,
        status: report.status,
        severity: report.severity,
      });

      const marker = new google.maps.Marker({
        position: {
          lat: report.location.latitude,
          lng: report.location.longitude,
        },
        map,
        title: `${report.wasteType} - ${report.severity}`,
        icon: getMarkerIcon(report.status, report.severity),
      });

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(report),
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      newMarkers.push(marker);
    });

    console.log("GoogleMap: Created", newMarkers.length, "markers");
    setMarkers(newMarkers);

    // Auto-fit map to show all markers if we have reports
    if (reports.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      reports.forEach((report) => {
        bounds.extend({
          lat: report.location.latitude,
          lng: report.location.longitude,
        });
      });
      map.fitBounds(bounds);

      // Add some padding and ensure minimum zoom level
      setTimeout(() => {
        if (map.getZoom() > 15) {
          map.setZoom(15);
        }
      }, 100);
    }
  }, [map, reports]);

  const getMarkerIcon = (status: string, severity: string) => {
    // Priority: High/Critical severity takes precedence over status
    let color = "#10B981"; // default green for completed

    // First check severity - high priority overrides status
    if (severity === "high" || severity === "critical") {
      color = "#EF4444"; // red for high priority
    } else {
      // If not high priority, use status color
      if (status === "pending")
        color = "#F59E0B"; // yellow
      else if (status === "in_progress")
        color = "#3B82F6"; // blue
      else if (status === "completed") color = "#10B981"; // green
    }

    return {
      url:
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C11.6 2 8 5.6 8 10C8 16 16 30 16 30C16 30 24 16 24 10C24 5.6 20.4 2 16 2Z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
          <circle cx="16" cy="10" r="4" fill="#ffffff"/>
        </svg>
      `),
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 32),
    };
  };

  const createInfoWindowContent = (report: WasteReport) => {
    const statusIcon =
      report.status === "completed"
        ? "✅"
        : report.status === "in_progress"
          ? "🔄"
          : "⏳";

    return `
      <div style="padding: 8px; max-width: 300px;">
        <h3 style="margin: 0 0 8px 0; font-weight: bold;">${report.wasteType}</h3>
        <p style="margin: 4px 0; color: #666;"><strong>Status:</strong> ${statusIcon} ${report.status}</p>
        <p style="margin: 4px 0; color: #666;"><strong>Severity:</strong> ${report.severity}</p>
        <p style="margin: 4px 0; color: #666;"><strong>Reported by:</strong> ${report.userName}</p>
        <p style="margin: 4px 0; color: #666;">${report.description}</p>
        <p style="margin: 8px 0 4px 0; color: #888; font-size: 12px;">
          ${new Date(report.reportedAt).toLocaleDateString()}
        </p>
        <button 
                    onclick="window.open('https://www.google.com/maps/dir//${report.location.latitude},${report.location.longitude}', '_blank')"
          style="
            padding: 6px 10px;
            background: #22C55E;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            margin-right: 6px;
            margin-top: 8px;
          "
        >
          📍 Get Directions
        </button>
        ${
          user && report.status !== "completed"
            ? `<button
                onclick="window.handleMarkAsCleanedClick('${report.id}')"
                style="
                  padding: 6px 10px;
                  background: #3B82F6;
                  color: white;
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 11px;
                  margin-top: 8px;
                "
              >
                📸 Mark as Cleaned
              </button>`
            : report.status === "completed"
              ? `<span style="
                  padding: 6px 10px;
                  background: #10B981;
                  color: white;
                  border-radius: 4px;
                  font-size: 11px;
                  margin-left: 6px;
                  margin-top: 8px;
                  display: inline-block;
                ">✅ Cleaned</span>`
              : ""
        }
      </div>
    `;
  };

  return (
    <div className="relative w-full h-full">
      <div ref={ref} style={{ ...style, minHeight: "400px" }} />

      {/* Location button overlay */}
      <Button
        onClick={getCurrentLocation}
        className="absolute bottom-4 left-4 z-10 bg-white text-gray-800 hover:bg-gray-100 shadow-lg border"
        size="sm"
      >
        <Navigation className="w-4 h-4 mr-2" />
        My Location
      </Button>

      {/* Legend */}
      <Card className="absolute top-4 right-4 z-10 bg-background/95 backdrop-blur border">
        <CardContent className="p-3">
          <h4 className="font-semibold mb-2 text-sm">Map Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Pending Reports</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Completed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cleanup Verification Modal */}
      <CleanupVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        report={selectedReport}
        onSuccess={handleVerificationSuccess}
      />
    </div>
  );
};

const MapLoadingComponent: React.FC = () => (
  <div className="h-full flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-gray-600">Loading interactive map...</p>
    </div>
  </div>
);

const MapErrorComponent: React.FC<{ status: Status }> = ({ status }) => (
  <div className="h-full flex items-center justify-center bg-gray-100">
    <div className="text-center max-w-md p-6">
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Map Loading Error</h3>
      <p className="text-gray-600 mb-4">
        {status === Status.FAILURE
          ? "Failed to load Google Maps. Please check your API key and internet connection."
          : `Map status: ${status}`}
      </p>
    </div>
  </div>
);

const GoogleMap: React.FC<GoogleMapProps> = (props) => {
  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <MapLoadingComponent />;
      case Status.FAILURE:
        return <MapErrorComponent status={status} />;
      case Status.SUCCESS:
        return (
          <MapComponent {...props} style={{ width: "100%", height: "100%" }} />
        );
    }
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md p-6">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">API Key Missing</h3>
          <p className="text-gray-600">
            Google Maps API key is not configured.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Wrapper
      apiKey={GOOGLE_MAPS_API_KEY}
      render={render}
      libraries={["geometry", "places"]}
    />
  );
};

export default GoogleMap;
