import { useNavigate } from 'react-router-dom';
import { Monitor, TabletSmartphone } from 'lucide-react';
import SharedHeader from '@/components/SharedHeader';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SharedHeader />
      
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="flex gap-10">
          <button 
            onClick={() => navigate('/kiosk')}
            className="flex flex-col items-center gap-8 p-16 bg-background rounded-3xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 group min-w-[320px]"
          >
            <div className="w-28 h-28 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <TabletSmartphone size={56} className="text-foreground" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl font-semibold text-foreground">Kiosk</span>
              <span className="text-xl text-muted-foreground">self-serve</span>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/pos')}
            className="flex flex-col items-center gap-8 p-16 bg-background rounded-3xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 group min-w-[320px]"
          >
            <div className="w-28 h-28 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Monitor size={56} className="text-foreground" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl font-semibold text-foreground">POS</span>
              <span className="text-xl text-muted-foreground">cashier-serve</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
