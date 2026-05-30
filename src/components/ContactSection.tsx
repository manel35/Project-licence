import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import contactImg from "@/assets/contact-illustration.png";

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const { error } = await supabase.from("contact_messages" as any).insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      } as any);
      if (error) throw error;
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="px-8 md:px-20 py-24">
      <div className="flex flex-col md:flex-row items-center gap-16 md:gap-20">
        <div className="flex-1 min-w-[300px] animate-fade-in-left" style={{ animationDelay: "0.2s", opacity: 0 }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-5">Contact Us</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Have questions or feedback? Reach out and we'll respond as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 placeholder:italic focus:outline-none focus:border-accent focus:shadow-gold transition-all"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 placeholder:italic focus:outline-none focus:border-accent focus:shadow-gold transition-all"
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 placeholder:italic focus:outline-none focus:border-accent focus:shadow-gold transition-all resize-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="self-start bg-gold-gradient px-7 py-3.5 rounded-full font-medium text-accent-foreground hover:-translate-y-0.5 hover:shadow-gold transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        <div className="flex-1 min-w-[300px] flex justify-center animate-fade-in-right" style={{ animationDelay: "0.3s", opacity: 0 }}>
          <img src={contactImg} alt="Contact us" className="w-full max-w-[400px]" />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
