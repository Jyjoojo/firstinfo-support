"use client";

import { useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import Image from 'next/image';
import Link from "next/link";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 z-50 transition-all ${
        isScrolled ? "shadow-md py-3" : "shadow-sm py-4"
      }`}
    >
      <div className="flex justify-between items-center max-w-container-max mx-auto w-full">
        <div className="flex items-center gap-8">
          <Image
            src="/logofirstinfo-v2.png"
            width={100}
            height={10}
            className="font-headline-md text-headline-md font-bold text-tertiary"
            alt="First Info CI Logo"
          />
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#faq"
              className="font-body-md text-body-md text-on-surface-variant border-primary pb-1"
            >
              Notre Expertise
            </a>
            <a
              href="#solutions"
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Nos Solutions
            </a>
            <a
              href="#contact"
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Contact
            </a>
            <a
              href="#"
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Support
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <SearchInput />
          <Link href="/login" className="bg-primary hover:bg-primary/90 text-on-primary px-6 py-2 rounded-full font-label-sm text-label-sm transition-all active:scale-95 shadow-sm">
            Se connecter
          </Link>
        </div>
      </div>
    </header>
  );
}
