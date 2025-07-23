import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFeed, CleanupActivity, FeedStats } from "@/contexts/feed-context";
import {
  Camera,
  MapPin,
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  CheckCircle,
  Award,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function Feed() {
  const {
    activities,
    stats,
    loading,
    hasMore,
    loadMoreActivities,
    likeActivity,
    filterActivities,
  } = useFeed();
  const [filter, setFilter] = useState<"all" | "verified" | "recent">("all");

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleFilterChange = (newFilter: "all" | "verified" | "recent") => {
    setFilter(newFilter);
    filterActivities(newFilter);
  };

  const handleLike = (activityId: string) => {
    likeActivity(activityId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Cleanup Feed</h1>
        <p className="text-muted-foreground">
          See the amazing cleanup work happening in our community. Every action
          makes a difference!
        </p>
      </div>

      {/* Stats Banner */}
      <Card className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {stats?.areascleaned || 0}
              </div>
              <div className="text-sm text-muted-foreground">Areas Cleaned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {stats?.photosShared
                  ? stats.photosShared >= 1000
                    ? `${(stats.photosShared / 1000).toFixed(1)}k`
                    : stats.photosShared
                  : 0}
              </div>
              <div className="text-sm text-muted-foreground">Photos Shared</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {stats?.verificationRate || 0}%
              </div>
              <div className="text-sm text-muted-foreground">Verified</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {stats?.pointsEarned
                  ? stats.pointsEarned >= 1000
                    ? `${(stats.pointsEarned / 1000).toFixed(1)}k`
                    : stats.pointsEarned
                  : 0}
              </div>
              <div className="text-sm text-muted-foreground">Points Earned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterChange("all")}
        >
          All Activities
        </Button>
        <Button
          variant={filter === "verified" ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterChange("verified")}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Verified Only
        </Button>
        <Button
          variant={filter === "recent" ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterChange("recent")}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Last 24h
        </Button>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {activities.map((activity) => (
          <Card key={activity.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={activity.userAvatar}
                      alt={activity.userName}
                    />
                    <AvatarFallback>
                      {activity.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{activity.userName}</h3>
                      {activity.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{activity.location.address}</span>
                      <span>•</span>
                      <span>{getTimeAgo(activity.cleanedAt)}</span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  <Award className="w-3 h-3 mr-1" />+{activity.pointsEarned} pts
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Description */}
              <p className="text-sm">{activity.description}</p>

              {/* Waste Type Badge */}
              <Badge variant="secondary" className="w-fit">
                <Sparkles className="w-3 h-3 mr-1" />
                {activity.wasteType}
              </Badge>

              {/* Before/After Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Before
                  </h4>
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={activity.beforeImage}
                      alt="Before cleanup"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="destructive" className="text-xs">
                        Before
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    After
                  </h4>
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={activity.afterImage}
                      alt="After cleanup"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="text-xs bg-green-500 hover:bg-green-600">
                        After
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Photo */}
              {activity.verified && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    GPS Verification Photo
                  </h4>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted max-w-md">
                    <img
                      src={activity.verificationImage}
                      alt="GPS verification"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2">
                      <Badge className="text-xs bg-blue-500 hover:bg-blue-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        GPS Verified
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-red-500"
                    onClick={() => handleLike(activity.id)}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {activity.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {activity.comments}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  View on Map
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={loadMoreActivities}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Activities"
            )}
          </Button>
        </div>
      )}

      {/* Empty State */}
      {activities.length === 0 && !loading && (
        <div className="text-center py-12">
          <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No activities yet</h3>
          <p className="text-muted-foreground mb-4">
            Be the first to share a cleanup activity with the community!
          </p>
          <Button asChild>
            <a href="/report">Report & Clean Waste</a>
          </Button>
        </div>
      )}
    </div>
  );
}
