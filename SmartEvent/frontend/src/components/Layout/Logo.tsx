import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Calendar Base */}
        <rect x="40" y="50" width="120" height="110" rx="8" fill="white" stroke="black" strokeWidth="6"/>
        
        {/* Calendar Top */}
        <rect x="40" y="50" width="120" height="30" rx="4" fill="#FF6B00" stroke="black" strokeWidth="6"/>
        
        {/* Calendar Hangers */}
        <rect x="70" y="35" width="10" height="25" rx="2" fill="black"/>
        <rect x="120" y="35" width="10" height="25" rx="2" fill="black"/>
        
        {/* Calendar Day */}
        <rect x="65" y="100" width="70" height="40" rx="4" fill="#FF6B00"/>
        <text x="100" y="130" fontFamily="Arial, sans-serif" fontSize="30" fontWeight="bold" fill="white" textAnchor="middle">SE</text>
      </svg>
      <span className="ml-2 text-xl font-bold text-black">SmartEvent</span>
    </div>
  );
};

export default Logo;
