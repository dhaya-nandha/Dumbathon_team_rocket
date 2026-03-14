import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getRandomCaptchaType } from '../utils/captchaRandomizer';

const CaptchaContext = createContext();

export const useCaptcha = () => useContext(CaptchaContext);

export const CaptchaProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [actionName, setActionName] = useState('');
  const [onSuccessCb, setOnSuccessCb] = useState(null);
  const [captchaType, setCaptchaType] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [specialMode, setSpecialMode] = useState(null);

  // triggerCaptcha(action, itemOrNull, onSuccess)
  // Also supports legacy 2-arg: triggerCaptcha(action, onSuccess)
  const triggerCaptcha = (action, itemOrCb, onSuccess) => {
    let item = null;
    let cb = onSuccess;
    // Legacy 2-arg support: if second arg is a function, treat as callback
    if (typeof itemOrCb === 'function') {
      cb = itemOrCb;
      item = null;
    } else {
      item = itemOrCb;
    }

    setActionName(action);
    setOnSuccessCb(() => cb);
    setFailCount(0);

    if (item?.name?.includes('Omnitrix')) {
      setSpecialMode('omnitrix');
      setCaptchaType('omnitrix_150');
    } else {
      setSpecialMode(null);
      setCaptchaType(getRandomCaptchaType());
    }
    setIsOpen(true);
  };

  const handleSuccess = () => {
    setIsOpen(false);
    setFailCount(0);
    if (onSuccessCb) onSuccessCb();
  };

  const handleFail = () => {
    const newCount = failCount + 1;
    setFailCount(newCount);

    if (newCount >= 3) {
      // Rickroll on 3+ failures
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
      // Then give them another random captcha
      setTimeout(() => {
        setCaptchaType(getRandomCaptchaType());
      }, 500);
    } else {
      // Just give a new random captcha
      setCaptchaType(getRandomCaptchaType());
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFailCount(0);
  };

  return (
    <CaptchaContext.Provider value={{ triggerCaptcha }}>
      {children}
      {isOpen && (
        <EvilCaptchaModal
          type={captchaType}
          actionName={actionName}
          failCount={failCount}
          onSuccess={handleSuccess}
          onFail={handleFail}
          onClose={handleClose}
          setCaptchaType={setCaptchaType}
        />
      )}
    </CaptchaContext.Provider>
  );
};

function EvilCaptchaModal({ type, actionName, failCount, onSuccess, onFail, onClose, setCaptchaType }) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-bunker border-2 border-blood-red rounded-lg p-5 shadow-blood">
        <button onClick={onClose} className="absolute top-2 right-3 text-zombie-skin hover:text-white text-lg">✕</button>
        <h3 className="text-sm font-black text-blood-red uppercase tracking-widest border-b border-blood-red/30 pb-1 mb-1">
          Security Protocol
        </h3>
        <p className="text-radium-yellow font-mono mb-4 text-xs uppercase tracking-wider">{actionName}</p>
        {failCount > 0 && (
          <p className="text-blood-red text-xs font-bold mb-3 animate-pulse">
            ⚠ FAILED {failCount}x — {failCount >= 3 ? 'RICKROLLED. TRY AGAIN.' : 'Try harder.'}
          </p>
        )}

        {type === 0 && <StandardCaptcha onSuccess={onSuccess} onFail={onFail} />}
        {type === 1 && <SliderCaptcha onSuccess={onSuccess} onFail={onFail} />}
        {type === 2 && <TypeThriceCaptcha onSuccess={onSuccess} onFail={onFail} />}
        {type === 3 && <BackgroundSyncCaptcha onSuccess={onSuccess} onFail={onFail} />}
        {type === 4 && <RickRollCaptcha setCaptchaType={setCaptchaType} />}
        {type === 5 && <ILiedCaptcha setCaptchaType={setCaptchaType} />}
        {type === 6 && <WebsiteBreakerCaptcha onSuccess={onSuccess} />}
        {type === 'omnitrix_150' && <Omnitrix150Captcha onSuccess={onSuccess} onFail={onFail} />}

        <div className="absolute bottom-1 right-2 text-[8px] text-blood-red/20 font-mono">T:{String(type)}</div>
      </div>
    </div>
  );
}

// ---- EXTREME ----

