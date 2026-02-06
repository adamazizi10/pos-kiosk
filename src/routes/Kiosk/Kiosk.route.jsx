import KioskHeader from './components/KioskHeader';
import KioskWelcome from './components/KioskWelcome';

const KioskRoute = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <KioskHeader />
      
      <main className="flex-1 flex flex-col items-center justify-center">
        <KioskWelcome />
      </main>
    </div>
  );
};

export default KioskRoute;
