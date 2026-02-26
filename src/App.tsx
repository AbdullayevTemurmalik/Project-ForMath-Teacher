import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { TeacherDashboard } from './components/TeacherDashboard';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teacherData, setTeacherData] = useState<{
    name: string;
    email: string;
    subject: string;
  } | null>(null);

  const handleLogin = (email: string, password: string, name?: string, subject?: string) => {
    // Mock authentication - in production, this would call a real API
    if (email && password) {
      setIsLoggedIn(true);
      setTeacherData({
        name: name || "O'qituvchi Ism",
        email: email,
        subject: subject || "Matematika"
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setTeacherData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <TeacherDashboard 
          teacherData={teacherData!} 
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}