const Omnitrix150Captcha = ({ onSuccess, onFail }) => {
  const code = "ALIEN_DNA_OVERRIDE";
  const [count, setCount] = useState(0);
  const [input, setInput] = useState('');
  const handleCheck = () => {
    if (input === code) {
      const next = count + 1;
      setCount(next);
      setInput('');
      if (next >= 150) onSuccess();
    } else {
      onFail();
      setCount(0);
    }
  };
  return (
    <div className="flex flex-col gap-3 text-center">
      <p className="text-pus-green font-black text-xs tracking-widest animate-pulse">OMNITRIX PROTOCOL</p>
      <p className="text-white text-[10px]">Type below exactly 150 times:</p>
      <div className="bg-night p-2 text-sm font-mono text-radium-yellow border border-pus-green/40 select-none">{code}</div>
      <div className="text-xl font-black font-mono text-blood-red">{count}/150</div>
      <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCheck()}
        className="w-full bg-night border-b-2 border-pus-green text-radium-yellow p-2 text-center text-sm font-mono focus:outline-none" placeholder="Type and Enter..." />
      <button onClick={handleCheck} className="bg-pus-green text-night font-bold text-sm py-2 hover:bg-white transition-colors uppercase tracking-widest">SUBMIT</button>
    </div>
  );
};

const AcousticScreamCaptcha = ({ onSuccess, onFail }) => {
  const [vol, setVol] = useState(0);
  const [connected, setConnected] = useState(false);
  const audioCtx = useRef(null);
  const analyserRef = useRef(null);
  const dataRef = useRef(null);
  const rafRef = useRef(null);
  const ticksRef = useRef(0);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (audioCtx.current) audioCtx.current.close();
  }, []);

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      const src = audioCtx.current.createMediaStreamSource(stream);
      analyserRef.current = audioCtx.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      src.connect(analyserRef.current);
      dataRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      setConnected(true);
      loop();
    } catch { onFail(); }
  };

  const loop = () => {
    if (!analyserRef.current) return;
    analyserRef.current.getByteFrequencyData(dataRef.current);
    let s = 0;
    for (let i = 0; i < dataRef.current.length; i++) s += dataRef.current[i];
    const avg = s / dataRef.current.length;
    setVol(avg);
    if (avg > 120) { ticksRef.current++; if (ticksRef.current > 25) onSuccess(); }
    else ticksRef.current = 0;
    rafRef.current = requestAnimationFrame(loop);
  };

  return (
    <div className="flex flex-col gap-3 text-center">
      <p className="text-blood-red font-black text-xs tracking-widest animate-flicker">ACOUSTIC CONTROL</p>
      <p className="text-white text-[10px]">SCREAM into your microphone to pass.</p>
      {!connected ? (
        <button onClick={startMic} className="bg-blood-red text-white font-bold text-sm py-2 hover:bg-white hover:text-blood-red transition-colors uppercase tracking-widest shadow-blood mt-2">ENABLE MIC</button>
      ) : (
        <div className="flex flex-col items-center gap-2 mt-2">
          <div className="w-full h-6 bg-night border border-blood-red/40 relative overflow-hidden rounded">
            <div className="absolute inset-y-0 left-0 bg-blood-red transition-all duration-75" style={{ width: `${Math.min((vol / 200) * 100, 100)}%` }}></div>
          </div>
          <p className="font-mono text-blood-red text-sm">VOL: {Math.floor(vol)}</p>
        </div>
      )}
    </div>
  );
};

// ---- STANDARD ----

const StandardCaptcha = ({ onSuccess, onFail }) => {
  const code = "ZMB-89X";
  const [input, setInput] = useState('');
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-night p-2 text-center text-lg font-mono tracking-[0.4em] text-radium-yellow line-through decoration-blood-red decoration-2 opacity-80 select-none border border-pus-green/30">{code}</div>
      <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (input === code ? onSuccess() : onFail())}
        className="w-full bg-night border-b border-pus-green text-radium-yellow p-2 text-center text-sm font-mono focus:outline-none" placeholder="Type the code..." />
      <button onClick={() => input === code ? onSuccess() : onFail()} className="bg-pus-green text-night font-bold py-2 text-sm hover:bg-white transition-colors uppercase tracking-widest">VERIFY</button>
    </div>
  );
};

const SliderCaptcha = ({ onSuccess, onFail }) => {
  const [val, setVal] = useState(50);
  return (
    <div className="flex flex-col gap-4">
      <p className="text-radium-yellow text-sm">Slide to the "Danger Zone". Use intuition.</p>
      <input type="range" min="0" max="100" value={val} onChange={e => setVal(Number(e.target.value))} className="w-full accent-blood-red" />
      <button onClick={() => (val > 80 && val < 90) ? onSuccess() : onFail()} className="bg-pus-green text-night font-bold py-2 text-sm hover:bg-white transition-colors uppercase tracking-widest">VERIFY</button>
    </div>
  );
};

