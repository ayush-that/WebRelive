import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Menu, LogIn, LogOut } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";

const handleAuth = (
  authenticated: boolean,
  login: () => void,
  logout: () => void
) => {
  if (authenticated) {
    logout();
  } else {
    login();
  }
};

export default function Navbar() {
  const { login, logout, authenticated, user } = usePrivy();
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center mb-1 py-2 pt-4 px-4 md:px-8 lg:px-16 bg-[#0a0a0a] border-b border-[#18181b]">
      <Link href="/" className="flex items-center">
        <Image
          src="/svg/logo.svg"
          alt="logo"
          width={40}
          height={40}
          priority
        />
        <span className="ml-2 text-xl font-bold text-white">WebRe.live</span>
      </Link>
      <div className="hidden md:flex items-center space-x-4">
        <Link href="/dashboard" className="text-gray-400 hover:text-white">
          Dashboard
        </Link>
        <Link href="/search" className="text-gray-400 hover:text-white">
          Search
        </Link>
        <Link href="/docs" className="text-gray-400 hover:text-white">
          Docs
        </Link>
        <Button
          onClick={() => handleAuth(authenticated, login, logout)}
          variant="outline"
        >
          {authenticated ? (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </>
          )}
        </Button>
      </div>
    </nav>
  );
}
