"use client";

import { useEffect } from "react";

export default function page() {
  useEffect(() => {
    window.location.href = "/chat";
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <h1 className="text-2xl font-bold">Redirecting...</h1>
    </div>
  );
}
