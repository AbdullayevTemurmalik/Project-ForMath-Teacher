import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { TeacherDashboard } from "./components/TeacherDashboard";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teacherData, setTeacherData] = useState<{
    name: string;
    email: string;
    subject: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedSession = localStorage.getItem("teacher_session");
    if (savedSession) {
      setTeacherData(JSON.parse(savedSession));
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (
    email: string,
    password: string,
    name?: string,
    subject?: string,
  ) => {
    const userData = {
      name: name || (email === "tmaq77@gmail.com" ? "Temurbek" : "Elyorbek"),
      email: email,
      subject: subject || "Dasturlash",
    };
    localStorage.setItem("teacher_session", JSON.stringify(userData));
    setTeacherData(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("teacher_session");
    setIsLoggedIn(false);
    setTeacherData(null);
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <TeacherDashboard teacherData={teacherData!} onLogout={handleLogout} />
      )}
    </div>
  );
}
