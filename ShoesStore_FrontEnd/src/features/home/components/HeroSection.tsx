const HeroSection = () => {
  return (
    <section className="relative w-full h-250 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEhkU2NrhlKC9g_kMLV-oaB3XPXyyYQ2dUeN2-bj0Ghj7LoBaPzpwzlhqIsGsCX58ztqShHNKDS3v6vgHKvPE2xDoGVYnmYQzmeWXO3IWwwgHG-t_ccIJqMMRBs7hwG8JkFuR-s1HHQT9CbBXcNN4y2g_q-pM8qd0wHlZZ8Bjg5JsBL3_GfWAvsSegqqQaan96qm2TkLQwo5PXVQ9oxr1qGXxZoifBl7mOfFhYLzM5H3r5DoLZaTHLAXiTnIfD2cEg6X5CUoeBgkk"
          alt="Hero Banner"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/10 to-transparent"></div>
      <div className="relative mx-auto h-full flex items-center px-5 lg:px-30">
        <div className="max-w-2xl text-white">
          <span className="bg-primary dark:bg-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            New Season Collections
          </span>
          <h1 className="text-6xl lg:text-8xl font-black">
            STEP INTO <span className="text-primary">STYLE.</span>
          </h1>
          <p className="text-xl text-white/80 mb-10 max-w-md">
            Experience the perfect blend of performance and street style with
            our latest high-performance sneakers.
          </p>
          <div className="flex gap-4">
            <button className="bg-primary hover:bg-primary/90 text-white dark:text-primary-foreground font-bold px-8 py-4 rounded-xl transition-all flex items-center gap-2">
              Shop Now
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold px-8 py-4 rounded-xl transition-all">
              View Lookbook
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
