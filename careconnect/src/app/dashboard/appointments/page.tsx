// src/app/dashboard/appointment/page.tsx
import React from 'react';
import AppointmentForm from './AppointmentForm'; // Import từ file cùng cấp

export default function AppointmentPage() {
  return (
    <div className="container mx-auto px-4 py-8"> {/* Thêm chút padding cho trang */}
      {/* Bạn có thể thêm tiêu đề trang hoặc các thành phần UI khác ở đây nếu muốn */}
      {/* Ví dụ:
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Book Your Appointment
        </h1>
        <p className="text-gray-600">
          Fill out the form below to schedule your visit.
        </p>
      </header>
      */}

      <AppointmentForm />

      {/*
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} CareConnectAI. All rights reserved.</p>
      </footer>
      */}
    </div>
  );
}

// Tùy chọn: Nếu bạn muốn thêm metadata cho trang này (tiêu đề tab trình duyệt, mô tả SEO)
// export const metadata = {
//   title: 'Schedule Appointment | CareConnectAI',
//   description: 'Schedule your medical appointment easily with CareConnectAI.',
// };