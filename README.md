# মাহমুদ টেলিকম – হিসাবের ওয়েবসাইট

## ফাইল
index.html, style.css, app.js, logo.js, logo.jpg, firebase-config.js

## ১) GitHub এ ফ্রিতে লাইভ করা
1. github.com এ অ্যাকাউন্ট খুলুন → New repository (যেমন: `mahmud-telecom`) → Public।
2. "uploading an existing file" চাপুন → zip খুলে সব ফাইল আপলোড করুন → Commit।
3. Settings → Pages → Branch: `main` / root → Save। ১–২ মিনিট পর লিংক পাবেন।

## ২) মোবাইল ও কম্পিউটারে একই হিসাব (ফ্রি Firebase)
(এটা না করলে হিসাব শুধু ওই ডিভাইসের ব্রাউজারে থাকবে।)
1. console.firebase.google.com → Add project।
2. Build → Authentication → Get started → Email/Password চালু করুন → Users → Add user (আপনার ইমেইল ও পাসওয়ার্ড)।
3. Build → Firestore Database → Create database (Production mode)।
4. Firestore → Rules এ এটা বসিয়ে Publish করুন:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{d}/documents {
    match /{document=**} { allow read, write: if request.auth != null; }
  }
}
```
5. Project settings → Your apps → Web (</>) → App register করুন → যে `firebaseConfig` দেখাবে তার apiKey, authDomain, projectId, appId `firebase-config.js` এ বসান।
6. Authentication → Settings → Authorized domains এ `আপনার-নাম.github.io` যোগ করুন।
7. GitHub এ ফাইলটি আবার আপলোড করুন। এখন লগইন করলে মোবাইল ও কম্পিউটারে একই হিসাব দেখাবে।

## নোট
- PNG রিপোর্ট বানাতে ইন্টারনেট লাগে। রিপোর্ট A4 প্রস্থে (794px) তৈরি হয়; লাইন বেশি হলে লম্বা হবে, তারিখ ফিল্টার দিয়ে ছোট করুন।
- শেয়ার বাটন মোবাইলে সরাসরি WhatsApp/Messenger এ ছবি পাঠায়।
