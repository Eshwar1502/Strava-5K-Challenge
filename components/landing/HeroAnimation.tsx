'use client'

export default function HeroAnimation() {
  return (
    <div className="relative w-48 h-48 mx-auto">
      <style>{`
        @keyframes run-bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes arm-swing {
          0%, 100% { transform: rotate(-30deg); }
          50% { transform: rotate(30deg); }
        }
        @keyframes leg-front {
          0%, 100% { transform: rotate(-40deg); }
          50% { transform: rotate(40deg); }
        }
        @keyframes leg-back {
          0%, 100% { transform: rotate(40deg); }
          50% { transform: rotate(-40deg); }
        }
        @keyframes trail-fade {
          0% { opacity: 0.6; transform: scaleX(1); }
          100% { opacity: 0; transform: scaleX(0.2); }
        }
        .runner-body {
          animation: run-bounce 0.4s ease-in-out infinite;
        }
        .arm-left {
          transform-origin: 50% 20%;
          animation: arm-swing 0.4s ease-in-out infinite;
        }
        .arm-right {
          transform-origin: 50% 20%;
          animation: arm-swing 0.4s ease-in-out infinite reverse;
        }
        .leg-left {
          transform-origin: 50% 5%;
          animation: leg-front 0.4s ease-in-out infinite;
        }
        .leg-right {
          transform-origin: 50% 5%;
          animation: leg-back 0.4s ease-in-out infinite;
        }
        .trail-1 { animation: trail-fade 0.4s ease-out infinite; }
        .trail-2 { animation: trail-fade 0.4s ease-out 0.13s infinite; }
        .trail-3 { animation: trail-fade 0.4s ease-out 0.26s infinite; }
      `}</style>

      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Ground line */}
        <line x1="20" y1="155" x2="180" y2="155" stroke="#2a2a2a" strokeWidth="2" />

        {/* Speed trails */}
        <g className="trail-1">
          <line x1="30" y1="120" x2="55" y2="120" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" />
        </g>
        <g className="trail-2">
          <line x1="25" y1="132" x2="58" y2="132" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" />
        </g>
        <g className="trail-3">
          <line x1="35" y1="144" x2="60" y2="144" stroke="#FF5722" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Runner */}
        <g className="runner-body" style={{ transformOrigin: '100px 130px' }}>
          {/* Head */}
          <circle cx="110" cy="80" r="14" fill="#FF7043" />
          {/* Body */}
          <rect x="102" y="94" width="16" height="30" rx="7" fill="#FF5722" />
          {/* Left arm */}
          <g className="arm-left" style={{ transformOrigin: '104px 100px' }}>
            <line x1="104" y1="100" x2="85" y2="122" stroke="#FF7043" strokeWidth="5" strokeLinecap="round" />
          </g>
          {/* Right arm */}
          <g className="arm-right" style={{ transformOrigin: '116px 100px' }}>
            <line x1="116" y1="100" x2="135" y2="122" stroke="#FF7043" strokeWidth="5" strokeLinecap="round" />
          </g>
          {/* Left leg */}
          <g className="leg-left" style={{ transformOrigin: '107px 124px' }}>
            <line x1="107" y1="124" x2="95" y2="155" stroke="#FF5722" strokeWidth="6" strokeLinecap="round" />
          </g>
          {/* Right leg */}
          <g className="leg-right" style={{ transformOrigin: '113px 124px' }}>
            <line x1="113" y1="124" x2="125" y2="155" stroke="#FF5722" strokeWidth="6" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  )
}
