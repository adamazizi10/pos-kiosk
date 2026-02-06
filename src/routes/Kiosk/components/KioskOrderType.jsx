import { UtensilsCrossed, ShoppingBag } from 'lucide-react';
import appConfig from '../../../app.config.js';

const iconMap = {
  utensils: UtensilsCrossed,
  bag: ShoppingBag,
};

const KioskOrderType = () => {
  const { orderTypes } = appConfig.mockData.kiosk;

  return (
    <section className="px-8 py-12 bg-muted/30">
      <h3 className="text-center text-lg font-medium text-muted-foreground mb-8">
        {orderTypes.prompt}
      </h3>
      
      <div className="flex justify-center gap-6 max-w-2xl mx-auto">
        {orderTypes.options.map((option) => {
          const Icon = iconMap[option.icon] || UtensilsCrossed;
          return (
            <button
              key={option.id}
              className="flex-1 flex flex-col items-center gap-4 p-8 bg-background rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
            >
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Icon size={36} className="text-foreground" />
              </div>
              <div className="text-center">
                <span className="block text-xl font-semibold text-foreground">{option.label}</span>
                <span className="text-sm text-muted-foreground">{option.subtitle}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default KioskOrderType;
