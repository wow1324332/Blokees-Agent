import React, { useState, useEffect, useRef } from 'react';

// --- 극강의 시네마틱 애니메이션 및 글로벌 스타일 ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Montserrat:wght@200;400;600&family=Noto+Sans+KR:wght@300;500;700&display=swap');

  :root {
    --core-orange: #ff6b00;
    --glow-orange: rgba(255, 107, 0, 0.6);
    --glass-bg: rgba(20, 10, 5, 0.4);
    --glass-border: rgba(255, 107, 0, 0.2);
  }

  body {
    font-family: 'Montserrat', 'Noto Sans KR', sans-serif;
    background-color: #020101;
    margin: 0;
    overflow: hidden;
  }

  /* 기존 애니메이션 키프레임 */
  @keyframes cinematic-intro {
    0% { transform: scale(0.8); opacity: 0; filter: blur(20px); }
    50% { transform: scale(1.05); opacity: 1; filter: blur(0px); }
    100% { transform: scale(1); opacity: 1; filter: blur(0px); }
  }
  @keyframes core-pulse {
    0%, 100% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 40px var(--glow-orange); }
    50% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 80px var(--core-orange); }
  }
  @keyframes ring-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes ring-spin-reverse {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }
  @keyframes float-smooth {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(1deg); }
  }
  @keyframes text-reveal {
    0% { clip-path: inset(0 100% 0 0); filter: blur(10px); }
    100% { clip-path: inset(0 0 0 0); filter: blur(0px); }
  }
  @keyframes particle-drift {
    from { transform: translateY(0) scale(1); opacity: 0; }
    50% { opacity: 0.5; }
    to { transform: translateY(-100vh) scale(2); opacity: 0; }
  }

  /* --- 신규: 극강의 역동적 인트로용 애니메이션 --- */
  @keyframes cinematic-intro-extreme {
    0% { transform: scale(0); opacity: 0; filter: blur(30px); }
    30% { transform: scale(1.2); opacity: 1; filter: blur(0px); }
    100% { transform: scale(1); opacity: 1; filter: blur(0px); }
  }
  @keyframes flare-burst {
    0% { opacity: 0; transform: scale(0.5); }
    20% { opacity: 0.4; transform: scale(1.5); }
    100% { opacity: 0; transform: scale(2); }
  }
  @keyframes ring-spin-fast {
    0% { transform: rotate(0deg) scale(0.5); opacity: 0; }
    20% { transform: rotate(180deg) scale(1.1); opacity: 1; }
    100% { transform: rotate(360deg) scale(1); opacity: 1; }
  }
  @keyframes ring-spin-reverse-fast {
    0% { transform: rotate(360deg) scale(1.5); opacity: 0; }
    30% { transform: rotate(100deg) scale(0.9); opacity: 1; }
    100% { transform: rotate(0deg) scale(1); opacity: 1; }
  }
  @keyframes core-explode {
    0%, 100% { transform: scale(1); box-shadow: 0 0 40px var(--glow-orange); }
    15% { transform: scale(1.4); box-shadow: 0 0 120px var(--core-orange), inset 0 0 30px #fff; }
    40% { transform: scale(0.9); box-shadow: 0 0 20px var(--glow-orange); }
  }
  @keyframes text-slam {
    0% { transform: scale(2.5) translateY(-20px); opacity: 0; filter: blur(20px); letter-spacing: 0.5em; }
    30% { transform: scale(0.9) translateY(0); opacity: 1; filter: blur(0px); letter-spacing: 0.25em; }
    100% { transform: scale(1) translateY(0); opacity: 1; letter-spacing: 0.25em; }
  }
  @keyframes text-reveal-fast {
    0% { clip-path: inset(0 50% 0 50%); filter: blur(10px); opacity: 0; transform: scale(1.2); }
    100% { clip-path: inset(0 0 0 0); filter: blur(0px); opacity: 1; transform: scale(1); }
  }
  @keyframes line-strike {
    0% { width: 0; opacity: 0; box-shadow: 0 0 0 transparent; }
    40% { width: 250px; opacity: 1; box-shadow: 0 0 40px #ff6b00; background-color: #fff; }
    100% { width: 150px; opacity: 0.8; box-shadow: 0 0 10px #ff6b00; background-color: var(--core-orange); }
  }
  @keyframes flare-strike {
    0% { opacity: 0; transform: scaleX(0); background-color: #fff; }
    20% { opacity: 1; transform: scaleX(1); background-color: #fff; box-shadow: 0 0 150px 30px #ff6b00; }
    100% { opacity: 0; transform: scaleX(1.5); background-color: var(--core-orange); box-shadow: 0 0 20px 0 #ff6b00; }
  }
  @keyframes icon-glitch {
    0%, 100% { transform: translate(0); opacity: 1; }
    2% { transform: translate(-3px, 3px); opacity: 0.8; filter: drop-shadow(3px -3px 0 rgba(255,107,0,0.5)); }
    4% { transform: translate(3px, -3px); opacity: 1; filter: drop-shadow(-3px 3px 0 rgba(255,255,255,0.5)); }
    6% { transform: translate(0); opacity: 1; filter: none; }
  }

  /* 유틸리티 클래스 */
  .font-cinzel { font-family: 'Cinzel', serif; }
  
  .glass-panel {
    background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.5) 100%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 107, 0, 0.15);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border-radius: 2rem;
  }

  .glass-button {
    background: linear-gradient(180deg, rgba(255, 107, 0, 0.1) 0%, rgba(20, 5, 0, 0.8) 100%);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 107, 0, 0.3);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4), inset 0 2px 10px rgba(255, 107, 0, 0.1);
    border-radius: 9999px;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .glass-button:hover {
    background: linear-gradient(180deg, rgba(255, 107, 0, 0.2) 0%, rgba(20, 5, 0, 0.9) 100%);
    border-color: rgba(255, 107, 0, 0.6);
    box-shadow: 0 15px 30px rgba(255, 107, 0, 0.2), inset 0 2px 15px rgba(255, 107, 0, 0.3);
    transform: translateY(-2px);
  }
  .glass-button:active {
    transform: translateY(1px) scale(0.98);
  }

  .text-glow-premium {
    color: #fff;
    text-shadow: 0 0 10px rgba(255, 107, 0, 0.8), 0 0 20px rgba(255, 107, 0, 0.5), 0 0 40px rgba(255, 107, 0, 0.3);
  }

  .slot-cylinder {
    background: linear-gradient(90deg, #020100 0%, #1a0802 20%, #2a0c03 50%, #1a0802 80%, #020100 100%);
    box-shadow: inset 0 40px 40px -20px rgba(0,0,0,0.9), inset 0 -40px 40px -20px rgba(0,0,0,0.9);
  }
  
  .glass-reflection {
    position: absolute;
    top: 0; left: 0; right: 0; height: 50%;
    background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%);
    border-radius: inherit;
    pointer-events: none;
  }

  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

// --- 백그라운드 파티클 컴포넌트 ---
const AmbientBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1f0a00] via-[#050100] to-black opacity-80" />
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-orange-500 rounded-full blur-[1px]"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-10px',
            animation: `particle-drift ${5 + Math.random() * 10}s infinite linear`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
      {/* 초거대 블러 오라 */}
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[50%] bg-orange-800/20 blur-[100px] rounded-full mix-blend-screen" />
    </div>
  );
};

// --- 공통 컴포넌트 ---
const PremiumModal = ({ isOpen, type, message, highlight, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-sm glass-panel p-8 animate-in zoom-in-[0.9] fade-in duration-500 flex flex-col items-center">
        <div className="glass-reflection" />
        
        {/* 모달 헤더 아이콘 */}
        <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center mb-6 relative">
          <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${type === 'ERROR' ? 'bg-red-500' : 'bg-orange-500'}`} />
          {type === 'ERROR' ? (
            <svg className="w-8 h-8 text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          ) : (
             <svg className="w-8 h-8 text-orange-400 drop-shadow-[0_0_10px_rgba(255,107,0,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
        </div>

        <h3 className="text-sm tracking-[0.3em] font-light text-orange-200/80 mb-2">
          {type === 'ERROR' ? 'SYSTEM ALERT' : 'DRAW COMPLETE'}
        </h3>
        
        <p className="text-center text-white/90 text-[15px] font-medium leading-relaxed mb-6">
          {message}
        </p>

        {highlight && (
          <div className="text-7xl font-cinzel text-glow-premium mb-8 relative">
            {highlight}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-500/20 blur-2xl -z-10" />
          </div>
        )}

        <button
          onClick={onClose}
          className="glass-button w-full py-4 text-orange-100 tracking-widest text-sm font-semibold"
        >
          CONFIRM
        </button>
      </div>
    </div>
  );
};


// --- 모듈 화면: 업데이트된 극강의 역동적 시네마틱 인트로 ---
const Intro = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 5500); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      onClick={onComplete} // 화면 터치 시 즉시 스킵
      className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50 overflow-hidden cursor-pointer"
    >
      <AmbientBackground />
      
      {/* 3D 옵티컬 렌즈 이펙트 (역동성 극대화) */}
      <div className="relative w-72 h-72 flex items-center justify-center" style={{ animation: 'cinematic-intro-extreme 4s cubic-bezier(0.075, 0.82, 0.165, 1) forwards' }}>
        
        {/* 배경 폭발 플레어 */}
        <div className="absolute inset-0 bg-orange-500 rounded-full mix-blend-screen blur-[80px] opacity-0 pointer-events-none" style={{ animation: 'flare-burst 5s ease-out forwards' }} />

        {/* 다중 외곽 고속 회전 링 */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-80" style={{ animation: 'ring-spin-fast 8s cubic-bezier(0.1, 0.7, 0.1, 1) infinite' }}>
          <defs>
            <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff6b00" />
              <stop offset="25%" stopColor="#fff" />
              <stop offset="50%" stopColor="transparent" />
              <stop offset="75%" stopColor="#ff6b00" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="95" fill="none" stroke="url(#ringGrad1)" strokeWidth="1.5" strokeDasharray="15 30 5 10" />
          <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,107,0,0.5)" strokeWidth="0.5" strokeDasharray="2 6" />
          <circle cx="100" cy="100" r="65" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="1 10" />
        </svg>

        {/* 내부 고속 역회전 링 */}
        <svg viewBox="0 0 200 200" className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)]" style={{ animation: 'ring-spin-reverse-fast 6s cubic-bezier(0.2, 0.8, 0.2, 1) infinite' }}>
          <circle cx="100" cy="100" r="90" fill="none" stroke="#ea580c" strokeWidth="3" strokeDasharray="40 60 10 30" strokeLinecap="round" />
          <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="5 15" />
        </svg>

        {/* 중앙 코어 (강렬한 펄스) */}
        <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#fff] via-orange-600 to-[#4a1c03] flex items-center justify-center shadow-[0_0_80px_rgba(255,107,0,0.8)]" style={{ animation: 'core-explode 3.5s infinite ease-in-out' }}>
           <div className="absolute inset-1 rounded-full bg-black/90 blur-[1px]" />
           <div className="absolute inset-0 rounded-full border border-orange-500/50 animate-ping" />
           {/* 코어 아이콘 (글리치 효과) */}
           <svg className="w-12 h-12 text-orange-400 relative z-10 drop-shadow-[0_0_15px_#ff6b00]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ animation: 'icon-glitch 3s infinite' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
        </div>
      </div>

      {/* 타이틀 텍스트 (더 강렬한 슬램 등장) */}
      <div className="mt-14 text-center flex flex-col items-center relative z-10">
        <h1 className="text-6xl font-cinzel text-glow-premium tracking-[0.25em] ml-[0.25em] opacity-0" style={{ animation: 'text-slam 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards' }}>
          BLOCKY
        </h1>
        
        {/* Good Luck 텍스트 */}
        <div className="text-xs font-cinzel italic tracking-[0.4em] text-orange-200/90 opacity-0 drop-shadow-[0_0_8px_rgba(255,107,0,0.8)] mt-3 mb-1" style={{ animation: 'text-reveal-fast 1s cubic-bezier(0.16, 1, 0.3, 1) 1.2s forwards' }}>
          Good Luck
        </div>
        
        <div className="h-[2px] w-0 bg-gradient-to-r from-transparent via-orange-400 to-transparent mt-2 mb-3 shadow-[0_0_10px_#ff6b00]" style={{ animation: 'line-strike 1s cubic-bezier(0.16, 1, 0.3, 1) 1.5s forwards', width: '150px' }} />
        
        <h2 className="text-sm font-light tracking-[0.8em] ml-[0.8em] text-orange-200/60 opacity-0" style={{ animation: 'text-reveal-fast 1s cubic-bezier(0.16, 1, 0.3, 1) 1.8s forwards' }}>
          AGENT
        </h2>
      </div>

      {/* 터치 스킵 안내 텍스트 */}
      <div className="absolute bottom-10 text-[9px] tracking-[0.5em] text-white/30 font-light opacity-0" style={{ animation: 'text-reveal 1.5s ease 2.5s forwards' }}>
         TAP TO INITIATE
      </div>

      {/* 렌즈 플레어 이펙트 (강력한 번쩍임) */}
      <div className="absolute top-1/2 left-0 w-full h-[3px] bg-orange-400/0 shadow-[0_0_80px_rgba(255,107,0,0)]" style={{ animation: 'flare-strike 2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards', height: '2px' }} />
    </div>
  );
};


// --- 모듈 화면: 유리 질감 로그인 ---
const Login = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === '1324') {
        setTimeout(onSuccess, 500); 
      } else {
        setIsError(true);
        setTimeout(() => {
          setPin('');
          setIsError(false);
        }, 600);
      }
    }
  }, [pin, onSuccess]);

  const handleKey = (k) => {
    if (isError || pin.length >= 4) return;
    setPin(prev => prev + k);
  };

  // --- 수정된 키 배열: 1부터 9까지만 존재 ---
  const keys = ['1','2','3','4','5','6','7','8','9'];

  return (
    <div className="relative flex flex-col h-full px-6 pt-20 pb-10 animate-in fade-in zoom-in-[0.95] duration-1000 z-10">
      <AmbientBackground />

      <div className="flex-1 flex flex-col items-center justify-center z-10" style={{ animation: 'float-smooth 6s ease-in-out infinite' }}>
        <div className="w-20 h-20 rounded-full glass-panel flex items-center justify-center mb-8">
           <svg className="w-8 h-8 text-orange-400 drop-shadow-[0_0_8px_rgba(255,107,0,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        
        <h2 className="text-[11px] tracking-[0.5em] text-orange-200/80 mb-12 font-medium">SYSTEM AUTHORIZATION</h2>

        <div className={`flex gap-6 mb-8 ${isError ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="relative w-4 h-4">
              <div className="absolute inset-0 rounded-full bg-white/5 border border-orange-500/30" />
              <div className={`absolute inset-0 rounded-full transition-all duration-500 
                ${pin.length > i ? 'bg-orange-500 shadow-[0_0_20px_#ff6b00] scale-100 opacity-100' : 'scale-0 opacity-0'}`} 
              />
            </div>
          ))}
        </div>
        {isError && <p className="text-[10px] text-red-400 tracking-widest absolute mt-20">ACCESS DENIED</p>}
      </div>

      {/* --- 9자리 키패드 --- */}
      <div className="grid grid-cols-3 gap-4 mb-8 z-10 mx-auto w-fit">
        {keys.map(k => (
          <button
            key={k}
            onClick={() => handleKey(k)}
            className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-2xl font-light text-orange-50 hover:bg-white/10 active:scale-90 transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="glass-reflection" />
            <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {k}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};


// --- 모듈 화면: 홈 베이스 (글래스 카드 UI) ---
const Home = ({ onSelectModule }) => {
  return (
    <div className="relative flex flex-col h-full animate-in fade-in duration-700 z-10">
      <AmbientBackground />
      
      {/* 럭셔리 헤더 */}
      <header className="flex items-center justify-between px-8 py-8 z-10 relative">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent" />
             <div className="w-5 h-5 rounded-full bg-orange-500 shadow-[0_0_15px_#ff6b00]" />
          </div>
          <div>
            <h1 className="text-sm tracking-[0.2em] font-cinzel font-bold text-white drop-shadow-md">BLOCKY BASE</h1>
            <p className="text-[10px] tracking-widest text-orange-300/60 mt-1">SECURE NETWORK</p>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors">
          <svg className="w-5 h-5 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </header>

      <div className="flex-1 px-6 pb-8 overflow-y-auto hide-scrollbar z-10">
        <h2 className="text-2xl font-light tracking-wide text-white mb-8 px-2 font-cinzel">System Modules</h2>

        <div className="space-y-6">
          {/* 활성화된 모듈 (번호 추첨) */}
          <div
            onClick={onSelectModule}
            className="group relative glass-panel p-6 cursor-pointer hover:-translate-y-1 transition-all duration-500"
          >
            <div className="glass-reflection" />
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-orange-500/20 group-hover:border-orange-500/50 transition-all">
               <svg className="w-5 h-5 text-orange-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>

            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-black/50 border border-orange-500/30 flex items-center justify-center shadow-[inset_0_0_20px_rgba(255,107,0,0.2)]">
                <svg className="w-8 h-8 text-orange-500 drop-shadow-[0_0_8px_rgba(255,107,0,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white tracking-wide mb-1">번호 추첨 모듈</h3>
                <p className="text-xs text-orange-200/50 tracking-widest uppercase">Random Draw Protocol</p>
              </div>
            </div>
          </div>

          {/* 비활성화된 더미 모듈들 */}
          {[1, 2].map(i => (
            <div key={i} className="relative glass-panel p-6 opacity-40 select-none border-white/5">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white/70 tracking-wide mb-1">접근 불가 모듈</h3>
                  <p className="text-xs text-white/40 tracking-widest uppercase">Restricted Area</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- 모듈 화면: 번호 추첨 (고급 슬롯머신) ---
const NumberDraw = ({ onBack }) => {
  const [participants, setParticipants] = useState('');
  const [spinSeq, setSpinSeq] = useState([0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [offset, setOffset] = useState(0);

  const [modal, setModal] = useState({ isOpen: false, type: '', message: '', highlight: '' });

  const ITEM_HEIGHT = 144; // 9rem (h-36)

  // 완벽한 난수 생성 (Web Crypto API)
  const getSecureRandom = (max) => {
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    const randomNumber = randomBuffer[0] / (0xffffffff + 1);
    return Math.floor(randomNumber * max) + 1;
  };

  const handleDraw = () => {
    const max = parseInt(participants, 10);
    if (isNaN(max) || max < 1) {
      setModal({ isOpen: true, type: 'ERROR', message: '대상자의 수를 정확한 숫자로 입력해주십시오.' });
      return;
    }
    if (max > 999999) {
      setModal({ isOpen: true, type: 'ERROR', message: '시스템 허용 범위를 초과하였습니다.' });
      return;
    }

    const target = getSecureRandom(max);
    const spins = 45; // 회전 수 증가로 더 극적인 효과
    const seq = [];

    for(let i=0; i<spins-1; i++) {
       seq.push(getSecureRandom(max));
    }
    seq.push(target);

    setSpinSeq(seq);
    setOffset(0);
    setIsSpinning(true);

    setTimeout(() => {
       setOffset((spins - 1) * ITEM_HEIGHT);
    }, 50);

    // 5초간 회전 (cubic-bezier로 현실적인 감속 구현)
    setTimeout(() => {
       setIsSpinning(false);
       setModal({ 
         isOpen: true, 
         type: 'SUCCESS', 
         message: '추첨이 완료되었습니다. 결과를 확인하십시오.', 
         highlight: target.toString() 
       });
    }, 5050);
  };

  return (
    <div className="relative flex flex-col h-full animate-in slide-in-from-right-8 duration-500 z-10">
       <AmbientBackground />
       
       <header className="flex items-center p-6 z-10 relative">
         <button onClick={onBack} disabled={isSpinning} className="w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 disabled:opacity-30 transition-all">
           <svg className="w-6 h-6 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
         </button>
         <h1 className="flex-1 text-center text-xs tracking-[0.4em] text-white font-light mr-12 uppercase">Draw Protocol</h1>
       </header>

       <div className="flex-1 flex flex-col px-6 pb-10 overflow-hidden z-10">
         
         {/* 입력 필드 영역 */}
         <div className="mb-8 mt-2">
           <label className="block text-[11px] font-medium tracking-[0.2em] text-orange-200/80 mb-4 text-center uppercase">Total Participants</label>
           <div className="relative glass-panel p-2 focus-within:border-orange-500/60 focus-within:shadow-[0_0_30px_rgba(255,107,0,0.2)] transition-all duration-500 rounded-full">
             <div className="glass-reflection rounded-full" />
             <input
               type="number"
               value={participants}
               onChange={(e) => setParticipants(e.target.value)}
               disabled={isSpinning}
               className="w-full bg-transparent text-center text-3xl font-cinzel text-white outline-none placeholder-white/20 disabled:opacity-50 py-4 relative z-10"
               placeholder="Enter Number"
               inputMode="numeric"
             />
           </div>
         </div>

         {/* 3D 슬롯머신 실린더 UI */}
         <div className="flex-1 flex flex-col items-center justify-center relative mb-10 w-full">
            
            <div className="relative w-full h-[220px] rounded-[3rem] slot-cylinder border-2 border-[#3a1505] overflow-hidden flex items-center justify-center shadow-2xl">
               
               {/* 둥근 유리 반사광 */}
               <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/60 pointer-events-none z-20 rounded-[3rem]" />
               <div className="absolute top-0 left-[10%] right-[10%] h-[30%] bg-gradient-to-b from-white/15 to-transparent rounded-full blur-md pointer-events-none z-20" />

               {/* 중앙 조준선 */}
               <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[2px] bg-orange-500/80 shadow-[0_0_20px_#ff6b00] z-20 opacity-80" />
               <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-16 border-y border-orange-500/30 z-20 pointer-events-none" />
               
               {/* 슬롯 릴 */}
               <div className="w-full h-36 relative flex justify-center">
                 <div
                   className="flex flex-col w-full text-center"
                   style={{
                     transform: `translateY(-${offset}px)`,
                     transition: isSpinning ? 'transform 5s cubic-bezier(0.15, 0.85, 0.1, 1)' : 'none'
                   }}
                 >
                   {spinSeq.map((num, idx) => (
                     <div key={idx} className="h-36 flex items-center justify-center text-[7rem] leading-none font-cinzel text-glow-premium shrink-0">
                       {num === 0 ? '-' : num}
                     </div>
                   ))}
                 </div>
               </div>

               {/* 상하단 입체감 그라데이션 커버 */}
               <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#020100] 0%, transparent 25%, transparent 75%, #020100 100% z-10 rounded-[3rem]" />
            </div>

         </div>

         {/* 메인 실행 버튼 */}
         <div className="mt-auto">
           <button 
             onClick={handleDraw} 
             disabled={isSpinning || !participants}
             className={`w-full py-6 rounded-full font-cinzel font-bold text-lg tracking-[0.2em] transition-all duration-500 relative overflow-hidden group
               ${isSpinning || !participants 
                 ? 'bg-black/50 border border-white/10 text-white/30 cursor-not-allowed' 
                 : 'glass-button text-white shadow-[0_0_40px_rgba(255,107,0,0.3)]'}`}
           >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
             <span className="relative z-10 drop-shadow-md">
               {isSpinning ? 'PROCESSING...' : 'INITIALIZE'}
             </span>
           </button>
         </div>
       </div>

       <PremiumModal
         isOpen={modal.isOpen}
         type={modal.type}
         message={modal.message}
         highlight={modal.highlight}
         onClose={() => setModal({ isOpen: false })}
       />
    </div>
  );
};


// --- 메인 App 래퍼 ---
export default function App() {
  const [view, setView] = useState('INTRO'); 

  return (
    <>
      <style>{globalStyles}</style>
      <div className="flex items-center justify-center min-h-screen bg-[#000] select-none font-sans overflow-hidden p-0 sm:p-4 perspective-[1000px]">
        
        {/* 모바일 디바이스 프레임 (극강의 럭셔리 라운딩 및 그림자) */}
        <div className="relative w-full max-w-[430px] h-[100dvh] sm:h-[900px] bg-[#020101] overflow-hidden 
                        sm:rounded-[3rem] sm:border-[4px] sm:border-[#1a1a1a] sm:shadow-[0_0_100px_rgba(255,107,0,0.15),inset_0_0_20px_rgba(255,255,255,0.05)] 
                        flex flex-col transform-gpu">
          
          {/* 디바이스 상단 노치/스피커 가상 영역 (PC 뷰용) */}
          <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#000] rounded-b-3xl z-[100] border-b border-x border-[#1a1a1a]" />

          {view === 'INTRO' && <Intro onComplete={() => setView('LOGIN')} />}
          {view === 'LOGIN' && <Login onSuccess={() => setView('HOME')} />}
          {view === 'HOME' && <Home onSelectModule={() => setView('DRAW')} />}
          {view === 'DRAW' && <NumberDraw onBack={() => setView('HOME')} />}
          
        </div>
      </div>
    </>
  );
}
