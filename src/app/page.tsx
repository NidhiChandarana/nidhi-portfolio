'use client';

import dynamic from "next/dynamic";

// Load Portfolio only on the client (charts / browser-only features)
const Portfolio = dynamic(() => import("@/components/Portfolio"), { ssr: false });

export default function Page() {
  return <Portfolio />;
}
