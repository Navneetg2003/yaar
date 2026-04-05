export default function JournalAnimation() {
  return (
    <div className="kd-wrap">
      <svg className="kd-svg" width="560" height="400" viewBox="0 0 560 400">

        {/* Sun body */}
        <circle cx="160" cy="90" r="36"
          fill="none" stroke="#F5C842" strokeWidth="3.5" strokeLinecap="round"
          className="kd-draw" style={{"--len":226,"--dur":"1.0s","--delay":"0.2s"}}/>
        <circle cx="160" cy="90" r="34"
          fill="#FDE66A" className="kd-fill" style={{"--fdur":"0.5s","--fdelay":"1.1s"}}/>

        {/* Sun rays */}
        {[
          [160,44,160,34],[160,136,160,146],[116,90,106,90],[204,90,214,90],
          [129,59,122,52],[191,121,198,128],[191,59,198,52],[129,121,122,128]
        ].map(([x1,y1,x2,y2],i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#F5C842" strokeWidth="2.5" strokeLinecap="round"
            className="kd-draw"
            style={{"--len":10,"--dur":"0.2s","--delay":`${1.2+i*0.1}s`}}/>
        ))}

        {/* Clouds */}
        <path d="M60 60 Q68 48 80 52 Q84 42 96 46 Q108 40 114 50 Q122 44 128 54 Q132 62 120 66 Q110 72 90 70 Q70 72 60 64 Z"
          fill="none" stroke="#AAAAAA" strokeWidth="2.5" strokeLinejoin="round"
          className="kd-draw" style={{"--len":220,"--dur":"0.8s","--delay":"1.8s"}}/>
        <path d="M60 60 Q68 48 80 52 Q84 42 96 46 Q108 40 114 50 Q122 44 128 54 Q132 62 120 66 Q110 72 90 70 Q70 72 60 64 Z"
          fill="white" opacity="0.85" className="kd-fill" style={{"--fdur":"0.4s","--fdelay":"2.5s"}}/>
        <path d="M380 50 Q390 38 404 42 Q410 32 424 36 Q436 30 440 42 Q448 36 454 48 Q456 58 444 62 Q430 68 408 66 Q386 68 380 58 Z"
          fill="none" stroke="#AAAAAA" strokeWidth="2.5" strokeLinejoin="round"
          className="kd-draw" style={{"--len":220,"--dur":"0.8s","--delay":"2.2s"}}/>
        <path d="M380 50 Q390 38 404 42 Q410 32 424 36 Q436 30 440 42 Q448 36 454 48 Q456 58 444 62 Q430 68 408 66 Q386 68 380 58 Z"
          fill="white" opacity="0.85" className="kd-fill" style={{"--fdur":"0.4s","--fdelay":"2.8s"}}/>

        {/* Left mountain */}
        <polygon points="30,320 180,100 330,320"
          fill="none" stroke="#7BAE7F" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round"
          className="kd-draw" style={{"--len":700,"--dur":"1.6s","--delay":"2.0s"}}/>
        <polygon points="30,320 180,100 330,320"
          fill="#A8D5A2" className="kd-fill" style={{"--fdur":"0.5s","--fdelay":"3.5s"}}/>
        <polygon points="180,100 160,145 200,145"
          fill="none" stroke="#E8E8E8" strokeWidth="2.5" strokeLinejoin="round"
          className="kd-draw" style={{"--len":140,"--dur":"0.4s","--delay":"3.6s"}}/>
        <polygon points="180,100 160,145 200,145"
          fill="white" opacity="0.85" className="kd-fill" style={{"--fdur":"0.3s","--fdelay":"3.9s"}}/>

        {/* Right mountain */}
        <polygon points="250,320 390,140 530,320"
          fill="none" stroke="#6B9E6F" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round"
          className="kd-draw" style={{"--len":600,"--dur":"1.4s","--delay":"2.4s"}}/>
        <polygon points="250,320 390,140 530,320"
          fill="#8DC38A" className="kd-fill" style={{"--fdur":"0.5s","--fdelay":"3.7s"}}/>
        <polygon points="390,140 373,178 407,178"
          fill="none" stroke="#E8E8E8" strokeWidth="2.5" strokeLinejoin="round"
          className="kd-draw" style={{"--len":120,"--dur":"0.35s","--delay":"3.7s"}}/>
        <polygon points="390,140 373,178 407,178"
          fill="white" opacity="0.85" className="kd-fill" style={{"--fdur":"0.3s","--fdelay":"4.0s"}}/>

        {/* Ground */}
        <line x1="0" y1="320" x2="560" y2="320"
          stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round"
          className="kd-draw" style={{"--len":560,"--dur":"0.7s","--delay":"4.4s"}}/>

        {/* River */}
        <path d="M195,280 Q210,295 220,315 Q230,340 225,380 L245,380 Q248,340 242,315 Q235,295 225,280 Z"
          fill="#AED9E0" className="kd-fill" style={{"--fdur":"0.6s","--fdelay":"4.6s"}}/>
        <path d="M195,280 Q210,295 220,315 Q230,340 225,380"
          fill="none" stroke="#5BA4CF" strokeWidth="3" strokeLinecap="round"
          className="kd-draw" style={{"--len":160,"--dur":"0.7s","--delay":"3.9s"}}/>
        <path d="M225,280 Q238,295 242,315 Q248,340 245,380"
          fill="none" stroke="#5BA4CF" strokeWidth="3" strokeLinecap="round"
          className="kd-draw" style={{"--len":160,"--dur":"0.7s","--delay":"4.1s"}}/>
        {/* River shimmer */}
        {[[209,306,217,306],[212,322,222,322],[214,340,224,340]].map(([x1,y1,x2,y2],i)=>(
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#5BA4CF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"
            className="kd-draw" style={{"--len":10,"--dur":"0.2s","--delay":`${4.8+i*0.2}s`}}/>
        ))}

        {/* House body */}
        <rect x="100" y="268" width="80" height="52" rx="2"
          fill="none" stroke="#C0703A" strokeWidth="3" strokeLinejoin="round"
          className="kd-draw" style={{"--len":268,"--dur":"0.8s","--delay":"4.5s"}}/>
        <rect x="100" y="268" width="80" height="52" rx="2"
          fill="#F4C99A" className="kd-fill" style={{"--fdur":"0.4s","--fdelay":"5.2s"}}/>

        {/* Roof */}
        <polygon points="92,270 140,228 188,270"
          fill="none" stroke="#A0522D" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"
          className="kd-draw" style={{"--len":220,"--dur":"0.7s","--delay":"5.0s"}}/>
        <polygon points="92,270 140,228 188,270"
          fill="#C0703A" className="kd-fill" style={{"--fdur":"0.4s","--fdelay":"5.6s"}}/>

        {/* Chimney */}
        <rect x="155" y="234" width="14" height="22" rx="1"
          fill="none" stroke="#A0522D" strokeWidth="2.5"
          className="kd-draw" style={{"--len":76,"--dur":"0.3s","--delay":"5.2s"}}/>
        <rect x="155" y="234" width="14" height="22" rx="1"
          fill="#C0703A" className="kd-fill" style={{"--fdur":"0.3s","--fdelay":"5.4s"}}/>

        {/* Door */}
        <rect x="128" y="288" width="24" height="32" rx="2"
          fill="none" stroke="#8B4513" strokeWidth="2.5"
          className="kd-draw" style={{"--len":120,"--dur":"0.4s","--delay":"5.4s"}}/>
        <rect x="128" y="288" width="24" height="32" rx="2"
          fill="#A0522D" className="kd-fill" style={{"--fdur":"0.3s","--fdelay":"5.7s"}}/>
        <circle cx="149" cy="306" r="2.5"
          fill="#F5C842" className="kd-fill" style={{"--fdur":"0.2s","--fdelay":"5.8s"}}/>

        {/* Windows */}
        {[[106,274],[156,274]].map(([x,y],i)=>(
          <g key={i}>
            <rect x={x} y={y} width="18" height="16" rx="1"
              fill="none" stroke="#8B4513" strokeWidth="2"
              className="kd-draw" style={{"--len":72,"--dur":"0.3s","--delay":`${5.5+i*0.1}s`}}/>
            <rect x={x} y={y} width="18" height="16" rx="1"
              fill="#AED9E0" className="kd-fill" style={{"--fdur":"0.3s","--fdelay":`${5.7+i*0.1}s`}}/>
            <line x1={x+9} y1={y} x2={x+9} y2={y+16} stroke="#8B4513" strokeWidth="1.5"
              className="kd-draw" style={{"--len":16,"--dur":"0.2s","--delay":`${5.7+i*0.1}s`}}/>
            <line x1={x} y1={y+8} x2={x+18} y2={y+8} stroke="#8B4513" strokeWidth="1.5"
              className="kd-draw" style={{"--len":18,"--dur":"0.2s","--delay":`${5.8+i*0.1}s`}}/>
          </g>
        ))}

        {/* Smoke */}
        {[{cx:162,cy:228,r:5,delay:"6.2s"},{cx:165,cy:218,r:6,delay:"6.5s"},{cx:160,cy:208,r:7,delay:"6.8s"}].map((s,i)=>(
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r}
            fill="none" stroke={`rgba(180,180,180,${0.7-i*0.15})`} strokeWidth="1.5"
            className="kd-smoke" style={{"--fdelay":s.delay}}/>
        ))}

        {/* Left tree */}
        <line x1="72" y1="320" x2="72" y2="272"
          stroke="#8B6914" strokeWidth="3" strokeLinecap="round"
          className="kd-draw" style={{"--len":48,"--dur":"0.35s","--delay":"5.8s"}}/>
        <circle cx="72" cy="258" r="18"
          fill="none" stroke="#4A7A4A" strokeWidth="3"
          className="kd-draw" style={{"--len":113,"--dur":"0.5s","--delay":"6.0s"}}/>
        <circle cx="72" cy="258" r="17"
          fill="#6BAD6B" className="kd-fill" style={{"--fdur":"0.4s","--fdelay":"6.4s"}}/>

        {/* Right tree */}
        <line x1="480" y1="320" x2="480" y2="265"
          stroke="#8B6914" strokeWidth="3" strokeLinecap="round"
          className="kd-draw" style={{"--len":55,"--dur":"0.35s","--delay":"6.0s"}}/>
        <circle cx="480" cy="250" r="20"
          fill="none" stroke="#4A7A4A" strokeWidth="3"
          className="kd-draw" style={{"--len":126,"--dur":"0.5s","--delay":"6.2s"}}/>
        <circle cx="480" cy="250" r="19"
          fill="#6BAD6B" className="kd-fill" style={{"--fdur":"0.4s","--fdelay":"6.6s"}}/>

        {/* Birds */}
        <path d="M320 80 Q326 74 332 80" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round"
          className="kd-draw" style={{"--len":28,"--dur":"0.3s","--delay":"6.5s"}}/>
        <path d="M340 68 Q347 61 354 68" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round"
          className="kd-draw" style={{"--len":32,"--dur":"0.3s","--delay":"6.7s"}}/>
        <path d="M360 80 Q365 74 370 80" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round"
          className="kd-draw" style={{"--len":24,"--dur":"0.3s","--delay":"6.9s"}}/>

        {/* Signature */}
        <text x="490" y="375"
          fontFamily="'Caveat', cursive" fontSize="15" fill="#C0703A"
          className="kd-fill" style={{"--fdur":"0.6s","--fdelay":"7.5s"}}>
          yaar ♥
        </text>

      </svg>

      {/* Tagline */}
      <div className="kd-tagline">always here for you</div>
    </div>
  );
}