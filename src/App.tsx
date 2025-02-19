import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LocaleProvider } from './contexts/LocaleContext';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AdminPage from './components/AdminPage';
import StudentMainPage from './components/StudentMainPage';
import ParentMainPage from './components/ParentMainPage';
import StudentReportList from './components/StudentReportList';
import PersonalityReportDetail from './components/PersonalityReportDetail';
import PersonalityTest from './components/PersonalityTest';
import RiskFactorManagement from './components/RiskFactorManagement';
import CommunityChat from './components/CommunityChat';
import { useLocale } from './contexts/LocaleContext';

function AppContent() {
  const { locale } = useLocale();

  return (
    <div lang={locale} className="font-sans">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/student-main" element={<StudentMainPage />} />
        <Route path="/parent-main" element={<ParentMainPage />} />
        <Route path="/student/:studentId/reports" element={<StudentReportList />} />
        <Route path="/student/:studentId/risk-factors" element={<RiskFactorManagement />} />
        <Route path="/personality-report" element={<PersonalityReportDetail />} />
        <Route path="/personality-test" element={<PersonalityTest />} />
        <Route path="/community" element={<CommunityChat />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LocaleProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LocaleProvider>
    </BrowserRouter>
  );
}

export default App;