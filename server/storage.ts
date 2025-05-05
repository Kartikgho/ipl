import { 
  User, InsertUser, users,
  Team, InsertTeam, teams,
  Player, InsertPlayer, players,
  Stadium, InsertStadium, stadiums,
  Match, InsertMatch, matches,
  Prediction, InsertPrediction, predictions,
  PlayerPerformance, InsertPlayerPerformance, playerPerformances,
  PlayerPerformancePrediction, InsertPlayerPerformancePrediction, playerPerformancePredictions,
  ChatMessage, InsertChatMessage, chatMessages,
} from "@shared/schema";

// Storage interface
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Team operations
  getAllTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  getTeamByName(name: string): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  
  // Player operations
  getAllPlayers(): Promise<Player[]>;
  getPlayer(id: number): Promise<Player | undefined>;
  getPlayersByTeam(teamId: number): Promise<Player[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  
  // Stadium operations
  getAllStadiums(): Promise<Stadium[]>;
  getStadium(id: number): Promise<Stadium | undefined>;
  createStadium(stadium: InsertStadium): Promise<Stadium>;
  
  // Match operations
  getAllMatches(): Promise<Match[]>;
  getMatch(id: number): Promise<Match | undefined>;
  getUpcomingMatches(limit?: number): Promise<Match[]>;
  getCompletedMatches(limit?: number): Promise<Match[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: number, match: Partial<Match>): Promise<Match | undefined>;
  
  // Prediction operations
  getAllPredictions(): Promise<Prediction[]>;
  getPrediction(id: number): Promise<Prediction | undefined>;
  getPredictionByMatchId(matchId: number): Promise<Prediction | undefined>;
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  updatePrediction(id: number, prediction: Partial<Prediction>): Promise<Prediction | undefined>;
  
  // Player Performance operations
  getPlayerPerformance(id: number): Promise<PlayerPerformance | undefined>;
  getPlayerPerformancesByMatch(matchId: number): Promise<PlayerPerformance[]>;
  getPlayerPerformancesByPlayer(playerId: number): Promise<PlayerPerformance[]>;
  createPlayerPerformance(performance: InsertPlayerPerformance): Promise<PlayerPerformance>;
  
  // Player Performance Prediction operations
  getPlayerPerformancePrediction(id: number): Promise<PlayerPerformancePrediction | undefined>;
  getPlayerPerformancePredictionsByMatch(matchId: number): Promise<PlayerPerformancePrediction[]>;
  getPlayerPerformancePredictionsByPlayer(playerId: number): Promise<PlayerPerformancePrediction[]>;
  createPlayerPerformancePrediction(prediction: InsertPlayerPerformancePrediction): Promise<PlayerPerformancePrediction>;
  
  // Chat message operations
  getChatMessagesByUser(userId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private teams: Map<number, Team>;
  private players: Map<number, Player>;
  private stadiums: Map<number, Stadium>;
  private matches: Map<number, Match>;
  private predictions: Map<number, Prediction>;
  private playerPerformances: Map<number, PlayerPerformance>;
  private playerPerformancePredictions: Map<number, PlayerPerformancePrediction>;
  private chatMessages: Map<number, ChatMessage>;
  
  private currentUserId: number;
  private currentTeamId: number;
  private currentPlayerId: number;
  private currentStadiumId: number;
  private currentMatchId: number;
  private currentPredictionId: number;
  private currentPlayerPerformanceId: number;
  private currentPlayerPerformancePredictionId: number;
  private currentChatMessageId: number;

  // Session store for authentication
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.teams = new Map();
    this.players = new Map();
    this.stadiums = new Map();
    this.matches = new Map();
    this.predictions = new Map();
    this.playerPerformances = new Map();
    this.playerPerformancePredictions = new Map();
    this.chatMessages = new Map();
    
    this.currentUserId = 1;
    this.currentTeamId = 1;
    this.currentPlayerId = 1;
    this.currentStadiumId = 1;
    this.currentMatchId = 1;
    this.currentPredictionId = 1;
    this.currentPlayerPerformanceId = 1;
    this.currentPlayerPerformancePredictionId = 1;
    this.currentChatMessageId = 1;
    
    // Set up session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with some sample data
    this.initSampleData();
  }

  private initSampleData() {
    // Sample teams
    const team1: Team = {
      id: this.currentTeamId++,
      name: "Chennai Super Kings",
      shortName: "CSK",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/800px-Chennai_Super_Kings_Logo.svg.png",
      homeVenue: "M. A. Chidambaram Stadium",
      createdAt: new Date(),
    };
    
    const team2: Team = {
      id: this.currentTeamId++,
      name: "Mumbai Indians",
      shortName: "MI",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Mumbai_Indians_Logo.svg/800px-Mumbai_Indians_Logo.svg.png",
      homeVenue: "Wankhede Stadium",
      createdAt: new Date(),
    };
    
    const team3: Team = {
      id: this.currentTeamId++,
      name: "Royal Challengers Bangalore",
      shortName: "RCB",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/Royal_Challengers_Bangalore_2020.svg/800px-Royal_Challengers_Bangalore_2020.svg.png",
      homeVenue: "M. Chinnaswamy Stadium",
      createdAt: new Date(),
    };
    
    const team4: Team = {
      id: this.currentTeamId++,
      name: "Kolkata Knight Riders",
      shortName: "KKR",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Kolkata_Knight_Riders_Logo.svg/800px-Kolkata_Knight_Riders_Logo.svg.png",
      homeVenue: "Eden Gardens",
      createdAt: new Date(),
    };
    
    const team5: Team = {
      id: this.currentTeamId++,
      name: "Sunrisers Hyderabad",
      shortName: "SRH",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/8/81/Sunrisers_Hyderabad.svg/800px-Sunrisers_Hyderabad.svg.png",
      homeVenue: "Rajiv Gandhi International Cricket Stadium",
      createdAt: new Date(),
    };
    
    this.teams.set(team1.id, team1);
    this.teams.set(team2.id, team2);
    this.teams.set(team3.id, team3);
    this.teams.set(team4.id, team4);
    this.teams.set(team5.id, team5);
    
    // Sample stadiums
    const stadium1: Stadium = {
      id: this.currentStadiumId++,
      name: "M. A. Chidambaram Stadium",
      city: "Chennai",
      country: "India",
      pitchType: "spin-friendly",
      createdAt: new Date(),
    };
    
    const stadium2: Stadium = {
      id: this.currentStadiumId++,
      name: "Wankhede Stadium",
      city: "Mumbai",
      country: "India",
      pitchType: "balanced",
      createdAt: new Date(),
    };
    
    const stadium3: Stadium = {
      id: this.currentStadiumId++,
      name: "M. Chinnaswamy Stadium",
      city: "Bengaluru",
      country: "India",
      pitchType: "batting-friendly",
      createdAt: new Date(),
    };
    
    this.stadiums.set(stadium1.id, stadium1);
    this.stadiums.set(stadium2.id, stadium2);
    this.stadiums.set(stadium3.id, stadium3);
    
    // Sample players
    const player1: Player = {
      id: this.currentPlayerId++,
      name: "MS Dhoni",
      teamId: team1.id,
      role: "wicket-keeper",
      battingStyle: "right-handed",
      bowlingStyle: "right-arm medium",
      imageUrl: "https://static.iplt20.com/players/210/1.png",
      country: "India",
      isCaptain: true,
      createdAt: new Date(),
    };
    
    const player2: Player = {
      id: this.currentPlayerId++,
      name: "Rohit Sharma",
      teamId: team2.id,
      role: "batsman",
      battingStyle: "right-handed",
      bowlingStyle: "right-arm off break",
      imageUrl: "https://static.iplt20.com/players/210/107.png",
      country: "India",
      isCaptain: true,
      createdAt: new Date(),
    };
    
    const player3: Player = {
      id: this.currentPlayerId++,
      name: "Jasprit Bumrah",
      teamId: team2.id,
      role: "bowler",
      battingStyle: "right-handed",
      bowlingStyle: "right-arm fast",
      imageUrl: "https://static.iplt20.com/players/210/1124.png",
      country: "India",
      isCaptain: false,
      createdAt: new Date(),
    };
    
    const player4: Player = {
      id: this.currentPlayerId++,
      name: "Ravindra Jadeja",
      teamId: team1.id,
      role: "all-rounder",
      battingStyle: "left-handed",
      bowlingStyle: "left-arm orthodox",
      imageUrl: "https://static.iplt20.com/players/210/9.png",
      country: "India",
      isCaptain: false,
      createdAt: new Date(),
    };
    
    this.players.set(player1.id, player1);
    this.players.set(player2.id, player2);
    this.players.set(player3.id, player3);
    this.players.set(player4.id, player4);
    
    // Sample matches
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    const match1: Match = {
      id: this.currentMatchId++,
      team1Id: team1.id,
      team2Id: team2.id,
      stadiumId: stadium1.id,
      matchDate: today,
      matchType: "league",
      season: 2023,
      isCompleted: false,
      tossWinnerId: null,
      tossDecision: null,
      winnerId: null,
      winMargin: null,
      winMarginType: null,
      team1Score: null,
      team1Wickets: null,
      team1Overs: null,
      team2Score: null,
      team2Wickets: null,
      team2Overs: null,
      createdAt: new Date(),
    };
    
    const match2: Match = {
      id: this.currentMatchId++,
      team1Id: team3.id,
      team2Id: team4.id,
      stadiumId: stadium3.id,
      matchDate: tomorrow,
      matchType: "league",
      season: 2023,
      isCompleted: false,
      tossWinnerId: null,
      tossDecision: null,
      winnerId: null,
      winMargin: null,
      winMarginType: null,
      team1Score: null,
      team1Wickets: null,
      team1Overs: null,
      team2Score: null,
      team2Wickets: null,
      team2Overs: null,
      createdAt: new Date(),
    };
    
    const match3: Match = {
      id: this.currentMatchId++,
      team1Id: team5.id,
      team2Id: team3.id,
      stadiumId: stadium2.id,
      matchDate: dayAfterTomorrow,
      matchType: "league",
      season: 2023,
      isCompleted: false,
      tossWinnerId: null,
      tossDecision: null,
      winnerId: null,
      winMargin: null,
      winMarginType: null,
      team1Score: null,
      team1Wickets: null,
      team1Overs: null,
      team2Score: null,
      team2Wickets: null,
      team2Overs: null,
      createdAt: new Date(),
    };
    
    this.matches.set(match1.id, match1);
    this.matches.set(match2.id, match2);
    this.matches.set(match3.id, match3);
    
    // Sample predictions
    const prediction1: Prediction = {
      id: this.currentPredictionId++,
      matchId: match1.id,
      predictedWinnerId: team1.id,
      winProbability: 0.62,
      team1PredictedScore: 187,
      team1PredictedWickets: 6,
      team2PredictedScore: 173,
      team2PredictedWickets: 8,
      reasoning: "CSK has a strong record at home in Chennai, with the pitch conditions favoring their spin attack. MS Dhoni's form in recent matches gives them an edge.",
      confidence: 0.78,
      isCorrect: null,
      predictionDate: new Date(),
      detailedStats: {
        powerplay: {
          team1Score: 58,
          team1Wickets: 1,
          team2Score: 51,
          team2Wickets: 2
        },
        middle: {
          team1Score: 85,
          team1Wickets: 3,
          team2Score: 76,
          team2Wickets: 3
        },
        death: {
          team1Score: 44,
          team1Wickets: 2,
          team2Score: 46,
          team2Wickets: 3
        }
      }
    };
    
    const prediction2: Prediction = {
      id: this.currentPredictionId++,
      matchId: match2.id,
      predictedWinnerId: team3.id,
      winProbability: 0.63,
      team1PredictedScore: 192,
      team1PredictedWickets: 5,
      team2PredictedScore: 180,
      team2PredictedWickets: 7,
      reasoning: "RCB has a strong batting lineup and the Chinnaswamy Stadium is known to be a high-scoring venue. KKR's bowling attack might struggle on this batting-friendly pitch.",
      confidence: 0.63,
      isCorrect: null,
      predictionDate: new Date(),
      detailedStats: null
    };
    
    const prediction3: Prediction = {
      id: this.currentPredictionId++,
      matchId: match3.id,
      predictedWinnerId: team5.id,
      winProbability: 0.56,
      team1PredictedScore: 168,
      team1PredictedWickets: 7,
      team2PredictedScore: 160,
      team2PredictedWickets: 9,
      reasoning: "SRH's bowling attack has been performing well in recent matches, and they have a slight edge over RCB in Mumbai conditions.",
      confidence: 0.56,
      isCorrect: null,
      predictionDate: new Date(),
      detailedStats: null
    };
    
    this.predictions.set(prediction1.id, prediction1);
    this.predictions.set(prediction2.id, prediction2);
    this.predictions.set(prediction3.id, prediction3);
    
    // Sample player performance predictions
    const playerPerfPrediction1: PlayerPerformancePrediction = {
      id: this.currentPlayerPerformancePredictionId++,
      matchId: match1.id,
      playerId: player1.id,
      predictedRunsScored: 42,
      predictedBallsFaced: 23,
      predictedFours: 3,
      predictedSixes: 3,
      predictedOvers: null,
      predictedRunsConceded: null,
      predictedWickets: null,
      predictedMaidens: null,
      predictionDate: new Date(),
      confidence: 0.75,
      reasoning: "MS Dhoni has been in excellent form in the death overs, with a strike rate of over 180 in the last 3 matches."
    };
    
    const playerPerfPrediction2: PlayerPerformancePrediction = {
      id: this.currentPlayerPerformancePredictionId++,
      matchId: match1.id,
      playerId: player2.id,
      predictedRunsScored: 38,
      predictedBallsFaced: 31,
      predictedFours: 4,
      predictedSixes: 1,
      predictedOvers: null,
      predictedRunsConceded: null,
      predictedWickets: null,
      predictedMaidens: null,
      predictionDate: new Date(),
      confidence: 0.68,
      reasoning: "Rohit Sharma has been consistent but not explosive in recent matches, with a strike rate around 120-130."
    };
    
    const playerPerfPrediction3: PlayerPerformancePrediction = {
      id: this.currentPlayerPerformancePredictionId++,
      matchId: match1.id,
      playerId: player3.id,
      predictedRunsScored: null,
      predictedBallsFaced: null,
      predictedFours: null,
      predictedSixes: null,
      predictedOvers: 4.0,
      predictedRunsConceded: 28,
      predictedWickets: 3,
      predictedMaidens: 0,
      predictionDate: new Date(),
      confidence: 0.82,
      reasoning: "Jasprit Bumrah has been MI's best bowler, consistently taking wickets in all phases of the game."
    };
    
    const playerPerfPrediction4: PlayerPerformancePrediction = {
      id: this.currentPlayerPerformancePredictionId++,
      matchId: match1.id,
      playerId: player4.id,
      predictedRunsScored: 26,
      predictedBallsFaced: 18,
      predictedFours: 2,
      predictedSixes: 1,
      predictedOvers: 4.0,
      predictedRunsConceded: 24,
      predictedWickets: 2,
      predictedMaidens: 0,
      predictionDate: new Date(),
      confidence: 0.71,
      reasoning: "Ravindra Jadeja's all-round abilities make him a key player, especially on Chennai's spin-friendly tracks."
    };
    
    this.playerPerformancePredictions.set(playerPerfPrediction1.id, playerPerfPrediction1);
    this.playerPerformancePredictions.set(playerPerfPrediction2.id, playerPerfPrediction2);
    this.playerPerformancePredictions.set(playerPerfPrediction3.id, playerPerfPrediction3);
    this.playerPerformancePredictions.set(playerPerfPrediction4.id, playerPerfPrediction4);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  // Team methods
  async getAllTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }
  
  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }
  
  async getTeamByName(name: string): Promise<Team | undefined> {
    return Array.from(this.teams.values()).find(
      (team) => team.name === name || team.shortName === name,
    );
  }
  
  async createTeam(team: InsertTeam): Promise<Team> {
    const id = this.currentTeamId++;
    const newTeam: Team = { ...team, id, createdAt: new Date() };
    this.teams.set(id, newTeam);
    return newTeam;
  }
  
  // Player methods
  async getAllPlayers(): Promise<Player[]> {
    return Array.from(this.players.values());
  }
  
  async getPlayer(id: number): Promise<Player | undefined> {
    return this.players.get(id);
  }
  
  async getPlayersByTeam(teamId: number): Promise<Player[]> {
    return Array.from(this.players.values()).filter(
      (player) => player.teamId === teamId,
    );
  }
  
  async createPlayer(player: InsertPlayer): Promise<Player> {
    const id = this.currentPlayerId++;
    const newPlayer: Player = { ...player, id, createdAt: new Date() };
    this.players.set(id, newPlayer);
    return newPlayer;
  }
  
  // Stadium methods
  async getAllStadiums(): Promise<Stadium[]> {
    return Array.from(this.stadiums.values());
  }
  
  async getStadium(id: number): Promise<Stadium | undefined> {
    return this.stadiums.get(id);
  }
  
  async createStadium(stadium: InsertStadium): Promise<Stadium> {
    const id = this.currentStadiumId++;
    const newStadium: Stadium = { ...stadium, id, createdAt: new Date() };
    this.stadiums.set(id, newStadium);
    return newStadium;
  }
  
  // Match methods
  async getAllMatches(): Promise<Match[]> {
    return Array.from(this.matches.values());
  }
  
  async getMatch(id: number): Promise<Match | undefined> {
    return this.matches.get(id);
  }
  
  async getUpcomingMatches(limit?: number): Promise<Match[]> {
    const now = new Date();
    const upcomingMatches = Array.from(this.matches.values())
      .filter((match) => !match.isCompleted && new Date(match.matchDate) >= now)
      .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());
    
    return limit ? upcomingMatches.slice(0, limit) : upcomingMatches;
  }
  
  async getCompletedMatches(limit?: number): Promise<Match[]> {
    const completedMatches = Array.from(this.matches.values())
      .filter((match) => match.isCompleted)
      .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime());
    
    return limit ? completedMatches.slice(0, limit) : completedMatches;
  }
  
  async createMatch(match: InsertMatch): Promise<Match> {
    const id = this.currentMatchId++;
    const newMatch: Match = { ...match, id, createdAt: new Date() };
    this.matches.set(id, newMatch);
    return newMatch;
  }
  
  async updateMatch(id: number, match: Partial<Match>): Promise<Match | undefined> {
    const existingMatch = this.matches.get(id);
    if (!existingMatch) return undefined;
    
    const updatedMatch = { ...existingMatch, ...match };
    this.matches.set(id, updatedMatch);
    return updatedMatch;
  }
  
  // Prediction methods
  async getAllPredictions(): Promise<Prediction[]> {
    return Array.from(this.predictions.values());
  }
  
  async getPrediction(id: number): Promise<Prediction | undefined> {
    return this.predictions.get(id);
  }
  
  async getPredictionByMatchId(matchId: number): Promise<Prediction | undefined> {
    return Array.from(this.predictions.values()).find(
      (prediction) => prediction.matchId === matchId,
    );
  }
  
  async createPrediction(prediction: InsertPrediction): Promise<Prediction> {
    const id = this.currentPredictionId++;
    const newPrediction: Prediction = { 
      ...prediction, 
      id, 
      predictionDate: new Date(),
      isCorrect: null 
    };
    this.predictions.set(id, newPrediction);
    return newPrediction;
  }
  
  async updatePrediction(id: number, prediction: Partial<Prediction>): Promise<Prediction | undefined> {
    const existingPrediction = this.predictions.get(id);
    if (!existingPrediction) return undefined;
    
    const updatedPrediction = { ...existingPrediction, ...prediction };
    this.predictions.set(id, updatedPrediction);
    return updatedPrediction;
  }
  
  // Player Performance methods
  async getPlayerPerformance(id: number): Promise<PlayerPerformance | undefined> {
    return this.playerPerformances.get(id);
  }
  
  async getPlayerPerformancesByMatch(matchId: number): Promise<PlayerPerformance[]> {
    return Array.from(this.playerPerformances.values()).filter(
      (performance) => performance.matchId === matchId,
    );
  }
  
  async getPlayerPerformancesByPlayer(playerId: number): Promise<PlayerPerformance[]> {
    return Array.from(this.playerPerformances.values()).filter(
      (performance) => performance.playerId === playerId,
    );
  }
  
  async createPlayerPerformance(performance: InsertPlayerPerformance): Promise<PlayerPerformance> {
    const id = this.currentPlayerPerformanceId++;
    const newPerformance: PlayerPerformance = { ...performance, id, createdAt: new Date() };
    this.playerPerformances.set(id, newPerformance);
    return newPerformance;
  }
  
  // Player Performance Prediction methods
  async getPlayerPerformancePrediction(id: number): Promise<PlayerPerformancePrediction | undefined> {
    return this.playerPerformancePredictions.get(id);
  }
  
  async getPlayerPerformancePredictionsByMatch(matchId: number): Promise<PlayerPerformancePrediction[]> {
    return Array.from(this.playerPerformancePredictions.values()).filter(
      (prediction) => prediction.matchId === matchId,
    );
  }
  
  async getPlayerPerformancePredictionsByPlayer(playerId: number): Promise<PlayerPerformancePrediction[]> {
    return Array.from(this.playerPerformancePredictions.values()).filter(
      (prediction) => prediction.playerId === playerId,
    );
  }
  
  async createPlayerPerformancePrediction(prediction: InsertPlayerPerformancePrediction): Promise<PlayerPerformancePrediction> {
    const id = this.currentPlayerPerformancePredictionId++;
    const newPrediction: PlayerPerformancePrediction = { 
      ...prediction, 
      id, 
      predictionDate: new Date() 
    };
    this.playerPerformancePredictions.set(id, newPrediction);
    return newPrediction;
  }
  
  // Chat message methods
  async getChatMessagesByUser(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).filter(
      (message) => message.userId === userId,
    );
  }
  
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const newMessage: ChatMessage = { ...message, id, createdAt: new Date() };
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }
}

export const storage = new MemStorage();
