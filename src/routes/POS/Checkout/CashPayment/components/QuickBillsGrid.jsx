const billTones = {
  bill5: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
  bill10: "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200",
  bill20: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
  bill50: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
  bill100: "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200",
};

const QuickBillsGrid = ({ bills, onBillSelect, onExact, exactLabel }) => {
  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-3">
      {/* Row 1: $5 (cols 1-2), $10 (cols 3-4) */}
      <button
        onClick={() => onBillSelect(bills[0].value)}
        className={`col-span-2 h-[100px] rounded-lg border font-bold text-2xl transition-colors ${billTones[bills[0].tone]}`}
      >
        {bills[0].label}
      </button>
      <button
        onClick={() => onBillSelect(bills[1].value)}
        className={`col-span-2 h-[100px] rounded-lg border font-bold text-2xl transition-colors ${billTones[bills[1].tone]}`}
      >
        {bills[1].label}
      </button>

      {/* Row 2: $20 (cols 1-2), $50 (cols 3-4) */}
      <button
        onClick={() => onBillSelect(bills[2].value)}
        className={`col-span-2 h-[100px] rounded-lg border font-bold text-2xl transition-colors ${billTones[bills[2].tone]}`}
      >
        {bills[2].label}
      </button>
      <button
        onClick={() => onBillSelect(bills[3].value)}
        className={`col-span-2 h-[100px] rounded-lg border font-bold text-2xl transition-colors ${billTones[bills[3].tone]}`}
      >
        {bills[3].label}
      </button>

      {/* Row 3: $100 (cols 1-2), Exact (cols 3-4) */}
      <button
        onClick={() => onBillSelect(bills[4].value)}
        className={`col-span-2 h-[100px] rounded-lg border font-bold text-2xl transition-colors ${billTones[bills[4].tone]}`}
      >
        {bills[4].label}
      </button>
      <button
        onClick={onExact}
        className="col-span-2 h-[100px] rounded-lg bg-muted text-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-bold text-2xl border border-border"
      >
        {exactLabel}
      </button>
    </div>
  );
};

export default QuickBillsGrid;
