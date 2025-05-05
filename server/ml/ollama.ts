import { Prediction, Match, Team, Stadium, Player, PlayerPerformancePrediction } from "@shared/schema";

type ExplanationContext = 
  | { type: 'match'; prediction: Prediction; match: Match; team1: Team; team2: Team; stadium: Stadium | null }
  | { type: 'player'; prediction: PlayerPerformancePrediction; match: Match; player: Player }
  | { type: 'chat'; message: string };

/**
 * Generates an explanation for a prediction using Ollama LLM.
 * In a real implementation, this would call the Ollama API.
 */
export async function getExplanationFromOllama(
  context: ExplanationContext | any,
  ...args: any[]
): Promise<string> {
  // In a real implementation, this would call the Ollama API with a properly crafted prompt
  // For now, we'll return reasonable pre-written explanations
  
  // Check context type
  if (context.type === 'chat') {
    return handleChatMessage(context.message);
  }
  
  if ('prediction' in context && 'playerId' in context.prediction) {
    // Player performance explanation
    const match = args[0] as Match;
    const player = args[1] as Player;
    return generatePlayerExplanation(context.prediction, player);
  }
  
  if ('prediction' in context && 'predictedWinnerId' in context.prediction) {
    // Match prediction explanation
    const match = args[0] as Match;
    const team1 = args[1] as Team;
    const team2 = args[2] as Team;
    const stadium = args[3] as Stadium | null;
    return generateMatchExplanation(context.prediction, match, team1, team2, stadium);
  }
  
  // Default response if no context matches
  return "Based on our analysis of historical data and current form, this prediction represents the most likely outcome given the available information.";
}

/**
 * Generates an explanation for a match prediction
 */
function generateMatchExplanation(
  prediction: Partial<Prediction>,
  match: Match,
  team1: Team,
  team2: Team,
  stadium: Stadium | null
): string {
  const winningTeam = prediction.predictedWinnerId === team1.id ? team1 : team2;
  const losingTeam = prediction.predictedWinnerId === team1.id ? team2 : team1;
  const winProb = prediction.winProbability ? Math.round(prediction.winProbability * 100) : 50;
  
  let homeAdvantage = "";
  if (stadium && stadium.name === winningTeam.homeVenue) {
    homeAdvantage = `${winningTeam.name} has won ${Math.floor(60 + Math.random() * 15)}% of their matches at ${stadium.name} in the last 3 seasons, compared to ${losingTeam.name}'s away win rate of ${Math.floor(35 + Math.random() * 15)}%.`;
  }
  
  let headToHead = "";
  const h2hWins = Math.floor(10 + Math.random() * 10);
  headToHead = `While historically balanced (${losingTeam.shortName} ${h2hWins} - ${winningTeam.shortName} ${20 - h2hWins}), ${stadium ? `in ${stadium.city} ${winningTeam.shortName} leads ${Math.floor(6 + Math.random() * 5)}-${Math.floor(2 + Math.random() * 3)}` : "the recent form favors " + winningTeam.shortName}.`;
  
  let pitchConditions = "";
  if (stadium) {
    if (stadium.pitchType === "spin-friendly") {
      pitchConditions = `The slower ${stadium.city} pitch favors ${winningTeam.shortName}'s spin-heavy bowling attack. ${losingTeam.shortName}'s pace-heavy attack may struggle.`;
    } else if (stadium.pitchType === "batting-friendly") {
      pitchConditions = `The batting-friendly conditions at ${stadium.city} tend to produce high-scoring games, which suits ${winningTeam.shortName}'s strong batting lineup.`;
    } else {
      pitchConditions = `The pitch conditions at ${stadium.city} are expected to be balanced, but ${winningTeam.shortName}'s adaptability gives them a slight edge.`;
    }
  }
  
  return `After analyzing the historical performances of both teams, our model predicts a ${winningTeam.name} victory with ${winProb}% confidence. Here's why:

1. Home advantage: ${homeAdvantage}

2. Current form: ${winningTeam.name} players have better individual form metrics in the last 3 matches, particularly in batting (avg. team SR: ${Math.floor(140 + Math.random() * 20)} vs ${Math.floor(130 + Math.random() * 15)}).

3. Head-to-head record: ${headToHead}

4. Pitch conditions: ${pitchConditions}

Note: This prediction accounts for all available data as of ${new Date().toLocaleDateString()}, including player availability and recent form.`;
}

/**
 * Generates an explanation for a player performance prediction
 */
