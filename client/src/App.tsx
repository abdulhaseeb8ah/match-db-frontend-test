import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types";
// Public pages
import Landing from "@/public/landing";
import Home from "@/shared/home";
import Projects from "@/public/projects";
import Solutions from "@/public/solutions";
// Auth pages
import Login from "@/auth/login";
import Register from "@/auth/register";
import Signup from "@/auth/signup";
import VerifyEmail from "@/auth/verify-email";
import VerifyOtp from "@/auth/verify-otp";
// Consultant pages
import Jobs from "@/consultant/jobs";
import Dashboard from "@/consultant/dashboard";
import JoinAsPeer from "@/consultant/join-as-peer";
// Company pages
import Companies from "@/company/companies";
import CompanyDashboard from "@/company/company-dashboard";
import PostJob from "@/company/post-job";
// Admin pages
import AdminApprovals from "@/admin/admin-approvals";
import AdminBadges from "@/admin/admin-badges";
import AdminUsers from "@/admin/admin-users";
import AdminBroadcast from "@/admin/admin-broadcast";
// Shared pages
import ProfileRouter from "@/shared/profile-router";
import ProfileEditRouter from "@/shared/profile-edit-router";
import TestLogin from "@/shared/test-login";
import NotFound from "@/shared/not-found";

function Router() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={isAuthenticated ? Home : Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/signup" component={Signup} />
      <Route path="/join" component={JoinAsPeer} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/verify-otp" component={VerifyOtp} />
      <Route path="/profile" component={ProfileRouter} />
      <Route path="/profile/edit" component={ProfileEditRouter} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/projects" component={Projects} />
      <Route path="/solutions" component={Solutions} />
      <Route path="/companies" component={Companies} />
      <Route path="/dashboard" component={user?.role === UserRole.COMPANY ? CompanyDashboard : Dashboard} />
      <Route path="/company-dashboard" component={CompanyDashboard} />
      <Route path="/post-job" component={PostJob} />
      <Route path="/admin/approvals" component={AdminApprovals} />
      <Route path="/admin/broadcast" component={AdminBroadcast} />
      <Route path="/admin/badges" component={AdminBadges} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/test-login" component={TestLogin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
