'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function Header() {
    const { user, isSignedIn } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className='p-5 flex justify-between items-center shadow-lg bg-[#1c2230] backdrop-blur-sm z-40 relative'>
            {/* Logo */}
            <Link href="/" className="flex flex-row items-center gap-2">
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
                <span className='text-[#00ffcc] font-black text-4xl' style={{ fontFamily: "Calibri" }}>AccuTrack</span>
            </Link>

            {/* Hamburger Icon */}
            <button className="md:hidden text-white" onClick={toggleMenu}>
                {menuOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Navigation Links */}
            <div className={`absolute top-16 right-5 bg-[#1c2230] shadow-lg rounded-lg p-4 space-y-6 md:hidden z-50 ${menuOpen ? 'block' : 'hidden'}`}>
                {isSignedIn ? (
                    <>
                        <Link href="/dashboard">
                            <Button className="w-full bg-[#bbbbbb] text-black font-bold hover:bg-gray-100 mb-2">Dashboard</Button>
                        </Link>
                        <Link href="/inventory">
                            <Button className="w-full bg-purple-500/20 text-purple-300 font-bold hover:bg-purple-500/30 mb-2 py-2">Inventory</Button>
                        </Link>
                        <Link href="/expenses">
                            <Button className="w-full bg-teal-500/20 text-teal-300 font-bold hover:bg-teal-500/30 mb-2">Expenses</Button>
                        </Link>
                        <Link href="/income">
                            <Button className="w-full bg-blue-500/20 text-blue-300 font-bold hover:bg-blue-500/30 mb-2">Income</Button>
                        </Link>
                        <div className="w-full mb-2">
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </>
                ) : (
                    <>
                        <Link href="/sign-in">
                            <Button className="w-full bg-[#bbbbbb] text-black font-bold hover:bg-gray-100 mb-2">Sign In</Button>
                        </Link>
                        <Link href="/sign-up">
                            <Button className="w-full bg-blue-500/20 text-blue-300 font-bold hover:bg-blue-500/30 mb-2">Get Started</Button>
                        </Link>
                    </>
                )}
            </div>

            {/* Desktop Navigation */}
            <div className='hidden md:flex gap-4 items-center'>
                {isSignedIn ? (
                    <>
                        <Link href="/dashboard">
                            <Button className="bg-[#bbbbbb] text-black font-bold hover:bg-gray-100 transition-all duration-200 px-6">
                                Dashboard
                            </Button>
                        </Link>

                        <Link href="/inventory">
                            <Button className="bg-purple-500/20 text-purple-300 font-bold hover:bg-purple-500/30 transition-all duration-200 px-6 py-2">
                                Inventory
                            </Button>
                        </Link>

                        <Link href="/expenses">
                            <Button className="bg-teal-500/20 text-teal-300 font-bold hover:bg-teal-500/30 transition-all duration-200 px-6">
                                Expenses
                            </Button>
                        </Link>

                        <Link href="/income">
                            <Button className="bg-blue-500/20 text-blue-300 font-bold hover:bg-blue-500/30 transition-all duration-200 px-6">
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
