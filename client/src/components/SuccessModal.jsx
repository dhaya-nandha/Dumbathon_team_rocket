import { useEffect } from 'react';

export default function SuccessModal({ message, subMessage, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-bunker border-4 border-pus-green rounded-xl p-6 text-center shadow-[0_0_40px_rgba(163,230,53,0.6)]">
        <div className="mb-4 w-16 h-16 mx-auto bg-night border-2 border-pus-green rounded-full flex items-center justify-center shadow-pus">
          <span className="text-3xl animate-bounce">✔</span>
        </div>
        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">{message}</h2>
        {subMessage && <p className="text-sm text-pus-green font-mono uppercase tracking-wider">{subMessage}</p>}
        <button onClick={onClose} className="mt-4 bg-pus-green text-night font-bold text-xs py-2 w-full rounded uppercase tracking-widest hover:bg-white transition-all">
          OK
        </button>
      </div>
    </div>
  );
}
