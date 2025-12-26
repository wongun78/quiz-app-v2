import TeamCard from "@/components/team/team-card";
import type { Team } from "@/types/team";

import team1Img from "@/assets/images/teams/team-1.png";
import team2Img from "@/assets/images/teams/team-2.png";
import team3Img from "@/assets/images/teams/team-3.png";

const featuredTeams: Team[] = [
  {
    id: "1",
    name: "Cong Dinh",
    role: "Tech Lead",
    image: team1Img,
  },
  {
    id: "2",
    name: "Trung Kien",
    role: "QA Engineer",
    image: team2Img,
  },
  {
    id: "3",
    name: "Minh Tuan",
    role: "Developer",
    image: team3Img,
  },
];

const FeaturedTeams = () => {
  return (
    <section className="py-12">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Our Team
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {featuredTeams.map((team) => (
            <div key={team.id} className="flex-1 min-w-[250px]">
              <TeamCard team={team} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTeams;
