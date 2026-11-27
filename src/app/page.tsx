import { Navbar } from "@/components/ui/Navbar";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { RegistrationDrawer } from "@/components/ui/RegistrationDrawer";
import { PassesDrawer } from "@/components/ui/PassesDrawer";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { GamesSection } from "@/components/sections/GamesSection";
import { PenaltyGame } from "@/components/sections/PenaltyGame";
import { TournamentsSection } from "@/components/sections/TournamentsSection";
import { HostGameSection } from "@/components/sections/HostGameSection";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <GamesSection />
        <PenaltyGame />
        <TournamentsSection />
        <HostGameSection />
        <CommunitySection />
      </main>
      <Footer />
      <RegistrationDrawer />
      <PassesDrawer />
      <CommandPalette />
    </>
  );
}
