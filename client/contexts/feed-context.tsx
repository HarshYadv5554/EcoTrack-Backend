import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

<<<<<<< HEAD
export interface Comment {
  id: string;
  activityId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  commentText: string;
  createdAt: string;
  updatedAt: string;
}

=======
>>>>>>> 83e28ff6a5bc61f5a1938db72f85ec135475b08c
export interface CleanupActivity {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  wasteReportId?: string;
  wasteType: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  description: string;
  beforeImage?: string;
  afterImage?: string;
  verificationImage: string;
  verified: boolean;
  pointsEarned: number;
  likes: number;
  comments: number;
  cleanedAt: string;
  createdAt: string;
<<<<<<< HEAD
  commentsList?: Comment[];
=======
>>>>>>> 83e28ff6a5bc61f5a1938db72f85ec135475b08c
}

export interface FeedStats {
  areascleaned: number;
  photosShared: number;
  verificationRate: number;
  pointsEarned: number;
}

interface FeedContextType {
  activities: CleanupActivity[];
  stats: FeedStats | null;
  loading: boolean;
  hasMore: boolean;
  currentPage: number;
  createCleanupActivity: (activityData: {
    wasteReportId?: string;
    wasteType: string;
    latitude: number;
    longitude: number;
    address: string;
    description: string;
    beforeImage?: string;
    afterImage?: string;
    verificationImage: string;
  }) => Promise<{ success: boolean; pointsEarned?: number }>;
  loadMoreActivities: () => Promise<void>;
  likeActivity: (activityId: string) => Promise<void>;
  refreshFeed: () => Promise<void>;
  filterActivities: (filter: "all" | "verified" | "recent") => void;
<<<<<<< HEAD
  loadActivityComments: (activityId: string) => Promise<Comment[]>;
  addActivityComment: (activityId: string, commentText: string) => Promise<void>;
  deleteActivityComment: (commentId: string, activityId: string) => Promise<void>;
=======
>>>>>>> 83e28ff6a5bc61f5a1938db72f85ec135475b08c
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<CleanupActivity[]>([]);
  const [stats, setStats] = useState<FeedStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilter, setCurrentFilter] = useState<
    "all" | "verified" | "recent"
  >("all");

  // Load initial feed data
  useEffect(() => {
    loadFeedData(true);
    loadFeedStats();
  }, [currentFilter]);

  const loadFeedData = async (reset = false) => {
    try {
      setLoading(true);
      const page = reset ? 1 : currentPage;

      const response = await apiClient.getFeedActivities(
        page,
        10,
        currentFilter,
      );

      if (reset) {
        setActivities(response.activities);
        setCurrentPage(1);
      } else {
        setActivities((prev) => [...prev, ...response.activities]);
      }

      setHasMore(response.pagination.hasMore);
      setCurrentPage(page + 1);
    } catch (error) {
      console.error("Error loading feed data:", error);
      // Don't show error to user, just log it
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFeedStats = async () => {
    try {
      const response = await apiClient.getFeedStats();
      setStats(response.stats);
    } catch (error) {
      console.error("Error loading feed stats:", error);
      // Fallback stats
      setStats({
        areascleaned: 0,
        photosShared: 0,
        verificationRate: 0,
        pointsEarned: 0,
      });
    }
  };

  const createCleanupActivity = async (activityData: {
    wasteReportId?: string;
    wasteType: string;
    latitude: number;
    longitude: number;
    address: string;
    description: string;
    beforeImage?: string;
    afterImage?: string;
    verificationImage: string;
  }): Promise<{ success: boolean; pointsEarned?: number }> => {
    try {
      const response = await apiClient.createCleanupActivity(activityData);

      // Add the new activity to the beginning of the list
      setActivities((prev) => [response.activity, ...prev]);

      // Refresh stats
      loadFeedStats();

      return { success: true, pointsEarned: response.pointsEarned };
    } catch (error) {
      console.error("Error creating cleanup activity:", error);
      return { success: false };
    }
  };

  const loadMoreActivities = async () => {
    if (!hasMore || loading) return;
    await loadFeedData(false);
  };

  const likeActivity = async (activityId: string) => {
    try {
      const response = await apiClient.likeActivity(activityId);

      // Update the activity in the local state
      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === activityId
            ? { ...activity, likes: response.likes }
            : activity,
        ),
      );
    } catch (error) {
      console.error("Error liking activity:", error);
    }
  };

  const refreshFeed = async () => {
    await loadFeedData(true);
    await loadFeedStats();
  };

  const filterActivities = (filter: "all" | "verified" | "recent") => {
    setCurrentFilter(filter);
    setCurrentPage(1);
    setHasMore(true);
    // loadFeedData will be called by useEffect when currentFilter changes
  };

<<<<<<< HEAD
  const loadActivityComments = async (activityId: string): Promise<Comment[]> => {
    try {
      const response = await apiClient.getActivityComments(activityId);
      return response.comments;
    } catch (error) {
      console.error("Error loading activity comments:", error);
      return [];
    }
  };

  const addActivityComment = async (activityId: string, commentText: string): Promise<void> => {
    try {
      const response = await apiClient.addActivityComment(activityId, commentText);
      
      // Update the activity in the local state
      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === activityId
            ? {
                ...activity,
                comments: activity.comments + 1,
                commentsList: [...(activity.commentsList || []), response.comment],
              }
            : activity,
        ),
      );
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  const deleteActivityComment = async (commentId: string, activityId: string): Promise<void> => {
    try {
      await apiClient.deleteActivityComment(commentId);
      
      // Update the activity in the local state
      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === activityId
            ? {
                ...activity,
                comments: Math.max(0, activity.comments - 1),
                commentsList: (activity.commentsList || []).filter(
                  (comment) => comment.id !== commentId,
                ),
              }
            : activity,
        ),
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  };

=======
>>>>>>> 83e28ff6a5bc61f5a1938db72f85ec135475b08c
  const value = {
    activities,
    stats,
    loading,
    hasMore,
    currentPage,
    createCleanupActivity,
    loadMoreActivities,
    likeActivity,
    refreshFeed,
    filterActivities,
<<<<<<< HEAD
    loadActivityComments,
    addActivityComment,
    deleteActivityComment,
=======
>>>>>>> 83e28ff6a5bc61f5a1938db72f85ec135475b08c
  };

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useFeed() {
  const context = useContext(FeedContext);
  if (context === undefined) {
    throw new Error("useFeed must be used within a FeedProvider");
  }
  return context;
}
