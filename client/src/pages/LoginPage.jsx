import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaptcha } from '../context/CaptchaContext';

export default function LoginPage() {
  const [regNo, setRegNo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { triggerCaptcha } = useCaptcha();

  const formatRegex = /^[a-z0-9]{6,12}$/i;

  const handleLogin = (e) => {
    e.preventDefault();
    if (!formatRegex.test(regNo)) {
      setError('Invalid hash. Use 6-12 alphanumeric chars (e.g. 24bca7807)');
      return;
    }
    // 2-arg call (legacy) — works with the updated CaptchaContext
    triggerCaptcha('Login Authorization', () => {
      navigate('/dashboard');
    });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 bg-night">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fungus-purple/30 via-night to-blood-red/10 opacity-60"></div>
      </div>

      <div className="relative z-10 w-full max-w-xs bg-black/70 border border-pus-green/40 rounded-lg p-6 backdrop-blur-xl shadow-pus">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-pus-green/20 border-2 border-pus-green flex items-center justify-center shadow-pus">
            <span className="text-2xl">☣</span>
          </div>
        </div>

        <h2 className="text-sm font-black text-center text-white mb-4 tracking-[0.3em] uppercase">
          Enter Hash
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="e.g. 24bca7807"
            value={regNo}
            onChange={(e) => { setRegNo(e.target.value); setError(''); }}
            className="w-full bg-transparent border-b border-pus-green/40 text-pus-green px-2 py-2 text-center text-lg font-mono focus:outline-none focus:border-pus-green transition-colors tracking-widest uppercase"
          />
          {error && (
            <p className="text-blood-red font-bold text-[10px] text-center animate-pulse uppercase">{error}</p>
          )}
          <button
            type="submit"
            className="mt-3 bg-pus-green text-black font-black text-sm py-2 hover:bg-white transition-all uppercase tracking-[0.2em] shadow-pus"
          >
            Inject
          </button>
        </form>
      </div>
    </div>
  );
}
