import { InsertPlayerPerformancePrediction, Match, Player } from "@shared/schema";

/**
 * Generates a prediction for a player's performance in a match.
 * This is a simplified implementation since we don't have actual ML models.
 * In a real implementation, this would use trained ML models.
 */
export async function generatePlayerPerformancePrediction(
  match: Match,
  player: Player
): Promise<InsertPlayerPerformancePrediction> {
  // In a real implementation, this would use actual ML models trained on historical data
  // For now, we'll generate reasonable predictions with some randomness
  
  const prediction: Partial<InsertPlayerPerformancePrediction> = {
    matchId: match.id,
    playerId: player.id,
    confidence: 0.7 + (Math.random() * 0.2), // 0.7-0.9
    reasoning: ""
  };
  
  // Batting predictions based on player role
  if (["batsman", "all-rounder", "wicket-keeper"].includes(player.role)) {
    let baseRuns = 0;
    let baseBalls = 0;
    
    // Different base stats based on role
    switch (player.role) {
      case "batsman":
        if (player.isCaptain) {
          baseRuns = 35 + Math.floor(Math.random() * 20); // 35-55 runs for captain batsmen
          baseBalls = Math.floor(baseRuns * (0.7 + Math.random() * 0.3)); // SR between 100-150
        } else {
          baseRuns = 25 + Math.floor(Math.random() * 15); // 25-40 runs for regular batsmen
          baseBalls = Math.floor(baseRuns * (0.7 + Math.random() * 0.3)); // SR between 100-150
        }
        break;
      case "all-rounder":
        baseRuns = 20 + Math.floor(Math.random() * 15); // 20-35 runs for all-rounders
        baseBalls = Math.floor(baseRuns * (0.7 + Math.random() * 0.3)); // SR between 100-150
        break;
      case "wicket-keeper":
        baseRuns = 30 + Math.floor(Math.random() * 15); // 30-45 runs for wicket-keepers
        baseBalls = Math.floor(baseRuns * (0.7 + Math.random() * 0.3)); // SR between 100-150
        break;
    }
    
    // Extra boost for players like MS Dhoni and Rohit Sharma
    if (player.name === "MS Dhoni") {
      baseRuns = 35 + Math.floor(Math.random() * 20); // 35-55 runs
      baseBalls = Math.floor(baseRuns * 0.55); // Higher SR for Dhoni around 180
    } else if (player.name === "Rohit Sharma") {
      baseRuns = 35 + Math.floor(Math.random() * 25); // 35-60 runs
      baseBalls = Math.floor(baseRuns * 0.8); // SR around 125
    }
    
    prediction.predictedRunsScored = baseRuns;
    prediction.predictedBallsFaced = baseBalls;
    prediction.predictedFours = Math.floor(baseRuns / 10);
    prediction.predictedSixes = Math.floor(baseRuns / 20);
  }
  
  // Bowling predictions based on player role
  if (["bowler", "all-rounder"].includes(player.role)) {
    let baseOvers = 0;
    let baseWickets = 0;
    let baseRunsConceded = 0;
    
    // Different base stats based on role
    switch (player.role) {
      case "bowler":
        baseOvers = 4; // Full quota for specialist bowlers
        baseWickets = 1 + Math.floor(Math.random() * 3); // 1-3 wickets
        baseRunsConceded = 25 + Math.floor(Math.random() * 15); // 25-40 runs conceded
        break;
      case "all-rounder":
        baseOvers = 2 + Math.floor(Math.random() * 2); // 2-4 overs for all-rounders
        baseWickets = Math.floor(Math.random() * 2); // 0-2 wickets
        baseRunsConceded = 20 + Math.floor(Math.random() * 15); // 20-35 runs conceded
        break;
    }
    
    // Extra boost for players like Jasprit Bumrah
    if (player.name === "Jasprit Bumrah") {
      baseWickets = 2 + Math.floor(Math.random() * 2); // 2-4 wickets
      baseRunsConceded = 20 + Math.floor(Math.random() * 15); // 20-35 runs conceded
    } else if (player.name === "Ravindra Jadeja") {
      baseWickets = 1 + Math.floor(Math.random() * 2); // 1-3 wickets
      baseRunsConceded = 20 + Math.floor(Math.random() * 10); // 20-30 runs conceded
    }
    
    prediction.predictedOvers = baseOvers;
    prediction.predictedRunsConceded = baseRunsConceded;
    prediction.predictedWickets = baseWickets;
    prediction.predictedMaidens = baseWickets > 2 ? 1 : 0; // Maidens more likely with high wickets
  }
  
  return prediction as InsertPlayerPerformancePrediction;
}