const TypeThriceCaptcha = ({ onSuccess, onFail }) => {
  const code = "BRAINS";
  const [i1, setI1] = useState('');
  const [i2, setI2] = useState('');
  const [i3, setI3] = useState('');
  return (
    <div className="flex flex-col gap-2">
      <div className="text-blood-red text-sm font-bold uppercase tracking-widest mb-2">TYPE "{code}" 3 TIMES</div>
      <input type="text" value={i1} onChange={e => setI1(e.target.value)} className="bg-night border-b border-pus-green text-radium-yellow p-2 text-center text-sm font-mono focus:outline-none" />
      <input type="text" value={i2} onChange={e => setI2(e.target.value)} className="bg-night border-b border-pus-green text-radium-yellow p-2 text-center text-sm font-mono focus:outline-none" />
      <input type="text" value={i3} onChange={e => setI3(e.target.value)} className="bg-night border-b border-pus-green text-radium-yellow p-2 text-center text-sm font-mono focus:outline-none" />
      <button onClick={() => (i1===code && i2===code && i3===code) ? onSuccess() : onFail()} className="bg-pus-green text-night font-bold py-2 text-sm mt-2 hover:bg-white transition-colors uppercase tracking-widest">VERIFY</button>
    </div>
  );
};

const BackgroundSyncCaptcha = ({ onSuccess, onFail }) => {
  const code = "FUNGUS";
  const [input, setInput] = useState('');
  return (
    <div className="flex flex-col gap-3 relative">
      <p className="text-zombie-skin text-xs uppercase tracking-widest">Find the hidden word.</p>
      <div className="absolute top-8 right-4 text-2xl font-black select-none z-0 rotate-6" style={{color: '#151d2e', textShadow: '0 0 2px rgba(163,230,53,0.08)'}}>{code}</div>
      <input type="text" value={input} onChange={e => setInput(e.target.value)} className="w-full bg-night border-b border-pus-green text-radium-yellow p-2 text-center text-sm focus:outline-none relative z-10" placeholder="Sequence..." />
      <button onClick={() => input === code ? onSuccess() : onFail()} className="bg-pus-green text-night font-bold py-2 text-sm relative z-10 hover:bg-white transition-colors uppercase tracking-widest">VERIFY</button>
    </div>
  );
};

const RickRollCaptcha = ({ setCaptchaType }) => {
  return (
    <div className="flex flex-col gap-4 text-center">
      <p className="text-radium-yellow text-sm font-black uppercase tracking-widest">Priority Verification!</p>
      <p className="text-[10px] text-white/60">Click to verify via external security feed.</p>
      <button onClick={() => {
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        setTimeout(() => setCaptchaType(getRandomCaptchaType()), 1500);
      }} className="bg-blood-red text-white py-3 font-bold text-sm rounded hover:bg-white hover:text-blood-red transition-colors animate-pulse uppercase tracking-widest shadow-blood">
        OPEN SECURITY FEED
      </button>
    </div>
  );
};

const ILiedCaptcha = ({ setCaptchaType }) => {
  const [clicked, setClicked] = useState(false);
  return (
    <div className="flex flex-col gap-4 text-center min-h-[120px] justify-center">
      {!clicked ? (
        <>
          <div className="bg-night/50 p-3 text-xl font-black tracking-widest text-radium-yellow select-none border border-pus-green/30">EASY-PASS</div>
          <button onClick={() => setClicked(true)} className="bg-pus-green text-night font-black text-sm py-2 hover:bg-white transition-colors uppercase tracking-widest">CLICK 2 PASS</button>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-blood-red font-black text-2xl mb-2 italic">I LIED.</h2>
          <button onClick={() => setCaptchaType(getRandomCaptchaType())} className="bg-night border border-blood-red text-white py-2 px-6 text-xs uppercase font-bold tracking-widest hover:bg-blood-red transition-all mt-2">PUNISH ME MORE</button>
        </div>
      )}
    </div>
  );
};

const WebsiteBreakerCaptcha = ({ onSuccess }) => {
  const [pos, setPos] = useState({ top: 50, left: 50 });
  return (
    <div className="h-48 relative overflow-hidden rounded border border-blood-red animate-[spin_6s_linear_infinite]">
      <div className="absolute inset-0 bg-blood-red/15 pointer-events-none"></div>
      <p className="text-center font-black text-xl text-radium-yellow rotate-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full mix-blend-exclusion">SYSTEM CRASH</p>
      <button
        onMouseEnter={() => setPos({ top: Math.random()*70+10, left: Math.random()*70+10 })}
        onClick={onSuccess}
        className="absolute bg-pus-green text-night font-bold py-1 px-3 rounded text-xs -rotate-12 shadow-pus hover:scale-110 transition-all duration-75"
        style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
      >CATCH ME</button>
    </div>
  );
};
