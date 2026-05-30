const Footer = () => {
  return (
    <footer className="w-full bg-background/50 backdrop-blur-sm py-8 border-t border-border">
      <div className="flex flex-col items-center gap-5">
        <div className="flex gap-6">
          {[
            { icon: "facebook", url: "https://facebook.com" },
            { icon: "instagram", url: "https://instagram.com" },
            { icon: "twitter", url: "https://twitter.com" },
            { icon: "linkedin", url: "https://linkedin.com" },
          ].map((s) => (
            <a
              key={s.icon}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-accent transition-colors text-xl"
              aria-label={s.icon}
            >
              <SocialIcon name={s.icon} />
            </a>
          ))}
        </div>

        <ul className="flex gap-6">
          {["Home", "About Us", "Contact Us", "Help"].map((item) => (
            <li key={item}>
              <a
                href={item === "Home" ? "#" : item === "About Us" ? "#why" : item === "Contact Us" ? "#contact" : "#help"}
                className="text-foreground/70 hover:text-foreground font-medium transition-colors"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <p className="text-sm text-muted-foreground">© 2026 tracker.com</p>
      </div>
    </footer>
  );
};

const SocialIcon = ({ name }: { name: string }) => {
  const paths: Record<string, JSX.Element> = {
    facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
    instagram: <><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></>,
    twitter: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></>,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

export default Footer;
