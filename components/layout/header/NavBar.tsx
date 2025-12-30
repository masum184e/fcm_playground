import Image from "next/image";
import Link from "next/link";
import React from "react";

const NavBar = () => {
  return (
    <nav className=" flex items-center justify-between sticky top-0 z-50 max-w-screen-xl mx-auto">
      <div className="flex gap-2">
        <Image src="/icon.png" alt="FCM Playground" height="32" width="32" />
        <Link href="/">
          <h1 className="text-xl font-bold tracking-tight text-orange-600">
            FCM Playground
          </h1>
          <p className="text-sm text-muted-foreground">
            Test Client & Admin SDK features in one place
          </p>
        </Link>
      </div>
      <div className="flex items-center gap-2 p-1 bg-white/50 backdrop-blur-sm rounded-lg w-fit">
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
    </nav>
  );
};

export default NavBar;
