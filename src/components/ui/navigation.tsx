import React from 'react';
import Link from 'next/link';

interface NavigationProps {
  className?: string;
}

export const Navigation = ({ className = '' }: NavigationProps) => {
  return (
    <nav className={className}>
      <ul className="flex gap-6">
        <li>
          <Link 
            href="/" 
            className="hover:text-blue-400 focus:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-md px-2 py-1 transition-colors"
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            href="#services" 
            className="hover:text-blue-400 focus:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-md px-2 py-1 transition-colors"
          >
            Services
          </Link>
        </li>
        <li>
          <Link 
            href="#projects" 
            className="hover:text-blue-400 focus:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-md px-2 py-1 transition-colors"
          >
            Projects
          </Link>
        </li>
        <li>
          <Link 
            href="#contact" 
            className="hover:text-blue-400 focus:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-md px-2 py-1 transition-colors"
          >
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation; 