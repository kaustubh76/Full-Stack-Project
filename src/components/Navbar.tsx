"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'


const Navbar = () => {
    const { data: session } = useSession()

    const user: User  = session?.user as User

  return (
    <nav>
        <div>
            <a className='text-xl font-bold mb-4:mb-0' href = "#">Mystry Message</a>
            {
                session ? (
                    <>
                    <span className='mr-4'>
                        Welcome, {user.username || user?.email}
                    </span>
                    <Button className='w-full md:w-auto' onClick={() => signOut()}>Sign Out</Button>
                    </> 
                    ) : (
                        <Link href="/sign-in">
                           <Button className='w-full md:w-auto'>Login</Button>
                        </Link>
                    )
            }
        </div>
    </nav>
  )
}

export default Navbar