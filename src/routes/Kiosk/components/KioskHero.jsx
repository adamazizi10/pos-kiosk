import { ArrowRight } from 'lucide-react';
import appConfig from '../../../app.config.js';

const KioskHero = () => {
  const { hero } = appConfig.mockData.kiosk;

  return (
    <section className="flex flex-col items-center justify-center text-center px-8 py-16">
      <div className="mb-8">
        <h2 className="text-5xl font-bold text-foreground mb-4 tracking-tight">
          {hero.title}
        </h2>
        <p className="text-xl text-muted-foreground max-w-md">
          {hero.subtitle}
        </p>
      </div>
      
      <button className="group flex items-center gap-4 bg-primary hover:bg-primary/90 text-primary-foreground px-16 py-8 rounded-2xl text-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
        <span>{hero.ctaButton}</span>
        <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform" />
      </button>
      
      <p className="mt-6 text-muted-foreground text-sm">
        {hero.ctaSubtext}
      </p>
    </section>
  );
};

export default KioskHero;
