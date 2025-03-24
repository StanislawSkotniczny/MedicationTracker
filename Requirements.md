Basic Requirements: Medication Tracker App (iOS)
📱 Platform
Mobile App

iOS Only (for now)

Built using React Native + Expo

🔧 Core Features (MVP)
1. Medication Management
User can add a medication entry with the following details:

Name of the medication

Dosage (e.g., 500mg)

Number of times per day (e.g., 3 times)

Amount per dose (e.g., 1 pill per intake)

Total amount available (e.g., 30 pills)

User can edit or delete an existing medication

2. Medication Intake Tracking
App tracks how many pills the user takes each day

Each day, user gets a schedule or reminders (optional at this stage) for when to take medication

App decreases the available quantity automatically based on the intake schedule

3. Shortage Alert System
App warns user when they are about to run out of medication

e.g., "Only 3 pills left, you will run out in 1 day based on your current schedule"

Color-coded indicator or push notification (optional)

🔐 Authentication (Optional for MVP)
Allow users to sign in (future-proofing for cloud sync, backup, multi-device usage)

Methods:

Email + Password login

Social login (Apple ID preferred on iOS)

If implemented:

Use Firebase Auth or Supabase Auth for quick integration with Expo

🗃️ Data Storage
Local device storage using:

AsyncStorage, or

SQLite (for more structured data)

Optional (future): Cloud sync using Firebase or Supabase

🧠 Suggested Tech Stack
Layer	Technology
Framework	React Native
Runtime	Expo
Auth (optional)	Firebase Auth / Supabase Auth
Local Storage	AsyncStorage / SQLite
State Management	React Context or Zustand
Notifications (future)	Expo Notifications API
Navigation	React Navigation
🧪 Optional Features (Future Enhancements)
Push notifications for intake reminders

Dark mode / accessibility features

Medication refill logging

Analytics dashboard (how consistent the user is)

Export data (PDF/CSV for doctor visits)

Cloud sync & backup

iCloud or HealthKit integration

