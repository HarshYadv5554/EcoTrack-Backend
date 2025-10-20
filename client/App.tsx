import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import { Navigation } from "./components/Navigation";
import { ProtectedRoute } from "./components/protected-route";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ReportWaste from "./pages/ReportWaste";
import Map from "./pages/Map";
import Feed from "./pages/Feed";
import Leaderboard from "./pages/Leaderboard";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />

            {/* Routes with navigation */}
            <Route
              path="/*"
              element={
                <>
                  <Navigation />
                  <main>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route
                        path="/report"
                        element={
                          <ProtectedRoute>
                            <ReportWaste />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/map"
                        element={
                          <ProtectedRoute>
                            <Map />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/feed"
                        element={
                          <ProtectedRoute>
                            <Feed />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/leaderboard"
                        element={
                          <ProtectedRoute>
                            <Leaderboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/rewards"
                        element={
                          <ProtectedRoute>
                            <Rewards />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
