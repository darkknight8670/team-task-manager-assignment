"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton({ className }) {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/login" })} 
      className={className}
    >
      Sign Out
    </button>
  );
}
