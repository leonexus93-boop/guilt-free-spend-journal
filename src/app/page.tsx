'use client';

import React from 'react';
import SpendEntryForm from '@/components/SpendEntryForm';
import AuthStatus from '@/components/AuthStatus';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Guilt-Free Spend Journal ✨
            </h1>
            <p className="text-gray-600 mt-2">
              Track not just what you spend, but how it makes you feel
            </p>
          </div>
          <AuthStatus />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <SpendEntryForm />
        
        {/* Coming soon section */}
        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Coming Soon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
            <div className="p-4 bg-white rounded-lg shadow">
              <span className="text-2xl">📊</span>
              <h3 className="font-medium mt-2">Spending Insights</h3>
              <p className="text-sm mt-1">See patterns in your spending</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <span className="text-2xl">💡</span>
              <h3 className="font-medium mt-2">Mood Correlations</h3>
              <p className="text-sm mt-1">What actually makes you happy</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <span className="text-2xl">☁️</span>
              <h3 className="font-medium mt-2">Cloud Sync</h3>
              <p className="text-sm mt-1">Your data, everywhere</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
