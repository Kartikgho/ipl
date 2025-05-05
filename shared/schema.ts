import { pgTable, text, serial, integer, boolean, timestamp, json, real, date, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Team model
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  logoUrl: text("logo_url"),
  homeVenue: text("home_venue"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
});

// Player model
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  teamId: integer("team_id").references(() => teams.id),
  role: text("role").notNull(), // batsman, bowler, all-rounder, wicket-keeper
  battingStyle: text("batting_style"),
  bowlingStyle: text("bowling_style"),
  imageUrl: text("image_url"),
  country: text("country"),
  isCaptain: boolean("is_captain").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
});

// Stadium model
export const stadiums = pgTable("stadiums", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  pitchType: text("pitch_type"), // batting, bowling, balanced
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStadiumSchema = createInsertSchema(stadiums).omit({
  id: true,
  createdAt: true,
});

// Match model
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  team1Id: integer("team1_id").references(() => teams.id).notNull(),
  team2Id: integer("team2_id").references(() => teams.id).notNull(),
  stadiumId: integer("stadium_id").references(() => stadiums.id),
  matchDate: timestamp("match_date").notNull(),
  matchType: text("match_type").default("league"), // league, playoff, final, etc.
  season: integer("season").notNull(), // 2022, 2023, etc.
  isCompleted: boolean("is_completed").default(false),
  tossWinnerId: integer("toss_winner_id").references(() => teams.id),
  tossDecision: text("toss_decision"), // bat, bowl
  winnerId: integer("winner_id").references(() => teams.id),
  winMargin: integer("win_margin"),
  winMarginType: text("win_margin_type"), // runs, wickets
  team1Score: integer("team1_score"),
  team1Wickets: integer("team1_wickets"),
  team1Overs: real("team1_overs"),
  team2Score: integer("team2_score"),
  team2Wickets: integer("team2_wickets"),
  team2Overs: real("team2_overs"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
});

// Prediction model
export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => matches.id).notNull(),
  predictedWinnerId: integer("predicted_winner_id").references(() => teams.id).notNull(),
  winProbability: real("win_probability").notNull(), // 0.0 to 1.0
  team1PredictedScore: integer("team1_predicted_score"),
  team1PredictedWickets: integer("team1_predicted_wickets"),
  team2PredictedScore: integer("team2_predicted_score"),
  team2PredictedWickets: integer("team2_predicted_wickets"),
  reasoning: text("reasoning"), // LLM reasoning for prediction
  confidence: real("confidence").notNull(), // 0.0 to 1.0
  isCorrect: boolean("is_correct"), // Filled after match is completed
  predictionDate: timestamp("prediction_date").defaultNow(),
  detailedStats: json("detailed_stats"), // JSON containing detailed phase-wise predictions
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  predictionDate: true,
  isCorrect: true,
});

// Player Performance model
export const playerPerformances = pgTable("player_performances", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => matches.id).notNull(),
  playerId: integer("player_id").references(() => players.id).notNull(),
  runsScored: integer("runs_scored").default(0),
  ballsFaced: integer("balls_faced").default(0),
  fours: integer("fours").default(0),
  sixes: integer("sixes").default(0),
  overs: real("overs").default(0),
  runsConceded: integer("runs_conceded").default(0),
  wickets: integer("wickets").default(0),
  maidens: integer("maidens").default(0),
  catches: integer("catches").default(0),
  stumpings: integer("stumpings").default(0),
  runOuts: integer("run_outs").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPlayerPerformanceSchema = createInsertSchema(playerPerformances).omit({
  id: true,
  createdAt: true,
});

// Player Performance Prediction model
export const playerPerformancePredictions = pgTable("player_performance_predictions", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => matches.id).notNull(),
  playerId: integer("player_id").references(() => players.id).notNull(),
  predictedRunsScored: integer("predicted_runs_scored"),
  predictedBallsFaced: integer("predicted_balls_faced"),
  predictedFours: integer("predicted_fours"),
  predictedSixes: integer("predicted_sixes"),
  predictedOvers: real("predicted_overs"),
  predictedRunsConceded: integer("predicted_runs_conceded"),
  predictedWickets: integer("predicted_wickets"),
  predictedMaidens: integer("predicted_maidens"),
  predictionDate: timestamp("prediction_date").defaultNow(),
  confidence: real("confidence"), // 0.0 to 1.0
  reasoning: text("reasoning"), // LLM reasoning for prediction
});

export const insertPlayerPerformancePredictionSchema = createInsertSchema(playerPerformancePredictions).omit({
  id: true,
  predictionDate: true,
});

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  role: text("role").default("user"), // user, admin
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

export type InsertStadium = z.infer<typeof insertStadiumSchema>;
export type Stadium = typeof stadiums.$inferSelect;

export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;

export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type Prediction = typeof predictions.$inferSelect;

export type InsertPlayerPerformance = z.infer<typeof insertPlayerPerformanceSchema>;
export type PlayerPerformance = typeof playerPerformances.$inferSelect;

export type InsertPlayerPerformancePrediction = z.infer<typeof insertPlayerPerformancePredictionSchema>;
export type PlayerPerformancePrediction = typeof playerPerformancePredictions.$inferSelect;

// Chat messages model
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  message: text("message").notNull(),
  isUserMessage: boolean("is_user_message").notNull(),
  response: text("response"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
