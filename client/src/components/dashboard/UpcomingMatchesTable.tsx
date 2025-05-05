import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Match {
  id: number;
  team1Id: number;
  team2Id: number;
  stadiumId: number | null;
  matchDate: string;
  team1ShortName?: string;
  team2ShortName?: string;
  stadium?: string;
  prediction?: {
    id: number;
    predictedWinnerId: number;
    winProbability: number;
    confidence: number;
  };
}

interface UpcomingMatchesTableProps {
  matches: Match[];
  isLoading: boolean;
}

const UpcomingMatchesTable: React.FC<UpcomingMatchesTableProps> = ({
  matches,
  isLoading
}) => {
  const [expandedTable, setExpandedTable] = useState(false);

  // Calculate how many rows to display initially
  const initialRows = 4;
  const displayedMatches = expandedTable ? matches : matches.slice(0, initialRows);

  const getBadgeColorForTeam = (teamId: number, prediction: any) => {
    if (!prediction) return "bg-neutral-100 text-neutral-800";
    
    if (teamId === prediction.predictedWinnerId) {
      if (teamId % 5 === 0) return "bg-secondary-100 text-secondary-800";
      if (teamId % 5 === 1) return "bg-blue-100 text-blue-800";
      if (teamId % 5 === 2) return "bg-purple-100 text-purple-800";
      if (teamId % 5 === 3) return "bg-orange-100 text-orange-800";
      return "bg-pink-100 text-pink-800";
    }
    
    return "bg-neutral-100 text-neutral-800";
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden mb-8">
      <CardHeader className="px-5 py-4 border-b border-neutral-200 flex justify-between items-center">
        <CardTitle className="font-heading font-semibold text-lg">Upcoming Match Predictions</CardTitle>
        {matches.length > initialRows && (
          <Button 
            variant="ghost" 
            className="text-primary-500 hover:text-primary-600 text-sm font-medium"
            onClick={() => setExpandedTable(!expandedTable)}
          >
            {expandedTable ? "Show Less" : "View All"}
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50">
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Match</TableHead>
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date & Time</TableHead>
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Venue</TableHead>
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Prediction</TableHead>
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Confidence</TableHead>
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-neutral-200">
              {isLoading ? (
                // Loading state - skeleton rows
                Array(4).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <Skeleton className="h-2 w-16 rounded-full mr-2" />
                        <Skeleton className="h-4 w-6" />
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : displayedMatches.length > 0 ? (
                // Actual data
                displayedMatches.map((match) => {
                  const prediction = match.prediction;
                  const winningTeamId = prediction?.predictedWinnerId;
                  const winningTeamName = winningTeamId === match.team1Id ? match.team1ShortName : match.team2ShortName;
                  const confidence = prediction?.confidence ? Math.round(prediction.confidence * 100) : 0;
                  
                  return (
                    <TableRow key={match.id} className="hover:bg-neutral-50 transition-colors">
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="font-medium">{match.team1ShortName || 'Team 1'} vs {match.team2ShortName || 'Team 2'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap text-sm">
                        {new Date(match.matchDate).toLocaleString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap text-sm">
                        {match.stadium || 'TBD'}
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        {prediction ? (
                          <span 
                            className={`px-2 py-1 text-xs rounded-full ${getBadgeColorForTeam(
                              winningTeamId || 0, 
                              prediction
                            )}`}
                          >
                            {winningTeamName} Win
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-neutral-100 text-neutral-800">
                            Pending
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        {prediction ? (
                          <div className="flex items-center">
                            <div className="w-16 bg-neutral-200 rounded-full h-2 mr-2">
                              <div 
                                className={`${
                                  confidence > 70 ? 'bg-secondary-500' : 
                                  confidence > 60 ? 'bg-blue-500' : 
                                  'bg-orange-500'
                                } h-2 rounded-full`} 
                                style={{width: `${confidence}%`}}
                              ></div>
                            </div>
                            <span className="text-xs">{confidence}%</span>
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-500">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap text-sm">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-primary-500 hover:text-primary-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                // No matches available
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                    No upcoming matches found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingMatchesTable;
