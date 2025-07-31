"use client";

import type { PropsWithChildren } from "react";
import { Breadcrumb } from "../breadcrumb";
import Menu from "../menu";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="grid grid-cols-[250px_1fr] gap-5 text-purple-800 bg-gradient-to-br from-violet-200 via-violet-300 to-purple-400 h-screen p-4 font-mono ">
      <Menu />
      <div className="flex flex-col shadow-2xl p-4 rounded-xl bg-gray-50 dark:bg-black">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
