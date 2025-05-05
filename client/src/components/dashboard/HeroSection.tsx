import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, MessageCircle } from "lucide-react";
import { usePredictions } from "@/hooks/usePredictions";

const HeroSection: React.FC = () => {
  const { predictions, upcomingMatches, isLoading } = usePredictions();
  const [showChat, setShowChat] = useState(false);
  
  // Get the first prediction to display in hero section
  const mainPrediction = predictions && predictions.length > 0 ? predictions[0] : null;
  const mainMatch = mainPrediction ? upcomingMatches.find(match => match.id === mainPrediction.matchId) : null;
  
  return (
    <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              IPL Cricket Prediction System
            </h1>
            <p className="text-primary-100 mb-6 max-w-lg">
              Advanced machine learning and AI-powered predictions for match outcomes, scores, and player performance metrics with detailed reasoning.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="secondary" 
                className="flex items-center gap-2"
                onClick={() => window.location.href = '/predictions'}
              >
                <Trophy className="h-4 w-4" />
                Get Predictions
              </Button>
              <Button 
                variant="outline" 
                className="bg-white hover:bg-neutral-100 text-primary-600"
                onClick={() => setShowChat(true)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask Analysis Bot
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-white/20">
              {isLoading ? (
                // Loading state
                <div className="animate-pulse">
                  <div className="text-center mb-3">
                    <div className="h-6 bg-white/30 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-white/20 rounded w-1/2 mx-auto"></div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6 px-4">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 mb-2"></div>
                      <div className="h-4 bg-white/20 rounded w-10"></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-6 bg-white/30 rounded w-8 mb-1"></div>
                      <div className="h-4 bg-white/20 rounded w-16"></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 mb-2"></div>
                      <div className="h-4 bg-white/20 rounded w-10"></div>
                    </div>
                  </div>
                  
                  <div className="bg-white/20 rounded-md p-3 mb-4">
                    <div className="h-4 bg-white/30 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-white/20 rounded"></div>
                    <div className="flex justify-between mt-1">
                      <div className="h-3 bg-white/20 rounded w-16"></div>
                      <div className="h-3 bg-white/20 rounded w-16"></div>
                    </div>
                  </div>
                  
                  <div className="bg-white/20 rounded-md p-3">
                    <div className="h-4 bg-white/30 rounded w-1/2 mb-2"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/30 p-2 rounded">
                        <div className="h-3 bg-white/30 rounded w-8 mx-auto mb-1"></div>
                        <div className="h-5 bg-white/30 rounded w-16 mx-auto"></div>
                      </div>
                      <div className="bg-white/30 p-2 rounded">
                        <div className="h-3 bg-white/30 rounded w-8 mx-auto mb-1"></div>
                        <div className="h-5 bg-white/30 rounded w-16 mx-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : mainPrediction && mainMatch ? (
                // Prediction card
                <>
                  <div className="text-center mb-3">
                    <h3 className="font-heading font-semibold text-xl">Next Match Prediction</h3>
                    <div className="text-sm text-primary-200">
                      {new Date(mainMatch.matchDate).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6 px-4">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-white p-1 mb-2 flex items-center justify-center">
                        <img 
                          src={upcomingMatches[0]?.team1Logo || "https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/800px-Chennai_Super_Kings_Logo.svg.png"} 
                          alt="Team 1" 
                          className="w-12 h-12 rounded-full object-cover" 
                        />
                      </div>
                      <h4 className="font-medium text-sm">
                        {upcomingMatches[0]?.team1ShortName || "CSK"}
                      </h4>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="font-bold text-lg mb-1">vs</div>
                      <div className="text-xs px-3 py-1 bg-secondary-500 rounded-full">Prediction</div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-white p-1 mb-2 flex items-center justify-center">
                        <img 
                          src={upcomingMatches[0]?.team2Logo || "https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Mumbai_Indians_Logo.svg/800px-Mumbai_Indians_Logo.svg.png"}
                          alt="Team 2" 
                          className="w-12 h-12 rounded-full object-cover" 
                        />
                      </div>
                      <h4 className="font-medium text-sm">
                        {upcomingMatches[0]?.team2ShortName || "MI"}
                      </h4>
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm rounded-md p-3 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm">Win Probability</div>
                      <div className="text-xs text-primary-200">
                        ML Confidence: {Math.round(mainPrediction.confidence * 100)}%
                      </div>
                    </div>
                    <div className="relative h-4 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-secondary-500 rounded-full" 
                        style={{width: `${Math.round(mainPrediction.winProbability * 100)}%`}}
                      ></div>
                      <div 
                        className="absolute top-0 right-0 h-full bg-blue-500 rounded-full" 
                        style={{width: `${Math.round((1 - mainPrediction.winProbability) * 100)}%`}}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs">
                      <div>{upcomingMatches[0]?.team1ShortName || "Team 1"}: {Math.round(mainPrediction.winProbability * 100)}%</div>
                      <div>{upcomingMatches[0]?.team2ShortName || "Team 2"}: {Math.round((1 - mainPrediction.winProbability) * 100)}%</div>
                    </div>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-md p-3">
                    <div className="text-sm mb-2">Predicted Scores</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/30 p-2 rounded text-center">
                        <div className="text-xs mb-1">{upcomingMatches[0]?.team1ShortName || "Team 1"}</div>
                        <div className="font-bold">{mainPrediction.team1PredictedScore}/{mainPrediction.team1PredictedWickets}</div>
                      </div>
                      <div className="bg-white/30 p-2 rounded text-center">
                        <div className="text-xs mb-1">{upcomingMatches[0]?.team2ShortName || "Team 2"}</div>
                        <div className="font-bold">{mainPrediction.team2PredictedScore}/{mainPrediction.team2PredictedWickets}</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // No prediction available
                <div className="text-center py-6">
                  <h3 className="font-heading font-semibold text-xl mb-2">Match Predictions</h3>
                  <p className="text-primary-200 mb-4">No predictions available for upcoming matches yet.</p>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => window.location.href = '/predictions'}
                  >
                    Generate Predictions
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
