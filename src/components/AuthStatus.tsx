'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithGoogle, linkWithGoogle, signOut } from '@/lib/firebase/auth';

export default function AuthStatus() {
  const { user, isAnonymous } = useAuth();
  const [isLinking, setIsLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLinkWithGoogle = async () => {
    if (!user) return;
    
    setIsLinking(true);
    setError(null);

    try {
      if (isAnonymous) {
        // Link anonymous account with Google (preserves existing data)
        await linkWithGoogle();
      } else {
        // Already has a linked account, just sign in
        await signInWithGoogle();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to link account');
    } finally {
      setIsLinking(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Will auto re-sign-in anonymously via AuthContext
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {/* User info */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-700 font-medium">
              {user.email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
        )}
        
        <div>
          {isAnonymous ? (
            <span className="text-gray-500">Anonymous session</span>
          ) : (
            <span className="font-medium">{user.displayName || user.email}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {isAnonymous && (
          <button
            onClick={handleLinkWithGoogle}
            disabled={isLinking}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
            title="Link your account to save data permanently"
          >
            {isLinking ? 'Linking...' : 'Link Account'}
          </button>
        )}
        
        <button
          onClick={handleSignOut}
          className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          title="Sign out (will start new anonymous session)"
        >
          Sign Out
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
