'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function Header() {
    const { user, isSignedIn} = useUser();
    return (
        <div className='p-5 flex justify-between items-center shadow-lg bg-[#1c2230] backdrop-blur-sm'>
            <div className="flex flex-row items-center gap-2">
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
                <span className='text-[#00ffcc] font-black text-4xl' style={{ fontFamily: "'Lucida Handwriting', cursive" }}>AccuTrack</span>

            </div>
            {isSignedIn ?
                <div className='flex gap-4 items-center'>
                    <Link href="/">
                        <Button className="bg-gray-800/50 text-[#bbbbbb] font-bold hover:bg-gray-700/50 transition-all duration-200 px-6">
                            Dashboard
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
                </div> : 
                <div className='flex gap-4 items-center'>
                    <Link href="/">
                        <Button className="bg-[#bbbbbb] text-black font-bold hover:bg-gray-100 transition-all duration-200 px-6">
                            Register
                        </Button>
                    </Link>


                    <Link href="/">
                        <Button className="bg-teal-500/20 text-teal-300 font-bold hover:bg-teal-500/30 transition-all duration-200 px-6">
                            Home
                        </Button>
                    </Link>

                    <Link href="/features">
                        <Button className="bg-teal-500/20 text-teal-300 font-bold hover:bg-teal-500/30 transition-all duration-200 px-6">
                            Features
                        </Button>
                    </Link>

                    <Link href="/">
                    <Button className="bg-teal-500/20 text-teal-300 font-bold hover:bg-teal-500/30 transition-all duration-200 px-6">
                            Contact Us
                        </Button>
                    </Link>

                    <Link href="/sign-in">
                        <Button className="bg-blue-500/20 text-blue-300 font-bold hover:bg-blue-500/30 transition-all duration-200 px-6">
                            Login
                        </Button>
                    </Link>
                </div>}
        </div>
    )
}