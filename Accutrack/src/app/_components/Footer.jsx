"use client";

import React from "react";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#1c2230] text-[#bbbbbb] py-8 px-6 mt-10 w-full">
      {/* used grid instead to center the content in the footer */} 
      <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left items-center">
        
        {/* Left - Logo & Contact Info */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <div className="flex items-center gap-3">
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              className="text-[#00ffcc]"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <h2 className="text-lg font-semibold text-white">AccuTrack</h2>
          </div>

          <div className="text-sm">
            <p>Email: <a href="mailto:support@accutrack.com" className="hover:underline text-[#00ffcc]">support@accutrack.com</a></p>
            <p>Phone: <a href="tel:+1800123BOOK" className="hover:underline text-[#00ffcc]">+1-800-123-BOOK</a></p>
            <p>1812 Sir Issac Brock Way, St. Catharines, ON - L2S3A1</p>
          </div>
        </div>

        {/* Center - Copyright */}
        <div className="text-sm text-gray-400 md:text-center">
          © 2025 AccuTrack. All rights reserved.
        </div>

        {/* Right - Social Media Icons */}
        <div className="flex justify-center md:justify-end gap-4">
          <Link href="https://instagram.com" target="_blank">
            <FaInstagram className="text-teal-400 hover:text-teal-300 text-2xl" />
          </Link>
          <Link href="https://facebook.com" target="_blank">
            <FaFacebook className="text-teal-400 hover:text-teal-300 text-2xl" />
          </Link>
          <Link href="https://twitter.com" target="_blank">
            <FaTwitter className="text-teal-400 hover:text-teal-300 text-2xl" />
          </Link>
          <Link href="https://linkedin.com" target="_blank">
            <FaLinkedin className="text-teal-400 hover:text-teal-300 text-2xl" />
          </Link>
        </div>

      </div>
    </footer>
  );
}
