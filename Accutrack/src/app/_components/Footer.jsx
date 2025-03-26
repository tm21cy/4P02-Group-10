"use client";

import React from "react";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useSubscriptionStore } from "@/lib/store";
import { IconCrown } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

export default function Footer() {
  const isSubscribed = useSubscriptionStore((state) => state.isSubscribed);
  const { isSignedIn } = useUser();

  return (
    <footer className="bg-[#0f1729] text-gray-300 py-12 px-6 mt-10 w-full border-t border-gray-800/20">
      <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left">
        
        {/* Left - Logo & Contact Info */}
        <div className="flex flex-col items-center md:items-start space-y-8">
          <div className="flex items-center gap-3 group cursor-pointer">
            <svg 
              width="42" 
              height="42" 
              viewBox="0 0 24 24" 
              className="text-blue-500 group-hover:text-blue-400 transition-all duration-300 ease-out"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <h2 className="text-2xl font-bold text-white/90 group-hover:text-white tracking-tight transition-all duration-300">AccuTrack</h2>
          </div>

          <div className="text-sm space-y-3 text-gray-400">
            <p className="flex items-center justify-center md:justify-start gap-3 hover:text-blue-400 transition-all duration-300">
              <span className="text-blue-500 font-medium">Email:</span>
              <a href="mailto:support@accutrack.com">support@accutrack.com</a>
            </p>
            <p className="flex items-center justify-center md:justify-start gap-3 hover:text-blue-400 transition-all duration-300">
              <span className="text-blue-500 font-medium">Phone:</span>
              <a href="tel:+1800123BOOK">+1-800-123-BOOK</a>
            </p>
            <p className="text-gray-500 hover:text-gray-400 transition-all duration-300">
              1812 Sir Issac Brock Way, St. Catharines, ON - L2S3A1
            </p>
            {isSignedIn && isSubscribed && (
              <p className="flex items-center justify-center md:justify-start gap-3">
                <Link 
                  href="/subscription" 
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-all duration-300"
                >
                  <IconCrown className="w-4 h-4" />
                  Manage Pro Subscription
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Center - Copyright */}
        <div className="text-sm text-gray-500 md:text-center self-center">
          <p className="mb-1 hover:text-blue-400 transition-all duration-300">© {new Date().getFullYear()} AccuTrack.</p>
          <p className="hover:text-blue-400 transition-all duration-300">All rights reserved.</p>
        </div>

        {/* Right - Social Media Icons */}
        <div className="flex flex-col items-center md:items-end gap-6">
          <h3 className="text-blue-500 font-medium text-sm tracking-wide uppercase">Connect With Us</h3>
          <div className="flex gap-8">
            {[
              { icon: FaInstagram, href: "https://instagram.com" },
              { icon: FaFacebook, href: "https://facebook.com" },
              { icon: FaTwitter, href: "https://twitter.com" },
              { icon: FaLinkedin, href: "https://linkedin.com" }
            ].map((social, index) => (
              <Link key={index} href={social.href} target="_blank" className="group">
                <social.icon className="text-gray-500 group-hover:text-blue-400 text-xl transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 ease-out" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
