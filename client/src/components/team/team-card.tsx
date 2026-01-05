import { Card, CardContent } from "@/components/ui/card";
import type { TeamMemberResponse } from "@/types/backend";
import type { MockTeamMember } from "@/types/mock";

interface TeamCardProps {
  team: TeamMemberResponse | MockTeamMember;
}

const TeamCard = ({ team }: TeamCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative h-full w-full overflow-hidden">
        <img
          src={team.image}
          alt={team.name}
          className="h-full w-full object-cover"
        />
      </div>

      <CardContent className="p-4 text-center">
        <h3 className="font-bold text-lg mb-1">{team.name}</h3>
        <p className="text-sm text-muted-foreground">{team.role}</p>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
