import { useState, useEffect, useCallback } from "react";
import {
  LogOut,
  Calendar,
  BarChart3,
  Users,
  Edit2,
  Save,
  X,
  Clock,
  CreditCard,
  TrendingUp,
  Settings,
  AlertCircle,
} from "lucide-react";
import { AttendanceTracking } from "./AttendanceTracking";
import { MonthlyReport } from "./MonthlyReport";
import { StudentManagement } from "./StudentManagement";
import { Schedule } from "./Schedule";
import { PaymentHistory } from "./PaymentHistory";
import { Statistics } from "./Statistics";
import TeacherProfile from "./ui/TeacherProfile";
import { Student } from "../types";

interface TeacherDashboardProps {
  teacherData: { name: string; email: string; subject: string };
  onLogout: () => void;
}

type View =
  | "attendance"
  | "reports"
  | "students"
  | "schedule"
  | "payments"
  | "statistics"
  | "profile";

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  type: "danger" | "info";
}

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  type = "danger",
}: any) {
  if (!isOpen) return null;
  const isDanger = type === "danger";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xs w-full p-5 shadow-2xl animate-in zoom-in duration-200 border border-gray-100">
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-12 h-12 ${isDanger ? "bg-red-50" : "bg-blue-50"} rounded-full flex items-center justify-center mb-3`}
          >
            {isDanger ? (
              <AlertCircle className="w-6 h-6 text-red-600" />
            ) : (
              <LogOut className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">
            {title}
          </h3>
          <p className="text-[13px] text-gray-500 mb-5 leading-relaxed px-2">
            {message}
          </p>
          <div className="flex gap-2 w-full">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-all active:scale-95"
            >
              Yo'q
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`flex-1 px-3 py-2 ${isDanger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"} text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-95`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeacherDashboard({
  teacherData,
  onLogout,
}: TeacherDashboardProps) {
  const [currentView, setCurrentView] = useState<View>("attendance");
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [editSubject, setEditSubject] = useState(teacherData?.subject || "");
  const [currentSubject, setCurrentSubject] = useState(
    teacherData?.subject || "",
  );

  const [modalConfig, setModalConfig] = useState<ModalState>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    onConfirm: () => {},
    type: "danger",
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(`students_${teacherData?.email}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    if (teacherData?.email) {
      localStorage.setItem(
        `students_${teacherData.email}`,
        JSON.stringify(students),
      );
    }
  }, [students, teacherData?.email]);

  const closeModal = useCallback(() => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const openDeleteStudentModal = useCallback(
    (student: Student) => {
      setModalConfig({
        isOpen: true,
        title: "Talabani o'chirish",
        message: `${student.name} ni ro'yxatdan o'chirmoqchimisiz?`,
        confirmText: "O'chirish",
        type: "danger",
        onConfirm: () => {
          setStudents((prev) => prev.filter((s) => s.id !== student.id));
          closeModal();
        },
      });
    },
    [closeModal],
  );

  const openDeletePaymentModal = useCallback(
    (paymentId: string, confirmCallback: () => void) => {
      setModalConfig({
        isOpen: true,
        title: "To'lovni o'chirish",
        message:
          "Ushbu to'lov ma'lumotini butunlay o'chirib tashlamoqchimisiz?",
        confirmText: "Ha, o'chirilsin",
        type: "danger",
        onConfirm: () => {
          confirmCallback();
          closeModal();
        },
      });
    },
    [closeModal],
  );

  const openLogoutModal = useCallback(() => {
    setModalConfig({
      isOpen: true,
      title: "Tizimdan chiqish",
      message: "Haqiqatan ham profilni yopmoqchimisiz?",
      confirmText: "Ha, chiqish",
      type: "info",
      onConfirm: onLogout,
    });
  }, [onLogout]);

  const saveSubject = () => {
    if (editSubject.trim()) {
      setCurrentSubject(editSubject.trim());
      setIsEditingSubject(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-20">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold">
              {isEditingSubject ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveSubject();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="border-2 border-blue-500 px-2 py-1 rounded-lg text-base outline-none focus:ring-2 ring-blue-200 transition-all"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white p-1.5 rounded-lg hover:bg-blue-600 transition shadow-md shadow-blue-200"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {currentSubject}
                  </span>
                  <button
                    onClick={() => setIsEditingSubject(true)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 font-medium">
              {teacherData?.name} • {teacherData?.email}
            </p>
          </div>
          <button
            onClick={openLogoutModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all font-bold active:scale-95"
          >
            <LogOut className="w-5 h-5" /> Chiqish
          </button>
        </div>
      </header>

      <div className="bg-white border-b overflow-x-auto scrollbar-hide sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-4 sm:gap-8 whitespace-nowrap">
            {[
              { id: "attendance", icon: Calendar, label: "Davomat" },
              { id: "reports", icon: BarChart3, label: "Hisobot" },
              { id: "students", icon: Users, label: "Talabalar" },
              { id: "schedule", icon: Clock, label: "Jadval" },
              { id: "payments", icon: CreditCard, label: "To'lovlar" },
              { id: "statistics", icon: TrendingUp, label: "Statistika" },
              { id: "profile", icon: Settings, label: "Profil" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id as View)}
                className={`flex items-center gap-2 py-5 border-b-4 font-bold transition-all ${currentView === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}
              >
                <tab.icon className="w-5 h-5" /> {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
        {currentView === "attendance" && (
          <AttendanceTracking
            subject={currentSubject}
            students={students}
            setStudents={setStudents}
          />
        )}
        {currentView === "reports" && (
          <MonthlyReport
            subject={currentSubject}
            students={students}
            setStudents={setStudents}
          />
        )}
        {currentView === "students" && (
          <StudentManagement
            subject={currentSubject}
            students={students}
            setStudents={setStudents}
          />
        )}
        {currentView === "payments" && (
          <PaymentHistory
            subject={currentSubject}
            students={students}
            onDeletePaymentRequest={openDeletePaymentModal}
          />
        )}
        {currentView === "schedule" && <Schedule subject={currentSubject} />}
        {currentView === "statistics" && (
          <Statistics subject={currentSubject} students={students} />
        )}
        {currentView === "profile" && (
          <TeacherProfile teacherData={teacherData} />
        )}
      </main>

      <ConfirmModal {...modalConfig} onClose={closeModal} />
    </div>
  );
}
