"use client";

import React from "react";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#1c2230] text-[#bbbbbb] py-6 px-8 mt-10 w-full max-w-8xl mx-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        
        {/* Left Side - Logo */}
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left mb-4 md:mb-0">
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            className="text-[#00ffcc] mb-2 md:mb-0 md:mr-4"
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          
          {/* Contact Info - Now Positioned to the Right of the Logo */}
          <div className="text-center md:text-left">
            <p>Email: <a href="mailto:support@accutrack.com" className="hover:underline">support@accutrack.com</a></p>
            <p>Phone: <a href="tel:+1800123BOOK" className="hover:underline">+1-800-123-BOOK</a></p>
            <p>Address: Brock University</p>
          </div>
        </div>

        {/* Center - Copyright */}
        <div className="text-center text-sm md:text-base">
          © 2025 AccuTrack. All rights reserved.
        </div>

        {/* Right Side - Social Media Icons */}
        <div className="flex gap-4 mt-4 md:mt-0">
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
