import React from 'react';
import { PokerApplicationForm } from './components/PokerApplicationForm';

export default function App() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <PokerApplicationForm />
    </React.Suspense>
  );
}