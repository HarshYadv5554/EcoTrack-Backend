import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Medal,
  Award,
  Star,
  Users,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";

export default function Leaderboard() {
  const topContributors = [
    {
      rank: 1,
      name: "Sarah Chen",
      points: 2450,
      reports: 89,
      cleanups: 34,
      avatar: "/placeholder.svg",
      badge: "Eco Champion",
      growth: "+15%",
    },
    {
      rank: 2,
      name: "Miguel Rodriguez",
      points: 2180,
      reports: 76,
      cleanups: 28,
      avatar: "/placeholder.svg",
      badge: "Green Hero",
      growth: "+12%",
    },
    {
      rank: 3,
      name: "Aisha Patel",
      points: 1920,
      reports: 65,
      cleanups: 25,
      avatar: "/placeholder.svg",
      badge: "Earth Guardian",
      growth: "+8%",
    },
    {
      rank: 4,
      name: "James Wilson",
      points: 1750,
      reports: 58,
      cleanups: 22,
      avatar: "/placeholder.svg",
      badge: "Waste Warrior",
      growth: "+6%",
    },
    {
      rank: 5,
      name: "Emma Thompson",
      points: 1680,
      reports: 54,
      cleanups: 20,
      avatar: "/placeholder.svg",
      badge: "Clean Crusader",
      growth: "+10%",
    },
  ];

  const weeklyLeaders = [
    { name: "Alex Johnson", points: 420, reports: 12 },
    { name: "Lisa Garcia", points: 380, reports: 11 },
    { name: "David Kim", points: 350, reports: 10 },
  ];

  const monthlyStats = [
    { label: "Total Reports", value: "1,248", icon: Target },
    { label: "Areas Cleaned", value: "89", icon: Award },
    { label: "Active Users", value: "456", icon: Users },
    { label: "Points Earned", value: "28,340", icon: Star },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-sm font-bold">
            {rank}
          </div>
        );
    }
  };

  const getBadgeColor = (badge: string) => {
    const colors = {
      "Eco Champion": "bg-yellow-100 text-yellow-800",
      "Green Hero": "bg-green-100 text-green-800",
      "Earth Guardian": "bg-blue-100 text-blue-800",
      "Waste Warrior": "bg-purple-100 text-purple-800",
      "Clean Crusader": "bg-orange-100 text-orange-800",
    };
    return colors[badge as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Leaderboard</h1>
        <p className="text-muted-foreground">
          Celebrate our environmental champions making a difference in their
          communities.
        </p>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {monthlyStats.map((stat, index) => {
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

      <Tabs defaultValue="allTime" className="w-full">
        <TabsList className="grid w-full lg:w-auto grid-cols-2">
          <TabsTrigger value="allTime">All Time</TabsTrigger>
          <TabsTrigger value="weekly">This Week</TabsTrigger>
        </TabsList>

        <TabsContent value="allTime" className="space-y-6">
          {/* Top 3 Podium */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {topContributors.slice(0, 3).map((user, index) => (
                  <div
                    key={user.rank}
                    className={`text-center p-6 rounded-lg border-2 ${
                      index === 0
                        ? "border-yellow-200 bg-yellow-50"
                        : index === 1
                          ? "border-gray-200 bg-gray-50"
                          : "border-amber-200 bg-amber-50"
                    }`}
                  >
                    <div className="mb-4">{getRankIcon(user.rank)}</div>
                    <Avatar className="w-16 h-16 mx-auto mb-4">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg mb-2">{user.name}</h3>
                    <Badge
                      className={getBadgeColor(user.badge)}
                      variant="secondary"
                    >
                      {user.badge}
                    </Badge>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-2xl">
                          {user.points.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.reports} reports • {user.cleanups} cleanups
                      </div>
                      <div className="flex items-center justify-center gap-1 text-green-600">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          {user.growth}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rest of leaderboard */}
              <div className="space-y-3">
                {topContributors.slice(3).map((user) => (
                  <div
                    key={user.rank}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {getRankIcon(user.rank)}
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <Badge
                          className={getBadgeColor(user.badge)}
                          variant="secondary"
                        >
                          {user.badge}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold">
                          {user.points.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.reports} reports
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-sm font-medium">{user.growth}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-blue-500" />
                This Week's Leaders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyLeaders.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {getRankIcon(index + 1)}
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold">{user.points}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.reports} reports
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="mt-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="text-center p-8">
          <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Climb the Leaderboard!</h3>
          <p className="text-muted-foreground mb-6">
            Report waste, participate in cleanups, and earn points to reach the
            top.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href="/report">Report Waste</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/map">Join Cleanup</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
