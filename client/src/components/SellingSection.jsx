import { useState } from 'react';
import { useCaptcha } from '../context/CaptchaContext';
import SuccessModal from './SuccessModal';

export default function SellingSection({ refreshUser, inventory }) {
  const [category, setCategory] = useState('Food');
  const [quantity, setQuantity] = useState(1);
  const [successState, setSuccessState] = useState(null);
  const { triggerCaptcha } = useCaptcha();

  const handleSell = (e) => {
    e.preventDefault();
    if (quantity <= 0) return;
    triggerCaptcha(`Sell ${quantity}x ${category}`, { name: 'Sell', category }, async () => {
      try {
        const res = await fetch('http://localhost:4000/api/sell', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category, quantity: parseInt(quantity) }) });
        const data = await res.json();
        if (res.ok) {
          setSuccessState({ message: "Funds Deposited", subMessage: data.message });
          refreshUser();
          setQuantity(1);
        } else { alert(data.error || "Failed"); }
      } catch (e) { console.error(e); }
    });
  };

  return (
    <>
    {successState && <SuccessModal message={successState.message} subMessage={successState.subMessage} onClose={() => setSuccessState(null)} />}
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">

      {/* Sell Form */}
      <div className="bg-bunker/70 border border-blood-red/40 rounded-lg p-4">
        <h2 className="text-sm font-black text-blood-red uppercase tracking-widest mb-1">Merchant Portal</h2>
        <p className="text-[9px] text-zombie-skin mb-4">Offload scavenged materials for Bio-Credits.</p>
        <form onSubmit={handleSell} className="flex flex-col gap-3">
          <div>
            <label className="block text-radium-yellow font-bold uppercase text-[9px] tracking-widest mb-1">Resource</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full bg-night border border-blood-red/30 text-white p-2 rounded text-xs focus:outline-none">
              <option value="Food">Food (Raw / Irradiated)</option>
              <option value="Gear">Gear (Scrap / Tools)</option>
              <option value="Cloth">Cloth (Rags / Hazmat)</option>
              <option value="Medicine">Medicine (Stims)</option>
            </select>
          </div>
          <div>
            <label className="block text-radium-yellow font-bold uppercase text-[9px] tracking-widest mb-1">Quantity</label>
            <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)}
              className="w-full bg-night border border-blood-red/30 text-white p-2 rounded font-mono text-sm focus:outline-none" />
          </div>
          <div className="bg-night/40 p-2 rounded border border-blood-red/20">
            <p className="text-[8px] uppercase text-zombie-skin">Estimated Payout</p>
            <p className="text-sm font-mono text-radium-yellow">~ {category === 'Food' ? 15*quantity : category==='Gear' ? 45*quantity : category==='Cloth' ? 20*quantity : 60*quantity} ☣</p>
          </div>
          <button type="submit" className="bg-blood-red hover:bg-red-600 text-white font-bold text-xs py-2 rounded uppercase tracking-widest transition-colors shadow-blood">
            Confirm Sale
          </button>
        </form>
      </div>

      {/* Inventory */}
      <div className="lg:col-span-2 bg-night/50 border border-white/5 rounded-lg p-4">
        <h2 className="text-sm font-black text-white uppercase tracking-widest mb-3">Vault</h2>
        {inventory.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center border border-dashed border-zombie-skin/20 rounded opacity-40">
            <span className="text-2xl mb-1">🕸️</span>
            <p className="uppercase tracking-widest text-[9px] font-bold text-zombie-skin">Empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {inventory.map((item, idx) => (
              <div key={idx} className="bg-bunker border border-white/5 rounded-lg p-2 text-xs">
                <span className={`text-[8px] uppercase font-bold px-1 rounded ${item.rarity === 'Zombie' ? 'bg-radium-yellow text-night' : item.rarity === 'Ultra Rare' ? 'bg-pus-green text-night' : item.rarity === 'Rare' ? 'bg-blood-red text-white' : 'bg-zombie-skin text-white'}`}>{item.rarity}</span>
                <h4 className="font-bold text-white text-[10px] mt-1 truncate">{item.name}</h4>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-[8px] text-zombie-skin uppercase">{item.category}</p>
                  <span className="text-[9px] font-bold bg-white/10 px-1 rounded text-white">x{item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
