import React from 'react';
import { Leaf } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <Leaf className="w-5 h-5 text-brand-green" />
            <span className="text-white font-bold text-lg">AgroGuard</span>
          </div>

          {/* Links */}
          <div className="flex space-x-6 text-sm">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              GitHub
            </a>
            <a href="#" className="hover:text-white transition">Documentation</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>

          {/* Credits */}
          <p className="text-sm text-slate-500">
            © 2026 AgroGuard. By Vaishnavi, Noman & Yashwant.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
