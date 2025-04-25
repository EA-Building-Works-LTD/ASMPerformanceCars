"use client";

import dynamic from 'next/dynamic';

// Dynamically import the TransportationCalculatorForm with no SSR
const TransportationCalculatorForm = dynamic(
  () => import('./TransportationCalculatorForm').then(mod => mod.TransportationCalculatorForm),
  { ssr: false }
);

export function TransportationFormWrapper() {
  return <TransportationCalculatorForm />;
} 