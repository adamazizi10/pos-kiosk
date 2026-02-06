import { useState } from 'react';
import appConfig from '../../../../app.config.js';

const CartSpecialInstructions = () => {
  const { cart } = appConfig.mockData.kiosk;
  const [instructions, setInstructions] = useState('');

  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      <textarea
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        placeholder={cart.specialInstructionsPlaceholder}
        className="w-full h-24 bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none text-base"
      />
    </div>
  );
};

export default CartSpecialInstructions;
