import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Inventory from "@/pages/inventory";
import VehicleDetail from "@/pages/vehicle-detail";
import Financing from "@/pages/financing";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import PrivacyPolicy from "@/pages/privacy";
import TermsOfService from "@/pages/terms";
import AdminDashboard from "@/pages/admin";
import Application from "@/pages/application";
import WebhookReceiver from "@/pages/webhook-receiver";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/financing" component={Financing} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/application" component={Application} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/webhook-receiver" component={WebhookReceiver} />
      <Route path="/vehicle/:slug" component={VehicleDetail} />
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
