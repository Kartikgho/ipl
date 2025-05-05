import { Switch, Route } from "wouter";
import Dashboard from "@/pages/Dashboard";
import Predictions from "@/pages/Predictions";
import Teams from "@/pages/Teams";
import Players from "@/pages/Players";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProtectedRoute } from "@/lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        <Switch>
          <ProtectedRoute path="/" component={Dashboard} />
          <ProtectedRoute path="/predictions" component={Predictions} />
          <ProtectedRoute path="/teams" component={Teams} />
          <ProtectedRoute path="/players" component={Players} />
          <Route path="/auth" component={AuthPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
