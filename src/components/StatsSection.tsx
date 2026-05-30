const StatsSection = () => {
  return (
    <section className="bg-gold-gradient px-8 md:px-20 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-lg font-medium text-accent-foreground">
          Trusted by over 10,000+ <br className="hidden md:block" />
          clients worldwide since 2018.
        </p>

        <div className="text-center">
          <h2 className="text-4xl font-bold text-accent-foreground">4.6</h2>
          <p className="text-gold-glow">★★★★★</p>
          <span className="text-sm text-accent-foreground/70">3,500 ratings</span>
        </div>

        <div className="text-center">
          <h2 className="text-4xl font-bold text-accent-foreground">2M</h2>
          <span className="text-sm text-accent-foreground/70">Worldwide users per year</span>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
