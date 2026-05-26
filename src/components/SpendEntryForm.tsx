'use client';

import React, { useState } from 'react';
import { createEntry } from '@/lib/firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

interface SpendEntryFormProps {
  onEntryCreated?: () => void;
}

const CATEGORIES = [
  'Food & Drink',
  'Transport',
  'Shopping',
  'Entertainment',
  'Health',
  'Bills & Utilities',
  'Personal Care',
  'Gifts',
  'Other',
];

export default function SpendEntryForm({ onEntryCreated }: SpendEntryFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    category: CATEGORIES[0],
    description: '',
    moodScore: 3,
    worthIt: 'maybe' as 'yes' | 'maybe' | 'no',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create an entry');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      await createEntry({
        amount,
        category: formData.category,
        description: formData.description,
        moodScore: formData.moodScore,
        worthIt: formData.worthIt,
        createdAt: new Date(),
      });

      setSuccess(true);
      
      // Reset form
      setFormData({
        amount: '',
        category: CATEGORIES[0],
        description: '',
        moodScore: 3,
        worthIt: 'maybe',
      });

      onEntryCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMoodEmoji = (score: number) => {
    const emojis = ['😞', '😕', '😐', '🙂', '😄'];
    return emojis[score - 1] || '😐';
  };

  const getWorthItColor = (value: string) => {
    switch (value) {
      case 'yes': return 'bg-green-100 text-green-800 border-green-300';
      case 'maybe': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'no': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        How did this make you feel?
      </h2>

      {/* Amount */}
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
          Amount (£)
        </label>
        <input
          type="number"
          id="amount"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
          placeholder="0.00"
          required
        />
      </div>

      {/* Category */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          What did you spend on?
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          rows={3}
          placeholder="Be specific... e.g., 'Latte at Monmouth Coffee'"
          required
        />
      </div>

      {/* Mood Score */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How did it make you feel?
        </label>
        <div className="flex justify-between gap-2">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => setFormData({ ...formData, moodScore: score })}
              className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                formData.moodScore === score
                  ? 'border-green-500 bg-green-50 scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{getMoodEmoji(score)}</span>
              <span className="block text-xs text-gray-600 mt-1">{score}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Worth It */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Was it worth it?
        </label>
        <div className="flex gap-3">
          {(['yes', 'maybe', 'no'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFormData({ ...formData, worthIt: value })}
              className={`flex-1 py-3 rounded-lg border-2 font-medium capitalize transition-all ${
                formData.worthIt === value
                  ? getWorthItColor(value)
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Entry saved successfully! ✨
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors text-lg"
      >
        {isSubmitting ? 'Saving...' : 'Save Entry'}
      </button>
    </form>
  );
}
