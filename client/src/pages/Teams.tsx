import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, TrendingUp, Users, Calendar, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Teams: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");

  const { data: teams, isLoading } = useQuery({
    queryKey: ['/api/teams'],
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-neutral-800">IPL Teams</h1>
          <p className="text-neutral-600 mt-1">View team information and performance history</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <div className="bg-white rounded-md shadow-sm border border-neutral-200 flex items-center px-3 py-2 w-full md:w-auto">
            <Search className="w-4 h-4 text-neutral-500 mr-2" />
            <Input 
              type="text" 
              placeholder="Search teams" 
              className="border-none focus:outline-none text-sm flex-grow bg-transparent"
            />
          </div>
          <Button variant="default" className="flex items-center text-sm gap-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Teams</TabsTrigger>
          <TabsTrigger value="standings">Standings</TabsTrigger>
          <TabsTrigger value="stats">Team Stats</TabsTrigger>
          <TabsTrigger value="history">Match History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array(8).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-32 bg-neutral-200 animate-pulse"></div>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              teams?.map((team: any) => (
                <Card key={team.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-800 flex items-center justify-center">
                    <img 
                      src={team.logoUrl} 
                      alt={`${team.name} logo`}
                      className="h-24 w-24 object-contain"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{team.name}</CardTitle>
                    <CardDescription>Established: 2008</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-neutral-600">
                        <MapPin className="h-4 w-4" />
                        <span>{team.homeVenue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600">
                        <TrendingUp className="h-4 w-4" />
                        <span>Win Rate: 58%</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Calendar className="h-4 w-4" />
                        <span>IPL Titles: {team.shortName === "CSK" || team.shortName === "MI" ? "5" : "0-2"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Users className="h-4 w-4" />
                        <span>Players: 25</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-between">
                      <Button variant="ghost" size="sm">Players</Button>
                      <Button variant="ghost" size="sm">Stats</Button>
                      <Button variant="ghost" size="sm">Matches</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="standings">
          <Card>
            <CardHeader>
              <CardTitle>Team Standings</CardTitle>
              <CardDescription>Current IPL season standings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-neutral-500">
                Standings data will be available once the season starts
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Team Statistics</CardTitle>
              <CardDescription>Detailed performance metrics for each team</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-neutral-500">
                Team statistics dashboard coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Match History</CardTitle>
              <CardDescription>Past match results and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-neutral-500">
                Match history data is being collected
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Teams;
