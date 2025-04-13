'use client'
/**
 * Header Section
 *
 * This component renders the top navigation bar of the AccuTrack app.
 * Includes the logo, navigation links (Dashboard, Inventory, Expenses, Income)
 * and user authentication buttons (Sign In, Sign Up), and user profile button/ clerk user buttons.
 * Navigation links reduce to hamburger menu for mobile view
 * 
 * Notable Features:
 * - Responsive design (hamburger menu for mobile)
 * - User authentication (Sign In, Sign Up, User Profile)
 * - Branding with animated logo and subscription badge
 * - Clerk user button with sign-out functionality
 */
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useUser, UserButton } from '@clerk/nextjs' // Importing the Clerk auth tools for user status and profile menu
import Link from 'next/link'
import { useSubscriptionStore } from '@/lib/store' // Importing the subscription store for managing subscription state

/**
 * JSX template for the common header section across most pages.
 * Includes logos, navigation, and viewport scaling.
 * @returns JSX component.
 */

export default function Header() {
    // State management for logged in users, hamburger menus, and user subscription status.
    const { user, isSignedIn } = useUser(); // Importing user authentication status and user object from Clerk
    const [menuOpen, setMenuOpen] = useState(false); // State for managing the hamburger menu open/close status
    const isSubscribed = useSubscriptionStore((state) => 
        state.subscriptions[user?.id] || false
    );

    // Toggles the hamburger menu when pressed.
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Header components
    return (
        <div className='p-5 flex justify-between items-center shadow-lg bg-[#1c2230] backdrop-blur-sm z-40 relative'>
            {/* Logo */}
            <Link href="/" className="flex flex-row items-center gap-3 group">
                <div className="relative">
                    <svg 
                        width="36" 
                        height="36" 
                        viewBox="0 0 24 24" 
                        className="text-blue-500 transform transition-transform duration-500 ease-out group-hover:rotate-180"
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    
                </div>
                <span className='bg-white bg-clip-text text-transparent font-black text-3xl tracking-tight relative group-hover:tracking-wide transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-500 group-hover:after:w-full after:transition-all after:duration-300'>
                    AccuTrack {isSignedIn && isSubscribed && <span className="text-xs align-top text-purple-400">PRO</span>}
                </span>
            </Link>

            {/* Hamburger Icon */}
            <button className="md:hidden text-white/90 hover:text-white transition-colors" onClick={toggleMenu}>
                {menuOpen ? (
                    <svg className="w-6 h-6 transform transition-transform duration-200 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Mobile Navigation */}
            <div className={`absolute top-[72px] right-0 left-0 bg-[#0c1015]/95 backdrop-blur-lg border-b border-white/5 p-4 space-y-2 md:hidden transition-all duration-300 ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                {isSignedIn ? (
                    <>
                        <Link href="/dashboard" className="block">
                            <Button className="w-full bg-white/10 text-white hover:bg-white/20 transition-all duration-200 py-6 text-sm font-medium">Dashboard</Button>
                        </Link>
                        <Link href="/inventory" className="block">
                            <Button className="w-full bg-purple-500/10 text-purple-200 hover:bg-purple-500/20 transition-all duration-200 py-6 text-sm font-medium">Inventory</Button>
                        </Link>
                        <Link href="/expenses" className="block">
                            <Button className="w-full bg-teal-500/10 text-teal-200 hover:bg-teal-500/20 transition-all duration-200 py-6 text-sm font-medium">Expenses</Button>
                        </Link>
                        <Link href="/income" className="block">
                            <Button className="w-full bg-blue-500/10 text-blue-200 hover:bg-blue-500/20 transition-all duration-200 py-6 text-sm font-medium">Income</Button>
                        </Link>
                        <div className="pt-2 pb-1 flex justify-center">
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </>
                ) : (
                    <>
                        <Link href="/sign-in" className="block">
                            <Button className="w-full bg-white/10 text-white hover:bg-white/20 transition-all duration-200 py-6">Sign In</Button>
                        </Link>
                        <Link href="/sign-up" className="block">
                            <Button className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:opacity-90 transition-all duration-200 py-6">Get Started</Button>
                        </Link>
                    </>
                )}
            </div>

            {/* Desktop Navigation */}
            <div className='hidden md:flex gap-4 items-center'>
                {isSignedIn ? (
                    <>
                        <Link href="/dashboard">
                            <Button className="bg-[#bbbbbb] text-black font-bold hover:bg-gray-100 transition-all duration-200 px-7 py-4 text-base">
                                Dashboard
                            </Button>
                        </Link>

                        <Link href="/inventory">
                            <Button className="bg-purple-500/20 text-purple-300 font-bold hover:bg-purple-500/30 transition-all duration-200 px-7 py-4 text-base">
                                Inventory
                            </Button>
                        </Link>

                        <Link href="/expenses">
                            <Button className="bg-teal-500/20 text-teal-300 font-bold hover:bg-teal-500/30 transition-all duration-200 px-7 py-4 text-base">
                                Expenses
                            </Button>
                        </Link>

                        <Link href="/income">
                            <Button className="bg-blue-500/20 text-blue-300 font-bold hover:bg-blue-500/30 transition-all duration-200 px-7 py-4 text-base">
                                Income
                            </Button>
                        </Link>

                        <div className="ml-2">
                            <UserButton afterSignOutUrl="/"/>
                        </div>
                    </>
                ) : (
                    <>
                        <Link href="/sign-in">
                            <Button className="bg-[#bbbbbb] text-black font-bold hover:bg-gray-100 transition-all duration-200 px-6">
                                Sign In
                            </Button>
                        </Link>

                        <Link href="/sign-up">
                            <Button className="bg-blue-500/20 text-blue-300 font-bold hover:bg-blue-500/30 transition-all duration-200 px-6">
                                Get Started
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

