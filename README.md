# Guilt-Free Spend Journal ✨

A mindful spending tracker that focuses on understanding your relationship with money—not restricting it.

## What Makes It Different

Most finance apps make you feel judged. This one asks three simple questions after each spend:
1. **What did you spend?**
2. **How did it make you feel?** (mood 1-5)
3. **Was it worth it?** (yes/maybe/no)

Over time, you'll see the correlation between spending and wellbeing—not what you saved, but what actually made you happier.

## Features

### ✅ Implemented (v0.1 with Firebase)
- **Frictionless onboarding** — Anonymous sign-in by default, no email required
- **Spend entry form** — Amount, category, description, mood score, "worth it?" rating
- **Cloud sync** — Data automatically syncs to Firestore, works offline
- **Account upgrade** — Link anonymous account to Google for account recovery
- **Error tracking** — Automatic crash reporting via Firebase Crashlytics
- **Analytics** — Understand which features users actually use

### 🚧 Coming Soon
- Dashboard with spending breakdowns by category
- Mood correlation insights ("You rate coffees 2/5 but buy 4/week")
- Weekly/monthly reports
- Export to CSV/JSON
- Custom categories
- PWA for mobile installation

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Backend:** Firebase (Auth, Firestore, Crashlytics, Analytics)
- **Language:** TypeScript
- **Deployment:** Vercel (recommended) or Firebase Hosting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Firebase account (free tier is sufficient)

### Installation

1. **Clone/navigate to the project**
   ```bash
   cd /home/ubuntu/.openclaw/workspace-mira/guilt-free-spend-journal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   
   Follow the guide in [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md) to:
   - Create a Firebase project
   - Enable Authentication (Anonymous + Google)
   - Create Firestore database
   - Deploy security rules
   - Copy config to `.env.local`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open http://localhost:3000**

   You'll be automatically signed in anonymously. Create a spend entry and watch it sync to Firestore!

## Project Structure

```
guilt-free-spend-journal/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout with AuthProvider
│   ├── page.tsx              # Home page (entry form)
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── SpendEntryForm.tsx    # Main entry form
│   └── AuthStatus.tsx        # Auth state + account linking
├── contexts/                 # React contexts
│   └── AuthContext.tsx       # Auth state management
├── lib/                      # Utilities and services
│   └── firebase/
│       ├── config.ts         # Firebase initialization
│       ├── auth.ts           # Auth service wrapper
│       ├── firestore.ts      # Firestore service wrapper
│       └── crashlytics.ts    # Error tracking
├── firestore.rules           # Firestore security rules
├── .env.local.example        # Environment variables template
└── FIREBASE_SETUP.md         # Detailed Firebase setup guide
```

## Firebase Architecture

### Authentication Flow

1. **New user** → Automatically signed in anonymously (no friction)
2. **Data created** → Associated with anonymous user ID
3. **User wants to keep data** → Clicks "Link Account" → Signs in with Google
4. **Account linked** → Anonymous data preserved, now recoverable on any device

### Firestore Data Model

```typescript
interface SpendEntry {
  id: string;
  userId: string;          // Firebase Auth UID
  amount: number;          // In GBP (or local currency)
  category: string;        // e.g., "Food & Drink"
  description: string;     // User's description
  moodScore: number;       // 1-5
  worthIt: 'yes' | 'maybe' | 'no';
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  synced: boolean;
}
```

### Security Rules

Firestore rules ensure users can only access their own data:

```javascript
allow read, write: if request.auth.uid == resource.data.userId;
```

## Deployment

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables from `.env.local`
4. Deploy!

### Option 2: Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Contributing

This is a personal project, but feel free to:
- Report bugs
- Suggest features
- Submit PRs

## License

MIT

---

**Built with ❤️ by Huaiyao**

*Remember: The goal isn't to spend less—it's to spend on what actually makes you happy.*
