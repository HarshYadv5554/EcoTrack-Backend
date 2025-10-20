import { useState } from "react";
import { useWasteReports } from "@/contexts/waste-reports-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import GoogleMap from "@/components/GoogleMap";
import {
  MapPin,
  Navigation,
  Clock,
  AlertTriangle,
  CheckCircle,
  Circle,
  Search,
  Filter,
} from "lucide-react";

export default function Map() {
  const { reports } = useWasteReports();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Debug: Log the reports data
  console.log("Map: Total reports loaded:", reports.length);
  console.log("Map: Reports data:", reports);

  // Filter reports based on status, search query, and completedAt
  const filteredReports = reports.filter((report) => {
    // Remove completed reports older than 24 hours
    if (
      report.status === "completed" &&
      report.completedAt &&
      new Date().getTime() - new Date(report.completedAt).getTime() > 24 * 60 * 60 * 1000
    ) {
      return false;
    }
    const matchesStatus =
      selectedStatus === "all" || report.status === selectedStatus;
    const matchesSearch =
      searchQuery === "" ||
      report.wasteType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.address
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Find the selected report's location
  const selectedReport = filteredReports.find(r => r.id === selectedReportId);
  const selectedLocation = selectedReport
    ? { lat: selectedReport.location.latitude, lng: selectedReport.location.longitude }
    : undefined;

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Circle className="w-4 h-4 text-yellow-600" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDirections = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir//${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Interactive Waste Map</h1>
        <p className="text-muted-foreground">
          View all reported waste locations and track cleanup progress in
          real-time. Click markers for details and directions.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] overflow-hidden">
            <CardContent className="p-0 h-full flex flex-col">
              <div className="flex-1 min-h-0">
                <GoogleMap reports={filteredReports} center={selectedLocation} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Sidebar */}
        <div className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus("all")}
                    className="text-xs"
                  >
                    All ({reports.length})
                  </Button>
                  <Button
                    variant={
                      selectedStatus === "pending" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedStatus("pending")}
                    className="text-xs"
                  >
                    Pending (
                    {reports.filter((r) => r.status === "pending").length})
                  </Button>
                  <Button
                    variant={
                      selectedStatus === "in_progress" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedStatus("in_progress")}
                    className="text-xs"
                  >
                    Active (
                    {reports.filter((r) => r.status === "in_progress").length})
                  </Button>
                  <Button
                    variant={
                      selectedStatus === "completed" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedStatus("completed")}
                    className="text-xs"
                  >
                    Done (
                    {reports.filter((r) => r.status === "completed").length})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Reports ({filteredReports.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedReportId(report.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">
                        {report.location.address || "Unknown Location"}
                      </h4>
                      <Badge className={getStatusColor(report.status)}>
                        {getStatusIcon(report.status)}
                        <span className="ml-1 capitalize">{report.status}</span>
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={getSeverityColor(report.severity)}
                        >
                          {report.severity}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {report.wasteType}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {report.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>By {report.userName}</span>
                        <span>{getTimeAgo(report.reportedAt)}</span>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          getDirections(
                            report.location.latitude,
                            report.location.longitude,
                          )
                        }
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {reports.length === 0
                      ? "No waste reports yet"
                      : "No reports match your filters"}
                  </p>
                  {reports.length === 0 && (
                    <Button className="mt-4" asChild>
                      <a href="/report">Report First Waste</a>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {reports.filter((r) => r.status === "pending").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {reports.filter((r) => r.status === "in_progress").length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    In Progress
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {reports.filter((r) => r.status === "completed").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {
                      reports.filter(
                        (r) =>
                          r.severity === "high" || r.severity === "critical",
                      ).length
                    }
                  </div>
                  <div className="text-xs text-muted-foreground">
                    High Priority
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
