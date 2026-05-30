import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Bug } from "lucide-react";
import logo from "@/assets/icon.jpg";
import bgImage from "@/assets/background.png";

const faqs = [
  {
    q: "What is SmartBug Tracker?",
    a: "SmartBug Tracker is an intelligent bug management system that helps you report, track, and resolve software defects efficiently. It features resolution linking, persistent reminders, and analytics to keep your projects on track.",
  },
  {
    q: "How does bug tracking work?",
    a: "Simply sign up, log in, and start reporting bugs with title, description, priority, and tags. You can then track their status, link resolutions, and set reminders for follow-up — all from your dashboard.",
  },
  {
    q: "What is Resolution Linking?",
    a: "Resolution Linking connects each bug to its fix details — including a description of what was done and technical notes. This creates a history of how issues were resolved, making future debugging faster.",
  },
  {
    q: "How do Persistent Reminders work?",
    a: "You can set reminders on any bug with a specific date/time and message. When a reminder is due, you'll see an in-app notification with a pulse indicator. Reminders persist until you dismiss them.",
  },
  {
    q: "What priority levels are available?",
    a: "Bugs can be classified as Low, Medium, High, or Critical priority. Each level is color-coded for quick visual identification on your dashboard.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. All data is stored securely with row-level security policies, meaning only you can access your own bugs, resolutions, and reminders.",
  },
  {
    q: "Can I view analytics on my bugs?",
    a: "Yes! The dashboard includes an analytics panel showing total bugs, resolution rate, priority breakdown, and status distribution to help you understand your defect management performance.",
  },
  {
    q: "How can I contact support?",
    a: "You can reach us through the Contact Us section on the home page. We aim to respond within 24 hours.",
  },
];

const HelpPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <nav className="flex items-center justify-between px-6 md:px-10 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="SmartBug Tracker" className="w-12 h-12 rounded-xl" />
          <span className="font-display text-lg font-bold text-foreground hidden sm:inline">SmartBug Tracker</span>
        </Link>
        <ul className="hidden md:flex items-center gap-8">
          {["Home", "About Us", "Contact Us", "Help"].map((item) => (
            <li key={item}>
              <Link
                to={item === "Home" ? "/" : item === "Help" ? "/help" : `/#${item === "About Us" ? "why" : "contact"}`}
                className="font-medium text-foreground/90 hover:text-foreground transition-colors"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="/auth"
          className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full font-medium text-sm hover:bg-foreground/80 transition-colors"
        >
          <Bug size={16} />
          Get Started
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold font-display text-center mb-4">
          How can we <span className="text-gradient-gold">help you?</span>
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          Find answers to the most common questions about SmartBug Tracker.
        </p>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-medium text-foreground">{faq.q}</span>
                <ChevronDown
                  size={20}
                  className={`text-muted-foreground transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5 text-muted-foreground animate-fade-in-up">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HelpPage;
