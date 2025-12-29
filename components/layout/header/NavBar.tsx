import React from "react";

const NavBar = () => {
  return (
    <nav className="border-b bg-background py-4 flex items-center justify-between sticky top-0 z-50 max-w-[88rem] mx-auto">
      <div>
        <h1 className="text-xl font-bold tracking-tight">FCM Playground</h1>
        <p className="text-sm text-muted-foreground">
          Test Client & Admin SDK features in one place
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-xs font-mono bg-muted px-2 py-1 rounded border">
          v1.0.0
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
