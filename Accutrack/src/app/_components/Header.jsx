'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function Header() {
    const { user, isSignedIn} = useUser();
    return (
        <div className='p-5 flex justify-between items-center shadow-lg'>
            <div className="flex flex-row items-center">
                <Image src={'./logo.svg'} alt='logo' width={70} height={50}/>
                <span className='text-teal-500 font-bold text-xl' style={{ fontFamily: "'Lucida Handwriting', cursive, bold" }}>Name</span>
            </div>
            {isSignedIn ?
                <div className='flex gap-7 items-center'>
                    <Link href="/">
                    <Button className="bg-transparent text-white">Dashboard</Button>
                    </Link>

                    <Link href="/expenses">
                    <Button className="bg-transparent text-white">Expenses</Button>
                    </Link>

                    <Link href="/income">
                    <Button className="bg-transparent text-white">Income</Button>
                    </Link>

                    <UserButton/>
                </div> : 
                <div className='flex gap-7 items-center'>
                    {/* Add return to home page*/}
                    <Link href="/">
                        <Button className="bg-transparent text-white">Home</Button>
                    </Link>

                    <Link href="/features">
                        <Button className="bg-transparent text-white">Features</Button>
                    </Link>

                    {/* Add scroll to contacts info at bottom of landing page*/}
                    <Button className="bg-transparent text-white">Contact</Button>

                    <Link href="/sign-in">
                        <Button className="bg-transparent text-white">Login</Button>
                    </Link>
                </div>}
        </div>
    )
}