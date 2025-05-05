import HeroSection from "@/components/dashboard/HeroSection";
import StatCard from "@/components/dashboard/StatCard";
import UpcomingMatchesTable from "@/components/dashboard/UpcomingMatchesTable";
import DetailedPredictionAnalysis from "@/components/dashboard/DetailedPredictionAnalysis";
import PredictionChatbot from "@/components/dashboard/PredictionChatbot";
import TeamPerformanceTrends from "@/components/dashboard/TeamPerformanceTrends";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePredictions } from "@/hooks/usePredictions";

const Dashboard: React.FC = () => {
  const { isLoading, upcomingMatches, predictions } = usePredictions();

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Dashboard */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-heading font-bold text-neutral-800">Prediction Dashboard</h2>
            <p className="text-neutral-600">Explore match predictions and player performance analytics</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="bg-white rounded-md shadow-sm border border-neutral-200 flex items-center px-3 py-2 w-full md:w-auto">
              <Search className="w-4 h-4 text-neutral-500 mr-2" />
              <Input 
                type="text" 
                placeholder="Search teams or players" 
                className="border-none focus:outline-none text-sm flex-grow bg-transparent" 
              />
            </div>
            <Button variant="default" className="flex items-center text-sm">
              <Filter className="w-4 h-4 mr-1" />
              Filters
            </Button>
          </div>
        </div>

        {/* Stats Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Prediction Accuracy"
            value="87.4%"
            trend="+3.2%"
            trendDirection="up"
            icon="chart_line"
            iconBgColor="bg-primary-100"
            iconColor="text-primary-500"
          />
          
          <StatCard 
            title="Matches Analyzed"
            value="1,287"
            trend="+14"
            trendText="new matches"
            trendDirection="up"
            icon="sports_cricket"
            iconBgColor="bg-secondary-100"
            iconColor="text-secondary-500"
          />
          
          <StatCard 
            title="Player Data Points"
            value="45.3K"
            trend="+1.8K"
            trendDirection="up"
            trendText="since yesterday"
            icon="person"
            iconBgColor="bg-blue-100"
            iconColor="text-blue-500"
          />
          
          <StatCard 
            title="ML Model Version"
            value="v3.2.1"
            trend="2 days ago"
            trendDirection="info"
            trendText="Updated"
            icon="psychology"
            iconBgColor="bg-purple-100"
            iconColor="text-purple-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Match Predictions */}
          <div className="lg:col-span-2">
            <UpcomingMatchesTable 
              isLoading={isLoading}
              matches={upcomingMatches} 
            />
            
            {predictions && predictions.length > 0 && (
              <DetailedPredictionAnalysis prediction={predictions[0]} />
            )}
          </div>
          
          {/* Right Column - Sidebar Content */}
          <div className="lg:col-span-1">
            <PredictionChatbot />
            <TeamPerformanceTrends />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
