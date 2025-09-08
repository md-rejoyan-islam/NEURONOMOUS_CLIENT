'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ThemeToggle } from '../shared/theme-toggle';

const HomepageHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header
      className={clsx(
        'fixed top-0 right-0 left-0 z-50 border-b border-slate-200 bg-white/75 backdrop-blur-md dark:border-slate-800/50 dark:bg-[#050816]/80',
        isMenuOpen && 'bg-white/95 dark:bg-[#050816]/95'
      )}
    >
      <div className="relative z-50 container mx-auto flex max-w-7xl items-center justify-between p-4">
        <a href="#" className="flex items-center space-x-2">
          <Image
            src={'/logo.png'}
            alt="Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />

          <span className="text-xl font-bold">Neuronomous</span>
        </a>
        <nav className="hidden items-center space-x-8 lg:flex">
          <a
            href="#features"
            className="text-slate-600 transition hover:text-teal-400 dark:text-slate-400"
          >
            Features
          </a>
          <a
            href="#devices"
            className="text-slate-600 transition hover:text-teal-400 dark:text-slate-400"
          >
            Devices
          </a>
          <a
            href="#how-it-works"
            className="text-slate-600 transition hover:text-teal-400 dark:text-slate-400"
          >
            How It Works
          </a>
          <a
            href="#contact"
            className="text-slate-600 transition hover:text-teal-400 dark:text-slate-400"
          >
            Contact
          </a>
        </nav>
        <div className="flex items-center space-x-2">
          <Link href={'/login'}>
            <motion.span
              className="hidden rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white sm:inline-block"
              whileHover={{
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
              }}
            >
              Dashboard Login
            </motion.span>
          </Link>

          <ThemeToggle size="h-8 w-8" />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="cursor-pointer p-2 lg:hidden"
            aria-label="Open menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div
        className={clsx(
          'absolute top-[104%] right-0 left-0 mx-auto flex w-[98vw] flex-col space-y-2 rounded-b-md bg-[#FDFEFE] px-4 pt-2 pb-4 transition-all duration-300 lg:hidden dark:bg-[#050816]',
          isMenuOpen ? 'translate-y-0' : '-translate-y-[200%] opacity-0'
        )}
      >
        <a
          href="#features"
          className="block py-2 text-slate-600 dark:text-slate-400"
        >
          Features
        </a>
        <a
          href="#devices"
          className="block py-2 text-slate-600 dark:text-slate-400"
        >
          Devices
        </a>
        <a
          href="#how-it-works"
          className="block py-2 text-slate-600 dark:text-slate-400"
        >
          How It Works
        </a>
        <a
          href="#contact"
          className="block py-2 text-slate-600 dark:text-slate-400"
        >
          Contact
        </a>
        <Link href={'/login'} aria-label="Dashboard Login">
          <motion.span
            className="block w-full rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white sm:hidden"
            whileHover={{
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
            }}
          >
            Dashboard Login
          </motion.span>
        </Link>
      </div>
    </header>
  );
};

export default HomepageHeader;
