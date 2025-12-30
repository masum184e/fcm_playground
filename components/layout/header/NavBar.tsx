"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className=" flex items-center justify-between sticky top-0 z-50 max-w-screen-xl mx-auto px-4 md:px-6">
      <div className="flex gap-2">
        <Image
          src="/icon.png"
          alt="FCM Playground"
          height="32"
          width="32"
          className="shrink-0"
        />
        <Link href="/">
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-orange-600 leading-tight">
            FCM Playground
          </h1>
          <p className="text-sm text-muted-foreground">
            Test Client & Admin SDK features in one place
          </p>
        </Link>
      </div>
      {/* <div className="hidden md:flex items-center gap-2 p-1 bg-gray-50/50 rounded-lg border border-gray-100"></div> */}
      <div className="hidden md:flex items-center gap-2 p-1 bg-white/50 backdrop-blur-sm rounded-lg w-fit">
        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          <Link
            href="/client"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-all duration-300 active:scale-95"
          >
            Client
          </Link>
          <Link
            href="/admin"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-all duration-300 active:scale-95"
          >
            Admin
          </Link>
          <Link
            href="https://console.firebase.google.com/"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-all duration-300 active:scale-95"
          >
            Console
          </Link>
        </div>

        {/* Vertical Divider */}
        <div className="h-4 w-[1px] bg-gray-200 mx-1" />

        {/* Version Badge */}
        <div className="flex items-center px-2 py-1 bg-orange-50 border border-orange-100 rounded-full">
          <span className="text-[10px] uppercase tracking-wider font-bold text-orange-600/80 mr-1">
            Ver
          </span>
          <span className="text-xs font-mono font-semibold text-orange-600">
            1.0.0
          </span>
        </div>
      </div>
      <button
        className="md:hidden p-2 text-gray-600 hover:bg-orange-50 rounded-md transition-colors cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-orange-100 p-4 flex flex-col gap-2 shadow-xl animate-in slide-in-from-top-2">
          <Link
            href="/client"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-all duration-300 active:scale-95"
          >
            Client
          </Link>
          <Link
            href="/admin"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-all duration-300 active:scale-95"
          >
            Admin
          </Link>
          <Link
            href="https://console.firebase.google.com/"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-all duration-300 active:scale-95"
          >
            Console
          </Link>
          <div className="flex items-center px-2 py-1 bg-orange-50 border border-orange-100 rounded-full">
            <span className="text-[10px] uppercase tracking-wider font-bold text-orange-600/80 mr-1">
              Ver
            </span>
            <span className="text-xs font-mono font-semibold text-orange-600">
              1.0.0
            </span>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
