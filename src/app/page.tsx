'use client';

import React, { useState, useEffect, useCallback } from 'react';
import SpendEntryForm from '@/components/SpendEntryForm';
import AuthStatus from '@/components/AuthStatus';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToEntries, SpendEntry } from '@/lib/firebase/firestore';

export default function Home() {
  const { user, loading } = useAuth();
  const [entries, setEntries] = useState<SpendEntry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);

  useEffect(() => {
    if (!user || loading) return;

    setIsLoadingEntries(true);
    const unsubscribe = subscribeToEntries(
      (newEntries) => {
        setEntries(newEntries);
        setIsLoadingEntries(false);
      },
      (error) => {
        console.error('Failed to load entries:', error);
        setIsLoadingEntries(false);
      }
    );

    return () => unsubscribe();
  }, [user, loading]);

  const getMoodEmoji = (score: number) => {
    const emojis = ['😞', '😕', '😐', '🙂', '😄'];
    return emojis[score - 1] || '😐';
  };

  const getWorthItBadge = (worthIt: string) => {
    switch (worthIt) {
      case 'yes': return 'bg-green-100 text-green-800';
      case 'maybe': return 'bg-yellow-100 text-yellow-800';
      case 'no': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Guilt-Free Spend Journal ✨
            </h1>
          </div>
          <AuthStatus />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Entry Form */}
        <SpendEntryForm />

        {/* Entries List */}
        <div className="mt-10">
          {isLoadingEntries ? (
            <div className="text-center text-gray-500 py-8">Loading entries...</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl">📝</span>
              <p className="text-gray-500 mt-3 text-lg">
                No entries yet. Add your first spend above!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Recent Entries ({entries.length})
              </h2>
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    {/* Mood */}
                    <div className="text-2xl" title={`Mood: ${entry.moodScore}/5`}>
                      {getMoodEmoji(entry.moodScore)}
                    </div>
                    {/* Details */}
                    <div>
                      <p className="font-medium text-gray-800">
                        {entry.description || entry.category}
                      </p>
                      <p className="text-sm text-gray-500">
                        {entry.category} · {entry.createdAt && 'toDate' in entry.createdAt
                          ? (entry.createdAt as any).toDate().toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : entry.createdAt instanceof Date
                            ? entry.createdAt.toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Recently'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Worth it badge */}
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getWorthItBadge(entry.worthIt)}`}
                    >
                      {entry.worthIt}
                    </span>
                    {/* Amount */}
                    <span className="text-lg font-bold text-gray-800">
                      £{entry.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
