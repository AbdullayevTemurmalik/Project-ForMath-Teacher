import { useState } from 'react';
import { DollarSign, Plus, Calendar, TrendingUp, Download } from 'lucide-react';

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
  setStudents: (students: any[]) => void;
}

export function PaymentHistory({ subject, students, setStudents }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<Payment[]>([
    { id: '1', studentId: '1', studentName: 'Aliyev Rustam', amount: 300000, date: '2024-01-05', month: '2024-01', note: '' },
    { id: '2', studentId: '2', studentName: 'Karimova Madina', amount: 300000, date: '2024-01-07', month: '2024-01', note: '' },
    { id: '3', studentId: '1', studentName: 'Aliyev Rustam', amount: 300000, date: '2024-02-03', month: '2024-02', note: '' },
    { id: '4', studentId: '3', studentName: 'Saidov Jamshid', amount: 150000, date: '2024-02-10', month: '2024-02', note: 'Qisman to\'lov' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState('all');
  
  const [formData, setFormData] = useState({
    studentId: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  const handleAddPayment = () => {
    if (!formData.studentId) {
      alert("Iltimos, o'quvchini tanlang");
      return;
    }
    if (formData.amount <= 0) {
      alert("Iltimos, to'lov summasini kiriting");
      return;
    }

    const student = students.find(s => s.id === formData.studentId);
    if (!student) return;

    const month = formData.date.substring(0, 7); // YYYY-MM format

    const newPayment: Payment = {
      id: Date.now().toString(),
      studentId: formData.studentId,
      studentName: student.name,
      amount: formData.amount,
      date: formData.date,
      month: month,
      note: formData.note,
    };

    setPayments([newPayment, ...payments]);
    resetForm();
    setIsAdding(false);
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      note: '',
    });
  };

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const monthMatch = selectedMonth === 'all' || payment.month === selectedMonth;
    const studentMatch = selectedStudent === 'all' || payment.studentId === selectedStudent;
    return monthMatch && studentMatch;
  });

  // Calculate statistics
  const totalIncome = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const currentMonth = new Date().toISOString().substring(0, 7);
  const thisMonthIncome = payments.filter(p => p.month === currentMonth).reduce((sum, p) => sum + p.amount, 0);

  // Get unique months
  const months = Array.from(new Set(payments.map(p => p.month))).sort().reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">To'lov tarixi</h2>
          <p className="text-gray-600 mt-1">Barcha to'lovlar tarixi va statistika</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          To'lov qo'shish
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Joriy oy daromad</p>
            <TrendingUp className="w-6 h-6 opacity-75" />
          </div>
          <p className="text-3xl font-bold">{thisMonthIncome.toLocaleString()} so'm</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Jami to'lovlar</p>
            <DollarSign className="w-6 h-6 opacity-75" />
          </div>
          <p className="text-3xl font-bold">{totalIncome.toLocaleString()} so'm</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">To'lovlar soni</p>
            <Calendar className="w-6 h-6 opacity-75" />
          </div>
          <p className="text-3xl font-bold">{filteredPayments.length} ta</p>
        </div>
      </div>

      {/* Add Payment Form */}
      {isAdding && (
        <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">To'lov qo'shish</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O'quvchi *
              </label>
              <select
                value={formData.studentId}
                onChange={(e) => {
                  const student = students.find(s => s.id === e.target.value);
                  setFormData({
                    ...formData,
                    studentId: e.target.value,
                    amount: student?.monthlyPayment || 0
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">O'quvchini tanlang</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.monthlyPayment.toLocaleString()} so'm)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To'lov summasi (so'm) *
              </label>
              <input
                type="number"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="300000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sana *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Izoh (ixtiyoriy)
              </label>
              <input
                type="text"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Qo'shimcha ma'lumot..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddPayment}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              Qo'shish
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                resetForm();
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Oy bo'yicha</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">Barcha oylar</option>
              {months.map(month => (
                <option key={month} value={month}>
                  {new Date(month + '-01').toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">O'quvchi bo'yicha</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">Barcha o'quvchilar</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              Excel yuklash
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">O'quvchi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Summa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sana</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Izoh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    To'lovlar topilmadi
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment, index) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{payment.studentName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="font-semibold text-green-600">
                        {payment.amount.toLocaleString()} so'm
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(payment.date).toLocaleDateString('uz-UZ')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(payment.month + '-01').toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long' })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.note || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}