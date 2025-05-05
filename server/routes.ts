import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertTeamSchema, 
  insertPlayerSchema, 
  insertMatchSchema, 
  insertPredictionSchema,
  insertPlayerPerformancePredictionSchema,
  insertChatMessageSchema
} from "@shared/schema";
import { generateMatchPrediction } from "./ml/predictMatch";
import { generatePlayerPerformancePrediction } from "./ml/predictPlayerPerformance";
import { getExplanationFromOllama } from "./ml/ollama";
import { scrapeLatestIPLData } from "./scraper/iplScraper";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Teams API
  app.get('/api/teams', async (req, res) => {
    try {
      const teams = await storage.getAllTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch teams' });
    }
  });

  app.get('/api/teams/:id', async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const team = await storage.getTeam(teamId);
      
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
      
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch team' });
    }
  });

  app.post('/api/teams', async (req, res) => {
    try {
      const validatedData = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam(validatedData);
      res.status(201).json(team);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create team' });
    }
  });

  // Players API
  app.get('/api/players', async (req, res) => {
    try {
      const teamId = req.query.teamId ? parseInt(req.query.teamId as string) : undefined;
      
      if (teamId) {
        const players = await storage.getPlayersByTeam(teamId);
        return res.json(players);
      }
      
      const players = await storage.getAllPlayers();
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch players' });
    }
  });

  app.get('/api/players/:id', async (req, res) => {
    try {
      const playerId = parseInt(req.params.id);
      const player = await storage.getPlayer(playerId);
      
      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }
      
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch player' });
    }
  });

  app.post('/api/players', async (req, res) => {
    try {
      const validatedData = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(validatedData);
      res.status(201).json(player);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create player' });
    }
  });

  // Matches API
  app.get('/api/matches', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const type = req.query.type as string;
      
      if (type === 'upcoming') {
        const matches = await storage.getUpcomingMatches(limit);
        return res.json(matches);
      } else if (type === 'completed') {
        const matches = await storage.getCompletedMatches(limit);
        return res.json(matches);
      }
      
      const matches = await storage.getAllMatches();
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch matches' });
    }
  });

  app.get('/api/matches/:id', async (req, res) => {
    try {
      const matchId = parseInt(req.params.id);
      const match = await storage.getMatch(matchId);
      
      if (!match) {
        return res.status(404).json({ error: 'Match not found' });
      }
      
      res.json(match);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch match' });
    }
  });

  app.post('/api/matches', async (req, res) => {
    try {
      const validatedData = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(validatedData);
      res.status(201).json(match);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create match' });
    }
  });

  // Predictions API
  app.get('/api/predictions', async (req, res) => {
    try {
      const matchId = req.query.matchId ? parseInt(req.query.matchId as string) : undefined;
      
      if (matchId) {
        const prediction = await storage.getPredictionByMatchId(matchId);
        return res.json(prediction || null);
      }
      
      const predictions = await storage.getAllPredictions();
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch predictions' });
    }
  });

  app.get('/api/predictions/:id', async (req, res) => {
    try {
      const predictionId = parseInt(req.params.id);
      const prediction = await storage.getPrediction(predictionId);
      
      if (!prediction) {
        return res.status(404).json({ error: 'Prediction not found' });
      }
      
      res.json(prediction);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch prediction' });
    }
  });

  app.post('/api/predictions', async (req, res) => {
    try {
      const validatedData = insertPredictionSchema.parse(req.body);
      const prediction = await storage.createPrediction(validatedData);
      res.status(201).json(prediction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create prediction' });
    }
  });

  // Generate prediction
  app.post('/api/predictions/generate', async (req, res) => {
    try {
      const { matchId } = req.body;
      
      if (!matchId) {
        return res.status(400).json({ error: 'Match ID is required' });
      }
      
      const match = await storage.getMatch(parseInt(matchId));
      
      if (!match) {
        return res.status(404).json({ error: 'Match not found' });
      }
      
      // Check if prediction already exists
      const existingPrediction = await storage.getPredictionByMatchId(match.id);
      
      if (existingPrediction) {
        return res.json(existingPrediction);
      }
      
      // Generate prediction using ML model
      const teams = await Promise.all([
        storage.getTeam(match.team1Id),
        storage.getTeam(match.team2Id)
      ]);
      
      const stadium = match.stadiumId ? await storage.getStadium(match.stadiumId) : null;
      
      if (!teams[0] || !teams[1]) {
        return res.status(404).json({ error: 'Team not found' });
      }
      
      const prediction = await generateMatchPrediction(match, teams[0], teams[1], stadium);
      
      // Get LLM reasoning
      const reasoning = await getExplanationFromOllama(prediction, match, teams[0], teams[1], stadium);
      prediction.reasoning = reasoning;
      
      // Save prediction
      const savedPrediction = await storage.createPrediction(prediction);
      
      res.json(savedPrediction);
    } catch (error) {
      console.error('Prediction generation error:', error);
      res.status(500).json({ error: 'Failed to generate prediction' });
    }
  });

  // Player Performance Predictions API
  app.get('/api/player-performance-predictions', async (req, res) => {
    try {
      const matchId = req.query.matchId ? parseInt(req.query.matchId as string) : undefined;
      const playerId = req.query.playerId ? parseInt(req.query.playerId as string) : undefined;
      
      if (matchId) {
        const predictions = await storage.getPlayerPerformancePredictionsByMatch(matchId);
        return res.json(predictions);
      }
      
      if (playerId) {
        const predictions = await storage.getPlayerPerformancePredictionsByPlayer(playerId);
        return res.json(predictions);
      }
      
      res.status(400).json({ error: 'Either matchId or playerId is required' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch player performance predictions' });
    }
  });

  app.post('/api/player-performance-predictions/generate', async (req, res) => {
    try {
      const { matchId, playerId } = req.body;
      
      if (!matchId || !playerId) {
        return res.status(400).json({ error: 'Match ID and Player ID are required' });
      }
      
      const match = await storage.getMatch(parseInt(matchId));
      const player = await storage.getPlayer(parseInt(playerId));
      
      if (!match) {
        return res.status(404).json({ error: 'Match not found' });
      }
      
      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }
      
      // Generate player performance prediction
      const prediction = await generatePlayerPerformancePrediction(match, player);
      
      // Get LLM reasoning
      const reasoning = await getExplanationFromOllama(prediction, match, player);
      prediction.reasoning = reasoning;
      
      // Save prediction
      const savedPrediction = await storage.createPlayerPerformancePrediction(prediction);
      
      res.json(savedPrediction);
    } catch (error) {
      console.error('Player performance prediction generation error:', error);
      res.status(500).json({ error: 'Failed to generate player performance prediction' });
    }
  });

  // Chatbot API
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, userId } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      // Save user message
      const chatMessage = await storage.createChatMessage({
        userId: userId || null,
        message,
        isUserMessage: true,
        response: null
      });
      
      // Generate response using Ollama
      const response = await getExplanationFromOllama({ type: 'chat', message });
      
      // Update chat message with response
      const updatedMessage = await storage.createChatMessage({
        userId: userId || null,
        message: response,
        isUserMessage: false,
        response: null
      });
      
      res.json({ 
        userMessage: chatMessage,
        botResponse: updatedMessage
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to process chat message' });
    }
  });

  // Data scraping API
  app.post('/api/scrape', async (req, res) => {
    try {
      const data = await scrapeLatestIPLData();
      res.json({ success: true, message: 'Data scraping initiated', data });
    } catch (error) {
      console.error('Scraping error:', error);
      res.status(500).json({ error: 'Failed to scrape data' });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
