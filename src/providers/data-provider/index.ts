"use client";

import dataProviderNestjsxCrud from "@refinedev/nestjsx-crud";

const API_URL = "http://localhost:3001";

export const dataProvider = dataProviderNestjsxCrud(API_URL);
