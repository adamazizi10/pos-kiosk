import appConfig from '../../../app.config.js';

const KioskHeader = () => {
  const { store } = appConfig;
  const { header } = appConfig.mockData.kiosk;

  return (
    <header className="flex items-center justify-center px-8 py-6 bg-background border-b border-border">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xl">{header.logoLetter}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{store.name}</h1>
          <p className="text-sm text-muted-foreground">{store.tagline}</p>
        </div>
      </div>
    </header>
  );
};

export default KioskHeader;
