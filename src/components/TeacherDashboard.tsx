import { useState, useEffect, useCallback } from "react";
import {
  LogOut,
  Calendar,
  BarChart3,
  Users,
  Edit2,
  Save,
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

/* ================= MODAL ================= */
function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  type = "danger",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  type?: "danger" | "info";
}) {
  if (!isOpen) return null;

  const isDanger = type === "danger";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-xs w-full p-5 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-12 h-12 ${
              isDanger ? "bg-red-50" : "bg-blue-50"
            } rounded-full flex items-center justify-center mb-3`}
          >
            <AlertCircle
              className={`w-6 h-6 ${
                isDanger ? "text-red-600" : "text-blue-600"
              }`}
            />
          </div>

          <h3 className="text-lg font-bold mb-1">{title}</h3>
          <p className="text-sm text-gray-500 mb-4">{message}</p>

          <div className="flex gap-2 w-full">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 py-2 rounded-xl font-bold"
            >
              Yo‘q
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-2 rounded-xl text-white font-bold ${
                isDanger
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= DASHBOARD ================= */
export function TeacherDashboard({
  teacherData,
  onLogout,
}: TeacherDashboardProps) {
  const [currentView, setCurrentView] = useState<View>("attendance");

  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [editSubject, setEditSubject] = useState(teacherData.subject);
  const [currentSubject, setCurrentSubject] = useState(teacherData.subject);

  const [students, setStudents] = useState<Student[]>([]);

  const [modalConfig, setModalConfig] = useState<ModalState>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    onConfirm: () => {},
    type: "danger",
  });

  /* ======== LOCALSTORAGE LOAD (SAFE) ======== */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!teacherData?.email) return;

    try {
      const saved = localStorage.getItem(`students_${teacherData.email}`);
      if (saved) {
        setStudents(JSON.parse(saved));
      }
    } catch (err) {
      console.error(err);
    }
  }, [teacherData?.email]);

  /* ======== LOCALSTORAGE SAVE ======== */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!teacherData?.email) return;

    localStorage.setItem(
      `students_${teacherData.email}`,
      JSON.stringify(students),
    );
  }, [students, teacherData?.email]);

  /* ======== MODAL HELPERS ======== */
  const closeModal = useCallback(() => {
    setModalConfig((p) => ({ ...p, isOpen: false }));
  }, []);

  const openDeleteStudentModal = useCallback(
    (student: Student) => {
      setModalConfig({
        isOpen: true,
        title: "Talabani o‘chirish",
        message: `${student.name} ni o‘chirmoqchimisiz?`,
        confirmText: "O‘chirish",
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
    (confirmCallback: () => void) => {
      setModalConfig({
        isOpen: true,
        title: "To‘lovni o‘chirish",
        message: "To‘lovni butunlay o‘chirmoqchimisiz?",
        confirmText: "Ha, o‘chirish",
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
      title: "Chiqish",
      message: "Rostdan ham chiqmoqchimisiz?",
      confirmText: "Chiqish",
      type: "info",
      onConfirm: onLogout,
    });
  }, [onLogout]);

  const saveSubject = () => {
    if (!editSubject.trim()) return;
    setCurrentSubject(editSubject.trim());
    setIsEditingSubject(false);
  };

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40 px-4">
        <div className="max-w-7xl mx-auto flex justify-between h-20 items-center">
          <div>
            {isEditingSubject ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveSubject();
                }}
                className="flex gap-2"
              >
                <input
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="border px-2 py-1 rounded-lg"
                  autoFocus
                />
                <button type="submit">
                  <Save />
                </button>
              </form>
            ) : (
              <div className="flex gap-2 items-center">
                <span className="text-2xl font-bold text-blue-600">
                  {currentSubject}
                </span>
                <button onClick={() => setIsEditingSubject(true)}>
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-sm text-gray-500">
              {teacherData.name} • {teacherData.email}
            </p>
          </div>

          <button
            onClick={openLogoutModal}
            className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-xl"
          >
            <LogOut /> Chiqish
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
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
            onDeleteStudent={openDeleteStudentModal}
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
