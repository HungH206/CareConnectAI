// src/lib/firebaseConfig.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore'; // Sửa _from thành from
import { getAuth, Auth } from 'firebase/auth';

// ĐÂY LÀ NƠI BẠN ĐIỀN THÔNG TIN CẤU HÌNH FIREBASE CỦA MÌNH
// BẠN CÓ THỂ LẤY THÔNG TIN NÀY TỪ FIREBASE CONSOLE
// (Project settings -> General -> Your apps -> Firebase SDK snippet -> Config)
// Khuyến nghị: Sử dụng biến môi trường cho các thông tin nhạy cảm này
const firebaseCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY", // Thay YOUR_API_KEY
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN", // Thay YOUR_AUTH_DOMAIN
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID", // Thay YOUR_PROJECT_ID
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET", // Thay YOUR_STORAGE_BUCKET
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID", // Thay YOUR_MESSAGING_SENDER_ID
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID" // Thay YOUR_APP_ID
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // (Tùy chọn)
};

let app: FirebaseApp;
let db: Firestore | null = null; // Khởi tạo là null
let auth: Auth | null = null;   // Khởi tạo là null
let firebaseConfigAvailable = false;

// Kiểm tra xem các thông tin credentials cần thiết có tồn tại không
if (firebaseCredentials.apiKey && firebaseCredentials.apiKey !== "YOUR_API_KEY" &&
    firebaseCredentials.projectId && firebaseCredentials.projectId !== "YOUR_PROJECT_ID") {
    if (!getApps().length) {
      app = initializeApp(firebaseCredentials);
    } else {
      app = getApp(); // Lấy app đã được khởi tạo nếu có
    }
    db = getFirestore(app);
    auth = getAuth(app);
    firebaseConfigAvailable = true;
    console.log("Firebase initialized successfully from firebaseConfig.ts");
} else {
    console.warn("Firebase configuration is missing or incomplete in firebaseConfig.ts. Please update it with your project credentials. Using mock data or limited functionality.");
    // Bạn có thể gán các đối tượng mock ở đây nếu muốn có fallback rõ ràng hơn
    // app = {} as FirebaseApp; // Gán mock nếu cần
    // db = {} as Firestore;
    // auth = {} as Auth;
}

export { app, db, auth, firebaseConfigAvailable, firebaseCredentials };