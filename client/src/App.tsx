import { Switch, Route } from "wouter";
import Dashboard from "@/pages/Dashboard";
import Predictions from "@/pages/Predictions";
import Teams from "@/pages/Teams";
import Players from "@/pages/Players";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/predictions" component={Predictions} />
          <Route path="/teams" component={Teams} />
          <Route path="/players" component={Players} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return <Router />;
}

export default App;
