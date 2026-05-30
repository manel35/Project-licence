import { Code, BarChart3, ShieldCheck } from "lucide-react";
import whyImg from "@/assets/why-illustration.png";

const features = [
  {
    icon: Code,
    title: "Clean, Smart Analysis",
    description: "Track your coding sessions and improve efficiency.",
  },
  {
    icon: BarChart3,
    title: "Performance Insights",
    description: "See real progress and measurable growth.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description: "Your data is protected and always available.",
  },
];

const WhySection = () => {
  return (
    <section id="why" className="px-8 md:px-20 py-24">
      <div className="flex flex-col md:flex-row items-center justify-between gap-16">
        <img
          src={whyImg}
          alt="Developer workspace"
          className="w-full md:w-[400px] animate-fade-in-left"
          style={{ animationDelay: "0.2s", opacity: 0 }}
        />

        <div className="animate-fade-in-right" style={{ animationDelay: "0.3s", opacity: 0 }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-10">
            Why Our Code Tracker is <br /> Good for You
          </h2>

          <div className="space-y-7">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-5">
                <f.icon className="text-accent mt-1 shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold text-lg">{f.title}</h4>
                  <p className="text-muted-foreground">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
