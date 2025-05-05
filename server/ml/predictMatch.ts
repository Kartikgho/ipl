import { InsertPrediction, Match, Team, Stadium } from "@shared/schema";

/**
 * Generates a prediction for a match based on team stats and stadium conditions.
 * This is a simplified implementation since we don't have actual ML models.
 * In a real implementation, this would use trained ML models.
 */
export async function generateMatchPrediction(
  match: Match,
  team1: Team,
  team2: Team,
  stadium: Stadium | null
): Promise<InsertPrediction> {
  // In a real implementation, this would use actual ML models trained on historical data
  // For now, we'll generate reasonable predictions with some randomness
  
  // Win probability calculation (simplified)
  // In reality, this would consider team strength, historical performance, 
  // recent form, head-to-head records, player availability, etc.
  const team1Strength = getTeamStrength(team1);
  const team2Strength = getTeamStrength(team2);
  
  // Consider home advantage
  let homeAdvantage = 0;
  if (stadium && stadium.name === team1.homeVenue) {
    homeAdvantage = 0.1; // 10% advantage for home team
  } else if (stadium && stadium.name === team2.homeVenue) {
    homeAdvantage = -0.1; // 10% advantage for away team
  }
  
  // Calculate raw win probability
  let team1WinProb = (team1Strength / (team1Strength + team2Strength)) + homeAdvantage;
  
  // Ensure probability is between 0 and 1
  team1WinProb = Math.max(0.1, Math.min(0.9, team1WinProb));
  
  // Determine predicted winner
  const predictedWinnerId = team1WinProb > 0.5 ? team1.id : team2.id;
  
  // Generate score prediction
  const winningTeamScore = Math.floor(160 + Math.random() * 40); // Between 160-200
  const losingTeamScore = Math.floor(winningTeamScore - 5 - Math.random() * 20); // 5-25 runs less
  
  // Generate wicket prediction
  const winningTeamWickets = Math.floor(2 + Math.random() * 5); // Between 2-6
  const losingTeamWickets = Math.floor(4 + Math.random() * 6); // Between 4-9
  
  // Set confidence level
  const confidenceDeviation = Math.random() * 0.2 - 0.1; // ±10%
  const confidence = Math.max(0.5, Math.min(0.9, Math.abs(team1WinProb - 0.5) * 2 + 0.5 + confidenceDeviation));
  
  // Create detailed stats for powerplay, middle, and death overs
  const detailedStats = {
    powerplay: {
      team1Score: Math.floor(winningTeamScore * 0.3),
      team1Wickets: Math.floor(winningTeamWickets * 0.2),
      team2Score: Math.floor(losingTeamScore * 0.3),
      team2Wickets: Math.floor(losingTeamWickets * 0.3)
    },
    middle: {
      team1Score: Math.floor(winningTeamScore * 0.45),
      team1Wickets: Math.floor(winningTeamWickets * 0.5),
      team2Score: Math.floor(losingTeamScore * 0.45),
      team2Wickets: Math.floor(losingTeamWickets * 0.4)
    },
    death: {
      team1Score: Math.floor(winningTeamScore * 0.25),
      team1Wickets: Math.floor(winningTeamWickets * 0.3),
      team2Score: Math.floor(losingTeamScore * 0.25),
      team2Wickets: Math.floor(losingTeamWickets * 0.3)
    }
  };
  
  // Create prediction object
  const prediction: InsertPrediction = {
    matchId: match.id,
    predictedWinnerId,
    winProbability: predictedWinnerId === team1.id ? team1WinProb : 1 - team1WinProb,
    team1PredictedScore: team1.id === predictedWinnerId ? winningTeamScore : losingTeamScore,
    team1PredictedWickets: team1.id === predictedWinnerId ? winningTeamWickets : losingTeamWickets,
    team2PredictedScore: team2.id === predictedWinnerId ? winningTeamScore : losingTeamScore,
    team2PredictedWickets: team2.id === predictedWinnerId ? winningTeamWickets : losingTeamWickets,
    reasoning: "", // Will be filled by the LLM
    confidence,
    detailedStats
  };
  
  return prediction;
}

/**
 * Helper function to calculate team strength (simplified)
 */
function getTeamStrength(team: Team): number {
  // In a real implementation, this would be based on player ratings, 
  // recent performance, etc.
  const baseStrength = 50 + Math.random() * 30;
  
  // Add some bias based on historically strong teams
  const strongTeams = ["Mumbai Indians", "Chennai Super Kings", "Kolkata Knight Riders"];
  const moderateTeams = ["Royal Challengers Bangalore", "Delhi Capitals", "Sunrisers Hyderabad"];
  
  if (strongTeams.includes(team.name)) {
    return baseStrength + 10;
  } else if (moderateTeams.includes(team.name)) {
    return baseStrength + 5;
  }
  
  return baseStrength;
}
