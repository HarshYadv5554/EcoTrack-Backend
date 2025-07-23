import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Camera,
  Trophy,
  Gift,
  Users,
  Leaf,
  Navigation as NavigationIcon,
  Smartphone,
  Shield,
  Zap,
} from "lucide-react";

export default function Index() {
  const features = [
    {
      icon: Camera,
      title: "Report Waste",
      description:
        "Snap a photo of waste in your area and report it instantly with GPS location.",
    },
    {
      icon: MapPin,
      title: "GPS Integration",
      description:
        "Accurate location tracking helps authorities find and clean reported waste spots.",
    },
    {
      icon: NavigationIcon,
      title: "Route Optimization",
      description:
        "Authorities get the shortest path to reach cleanup locations efficiently.",
    },
    {
      icon: Trophy,
      title: "Earn Eco Points",
      description:
        "Get rewarded with points for reporting waste and participating in cleanups.",
    },
    {
      icon: Gift,
      title: "Redeem Rewards",
      description:
        "Exchange your eco points for exciting rewards and discounts.",
    },
    {
      icon: Users,
      title: "Community Leaderboard",
      description:
        "Compete with others and see who's making the biggest environmental impact.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Waste Reports" },
    { number: "5,000+", label: "Active Users" },
    { number: "500+", label: "Areas Cleaned" },
    { number: "95%", label: "Response Rate" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-eco-50 via-background to-eco-100 overflow-hidden">
        <div
          className={
            'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2322c55e" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-50'
          }
        ></div>

        <div className="container relative px-4 py-20 md:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <Badge
                variant="secondary"
                className="mb-4 bg-eco-100 text-eco-700 border-eco-200"
              >
                <Leaf className="w-3 h-3 mr-1" />
                Join the Green Revolution
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Track Waste,
                <span className="text-primary"> Clean Earth</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Report waste in your community, help authorities clean it
                faster, and earn rewards for making our planet cleaner. Every
                action counts towards a sustainable future.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link to="/report">
                    <Camera className="w-5 h-5 mr-2" />
                    Report Waste Now
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="text-lg px-8"
                >
                  <Link to="/map">
                    <MapPin className="w-5 h-5 mr-2" />
                    View Map
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-card p-8 rounded-3xl border shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">EcoTrack Mobile</h3>
                      <p className="text-sm text-muted-foreground">
                        Clean communities together
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-eco-50 dark:bg-eco-900/20 rounded-lg">
                      <Shield className="w-5 h-5 text-eco-600 dark:text-eco-400" />
                      <span className="text-sm">Secure GPS tracking</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-eco-50 dark:bg-eco-900/20 rounded-lg">
                      <Zap className="w-5 h-5 text-eco-600 dark:text-eco-400" />
                      <span className="text-sm">Instant notifications</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-eco-50 dark:bg-eco-900/20 rounded-lg">
                      <Trophy className="w-5 h-5 text-eco-600 dark:text-eco-400" />
                      <span className="text-sm">Reward system</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-4 bg-eco-100 text-eco-700 border-eco-200"
            >
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to make a difference
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools needed to
              report, track, and clean waste in your community while rewarding
              your environmental contributions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to make a difference?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of environmental champions who are already making
            their communities cleaner and greener.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-lg px-8"
            >
              <Link to="/report">Start Reporting</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link to="/leaderboard">View Leaderboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
