import { useState } from "react";
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
} from "lucide-react";
import { AttendanceTracking } from "./AttendanceTracking";
import { MonthlyReport } from "./MonthlyReport";
import { StudentManagement } from "./StudentManagement";
import { Student } from "../types";
import { Schedule } from "./Schedule";
import { PaymentHistory } from "./PaymentHistory";
import { Statistics } from "./Statistics";
import TeacherProfile from "./ui/TeacherProfile";

interface TeacherDashboardProps {
  teacherData: {
    name: string;
    email: string;
    subject: string;
  };
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

export function TeacherDashboard({
  teacherData,
  onLogout,
}: TeacherDashboardProps) {
  const [currentView, setCurrentView] = useState<View>("attendance");
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [editSubject, setEditSubject] = useState(teacherData.subject);
  const [currentSubject, setCurrentSubject] = useState(teacherData.subject);

  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "Aliyev Rustam",
      phone: "+998901234567",
      parentPhone: "+998901234568",
      address: "Toshkent, Chilonzor",
      attendance: {},
      monthlyPayment: 300000,
      amountPaid: 300000,
      paymentStatus: "paid",
      joinedDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Karimova Madina",
      phone: "+998907654321",
      parentPhone: "+998907654322",
      address: "Toshkent, Yakkasaroy",
      attendance: {},
      monthlyPayment: 300000,
      amountPaid: 300000,
      paymentStatus: "paid",
      joinedDate: "2024-01-20",
    },
    {
      id: "3",
      name: "Saidov Jamshid",
      phone: "+998909876543",
      parentPhone: "+998909876544",
      address: "Toshkent, Mirzo Ulugbek",
      attendance: {},
      monthlyPayment: 300000,
      amountPaid: 150000,
      paymentStatus: "partial",
      paymentNote: "Oilaviy muammo",
      joinedDate: "2024-02-01",
    },
    {
      id: "4",
      name: "Rahimova Dilnoza",
      phone: "+998905555555",
      parentPhone: "+998905555556",
      address: "Toshkent, Yunusobod",
      attendance: {},
      monthlyPayment: 300000,
      amountPaid: 300000,
      paymentStatus: "paid",
      joinedDate: "2024-02-10",
    },
    {
      id: "5",
      name: "Toshmatov Abbos",
      phone: "+998906666666",
      parentPhone: "+998906666667",
      address: "Toshkent, Sergeli",
      attendance: {},
      monthlyPayment: 300000,
      amountPaid: 0,
      paymentStatus: "pending",
      paymentNote: "Keyinroq to'laydi",
      joinedDate: "2024-02-15",
    },
    {
      id: "6",
      name: "Yusupova Shahzoda",
      phone: "+998907777777",
      parentPhone: "+998907777778",
      address: "Toshkent, Uchtepa",
      attendance: {},
      monthlyPayment: 300000,
      amountPaid: 300000,
      paymentStatus: "paid",
      joinedDate: "2024-02-20",
    },
  ]);

  const saveSubject = () => {
    if (editSubject.trim()) {
      setCurrentSubject(editSubject.trim());
      setIsEditingSubject(false);
    }
  };

  const cancelEditSubject = () => {
    setEditSubject(currentSubject);
    setIsEditingSubject(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditingSubject ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      className="border border-gray-300 px-2 py-1 rounded mr-2"
                    />
                    <button
                      onClick={saveSubject}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={cancelEditSubject}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    {currentSubject}
                    <button
                      onClick={() => setIsEditingSubject(true)}
                      className="text-gray-500 hover:text-gray-700 ml-2"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {teacherData.name} • {teacherData.email}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              Chiqish
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            <button
              onClick={() => setCurrentView("attendance")}
              className={`flex items-center gap-2 py-4 border-b-2 font-medium transition ${
                currentView === "attendance"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <Calendar className="w-5 h-5" />
              Davomat
            </button>
            <button
              onClick={() => setCurrentView("reports")}
              className={`flex items-center gap-2 py-4 border-b-2 font-medium transition ${
                currentView === "reports"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Oylik hisobot
            </button>
            <button
              onClick={() => setCurrentView("students")}
              className={`flex items-center gap-2 py-4 border-b-2 font-medium transition ${
                currentView === "students"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <Users className="w-5 h-5" />
              Talabalar
            </button>
            <button
              onClick={() => setCurrentView("schedule")}
              className={`flex items-center gap-2 py-4 border-b-2 font-medium transition ${
                currentView === "schedule"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <Clock className="w-5 h-5" />
              Dars jadvali
            </button>
            <button
              onClick={() => setCurrentView("payments")}
              className={`flex items-center gap-2 py-4 border-b-2 font-medium transition ${
                currentView === "payments"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <CreditCard className="w-5 h-5" />
              To\'lovlar tarixi
            </button>
            <button
              onClick={() => setCurrentView("statistics")}
              className={`flex items-center gap-2 py-4 border-b-2 font-medium transition ${
                currentView === "statistics"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Statistika
            </button>
            <button
              onClick={() => setCurrentView("profile")}
              className={`flex items-center gap-2 py-4 border-b-2 font-medium transition ${
                currentView === "profile"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <Settings className="w-5 h-5" />
              Profil
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        {currentView === "schedule" && <Schedule subject={currentSubject} />}
        {currentView === "payments" && (
          <PaymentHistory
            subject={currentSubject}
            students={students}
            setStudents={setStudents}
          />
        )}
        {currentView === "statistics" && (
          <Statistics subject={currentSubject} students={students} />
        )}
        {currentView === "profile" && (
          <TeacherProfile teacherData={teacherData} />
        )}
      </main>
    </div>
  );
}
