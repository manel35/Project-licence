import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What is SmartBug Tracker?",
    a: "SmartBug Tracker is an intelligent bug management system that helps you report, track, and resolve software defects efficiently. It features resolution linking, persistent reminders, and analytics.",
  },
  {
    q: "How does bug tracking work?",
    a: "Simply sign up, log in, and start reporting bugs with title, description, priority, and tags. You can track their status, link resolutions, and set reminders — all from your dashboard.",
  },
  {
    q: "What is Resolution Linking?",
    a: "Resolution Linking connects each bug to its fix details — including a description and technical notes. This creates a history of how issues were resolved, making future debugging faster.",
  },
  {
    q: "How do Persistent Reminders work?",
    a: "You can set reminders on any bug with a specific date/time and message. When a reminder is due, you'll see an in-app notification. Reminders persist until you dismiss them.",
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
    a: "Yes! The dashboard includes an analytics panel showing total bugs, resolution rate, priority breakdown, and status distribution.",
  },
  {
    q: "How can I contact support?",
    a: "You can reach us through the Contact Us section below, or email us directly. We aim to respond within 24 hours.",
  },
];

const HelpSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="help" className="py-20 px-6 bg-secondary/30">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-3">
          Frequently Asked <span className="text-gradient-gold">Questions</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Everything you need to know about SmartBug Tracker.
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
                  className={`text-muted-foreground transition-transform shrink-0 ml-4 ${openIndex === i ? "rotate-180" : ""}`}
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
      </div>
    </section>
  );
};

export default HelpSection;
