import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Gift,
  Star,
  ShoppingBag,
  Coffee,
  Leaf,
  Bike,
  Shirt,
  Smartphone,
  Award,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function Rewards() {
  const [userPoints] = useState(1250);

  const availableRewards = [
    {
      id: 1,
      name: "Eco-Friendly Water Bottle",
      points: 500,
      category: "Lifestyle",
      image: "/placeholder.svg",
      description: "Reusable stainless steel water bottle",
      stock: 25,
      icon: Coffee,
    },
    {
      id: 2,
      name: "Organic Cotton T-Shirt",
      points: 800,
      category: "Clothing",
      image: "/placeholder.svg",
      description: "100% organic cotton t-shirt with eco design",
      stock: 15,
      icon: Shirt,
    },
    {
      id: 3,
      name: "Plant a Tree Certificate",
      points: 300,
      category: "Environment",
      image: "/placeholder.svg",
      description: "We'll plant a tree in your name",
      stock: 100,
      icon: Leaf,
    },
    {
      id: 4,
      name: "Bike Sharing Credits",
      points: 400,
      category: "Transport",
      image: "/placeholder.svg",
      description: "1 month of free bike sharing",
      stock: 50,
      icon: Bike,
    },
    {
      id: 5,
      name: "Eco Phone Case",
      points: 600,
      category: "Tech",
      image: "/placeholder.svg",
      description: "Biodegradable phone case",
      stock: 20,
      icon: Smartphone,
    },
    {
      id: 6,
      name: "Coffee Shop Voucher",
      points: 200,
      category: "Food",
      image: "/placeholder.svg",
      description: "$10 voucher for sustainable coffee",
      stock: 40,
      icon: Coffee,
    },
  ];

  const redeemedRewards = [
    {
      id: 1,
      name: "Eco-Friendly Water Bottle",
      points: 500,
      redeemedDate: "2024-01-15",
      status: "Delivered",
    },
    {
      id: 2,
      name: "Plant a Tree Certificate",
      points: 300,
      redeemedDate: "2024-01-10",
      status: "Completed",
    },
  ];

  const pointMilestones = [
    { points: 100, reward: "Bronze Badge", achieved: true },
    { points: 500, reward: "Silver Badge", achieved: true },
    { points: 1000, reward: "Gold Badge", achieved: true },
    { points: 2000, reward: "Platinum Badge", achieved: false },
    { points: 5000, reward: "Diamond Badge", achieved: false },
  ];

  const categories = [
    "All",
    "Lifestyle",
    "Clothing",
    "Environment",
    "Transport",
    "Tech",
    "Food",
  ];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredRewards = availableRewards.filter(
    (reward) =>
      selectedCategory === "All" || reward.category === selectedCategory,
  );

  const canRedeem = (points: number) => userPoints >= points;

  const nextMilestone = pointMilestones.find(
    (milestone) => !milestone.achieved,
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Rewards Store</h1>
        <p className="text-muted-foreground">
          Redeem your eco points for sustainable rewards and exclusive benefits.
        </p>
      </div>

      {/* User Points Card */}
      <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <Star className="w-6 h-6 text-yellow-500" />
                <span className="text-2xl font-bold">
                  {userPoints.toLocaleString()}
                </span>
                <span className="text-muted-foreground">Eco Points</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Keep reporting waste and cleaning to earn more points!
              </p>
            </div>

            {nextMilestone && (
              <div className="w-full md:w-64">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Next Milestone</span>
                  <Badge variant="outline">{nextMilestone.reward}</Badge>
                </div>
                <Progress
                  value={(userPoints / nextMilestone.points) * 100}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {nextMilestone.points - userPoints} points to go
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full lg:w-auto grid-cols-2">
          <TabsTrigger value="available">Available Rewards</TabsTrigger>
          <TabsTrigger value="history">My Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Rewards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => {
              const Icon = reward.icon;
              const canRedeemReward = canRedeem(reward.points);

              return (
                <Card
                  key={reward.id}
                  className={`relative ${!canRedeemReward ? "opacity-60" : ""}`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="secondary">{reward.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{reward.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {reward.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold">{reward.points}</span>
                        <span className="text-sm text-muted-foreground">
                          points
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {reward.stock} left
                      </span>
                    </div>

                    <Button
                      className="w-full"
                      disabled={!canRedeemReward || reward.stock === 0}
                    >
                      {!canRedeemReward
                        ? `Need ${reward.points - userPoints} more points`
                        : reward.stock === 0
                          ? "Out of Stock"
                          : "Redeem Now"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Redeemed Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              {redeemedRewards.length > 0 ? (
                <div className="space-y-4">
                  {redeemedRewards.map((reward) => (
                    <div
                      key={reward.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{reward.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Redeemed on{" "}
                          {new Date(reward.redeemedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">{reward.points}</span>
                        </div>
                        <Badge
                          variant={
                            reward.status === "Delivered"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {reward.status === "Delivered" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {reward.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No rewards redeemed yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Start earning points and redeem your first reward!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievement Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {pointMilestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`text-center p-4 rounded-lg border ${
                      milestone.achieved
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <Award
                      className={`w-8 h-8 mx-auto mb-2 ${
                        milestone.achieved ? "text-green-600" : "text-gray-400"
                      }`}
                    />
                    <p className="font-medium text-sm">{milestone.reward}</p>
                    <p className="text-xs text-muted-foreground">
                      {milestone.points} points
                    </p>
                    {milestone.achieved && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Earned
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
