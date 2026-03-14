import { useState, useEffect } from 'react';
import { useCaptcha } from '../context/CaptchaContext';
import SuccessModal from './SuccessModal';

export default function BiddingSection({ refreshUser, balance }) {
  const [auctions, setAuctions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [lastBid, setLastBid] = useState(null);
  const [successState, setSuccessState] = useState(null);
  const { triggerCaptcha } = useCaptcha();

  const fetchAuctions = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/auctions');
      const data = await res.json();
      setAuctions(data);
      setCurrentIndex(0);
      setTimeLeft(60);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchAuctions(); }, []);

  // Timer + simulated bids
  useEffect(() => {
    if (auctions.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (currentIndex < auctions.length - 1) {
            setCurrentIndex(i => i + 1);
            setLastBid(null);
            return 60;
          } else {
            fetch('http://localhost:4000/api/refresh-auctions', { method: 'POST' }).then(() => fetchAuctions());
            return 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    const simBid = setInterval(() => {
      if (Math.random() > 0.4) {
        const item = auctions[currentIndex];
        if (!item) return;
        const inc = Math.floor(Math.random() * 3000) + 500;
        setAuctions(prev => {
          const copy = [...prev];
          if (copy[currentIndex]) copy[currentIndex] = { ...copy[currentIndex], basePrice: copy[currentIndex].basePrice + inc };
          return copy;
        });
        setLastBid(inc);
        fetch('http://localhost:4000/api/bid', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ itemId: item.id, increaseAmount: inc }) }).catch(() => {});
      }
    }, 3000 + Math.random() * 3000);

    return () => { clearInterval(timer); clearInterval(simBid); };
  }, [auctions, currentIndex]);

  const handleBid = (item) => {
    const inc = Math.floor(Math.random() * 3000) + 500;
    triggerCaptcha(`Bid +${inc}☣`, item, async () => {
      try {
        const res = await fetch('http://localhost:4000/api/bid', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ itemId: item.id, increaseAmount: inc }) });
        if (res.ok) {
          setLastBid(inc);
          setAuctions(prev => {
            const copy = [...prev];
            if (copy[currentIndex]) copy[currentIndex] = { ...copy[currentIndex], basePrice: copy[currentIndex].basePrice + inc };
            return copy;
          });
        }
      } catch (e) { console.error(e); }
    });
  };

  const handleBuy = (item) => {
    if (balance < item.basePrice) { alert("Insufficient Bio-Credits!"); return; }
    triggerCaptcha(`Buy ${item.name}`, item, async () => {
      try {
        const res = await fetch('http://localhost:4000/api/buy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ itemId: item.id, price: item.basePrice }) });
        const data = await res.json();
        if (res.ok) {
          setSuccessState({ message: "Asset Secured", subMessage: `${item.name} for ${item.basePrice}☣` });
          refreshUser();
          if (currentIndex < auctions.length - 1) { setCurrentIndex(i => i + 1); setTimeLeft(60); }
          else { fetch('http://localhost:4000/api/refresh-auctions', { method: 'POST' }).then(() => fetchAuctions()); }
        } else { alert(data.error || "Failed"); }
      } catch (e) { console.error(e); }
    });
  };

  const rarityClass = (r) => {
    switch(r) {
      case 'Zombie': return 'border-radium-yellow shadow-radium text-radium-yellow';
      case 'Ultra Rare': return 'border-pus-green shadow-pus text-pus-green';
      case 'Rare': return 'border-blood-red shadow-blood text-blood-red';
      default: return 'border-zombie-skin text-zombie-skin';
    }
  };

  const item = auctions[currentIndex];

  return (
    <>
    {successState && <SuccessModal message={successState.message} subMessage={successState.subMessage} onClose={() => setSuccessState(null)} />}
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-pus-green/30 pb-2">
        <div>
          <h2 className="text-lg font-black text-radium-yellow uppercase tracking-widest text-glow-radium">Live Bidding</h2>
          <p className="text-zombie-skin text-[10px] font-mono tracking-wider">One asset. 60 seconds. Highest bid wins.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-blood-red text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse">LIVE</span>
          <span className="font-mono text-sm text-radium-yellow bg-night px-3 py-1 rounded border border-pus-green/40">{timeLeft}s</span>
        </div>
      </div>

      {item ? (
        <div className={`bg-bunker/80 border-2 rounded-xl overflow-hidden ${rarityClass(item.rarity)} flex flex-col md:flex-row`}>
          {/* Image */}
          <div className="md:w-72 h-48 md:h-auto relative bg-night flex-shrink-0">
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover opacity-70 mix-blend-luminosity" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bunker/80 md:block hidden"></div>
            <div className="absolute top-2 right-2 bg-night/70 border border-inherit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">{item.rarity}</div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col justify-between gap-3">
            <div>
              <h3 className="text-lg font-black uppercase tracking-wider">{item.name}</h3>
              <p className="text-[10px] opacity-60 uppercase tracking-widest">{item.category} Asset</p>
            </div>

            {lastBid && (
              <div className="text-[10px] text-blood-red font-bold uppercase tracking-widest animate-bounce">
                ⚡ Remote Bid +{lastBid.toLocaleString()}☣
              </div>
            )}

            <div className="bg-night/50 rounded-lg p-3 border border-inherit/10">
              <p className="text-[10px] text-zombie-skin uppercase tracking-widest mb-1">Current Price</p>
              <p className="text-2xl font-mono font-black">{item.basePrice.toLocaleString()} ☣</p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => handleBid(item)}
                className="flex-1 bg-night border border-inherit text-inherit font-bold py-2 rounded text-xs hover:bg-inherit hover:text-night transition-colors uppercase tracking-widest">
                Bid Higher
              </button>
              <button onClick={() => handleBuy(item)}
                className="flex-1 bg-inherit text-night font-bold py-2 rounded text-xs hover:scale-[1.02] transition-all uppercase tracking-widest">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center border-2 border-dashed border-pus-green/20 rounded-xl bg-night/30">
          <p className="text-pus-green text-sm uppercase tracking-widest animate-pulse">Scanning frequencies...</p>
        </div>
      )}
    </div>
    </>
  );
}
