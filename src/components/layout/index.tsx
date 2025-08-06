"use client";

import type { PropsWithChildren } from "react";
import { Breadcrumb } from "../breadcrumb";
import Menu from "../menu";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="grid grid-cols-[200px_1fr] gap-5 text-purple-800 bg-gradient-to-br from-violet-200 via-violet-300 to-purple-400 min-h-svh p-4 font-mono ">
      <div className="border-purple-600 border-1 rounded-md mt-10 h-fit top-5 sticky">
        <Menu />
      </div>
      <div className="flex flex-col shadow-2xl p-1 rounded-xl bg-gray-50 dark:bg-black">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
