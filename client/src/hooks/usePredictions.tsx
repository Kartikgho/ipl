import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";

export function usePredictions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Get upcoming matches
  const { 
    data: matches = [], 
    isLoading: isMatchesLoading 
  } = useQuery({
    queryKey: ['/api/matches', { type: 'upcoming' }],
    queryFn: async ({ queryKey }) => {
      const response = await apiClient.get('/api/matches?type=upcoming');
      return response;
    }
  });

  // Get predictions for those matches
  const { 
    data: predictions = [], 
    isLoading: isPredictionsLoading 
  } = useQuery({
    queryKey: ['/api/predictions'],
    queryFn: async ({ queryKey }) => {
      const response = await apiClient.get('/api/predictions');
      return response;
    },
    enabled: matches.length > 0
  });

  // Combine match data with prediction data
  const upcomingMatches = matches.map((match: any) => {
    const prediction = predictions.find((p: any) => p.matchId === match.id);
    // Get team info from the storage for display purposes
    // In a real implementation, we would fetch this from the API
    const team1ShortName = match.team1Id === 1 ? "CSK" : 
                       match.team1Id === 2 ? "MI" : 
                       match.team1Id === 3 ? "RCB" : 
                       match.team1Id === 4 ? "KKR" : "SRH";
                       
    const team2ShortName = match.team2Id === 1 ? "CSK" : 
                       match.team2Id === 2 ? "MI" : 
                       match.team2Id === 3 ? "RCB" : 
                       match.team2Id === 4 ? "KKR" : "SRH";
                       
    const stadium = match.stadiumId === 1 ? "Chennai" : 
                match.stadiumId === 2 ? "Mumbai" : 
                match.stadiumId === 3 ? "Bengaluru" : "TBD";
                
    return {
      ...match,
      team1ShortName,
      team2ShortName,
      stadium,
      prediction: prediction || null
    };
  });

  // Generate prediction mutation
  const generatePredictionMutation = useMutation({
    mutationFn: async (matchId: number) => {
      const response = await apiClient.post('/api/predictions/generate', { matchId });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/predictions'] });
      toast({
        title: "Prediction Generated",
        description: "Match prediction has been successfully generated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate prediction. Please try again.",
        variant: "destructive",
      });
      console.error("Generate prediction error:", error);
    }
  });

  const generatePrediction = (matchId: number) => {
    generatePredictionMutation.mutate(matchId);
  };

  return {
    upcomingMatches,
    predictions,
    isLoading: isMatchesLoading || isPredictionsLoading || generatePredictionMutation.isPending,
    generatePrediction
  };
}
