import { CreditCard, Smartphone, Gift } from 'lucide-react';
import appConfig from '../../../../../app.config.js';

const iconMap = {
  creditCard: CreditCard,
  smartphone: Smartphone,
  gift: Gift,
};

const PaymentMethodSelector = ({ selectedMethod, onMethodSelect }) => {
  const { payment } = appConfig.mockData.kiosk;
  const enabledMethods = payment.methods.filter((m) => m.enabled);

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        {payment.methodsTitle}
      </h2>

      <div className="grid grid-cols-1 gap-3">
        {enabledMethods.map((method) => {
          const Icon = iconMap[method.icon];
          const isSelected = selectedMethod === method.id;

          return (
            <button
              key={method.id}
              onClick={() => onMethodSelect(method.id)}
              className={`
                flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left
                ${isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-background hover:border-primary/50 hover:bg-muted'
                }
              `}
            >
              <div
                className={`
                  w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0
                  ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                `}
              >
                {Icon && <Icon className="h-7 w-7" />}
              </div>
              <div>
                <span className={`block font-semibold text-lg ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {method.label}
                </span>
                <span className="text-sm text-muted-foreground">
                  {method.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
