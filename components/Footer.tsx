
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent mt-auto">
      <div className="container mx-auto px-4 py-4 text-center text-slate-500/80 text-sm">
        <p>&copy; {new Date().getFullYear()} STAI Imam Syafi'i Cianjur. All Rights Reserved.</p>
      </div>
    </footer>
  );
};