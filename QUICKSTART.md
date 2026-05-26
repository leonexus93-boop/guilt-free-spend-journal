# Quick Start Guide 🚀

## What I Built for You

I've created a **Guilt-Free Spend Journal** with full Firebase integration:

### ✅ Features Implemented

1. **Frictionless Authentication**
   - Users auto-sign-in anonymously (no email required)
   - One-click "Link Account" to upgrade to Google sign-in
   - Data is preserved when linking accounts

2. **Cloud Sync**
   - All entries sync to Firestore automatically
   - Works offline, syncs when back online
   - Data survives device changes and app reinstalls

3. **Error Tracking**
   - Automatic crash reporting via Firebase Analytics
   - Error events logged with stack traces
   - You'll know immediately if something breaks

4. **Beautiful UI**
   - Clean, warm design (not a typical finance app)
   - Mood selector with emojis (😞 to 😄)
   - "Worth it?" toggle (yes/maybe/no)
   - Responsive mobile-first design

## Next Steps (5-10 minutes)

### 1. Create Firebase Project

Go to [Firebase Console](https://console.firebase.google.com/) and:
- Create a new project called `guilt-free-spend-journal`
- Enable **Authentication** → Anonymous + Google sign-in
- Create **Firestore Database** (start in test mode)
- Register a **Web app** and copy the config

### 2. Configure Environment Variables

```bash
cd /home/ubuntu/.openclaw/workspace-mira/guilt-free-spend-journal
cp .env.local.example .env.local
```

Edit `.env.local` and paste your Firebase config values.

### 3. Deploy Firestore Rules

Copy the contents of `firestore.rules` to Firebase Console → Firestore → Rules → Publish.

### 4. Test It

```bash
npm run dev
```

Open http://localhost:3000 and create a spend entry!

### 5. Deploy to Production

**Option A: Vercel (easiest)**
```bash
# Push to GitHub, then import in Vercel
# Add .env.local variables in Vercel dashboard
```

**Option B: Firebase Hosting**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## File Structure

```
guilt-free-spend-journal/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with AuthProvider
│   │   └── page.tsx           # Home page with entry form
│   ├── components/
│   │   ├── SpendEntryForm.tsx # Main entry form component
│   │   └── AuthStatus.tsx     # Auth state + account linking UI
│   ├── contexts/
│   │   └── AuthContext.tsx    # Auth state management
│   └── lib/
│       └── firebase/
│           ├── config.ts      # Firebase initialization
│           ├── auth.ts        # Auth service
│           ├── firestore.ts   # Firestore service
│           └── crashlytics.ts # Error tracking
├── firestore.rules            # Security rules
├── .env.local.example         # Environment template
├── FIREBASE_SETUP.md          # Detailed Firebase guide
└── README.md                  # Full documentation
```

## Data Model

Each spend entry has:
```typescript
{
  userId: string;        // Firebase Auth UID
  amount: number;        // e.g., 3.50
  category: string;      // e.g., "Food & Drink"
  description: string;   // e.g., "Latte at Monmouth Coffee"
  moodScore: number;     // 1-5
  worthIt: 'yes' | 'maybe' | 'no';
  createdAt: Timestamp;
}
```

## Questions?

- **FIREBASE_SETUP.md** — Detailed Firebase configuration guide
- **README.md** — Full project documentation
- **firestore.rules** — Security rules for Firestore

---

**Ready to test?** Follow the steps above and let me know if you hit any issues! 🎉
