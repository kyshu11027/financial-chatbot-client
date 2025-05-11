"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function LogoButton() {
  return (
    <Button variant="default" size="icon" className="rounded-full p-1">
      <Image
        src="/logo.png"
        alt="Logo"
        width={60}
        height={60}
        className="rounded-full"
      />
    </Button>
  );
}
