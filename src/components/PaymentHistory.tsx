import { useState, useEffect } from "react";
import {
  DollarSign,
  Plus,
  Calendar,
  TrendingUp,
  Download,
  Edit2,
  Trash2,
  Save,
  X,
} from "lucide-react";

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  month: string;
  note?: string;
}

interface PaymentHistoryProps {
  subject: string;
  students: Array<{
    id: string;
    name: string;
    monthlyPayment: number;
  }>;
  onDeletePaymentRequest: (
    paymentId: string,
    confirmCallback: () => void,
  ) => void;
}

export function PaymentHistory({
  students,
  onDeletePaymentRequest,
}: PaymentHistoryProps) {
  // 1. To'lovlarni LocalStorage'dan o'qish
  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem("teacher_payments_data");
    return saved ? JSON.parse(saved) : []; // Boshida bo'sh bo'ladi, faqat siz qo'shganlar chiqadi
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState("all");

  const [formData, setFormData] = useState({
    studentId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  // 2. To'lovlar o'zgarganda LocalStorage'ga yozish
  useEffect(() => {
    localStorage.setItem("teacher_payments_data", JSON.stringify(payments));
  }, [payments]);

  const handleSavePayment = () => {
    if (!formData.studentId || !formData.amount) return;

    const student = students.find((s) => s.id === formData.studentId);
    if (!student) return;

    const dateObj = new Date(formData.date);
    const monthFormatted = `${dateObj.getFullYear()} M${String(dateObj.getMonth() + 1).padStart(2, "0")}`;

    if (editingId) {
      // Tahrirlash mantiqi
      setPayments((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                studentId: formData.studentId,
                studentName: student.name,
                amount: Number(formData.amount),
                date: formData.date,
                month: monthFormatted,
                note: formData.note || "-",
              }
            : p,
        ),
      );
    } else {
      // Yangi qo'shish mantiqi
      const newPayment: Payment = {
        id: Date.now().toString(),
        studentId: formData.studentId,
        studentName: student.name,
        amount: Number(formData.amount),
        date: formData.date,
        month: monthFormatted,
        note: formData.note || "-",
      };
      setPayments((prev) => [newPayment, ...prev]);
    }

    resetForm();
  };

  const startEdit = (p: Payment) => {
    setFormData({
      studentId: p.studentId,
      amount: p.amount.toString(),
      date: p.date,
      note: p.note === "-" ? "" : p.note || "",
    });
    setEditingId(p.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const filteredPayments = payments.filter((p) => {
    const monthMatch = selectedMonth === "all" || p.month === selectedMonth;
    const studentMatch =
      selectedStudent === "all" || p.studentId === selectedStudent;
    return monthMatch && studentMatch;
  });

  const totalIncome = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const months = Array.from(new Set(payments.map((p) => p.month)))
    .sort()
    .reverse();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            To'lov tarixi
          </h2>
          <p className="text-gray-500 text-sm">
            Barcha kiritilgan to'lovlar ro'yxati
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> To'lov qo'shish
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white border-2 border-blue-50 p-6 rounded-2xl shadow-sm space-y-4 animate-in zoom-in duration-200">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            {editingId ? (
              <Edit2 className="w-4 h-4 text-blue-600" />
            ) : (
              <Plus className="w-4 h-4 text-blue-600" />
            )}
            {editingId ? "To'lovni tahrirlash" : "Yangi to'lov qo'shish"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={formData.studentId}
              onChange={(e) => {
                const s = students.find((st) => st.id === e.target.value);
                setFormData({
                  ...formData,
                  studentId: e.target.value,
                  amount: s?.monthlyPayment.toString() || "",
                });
              }}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            >
              <option value="">O'quvchini tanlang</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Summa"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
            <input
              type="text"
              placeholder="Izoh"
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={resetForm}
              className="px-5 py-2 text-gray-500 hover:bg-gray-100 rounded-xl font-semibold"
            >
              Bekor qilish
            </button>
            <button
              onClick={handleSavePayment}
              className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Saqlash
            </button>
          </div>
        </div>
      )}

      {/* Rasmga mos To'lovlar Jadvali */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">№</th>
                <th className="px-6 py-4">O'quvchi</th>
                <th className="px-6 py-4">Summa</th>
                <th className="px-6 py-4">Sana</th>
                <th className="px-6 py-4">Oy</th>
                <th className="px-6 py-4">Izoh</th>
                <th className="px-6 py-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPayments.map((p, i) => (
                <tr
                  key={p.id}
                  className="group hover:bg-blue-50/30 transition-all duration-200"
                >
                  <td className="px-6 py-4 text-xs text-gray-400 font-medium">
                    {i + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">
                    {p.studentName}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-[#10b981] font-bold">
                      {p.amount.toLocaleString()} so'm
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                    {p.date}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-semibold uppercase">
                    {p.month}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400 italic">
                    {p.note || "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <button
                        onClick={() => startEdit(p)}
                        className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          onDeletePaymentRequest(p.id, () => {
                            setPayments((prev) =>
                              prev.filter((item) => item.id !== p.id),
                            );
                          })
                        }
                        className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPayments.length === 0 && (
          <div className="py-20 text-center text-gray-400 font-medium">
            Hali hech qanday to'lov qo'shilmagan
          </div>
        )}
      </div>
    </div>
  );
}
