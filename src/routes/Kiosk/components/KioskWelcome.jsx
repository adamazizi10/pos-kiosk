import { UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useKioskCart from '@/context/useKioskCart';

const KioskWelcome = () => {
  const navigate = useNavigate();
  const { setOrderType } = useKioskCart();

  const handleSelectOrderType = (type) => {
    setOrderType(type);
    navigate('/kiosk/menu');
  };

  return (
    <section className="flex flex-col items-center justify-center text-center px-8 py-16">
      <h1 className="text-7xl font-bold text-foreground mb-6 tracking-tight">
        Welcome!
      </h1>
      <p className="text-3xl text-muted-foreground mb-16">
        How would you like your order?
      </p>
      
      <div className="flex gap-10">
        <button
          onClick={() => handleSelectOrderType("DINE_IN")}
          className="flex flex-col items-center gap-8 p-16 bg-background rounded-3xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 group min-w-[320px]"
        >
          <div className="w-28 h-28 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <UtensilsCrossed size={56} className="text-foreground" />
          </div>
          <span className="text-4xl font-semibold text-foreground">Dine In</span>
        </button>
        
        <button
          onClick={() => handleSelectOrderType("TAKEOUT")}
          className="flex flex-col items-center gap-8 p-16 bg-background rounded-3xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 group min-w-[320px]"
        >
          <div className="w-28 h-28 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <ShoppingBag size={56} className="text-foreground" />
          </div>
          <span className="text-4xl font-semibold text-foreground">Takeout</span>
        </button>
      </div>
    </section>
  );
};

export default KioskWelcome;
