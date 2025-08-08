"use client";

import type { PropsWithChildren } from "react";
import Menu from "../menu";
import { MenuProvider, useMenu } from "./menu-context";

const LayoutContent: React.FC<PropsWithChildren> = ({ children }) => {
  const { isMenuOpen, closeMenu } = useMenu();

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5 text-purple-800 bg-gradient-to-br from-violet-200 via-violet-300 to-purple-400 min-h-svh p-4 font-mono">
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-purple-800">Menu</h2>
            <button
              onClick={closeMenu}
              className="text-purple-600 hover:text-purple-800 transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav>
            <ul className="space-y-2">
              <Menu />
            </ul>
          </nav>
        </div>
      </div>

      {/* Sidebar - Hidden on mobile, visible on md and up */}
      <div className="sidebar-responsive border-purple-600 border-1 rounded-md h-screen bg-white shadow-lg p-4">
        <nav>
          <ul className="space-y-2">
            <Menu />
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="main-responsive flex flex-col shadow-2xl p-1 rounded-xl bg-gray-50 dark:bg-black">
        <div>{children}</div>
      </div>
    </div>
  );
};

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <MenuProvider>
      <LayoutContent>{children}</LayoutContent>
    </MenuProvider>
  );
};
