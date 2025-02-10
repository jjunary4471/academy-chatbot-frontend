import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AdminPage from './components/AdminPage';
import StudentMainPage from './components/StudentMainPage';
import ParentMainPage from './components/ParentMainPage';
import StudentReportList from './components/StudentReportList';
import PersonalityReportDetail from './components/PersonalityReportDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/student-main" element={<StudentMainPage />} />
        <Route path="/parent-main" element={<ParentMainPage />} />
        <Route path="/student/:studentId/reports" element={<StudentReportList />} />
        <Route path="/personality-report" element={<PersonalityReportDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;