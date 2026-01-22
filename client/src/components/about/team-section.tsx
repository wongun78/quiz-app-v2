import TeamCard from "@/components/team/team-card";
import { DinoEgg } from "@/components/shared/DinoIcons";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { MockTeamMember } from "@/types/mock";

const team1Img =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80";
const team2Img =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80";
const team3Img =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80";

const featuredTeams: MockTeamMember[] = [
  {
    id: "1",
    name: "Rex Thunderfoot",
    role: "Chief Evolution Officer",
    image: team1Img,
  },
  {
    id: "2",
    name: "Veloci Swiftclaw",
    role: "Learning Architect",
    image: team2Img,
  },
  {
    id: "3",
    name: "Stego Brightscale",
    role: "Knowledge Curator",
    image: team3Img,
  },
];

const FeaturedTeams = () => {
  return (
    <section className="py-20 bg-secondary/20">
      <div className="container-custom">
        <SectionHeading
          icon={<DinoEgg size={32} className="text-primary" />}
          title="Meet Our Team"
          description="The minds behind Dino Quiz"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTeams;
