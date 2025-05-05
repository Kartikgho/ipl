import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CirclePlus, RefreshCcw } from "lucide-react";

const TeamPerformanceTrends: React.FC = () => {
  // Sample team data
  const teams = [
    { name: "CSK", winAccuracy: 92, color: "bg-secondary-500" },
    { name: "MI", winAccuracy: 87, color: "bg-blue-500" },
    { name: "RCB", winAccuracy: 78, color: "bg-red-500" },
    { name: "KKR", winAccuracy: 85, color: "bg-purple-500" },
    { name: "SRH", winAccuracy: 81, color: "bg-orange-500" }
  ];

  // Sample phase data
  const phases = [
    { name: "Powerplay", accuracy: 86 },
    { name: "Middle Overs", accuracy: 79 },
    { name: "Death Overs", accuracy: 72 },
    { name: "Final Score", accuracy: 76 }
  ];

  // Sample model updates
  const updates = [
    { type: "add", text: "Added player fatigue metrics to performance prediction" },
    { type: "add", text: "Improved pitch condition analytics with historical data" },
    { type: "update", text: "Enhanced LLM reasoning with more detailed match insights" },
    { type: "update", text: "Refined win probability calculations based on recent performances" }
  ];

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
      <CardHeader className="px-5 py-4 border-b border-neutral-200">
        <CardTitle className="font-heading font-semibold">Team Performance Trends</CardTitle>
      </CardHeader>
      
      <CardContent className="p-5">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-neutral-700">Win Prediction Accuracy</h4>
            <div className="text-xs text-neutral-500">Last 10 matches</div>
          </div>
          
          <div className="space-y-3">
            {teams.map((team, index) => (
              <div key={index}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{team.name}</span>
                  <span>{team.winAccuracy}%</span>
                </div>
                <div className="relative h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full ${team.color} rounded-full`} 
                    style={{width: `${team.winAccuracy}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-neutral-700">Score Prediction Accuracy</h4>
            <div className="text-xs text-neutral-500">± 10 runs margin</div>
          </div>
          
          <div className="space-y-3">
            {phases.map((phase, index) => (
              <div key={index}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{phase.name}</span>
                  <span>{phase.accuracy}%</span>
                </div>
                <div className="relative h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-green-500 rounded-full" 
                    style={{width: `${phase.accuracy}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 pt-5 border-t border-neutral-200">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-neutral-700">Latest Model Updates</h4>
            <span className="text-xs text-neutral-500">v3.2.1</span>
          </div>
          
          <div className="mt-3 space-y-2 text-xs">
            {updates.map((update, index) => (
              <div key={index} className="flex items-start">
                {update.type === "add" ? (
                  <CirclePlus className="h-3.5 w-3.5 text-green-500 mr-1.5 flex-shrink-0 mt-0.5" />
                ) : (
                  <RefreshCcw className="h-3.5 w-3.5 text-blue-500 mr-1.5 flex-shrink-0 mt-0.5" />
                )}
                <p>{update.text}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamPerformanceTrends;
