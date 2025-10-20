import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
<<<<<<< HEAD
import { Input } from "@/components/ui/input";
import { useFeed, CleanupActivity, FeedStats, Comment } from "@/contexts/feed-context";
=======
import { useFeed, CleanupActivity, FeedStats } from "@/contexts/feed-context";
>>>>>>> 83e28ff6a5bc61f5a1938db72f85ec135475b08c
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
<<<<<<< HEAD
  Send,
  Trash2,
=======
>>>>>>> 83e28ff6a5bc61f5a1938db72f85ec135475b08c
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
<<<<<<< HEAD
    loadActivityComments,
    addActivityComment,
    deleteActivityComment,
  } = useFeed();
  const [filter, setFilter] = useState<"all" | "verified" | "recent">("all");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [submittingComments, setSubmittingComments] = useState<Set<string>>(new Set());
=======
  } = useFeed();
  const [filter, setFilter] = useState<"all" | "verified" | "recent">("all");
>>>>>>> 83e28ff6a5bc61f5a1938db72f85ec135475b08c

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

<<<<<<< HEAD
  const toggleComments = async (activityId: string) => {
    if (expandedComments.has(activityId)) {
      setExpandedComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(activityId);
        return newSet;
      });
    } else {
      setExpandedComments(prev => new Set(prev).add(activityId));
      // Load comments if not already loaded
      const activity = activities.find(a => a.id === activityId);
      if (activity && !activity.commentsList) {
        try {
          const comments = await loadActivityComments(activityId);
          // Update the activity with comments
          // This will be handled by the context
        } catch (error) {
          console.error("Error loading comments:", error);
        }
      }
    }
  };

  const handleCommentSubmit = async (activityId: string) => {
    const commentText = commentTexts[activityId]?.trim();
    if (!commentText) return;

    setSubmittingComments(prev => new Set(prev).add(activityId));
    try {
      await addActivityComment(activityId, commentText);
      setCommentTexts(prev => ({ ...prev, [activityId]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmittingComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(activityId);
        return newSet;
      });
    }
  };

  const handleCommentDelete = async (commentId: string, activityId: string) => {
    try {
      await deleteActivityComment(commentId, activityId);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

=======
>>>>>>> 83e28ff6a5bc61f5a1938db72f85ec135475b08c
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
<<<<<<< HEAD
                    className="text-muted-foreground hover:text-blue-500"
                    onClick={() => toggleComments(activity.id)}
=======
                    className="text-muted-foreground"
>>>>>>> 83e28ff6a5bc61f5a1938db72f85ec135475b08c
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
<<<<<<< HEAD

              {/* Comments Section */}
              {expandedComments.has(activity.id) && (
                <div className="mt-4 border-t pt-4">
                  {/* Comments List */}
                  <div className="space-y-3 mb-4">
                    {activity.commentsList?.map((comment) => (
                      <div key={comment.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {comment.userName.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {comment.userName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {getTimeAgo(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">
                            {comment.commentText}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCommentDelete(comment.id, activity.id)}
                          className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {(!activity.commentsList || activity.commentsList.length === 0) && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No comments yet. Be the first to comment!
                      </p>
                    )}
                  </div>

                  {/* Add Comment Form */}
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentTexts[activity.id] || ""}
                        onChange={(e) =>
                          setCommentTexts(prev => ({
                            ...prev,
                            [activity.id]: e.target.value
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleCommentSubmit(activity.id);
                          }
                        }}
                      />
                    </div>
                    <button
                      onClick={() => handleCommentSubmit(activity.id)}
                      disabled={!commentTexts[activity.id]?.trim() || submittingComments.has(activity.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                    >
                      {submittingComments.has(activity.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
=======
>>>>>>> 83e28ff6a5bc61f5a1938db72f85ec135475b08c
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
