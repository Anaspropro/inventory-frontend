"use client";

import dataProviderNestjsxCrud from "@refinedev/nestjsx-crud";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://inventory-backend-xhg7.onrender.com/"
    : "http://localhost:3001";

export const dataProvider = dataProviderNestjsxCrud(API_URL); 
