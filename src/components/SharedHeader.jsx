import appConfig from '../app.config.js';

const SharedHeader = () => {
  const { store } = appConfig;
  const { header } = appConfig.mockData.kiosk;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-center px-6 py-4 bg-background border-b border-border">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">{header.logoLetter}</span>
        </div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">{store.name}</h1>
      </div>
    </header>
  );
};

export default SharedHeader;
