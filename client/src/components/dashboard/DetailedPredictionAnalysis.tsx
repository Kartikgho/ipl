import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brain } from "lucide-react";

interface Prediction {
  id: number;
  matchId: number;
  predictedWinnerId: number;
  winProbability: number;
  team1PredictedScore: number;
  team1PredictedWickets: number;
  team2PredictedScore: number;
  team2PredictedWickets: number;
  reasoning: string;
  confidence: number;
  detailedStats: any;
}

interface DetailedPredictionAnalysisProps {
  prediction: Prediction;
}

const DetailedPredictionAnalysis: React.FC<DetailedPredictionAnalysisProps> = ({
  prediction
}) => {
  // Sample player data for the demo, in a real app this would come from an API
  const players = [
    {
      id: 1,
      name: "MS Dhoni",
      team: "CSK",
      role: "Top Performer",
      prediction: "42(23), SR: 182.6",
      image: "https://static.iplt20.com/players/210/1.png",
    },
    {
      id: 2,
      name: "Rohit Sharma",
      team: "MI",
      role: "Captain",
      prediction: "38(31), SR: 122.6",
      image: "https://static.iplt20.com/players/210/107.png",
    },
    {
      id: 3,
      name: "Jasprit Bumrah",
      team: "MI",
      role: "Key Bowler",
      prediction: "3-28 (4), Econ: 7.0",
      image: "https://static.iplt20.com/players/210/1124.png",
    },
    {
      id: 4,
      name: "Ravindra Jadeja",
      team: "CSK",
      role: "All-rounder",
      prediction: "26(18), 2-24 (4)",
      image: "https://static.iplt20.com/players/210/9.png",
    },
  ];

  // Parse reasoning from string to paragraphs
  const reasoningParagraphs = prediction.reasoning.split('\n\n');

  // Function to get role badge color
  const getBadgeColor = (role: string) => {
    switch (role) {
      case "Top Performer":
        return "bg-secondary-100 text-secondary-800";
      case "Captain":
        return "bg-blue-100 text-blue-800";
      case "Key Bowler":
        return "bg-purple-100 text-purple-800";
      case "All-rounder":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
      <CardHeader className="px-5 py-4 border-b border-neutral-200">
        <CardTitle className="font-heading font-semibold text-lg">Detailed Prediction Analysis</CardTitle>
        <p className="text-neutral-500 text-sm mt-1">CSK vs MI - {new Date().toLocaleDateString()}</p>
      </CardHeader>
      
      <CardContent className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Predicted Score Card */}
          <div className="border border-neutral-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-neutral-600 mb-3">Predicted Scores</h4>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-neutral-50 rounded p-3 text-center">
                <p className="text-xs text-neutral-500 mb-1">CSK</p>
                <p className="text-xl font-bold text-neutral-800">
                  {prediction.team1PredictedScore}/{prediction.team1PredictedWickets}
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  RR: {(prediction.team1PredictedScore / 20).toFixed(2)}
                </p>
              </div>
              <div className="bg-neutral-50 rounded p-3 text-center">
                <p className="text-xs text-neutral-500 mb-1">MI</p>
                <p className="text-xl font-bold text-neutral-800">
                  {prediction.team2PredictedScore}/{prediction.team2PredictedWickets}
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  RR: {(prediction.team2PredictedScore / 20).toFixed(2)}
                </p>
              </div>
            </div>
            
            {prediction.detailedStats && (
              <div className="border-t border-neutral-200 pt-3">
                <h5 className="text-xs font-medium text-neutral-600 mb-2">Innings Breakdown</h5>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Powerplay (1-6)</span>
                      <span className="font-medium">
                        CSK: {prediction.detailedStats.powerplay.team1Score}-{prediction.detailedStats.powerplay.team1Wickets} | 
                        MI: {prediction.detailedStats.powerplay.team2Score}-{prediction.detailedStats.powerplay.team2Wickets}
                      </span>
                    </div>
                    <div className="relative h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-secondary-500 rounded-full"
                        style={{
                          width: `${Math.round((prediction.detailedStats.powerplay.team1Score / 
                            (prediction.detailedStats.powerplay.team1Score + prediction.detailedStats.powerplay.team2Score)) * 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Middle (7-15)</span>
                      <span className="font-medium">
                        CSK: {prediction.detailedStats.middle.team1Score}-{prediction.detailedStats.middle.team1Wickets} | 
                        MI: {prediction.detailedStats.middle.team2Score}-{prediction.detailedStats.middle.team2Wickets}
                      </span>
                    </div>
                    <div className="relative h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-secondary-500 rounded-full"
                        style={{
                          width: `${Math.round((prediction.detailedStats.middle.team1Score / 
                            (prediction.detailedStats.middle.team1Score + prediction.detailedStats.middle.team2Score)) * 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Death (16-20)</span>
                      <span className="font-medium">
                        CSK: {prediction.detailedStats.death.team1Score}-{prediction.detailedStats.death.team1Wickets} | 
                        MI: {prediction.detailedStats.death.team2Score}-{prediction.detailedStats.death.team2Wickets}
                      </span>
                    </div>
                    <div className="relative h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-secondary-500 rounded-full"
                        style={{
                          width: `${Math.round((prediction.detailedStats.death.team1Score / 
                            (prediction.detailedStats.death.team1Score + prediction.detailedStats.death.team2Score)) * 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Key Players Card */}
          <div className="border border-neutral-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-neutral-600 mb-3">Key Player Predictions</h4>
            
            <div className="space-y-3">
              {players.map((player) => (
                <div key={player.id} className="flex items-center p-2 bg-neutral-50 rounded">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-neutral-200 mr-3">
                    <Avatar>
                      <AvatarImage src={player.image} alt={player.name} />
                      <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">{player.name} ({player.team})</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeColor(player.role)}`}>
                        {player.role}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600">Predicted: {player.prediction}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* AI Analysis Card */}
        <div className="mt-6 border border-neutral-200 rounded-lg p-4">
          <div className="flex items-start mb-4">
            <div className="bg-primary-100 p-2 rounded-full mr-3">
              <Brain className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-800">AI Reasoning (Powered by LLM)</h4>
              <p className="text-xs text-neutral-500">Analysis based on historical data and current form</p>
            </div>
          </div>
          
          <div className="bg-neutral-50 rounded-lg p-4 text-sm">
            {reasoningParagraphs.map((paragraph, index) => {
              // First paragraph is the summary
              if (index === 0) {
                return <p key={index} className="mb-3">{paragraph}</p>;
              }
              // Check if it's a list item (starts with number and period)
              else if (/^\d+\./.test(paragraph)) {
                const [title, ...rest] = paragraph.split(':');
                const content = rest.join(':').trim();
                return (
                  <div key={index} className="mb-2">
                    <span className="font-medium">{title}:</span>
                    <span className="text-neutral-700"> {content}</span>
                  </div>
                );
              }
              // Regular paragraph
              else {
                return <p key={index} className={index === reasoningParagraphs.length - 1 ? "mt-4 text-neutral-500 text-xs italic" : "mb-3"}>{paragraph}</p>;
              }
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedPredictionAnalysis;
