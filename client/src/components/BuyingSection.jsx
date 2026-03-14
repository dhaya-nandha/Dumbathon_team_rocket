import { useState, useEffect } from 'react';
import { useCaptcha } from '../context/CaptchaContext';
import SuccessModal from './SuccessModal';

export default function BuyingSection({ refreshUser, balance }) {
  const [marketplace, setMarketplace] = useState([]);
  const [successState, setSuccessState] = useState(null);
  const { triggerCaptcha } = useCaptcha();

  const fetchMarketplace = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/marketplace');
      setMarketplace(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchMarketplace();
    const interval = setInterval(fetchMarketplace, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBuy = (item) => {
    if (balance < item.basePrice) { alert("Insufficient Bio-Credits!"); return; }
    triggerCaptcha(`Purchase ${item.name}`, item, async () => {
      try {
        const res = await fetch('http://localhost:4000/api/buy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ itemId: item.id, price: item.basePrice }) });
        const data = await res.json();
        if (res.ok) {
          setSuccessState({ message: "Trade Done", subMessage: `Acquired ${item.name}` });
          refreshUser();
          fetchMarketplace();
        } else { alert(data.error || "Failed"); }
      } catch (e) { console.error(e); }
    });
  };

  return (
    <>
    {successState && <SuccessModal message={successState.message} subMessage={successState.subMessage} onClose={() => setSuccessState(null)} />}
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 border-b border-pus-green/30 pb-2">
        <div>
          <h2 className="text-lg font-black text-pus-green uppercase tracking-widest">Market — Fixed Price</h2>
          <p className="text-zombie-skin text-[10px] font-mono tracking-wider">Standard salvage for immediate extraction.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {marketplace.slice(0, 20).map(item => (
          <div key={item.id} className="group bg-bunker/70 border border-pus-green/20 rounded-lg overflow-hidden hover:border-pus-green/50 transition-all text-xs">
            <div className="h-24 w-full relative bg-night">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity mix-blend-luminosity" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-bunker to-transparent"></div>
            </div>
            <div className="p-2">
              <h4 className="font-bold text-white text-[11px] leading-tight uppercase truncate">{item.name}</h4>
              <p className="text-[8px] text-zombie-skin uppercase mt-0.5">{item.category}</p>
              <div className="flex justify-between items-center mt-2 pt-1 border-t border-pus-green/10">
                <span className="font-mono text-radium-yellow text-[11px] font-bold">{item.basePrice.toLocaleString()}☣</span>
                <button onClick={() => handleBuy(item)}
                  className="bg-pus-green/80 hover:bg-pus-green text-night text-[9px] font-bold py-0.5 px-2 rounded transition-colors uppercase">
                  Buy
                </button>
              </div>
            </div>
          </div>
        ))}
        {marketplace.length === 0 && <p className="col-span-full py-8 text-center text-zombie-skin text-sm">Market empty.</p>}
      </div>
    </div>
    </>
  );
}
