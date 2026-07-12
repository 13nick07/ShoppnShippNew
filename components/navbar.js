'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Package, User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include', // send cookies
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
        setUser(null);
      }
    }

    fetchUser();
  }, [pathname]);



  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    router.push('/');
  };

  const isLanding = pathname === '/' || pathname.startsWith('/how-it-works') || pathname.startsWith('/pricing') || pathname.startsWith('/countries') || pathname.startsWith('/for-businesses') || pathname.startsWith('/faq') || pathname.startsWith('/contact');

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">The Parcelo</span>
          </Link>

          {/* Desktop Navigation */}
          {isLanding && (
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                How It Works
              </Link>
              <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="/countries" className="text-sm font-medium hover:text-primary transition-colors">
                Countries
              </Link>
              <Link href="/for-businesses" className="text-sm font-medium hover:text-primary transition-colors">
                For Businesses
              </Link>
              <Link href="/faq" className="text-sm font-medium hover:text-primary transition-colors">
                FAQ
              </Link>
            </div>
          )}

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {isLanding && (
              <>
                <Link href="/how-it-works" className="block text-sm font-medium hover:text-primary">
                  How It Works
                </Link>
                <Link href="/pricing" className="block text-sm font-medium hover:text-primary">
                  Pricing
                </Link>
                <Link href="/countries" className="block text-sm font-medium hover:text-primary">
                  Countries
                </Link>
                <Link href="/for-businesses" className="block text-sm font-medium hover:text-primary">
                  For Businesses
                </Link>
                <Link href="/faq" className="block text-sm font-medium hover:text-primary">
                  FAQ
                </Link>
              </>
            )}
            {user ? (
              <>
                <Link href="/dashboard" className="block text-sm font-medium hover:text-primary">
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="block text-sm font-medium hover:text-primary">
                    Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="block text-sm font-medium hover:text-primary text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-sm font-medium hover:text-primary">
                  Login
                </Link>
                <Link href="/register" className="block text-sm font-medium hover:text-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
