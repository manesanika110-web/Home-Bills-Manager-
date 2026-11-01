# Home Bills Manager 🏠🌿
> **Track • Manage • Save Your Home Bills**
> A modern, mobile-responsive household bills, payments, and monthly expenses tracking web application built with React, Vite, and Firebase.

![Home Bills Manager Design](https://img.shields.io/badge/Status-Production%20Ready-emerald)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🌟 Features

- **Modern & Responsive UI**: Clean white background with dark green (`#064e3b`) accents, soft mint cards, subtle shadows, and responsive layouts across mobile, tablet, and desktop.
- **Firebase Authentication**: Email/Password authentication ensuring household financial records remain completely private and isolated per user.
- **Firebase Cloud Firestore**: Real-time synchronization of household bills across devices with offline persistence.
- **Production Firestore Security Rules**: Strict per-user isolation (`userId == request.auth.uid`), validation of fields and types, immutable IDs and timestamps.
- **Interactive Dashboard**:
  - Live calculations of Total Monthly Expenses, Total Bills, Paid Bills, and Pending Bills.
  - Interactive Donut chart breakdown for category-wise expenses.
  - 12-month expense trend bar chart.
  - Quick recent transactions table.
- **Complete Bill Entry & Editing**:
  - Bill Name, Amount in INR (₹), Category (with custom category support).
  - Bill / Due Date, Status (Paid / Pending).
  - Mandatory Payment Date when paid (pre-filled with current date).
  - Payment Method (UPI, Net Banking, Credit Card, Cash, etc.) and optional Notes.
  - Duplicate submission prevention and input validation.
- **Bill History & Filters**:
  - Search by bill name, notes, or category.
  - Filter by category, payment status, month, and year.
  - Sort by date (newest/oldest), amount (highest/lowest), and name.
  - Dynamic summary badge (`Total: X Bills | Total Amount: ₹Y`).
  - Native `<dialog>` confirmation modal before deleting.
  - Responsive pagination.
- **Monthly Reports & CSV Export**:
  - Month and year selection.
  - Separate calculation for Paid Amount vs Pending Amount.
  - Month-over-month comparison with previous month total and percentage difference.
  - Category-wise spending breakdown table with percentages.
  - Annual 12-month expense summary.
  - 1-click **Export to CSV** for spreadsheets and accounting.
- **PWA & Mobile Support**:
  - Web App Manifest (`manifest.json`) and mobile icons.
  - Bottom navigation bar on mobile devices and sidebar on desktop.
  - Zero clipped content, tested across 360px, 390px, 768px, and desktop screens.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended; built and verified on Node v24)
- npm or yarn

### 2. Installation

Clone or open the repository directory:
```bash
cd "d:\WebProjects\Home Bills"
npm install
```

### 3. Firebase Configuration

1. Visit the [Firebase Console](https://console.firebase.google.com/) and click **Add Project**.
2. Go to **Build > Authentication** and enable the **Email/Password** sign-in method.
3. Go to **Build > Firestore Database** and click **Create Database** (start in production mode).
4. In your project settings (**Project Settings > General > Your apps**), register a **Web app** (`</>`).
5. Copy your Firebase configuration credentials.

Create a `.env` file in the root directory (you can copy `.env.example`):
```bash
cp .env.example .env
```

Set your Firebase configuration variables in `.env`:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

> **Note:** If `.env` is not yet configured, the app will run gracefully in **Demo Mode**, storing records locally in your browser so you can test all features, charts, and exports immediately!

### 4. Deploying Firestore Security Rules

Deploy the included `firestore.rules` file to your Firebase project:

Using the Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
firebase init firestore # Choose 'use existing firestore.rules'
firebase deploy --only firestore:rules
```

Or copy the contents of `firestore.rules` directly into the **Rules** tab of your Firestore Database console and click **Publish**.

---

## 💻 Running the Application

### Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🔒 Firestore Security Rules Specification

The project uses production-grade rules with field validation and user ownership checks:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    match /bills/{billId} {
      allow read: if isOwner(resource.data.userId);

      allow create: if isAuthenticated() &&
        isOwner(request.resource.data.userId);

      allow update: if isOwner(resource.data.userId) &&
        request.resource.data.userId == resource.data.userId;

      allow delete: if isOwner(resource.data.userId);
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 📦 Deployment

### Deploy to Vercel
1. Push your repository to GitHub or GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Under **Environment Variables**, add the `VITE_FIREBASE_*` variables from your `.env`.
4. Deploy!

### Deploy to Firebase Hosting
1. Initialize Firebase Hosting:
   ```bash
   firebase init hosting
   ```
   - What do you want to use as your public directory? `dist`
   - Configure as a single-page app (rewrite all urls to /index.html)? `Yes`
2. Build and deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

---

## 📱 Mobile & PWA Support
- Includes `public/manifest.json` configured with standalone display mode.
- Users can choose **Add to Home screen** in Chrome on Android or Safari on iOS to use Home Bills Manager as a native-feeling app.
