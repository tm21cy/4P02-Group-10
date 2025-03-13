"use client";

import React from "react";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#1a1f2e] to-[#151922] text-gray-300 py-10 px-6 mt-10 w-full border-t border-gray-800/30">
      <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left items-center">
        
        {/* Left - Logo & Contact Info */}
        <div className="flex flex-col items-center md:items-start space-y-6">
          <div className="flex items-center gap-3 group">
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              className="text-[#00ffcc] group-hover:text-[#33ffdd] transition-colors duration-300"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <h2 className="text-xl font-bold text-white group-hover:text-[#00ffcc] transition-colors duration-300">AccuTrack</h2>
          </div>

          <div className="text-sm space-y-2">
            <p className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-[#00ffcc]">Email:</span>
              <a href="mailto:support@accutrack.com" className="hover:text-[#00ffcc] transition-colors duration-300">support@accutrack.com</a>
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-[#00ffcc]">Phone:</span>
              <a href="tel:+1800123BOOK" className="hover:text-[#00ffcc] transition-colors duration-300">+1-800-123-BOOK</a>
            </p>
            <p className="text-gray-400">1812 Sir Issac Brock Way, St. Catharines, ON - L2S3A1</p>
          </div>
        </div>

        {/* Center - Copyright */}
        <div className="text-sm text-gray-400 md:text-center">

          <p>© {new Date().getFullYear()} AccuTrack.</p>
          <p>All rights reserved.</p>
        </div>

        {/* Right - Social Media Icons */}
        <div className="flex flex-col items-center md:items-end gap-4">
          <h3 className="text-[#00ffcc] font-semibold mb-2">Connect With Us</h3>
          <div className="flex gap-6">
            <Link href="https://instagram.com" target="_blank" className="group">
              <FaInstagram className="text-gray-400 group-hover:text-[#00ffcc] text-2xl transform group-hover:scale-110 transition-all duration-300" />
            </Link>
            <Link href="https://facebook.com" target="_blank" className="group">
              <FaFacebook className="text-gray-400 group-hover:text-[#00ffcc] text-2xl transform group-hover:scale-110 transition-all duration-300" />
            </Link>
            <Link href="https://twitter.com" target="_blank" className="group">
              <FaTwitter className="text-gray-400 group-hover:text-[#00ffcc] text-2xl transform group-hover:scale-110 transition-all duration-300" />
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="group">
              <FaLinkedin className="text-gray-400 group-hover:text-[#00ffcc] text-2xl transform group-hover:scale-110 transition-all duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
