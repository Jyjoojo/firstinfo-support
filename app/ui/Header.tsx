"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full flex justify-between items-center px-gutter max-w-container-max mx-auto bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 z-50 transition-all ${
        isScrolled ? "shadow-md py-3" : "shadow-sm py-4"
      }`}
    >
      <div className="flex items-center gap-8">
        <span className="font-headline-md text-headline-md font-bold text-primary">
          First Info CI
        </span>
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#"
            className="font-body-md text-body-md text-primary font-bold border-b-2 border-primary pb-1"
          >
            Expertise
          </a>
          <a
            href="#solutions"
            className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
          >
            Solutions
          </a>
          <a
            href="#"
            className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
          >
            Support
          </a>
          <a
            href="#"
            className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
          >
            Tarifs
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-full border border-outline-variant/30">
          <Icon name="search" className="text-outline" />
          <span className="text-label-sm font-label-sm text-on-surface-variant">
            Rechercher...
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-surface-container-low transition-all">
            <Icon name="help" className="text-on-surface-variant" />
          </button>
          <button className="p-2 rounded-full hover:bg-surface-container-low transition-all">
            <Icon name="notifications" className="text-on-surface-variant" />
          </button>
        </div>
        <a
          href="#"
          className="bg-primary hover:bg-primary/90 text-on-primary px-6 py-2 rounded-lg font-label-sm text-label-sm transition-all active:scale-95 shadow-sm"
        >
          Se connecter
        </a>
      </div>
    </header>
  );
}
