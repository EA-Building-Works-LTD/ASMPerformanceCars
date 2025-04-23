import React from 'react';

interface BannerProps {
  text: string;
  showBanner?: boolean;
}

export const Banner = ({ text, showBanner = true }: BannerProps) => {
  if (!showBanner) return null;
  
  return (
    <div className="bg-blue-600 text-white py-2 px-4 text-center">
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
};

export default Banner; 