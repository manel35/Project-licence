import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import heroImg from "@/assets/hero-illustration.png";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-16 md:py-24 min-h-[85vh]">
      <div className="max-w-xl animate-fade-in-up">
        <p className="text-sm tracking-[3px] text-muted-foreground mb-5">
          🚀 SMART CODE TRACKING PLATFORM
        </p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Do You Want to
        </h1>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gradient-gold">
          Level Up Your Coding?
        </h1>
        <p className="mt-6 text-lg text-foreground/80 leading-relaxed max-w-md">
          Track your progress, analyze performance, and improve your skills
          with our intelligent and powerful Code Tracker.
        </p>
        <div className="flex gap-5 mt-8">
          <Link
            to={user ? "/dashboard" : "/auth"}
            className="flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full font-medium hover:bg-foreground/80 transition-colors"
          >
            <Search size={16} />
            Start Tracking
          </Link>
          <a
            href="#why"
            className="px-6 py-3 rounded-full font-medium border border-foreground/30 text-foreground hover:bg-foreground/10 transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>

      <img
        src={heroImg}
        alt="Code tracking dashboard"
        className="w-full md:w-[38%] max-w-md mt-12 md:mt-0 animate-fade-in-right"
        style={{ animationDelay: "0.3s", opacity: 0 }}
      />
    </section>
  );
};

export default HeroSection;
