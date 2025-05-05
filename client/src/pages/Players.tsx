import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Badge, BatteryChargingIcon, Users, BarChart2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Players: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const { data: teams } = useQuery({
    queryKey: ['/api/teams'],
  });

  const { data: players, isLoading } = useQuery({
    queryKey: ['/api/players', selectedTeam],
    queryFn: async ({ queryKey }) => {
      const endpoint = selectedTeam 
        ? `/api/players?teamId=${selectedTeam}` 
        : '/api/players';
      const res = await fetch(endpoint, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch players');
      return res.json();
    }
  });

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'batsman':
        return <BatteryChargingIcon className="h-4 w-4 text-red-500" />;
      case 'bowler':
        return <Badge className="h-4 w-4 text-green-500" />;
      case 'all-rounder':
        return <BarChart2 className="h-4 w-4 text-purple-500" />;
      case 'wicket-keeper':
        return <Users className="h-4 w-4 text-blue-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'batsman':
        return 'bg-red-100 text-red-800';
      case 'bowler':
        return 'bg-green-100 text-green-800';
      case 'all-rounder':
        return 'bg-purple-100 text-purple-800';
      case 'wicket-keeper':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-neutral-800">IPL Players</h1>
          <p className="text-neutral-600 mt-1">View player information and performance statistics</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <div className="bg-white rounded-md shadow-sm border border-neutral-200 flex items-center px-3 py-2">
            <Search className="w-4 h-4 text-neutral-500 mr-2" />
            <Input 
              type="text" 
              placeholder="Search players" 
              className="border-none focus:outline-none text-sm flex-grow bg-transparent"
            />
          </div>
          
          <select 
            className="rounded-md shadow-sm border border-neutral-200 px-3 py-2 bg-white text-sm"
            onChange={(e) => setSelectedTeam(e.target.value)}
            value={selectedTeam || ''}
          >
            <option value="">All Teams</option>
            {teams?.map((team: any) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
          
          <Button variant="default" className="flex items-center text-sm gap-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Players</TabsTrigger>
          <TabsTrigger value="batsmen">Batsmen</TabsTrigger>
          <TabsTrigger value="bowlers">Bowlers</TabsTrigger>
          <TabsTrigger value="all-rounders">All-Rounders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Player Roster</CardTitle>
              <CardDescription>Complete list of IPL players</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(8).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Player</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Batting Style</TableHead>
                      <TableHead>Bowling Style</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players?.map((player: any) => {
                      const team = teams?.find((t: any) => t.id === player.teamId);
                      return (
                        <TableRow key={player.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={player.imageUrl} alt={player.name} />
                                <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{player.name}</div>
                                {player.isCaptain && <span className="text-xs text-primary-500">(Captain)</span>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {team?.logoUrl && (
                                <img 
                                  src={team.logoUrl} 
                                  alt={team.name} 
                                  className="h-5 w-5 object-contain"
                                />
                              )}
                              <span>{team?.shortName || 'N/A'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              {getRoleIcon(player.role)}
                              <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(player.role)}`}>
                                {player.role}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{player.country}</TableCell>
                          <TableCell>{player.battingStyle || 'N/A'}</TableCell>
                          <TableCell>{player.bowlingStyle || 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              View Stats
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="batsmen">
          <Card>
            <CardHeader>
              <CardTitle>Batsmen</CardTitle>
              <CardDescription>Specialized batting players</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-neutral-500">
                Filtered batting specialists will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bowlers">
          <Card>
            <CardHeader>
              <CardTitle>Bowlers</CardTitle>
              <CardDescription>Specialized bowling players</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-neutral-500">
                Filtered bowling specialists will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all-rounders">
          <Card>
            <CardHeader>
              <CardTitle>All-Rounders</CardTitle>
              <CardDescription>Players proficient in both batting and bowling</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-neutral-500">
                Filtered all-rounders will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Players;
