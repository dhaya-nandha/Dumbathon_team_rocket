import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BiddingSection from '../components/BiddingSection';
import BuyingSection from '../components/BuyingSection';
import SellingSection from '../components/SellingSection';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('bidding');
  const [user, setUser] = useState({ balance: 0, inventory: [] });
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/user');
      const data = await res.json();
      setUser(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUser();
    const i = setInterval(fetchUser, 3000);
    return () => clearInterval(i);
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-night text-radium-yellow p-2 md:p-4 flex flex-col items-center text-xs relative">

      {/* Header */}
      <header className="w-full max-w-7xl flex justify-between items-center bg-bunker/70 border border-pus-green/30 border-b-2 border-b-pus-green p-3 rounded-t-xl mb-2 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-pus-green text-lg">☣</span>
          <div>
            <h1 className="text-lg md:text-xl font-black text-white tracking-widest italic -skew-x-3">
              NEURO-<span className="text-pus-green text-glow-radium">TOXIN</span>
            </h1>
            <p className="text-zombie-skin tracking-widest uppercase text-[8px]">Trading Hub // Sector 7</p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="bg-night/80 border border-pus-green/30 px-3 py-1 rounded-lg">
            <p className="text-[8px] uppercase text-pus-green tracking-widest">Bio-Credits</p>
            <p className="text-sm font-mono font-black text-white">{user.balance.toLocaleString()} ☣</p>
          </div>
          <button onClick={handleLogout} className="bg-blood-red/80 hover:bg-blood-red text-white text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded transition-colors">
            Logout
          </button>
        </div>
      </header>

      {/* Tab Nav */}
      <nav className="w-full max-w-7xl flex gap-1 mb-2 bg-bunker/30 p-1 rounded-lg border border-white/5">
        {[
          { key: 'bidding', label: 'BID/BUY (AB-1)', color: 'pus-green' },
          { key: 'buying', label: 'MARKET (AB-1)', color: 'radium-yellow' },
          { key: 'selling', label: 'SELL (AB-2)', color: 'blood-red' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.key
                ? `bg-${tab.color} text-night shadow-${tab.color === 'pus-green' ? 'pus' : tab.color === 'blood-red' ? 'blood' : 'radium'}`
                : `text-${tab.color}/60 hover:bg-${tab.color}/10`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Active Section */}
      <main className="w-full max-w-7xl">
        {activeTab === 'bidding' && <BiddingSection refreshUser={fetchUser} balance={user.balance} />}
        {activeTab === 'buying' && <BuyingSection refreshUser={fetchUser} balance={user.balance} />}
        {activeTab === 'selling' && <SellingSection refreshUser={fetchUser} inventory={user.inventory} />}
      </main>
    </div>
  );
}