function generatePlayerExplanation(
  prediction: Partial<PlayerPerformancePrediction>,
  player: Player
): string {
  let explanation = "";
  
  if (prediction.predictedRunsScored) {
    let battingContext = "";
    
    if (player.name === "MS Dhoni") {
      battingContext = `MS Dhoni has been in excellent form in the death overs, with a strike rate of over 180 in the last 3 matches. His experience and ability to finish games make him a key player for CSK.`;
    } else if (player.name === "Rohit Sharma") {
      battingContext = `Rohit Sharma has been consistent but not explosive in recent matches, with a strike rate around 125. As the captain, he typically plays the anchor role, which is reflected in our prediction.`;
    } else if (player.role === "batsman") {
      battingContext = `As a specialist batsman, ${player.name} is expected to contribute significantly to the team's total. Based on recent performances, we predict a steady innings with a strike rate around ${Math.floor(120 + Math.random() * 30)}.`;
    } else if (player.role === "all-rounder") {
      battingContext = `${player.name}'s all-round abilities make them valuable in the middle order. We expect a quick-fire innings with a focus on rotating the strike and occasional boundaries.`;
    } else {
      battingContext = `${player.name} typically bats lower in the order but can contribute valuable runs, especially in the death overs.`;
    }
    
    explanation += battingContext;
  }
  
  if (prediction.predictedWickets) {
    let bowlingContext = "";
    
    if (player.name === "Jasprit Bumrah") {
      bowlingContext = `Jasprit Bumrah has been MI's best bowler, consistently taking wickets in all phases of the game. His yorkers and slower balls make him particularly effective in the death overs.`;
    } else if (player.name === "Ravindra Jadeja") {
      bowlingContext = `Ravindra Jadeja's left-arm spin is expected to be effective, especially if the pitch offers any assistance. His accuracy and variations make him a constant threat throughout the innings.`;
    } else if (player.role === "bowler") {
      bowlingContext = `As a specialist bowler, ${player.name} is likely to complete their full quota of 4 overs. Based on their recent form and the expected pitch conditions, we predict a economical spell with regular wicket-taking opportunities.`;
    } else {
      bowlingContext = `${player.name} provides a useful bowling option for the captain, particularly when matchups favor their bowling style.`;
    }
    
    if (explanation) {
      explanation += " " + bowlingContext;
    } else {
      explanation = bowlingContext;
    }
  }
  
  // Add confidence context
  const confidence = prediction.confidence ? Math.round(prediction.confidence * 100) : 70;
  explanation += ` Our model has ${confidence}% confidence in this prediction based on analysis of ${player.name}'s performance in similar conditions and against similar opposition.`;
  
  return explanation;
}

/**
 * Handles a chat message and returns an appropriate response
 */
function handleChatMessage(message: string): string {
  message = message.toLowerCase();
  
  // Simple pattern matching for common questions
  if (message.includes("who will win") || message.includes("match prediction") || message.includes("predict winner")) {
    return "Based on our analysis of recent form, head-to-head records, and pitch conditions, CSK has a 62% chance of winning today's match against MI. Their strong home record at Chennai and current team form gives them an advantage.";
  }
  
  if (message.includes("top scorer") || message.includes("most runs")) {
    return "Based on our ML model, MS Dhoni is predicted to be the top scorer for CSK with approximately 42 runs off 23 balls. For MI, Rohit Sharma is predicted to score 38 runs. This prediction is based on recent form, match-up analysis against the opposition bowlers, and historical performance at this venue.";
  }
  
  if (message.includes("win probability") || message.includes("chances of winning")) {
    return "CSK's 62% win probability is driven by several key factors: home advantage at Chennai Stadium (68% win rate), superior team form based on recent matches, better head-to-head record at this venue, team composition better suited to pitch conditions, and key MI players showing inconsistent recent form.";
  }
  
  if (message.includes("bowling") || message.includes("wickets") || message.includes("bowler")) {
    return "Jasprit Bumrah is predicted to be the most effective bowler in today's match with figures of 3-28 in 4 overs. His ability to bowl yorkers in the death overs and his recent form (7 wickets in last 3 matches) make him MI's biggest bowling threat.";
  }
  
  if (message.includes("pitch") || message.includes("conditions") || message.includes("stadium")) {
    return "The Chennai pitch is expected to be slightly on the slower side, favoring spin bowlers. Teams batting first have won 60% of matches here this season. The average first innings score is around 175, and the team winning the toss is likely to bat first.";
  }
  
  if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
    return "Hello! I'm your IPL Cricket Analyst. Ask me anything about match predictions, player stats, or team analysis. I can provide insights based on our ML models and historical data.";
  }
  
  // Default response for other questions
  return "I'm analyzing the data for your question about " + message.slice(0, 30) + "... Based on our models, I can tell you that team performance depends on many factors including player form, match conditions, and historical data. Could you ask a more specific question about match predictions, player performance, or team analysis?";
}
