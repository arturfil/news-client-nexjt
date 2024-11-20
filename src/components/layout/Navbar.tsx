'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  
  return (
    <nav className="bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          <Link href="/" className="text-xl font-bold">
            LegisNews
          </Link>
          <div className="ml-10 flex space-x-4">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md ${
                pathname === '/' ? 'bg-gray-500' : 'hover:bg-gray-300'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/admin" 
              className={`px-3 py-2 rounded-md ${
                pathname === '/admin' ? 'bg-gray-900' : 'hover:bg-gray-700'
              }`}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
