import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFB830 0%, #F79400 50%, #E07800 100%)',
          borderRadius: '50%',
        }}
      >
        <svg width="400" height="400" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="250" cy="250" r="240" fill="url(#bgGradient)" />
          <circle cx="250" cy="250" r="235" fill="none" stroke="url(#ringGradient)" strokeWidth="8" />
          <circle cx="250" cy="250" r="215" fill="none" stroke="white" strokeWidth="3" strokeDasharray="15,10" opacity="0.9" />
          <path id="topCircle" d="M 80,250 A 170,170 0 0,1 420,250" fill="none" />
          <text fontFamily="Georgia, serif" fontSize="32" fontWeight="bold" fill="white" letterSpacing="8">
            <textPath href="#topCircle" startOffset="50%" textAnchor="middle">EGLISE DE DIEU SALUT POUR TOUS</textPath>
          </text>
          <polygon points="150,180 155,195 170,195 158,205 163,220 150,210 137,220 142,205 130,195 145,195" fill="#FFF0B0" opacity="0.8" />
          <polygon points="350,180 355,195 370,195 358,205 363,220 350,210 337,220 342,205 330,195 345,195" fill="#FFF0B0" opacity="0.8" />
          <g transform="translate(250, 260)">
            <ellipse cx="0" cy="70" rx="90" ry="15" fill="rgba(150,80,0,0.25)" />
            <path d="M -85,-30 Q -90,0 -85,50 L -10,55 L -10,-35 Z" fill="white" stroke="#E8D8B0" strokeWidth="2" />
            <path d="M 85,-30 Q 90,0 85,50 L 10,55 L 10,-35 Z" fill="white" stroke="#E8D8B0" strokeWidth="2" />
            <rect x="-8" y="-35" width="16" height="90" fill="#F0E0B0" stroke="#D4B060" strokeWidth="1.5" />
            <line x1="-75" y1="-10" x2="-20" y2="-10" stroke="#D4C090" strokeWidth="2" />
            <line x1="-75" y1="0" x2="-20" y2="0" stroke="#D4C090" strokeWidth="2" />
            <line x1="-75" y1="10" x2="-20" y2="10" stroke="#D4C090" strokeWidth="2" />
            <line x1="-75" y1="20" x2="-20" y2="20" stroke="#D4C090" strokeWidth="2" />
            <line x1="20" y1="-10" x2="75" y2="-10" stroke="#D4C090" strokeWidth="2" />
            <line x1="20" y1="0" x2="75" y2="0" stroke="#D4C090" strokeWidth="2" />
            <line x1="20" y1="10" x2="75" y2="10" stroke="#D4C090" strokeWidth="2" />
            <line x1="20" y1="20" x2="75" y2="20" stroke="#D4C090" strokeWidth="2" />
            <g transform="translate(-50, 5)">
              <rect x="-3" y="-10" width="6" height="20" fill="#F0C030" />
              <rect x="-8" y="-5" width="16" height="6" fill="#F0C030" />
            </g>
          </g>
          <text x="250" y="380" fontFamily="Georgia, serif" fontSize="36" fontWeight="bold" fill="white" textAnchor="middle" opacity="0.95">Pr 29 : 18</text>
          <line x1="150" y1="395" x2="350" y2="395" stroke="white" strokeWidth="2" strokeDasharray="5,5" opacity="0.7" />
          <text x="250" y="450" fontFamily="Georgia, serif" fontSize="52" fontWeight="bold" fontStyle="italic" fill="white" textAnchor="middle">de Petit Paradis</text>
          <circle cx="120" cy="250" r="4" fill="white" opacity="0.6" />
          <circle cx="380" cy="250" r="4" fill="white" opacity="0.6" />
          <circle cx="250" cy="120" r="4" fill="white" opacity="0.6" />
          <circle cx="250" cy="380" r="4" fill="white" opacity="0.6" />
        </svg>
      </div>
    ),
    {
      width: 400,
      height: 400,
    }
  );
}