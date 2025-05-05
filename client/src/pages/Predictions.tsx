import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, Filter, Calendar, RefreshCw, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePredictions } from "@/hooks/usePredictions";

const Predictions: React.FC = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { isLoading, upcomingMatches, predictions, generatePrediction } = usePredictions();

  const handleGeneratePrediction = (matchId: number) => {
    generatePrediction(matchId);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-neutral-800">Match Predictions</h1>
          <p className="text-neutral-600 mt-1">View and generate predictions for upcoming IPL matches</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <div className="bg-white rounded-md shadow-sm border border-neutral-200 flex items-center px-3 py-2">
            <Search className="w-4 h-4 text-neutral-500 mr-2" />
            <Input 
              type="text" 
              placeholder="Search matches" 
              className="border-none focus:outline-none text-sm flex-grow bg-transparent"
            />
          </div>
          
          <Button variant="outline" className="flex items-center text-sm gap-2">
            <Calendar className="w-4 h-4" />
            <span>Date Range</span>
          </Button>
          
          <Button variant="default" className="flex items-center text-sm gap-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Matches</TabsTrigger>
            <TabsTrigger value="completed">Completed Matches</TabsTrigger>
            <TabsTrigger value="analytics">Prediction Analytics</TabsTrigger>
          </TabsList>
          
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Data</span>
          </Button>
        </div>
        
        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="h-4 w-1/2 bg-neutral-200 rounded animate-pulse"></div>
                    <div className="h-3 w-1/3 bg-neutral-200 rounded animate-pulse mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-neutral-200 animate-pulse"></div>
                        <div className="h-3 w-10 bg-neutral-200 rounded animate-pulse mt-2"></div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-4 w-8 bg-neutral-200 rounded animate-pulse"></div>
                        <div className="h-3 w-16 bg-neutral-200 rounded-full animate-pulse mt-2"></div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-neutral-200 animate-pulse"></div>
                        <div className="h-3 w-10 bg-neutral-200 rounded animate-pulse mt-2"></div>
                      </div>
                    </div>
                    <div className="mt-4 h-20 bg-neutral-200 rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              upcomingMatches.map((match) => {
                const prediction = predictions.find(p => p.matchId === match.id);
                const team1 = { name: "CSK", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/800px-Chennai_Super_Kings_Logo.svg.png" };
                const team2 = { name: "MI", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Mumbai_Indians_Logo.svg/800px-Mumbai_Indians_Logo.svg.png" };
                
                return (
                  <Card key={match.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-heading">Match #{match.id}</CardTitle>
                      <CardDescription>
                        {new Date(match.matchDate).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-6 px-4">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-white p-1 mb-2 flex items-center justify-center shadow-sm">
                            <img src={team1.logo} alt="Team 1 Logo" className="w-12 h-12 rounded-full object-cover" />
                          </div>
                          <h4 className="font-medium text-sm">{team1.name}</h4>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="font-bold text-lg mb-1">vs</div>
                          <div className="text-xs px-3 py-1 bg-neutral-200 rounded-full">
                            {match.stadiumId ? "Chennai" : "TBD"}
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-white p-1 mb-2 flex items-center justify-center shadow-sm">
                            <img src={team2.logo} alt="Team 2 Logo" className="w-12 h-12 rounded-full object-cover" />
                          </div>
                          <h4 className="font-medium text-sm">{team2.name}</h4>
                        </div>
                      </div>
                      
                      {prediction ? (
                        <div>
                          <div className="bg-neutral-100 rounded-md p-3 mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <div className="text-sm font-medium">Win Probability</div>
                              <div className="text-xs text-neutral-500">ML Confidence: {Math.round(prediction.confidence * 100)}%</div>
                            </div>
                            <div className="relative h-4 bg-neutral-200 rounded-full overflow-hidden">
                              <div 
                                className="absolute top-0 left-0 h-full bg-secondary-500 rounded-full" 
                                style={{width: `${Math.round(prediction.winProbability * 100)}%`}}
                              ></div>
                              <div 
                                className="absolute top-0 right-0 h-full bg-blue-500 rounded-full" 
                                style={{width: `${Math.round((1 - prediction.winProbability) * 100)}%`}}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-1 text-xs">
                              <div>{team1.name}: {Math.round(prediction.winProbability * 100)}%</div>
                              <div>{team2.name}: {Math.round((1 - prediction.winProbability) * 100)}%</div>
                            </div>
                          </div>
                          
                          <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>View Full Prediction</span>
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleGeneratePrediction(match.id)}
                        >
                          Generate Prediction
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Matches</CardTitle>
              <CardDescription>Review how our predictions performed for past matches</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-neutral-500">
                No completed matches data available yet
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Prediction Analytics</CardTitle>
              <CardDescription>Insights into our prediction model's performance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-neutral-500">
                Analytics dashboard coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Predictions;
