# Firebase Setup Guide

Follow these steps to configure Firebase for the Guilt-Free Spend Journal.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project**
3. Enter project name: `guilt-free-spend-journal` (or your preferred name)
4. Enable/disable Google Analytics (recommended: enable)
5. Click **Create project**

## 2. Register a Web App

1. In Firebase Console, click the **Web** icon (`</>`)
2. Register app nickname: `Guilt-Free Spend Journal Web`
3. **Important:** Check the box "Also set up Firebase Hosting" (optional for now)
4. Click **Register app**

## 3. Copy Firebase Configuration

You'll see a `firebaseConfig` object. Copy these values to `.env.local`:

```bash
cd /home/ubuntu/.openclaw/workspace-mira/guilt-free-spend-journal
cp .env.local.example .env.local
```

Edit `.env.local` and paste your values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 4. Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **Get started**
3. Enable these sign-in methods:
   - **Anonymous** (click Enable, then Save)
   - **Google** (click Enable, add your support email, then Save)
   - **Apple** (optional, requires Apple Developer account)

## 5. Create Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll add security rules next)
4. Select a location (closest to your users)
5. Click **Enable**

## 6. Deploy Security Rules

1. In Firestore Database, go to the **Rules** tab
2. Copy the contents of `firestore.rules` from this project
3. Paste into the Firebase Console rules editor
4. Click **Publish**

## 7. Enable Crashlytics (Optional but Recommended)

1. In Firebase Console, go to **Build** → **Crashlytics**
2. Click **Get started**
3. Follow the setup wizard (most is automatic for web apps)

## 8. Test the Setup

```bash
npm run dev
```

Open http://localhost:3000 and:
- You should be automatically signed in anonymously
- Create a spend entry
- Check Firestore Console → Data tab to see the entry appear

## 9. Production Checklist

Before deploying to production:

- [ ] Update Firestore security rules from test mode to production rules
- [ ] Add your production domain to Firebase Auth authorized domains
- [ ] Enable App Check (recommended for production)
- [ ] Set up budget alerts in Firebase Billing

## Troubleshooting

**"Firebase: No Firebase App '[DEFAULT]' has been created"**
- Make sure `.env.local` exists with all required variables
- Restart the dev server after changing `.env.local`

**"Missing or insufficient permissions"**
- Check that Firestore security rules are published
- Verify the user is authenticated (check `auth.currentUser`)

**"The query requires an index"**
- Firestore will provide a link to create the index
- Click the link and wait ~5 minutes for index creation
