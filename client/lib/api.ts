const API_BASE_URL = "/api";

class ApiClient {
  private activeRequests: Map<string, Promise<any>> = new Map();

  private getAuthToken(): string | null {
    return localStorage.getItem("ecotrack-token");
  }

  private getRequestKey(endpoint: string, options: RequestInit): string {
    const method = options.method || "GET";
    const body = options.body ? JSON.stringify(options.body) : "";
    return `${method}:${endpoint}:${body}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const requestKey = this.getRequestKey(endpoint, options);

    // Check if the same request is already in progress (for non-GET requests)
    if (
      options.method &&
      options.method !== "GET" &&
      this.activeRequests.has(requestKey)
    ) {
      console.log(`Deduplicating request: ${requestKey}`);
      return this.activeRequests.get(requestKey);
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();

    // Build headers separately to avoid conflicts
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Merge with any provided headers
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    const requestPromise = this.executeRequest<T>(url, config, endpoint);

    // Store the request promise for deduplication
    if (options.method && options.method !== "GET") {
      this.activeRequests.set(requestKey, requestPromise);

      // Clean up the request when it completes
      requestPromise.finally(() => {
        this.activeRequests.delete(requestKey);
      });
    }

    return requestPromise;
  }

  private async executeRequest<T>(
    url: string,
    config: RequestInit,
    endpoint: string,
  ): Promise<T> {
    try {
      console.log(`Making API request: ${config.method || "GET"} ${url}`);
      const response = await fetch(url, config);

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // If JSON parsing fails, use the status text
          errorMessage = response.statusText || errorMessage;
        }

        console.error(`API request failed for ${endpoint}:`, {
          status: response.status,
          statusText: response.statusText,
          errorMessage,
        });

        throw new Error(errorMessage);
      }

      // Parse JSON response
      const data = await response.json();
      console.log(`API request successful for ${endpoint}`);
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Authentication
  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<{
    token: string;
    user: any;
  }> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }): Promise<{
    token: string;
    user: any;
  }> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async getProfile(): Promise<{ user: any }> {
    return this.request("/auth/profile");
  }

  async updateProfile(profileData: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
  }): Promise<{ user: any }> {
    return this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  // Waste Reports
  async getAllReports(): Promise<{ reports: any[] }> {
    return this.request("/reports");
  }

  async getUserReports(): Promise<{ reports: any[] }> {
    return this.request("/reports/my");
  }

  async createReport(reportData: {
    location: {
      latitude: number;
      longitude: number;
      address: string;
    };
    wasteType: string;
    severity: string;
    description: string;
    images: string[];
    contactName: string;
    contactPhone?: string;
  }): Promise<{
    report: any;
    pointsEarned: number;
  }> {
    return this.request("/reports", {
      method: "POST",
      body: JSON.stringify(reportData),
    });
  }

  async updateReportStatus(
    reportId: string,
    status: string,
  ): Promise<{ report: any }> {
    return this.request(`/reports/${reportId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  // Feed/Cleanup Activities
  async getFeedActivities(
    page: number = 1,
    limit: number = 10,
    filter: "all" | "verified" | "recent" = "all",
  ): Promise<{
    activities: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
  }> {
    return this.request(
      `/cleanup-activities?page=${page}&limit=${limit}&filter=${filter}`,
    );
  }

  async createCleanupActivity(activityData: {
    wasteReportId?: string;
    wasteType: string;
    latitude: number;
    longitude: number;
    address: string;
    description: string;
    beforeImage?: string;
    afterImage?: string;
    verificationImage: string;
  }): Promise<{
    activity: any;
    pointsEarned: number;
    message: string;
  }> {
    return this.request("/cleanup-activities", {
      method: "POST",
      body: JSON.stringify(activityData),
    });
  }

  async getUserCleanupActivities(): Promise<{ activities: any[] }> {
    return this.request("/cleanup-activities/my");
  }

  async likeActivity(activityId: string): Promise<{
    likes: number;
    message: string;
  }> {
    return this.request(`/cleanup-activities/${activityId}/like`, {
      method: "POST",
    });
  }

  async getFeedStats(): Promise<{
    stats: {
      areascleaned: number;
      photosShared: number;
      verificationRate: number;
      pointsEarned: number;
    };
  }> {
    return this.request("/feed/stats");
  }

  // Utility
  async ping(): Promise<{ message: string; timestamp: string }> {
    return this.request("/ping");
  }
}

export const apiClient = new ApiClient();
