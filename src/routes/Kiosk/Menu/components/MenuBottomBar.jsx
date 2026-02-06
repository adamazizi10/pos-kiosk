import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useKioskCart from '@/context/useKioskCart';

const MenuBottomBar = () => {
  const { itemCount } = useKioskCart();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={() => {
          if (itemCount > 0) navigate('/kiosk/checkout');
        }}
        className="py-6 px-10 rounded-2xl bg-primary text-primary-foreground font-bold text-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-4 shadow-xl min-h-[80px]"
      >
        <ShoppingCart size={28} />
        <span>Checkout</span>
        {itemCount > 0 && (
          <span className="w-8 h-8 rounded-full bg-destructive text-destructive-foreground text-base font-bold flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default MenuBottomBar;
