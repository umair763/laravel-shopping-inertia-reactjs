import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';

function PersonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

export default function DropDown() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-cyan-400/60 hover:bg-white/10"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <PersonIcon />
      </button>

      {open ? (
        <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-sm font-semibold text-white">Sign in</p>
            <p className="mt-1 text-xs text-slate-400">Choose the right entry point for your role.</p>
          </div>

          <div className="p-2">
            <Link
              href="/login"
              className="block rounded-xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
              onClick={() => setOpen(false)}
            >
              User login
            </Link>
            <Link
              href="/admin/login"
              className="block rounded-xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
              onClick={() => setOpen(false)}
            >
              Admin login
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}