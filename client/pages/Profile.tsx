import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  Award,
  Calendar,
  Edit3,
  Camera,
  Trophy,
  Leaf,
  CheckCircle,
} from "lucide-react";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state - initialize with actual user data or defaults
  const [formData, setFormData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    phone: user?.phone || "+1 (555) 123-4567",
    location: user?.location || "New York, NY",
  });

  // Sync form data when user data changes (e.g., after login or profile update)
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "+1 (555) 123-4567",
        location: user.location || "New York, NY",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Update the user profile via API
      const success = await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
      });

      if (success) {
        setIsEditing(false);
        setSaveSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        // Handle error - could show an error message
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
    }

    setIsSaving(false);
  };

  const handleCancel = () => {
    // Reset form data to current user values
    setFormData({
      name: user?.name || "John Doe",
      email: user?.email || "john.doe@example.com",
      phone: user?.phone || "+1 (555) 123-4567",
      location: user?.location || "New York, NY",
    });
    setIsEditing(false);
  };

  const userStats = [
    { label: "Total Reports", value: "47", icon: MapPin },
    { label: "Eco Points", value: "1,250", icon: Star },
    { label: "Areas Cleaned", value: "12", icon: Leaf },
    { label: "Rank", value: "#24", icon: Trophy },
  ];

  const recentActivity = [
    {
      type: "report",
      description: "Reported plastic waste at Central Park",
      points: 50,
      date: "2024-01-15",
    },
    {
      type: "cleanup",
      description: "Participated in community cleanup",
      points: 100,
      date: "2024-01-12",
    },
    {
      type: "reward",
      description: "Redeemed eco-friendly water bottle",
      points: -500,
      date: "2024-01-10",
    },
  ];

  const achievements = [
    {
      name: "First Reporter",
      description: "Made your first waste report",
      earned: true,
    },
    { name: "Eco Warrior", description: "Earned 1000+ points", earned: true },
    {
      name: "Community Hero",
      description: "Helped clean 10+ areas",
      earned: true,
    },
    {
      name: "Green Champion",
      description: "Top 10% contributor",
      earned: false,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Success Alert */}
        {saveSuccess && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Profile updated successfully!</AlertDescription>
          </Alert>
        )}

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder.svg" alt="Profile" />
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">{formData.name}</h1>
                    <p className="text-muted-foreground">
                      Environmental Champion
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-eco-100 text-eco-800">
                        <Award className="w-3 h-3 mr-1" />
                        Eco Warrior
                      </Badge>
                      <Badge variant="outline">Member since Jan 2024</Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>

                {isEditing ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2 flex gap-2">
                      <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{formData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{formData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{formData.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>
                        Joined{" "}
                        {user?.joinedDate
                          ? new Date(user.joinedDate).toLocaleDateString(
                              "en-US",
                              { month: "long", year: "numeric" },
                            )
                          : "January 2024"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {userStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={activity.points > 0 ? "default" : "secondary"}
                      className="ml-4"
                    >
                      {activity.points > 0 ? "+" : ""}
                      {activity.points} pts
                    </Badge>
                  </div>
                  {index < recentActivity.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    achievement.earned
                      ? "bg-green-50 border border-green-200"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <Award
                    className={`w-6 h-6 ${
                      achievement.earned ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{achievement.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <Badge variant="outline" className="text-green-700">
                      Earned
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button className="h-16" asChild>
                <a href="/report" className="flex flex-col items-center gap-2">
                  <Camera className="w-6 h-6" />
                  <span>Report Waste</span>
                </a>
              </Button>
              <Button variant="outline" className="h-16" asChild>
                <a href="/map" className="flex flex-col items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  <span>View Map</span>
                </a>
              </Button>
              <Button variant="outline" className="h-16" asChild>
                <a href="/rewards" className="flex flex-col items-center gap-2">
                  <Star className="w-6 h-6" />
                  <span>Redeem Points</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
