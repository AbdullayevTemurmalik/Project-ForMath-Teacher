import { useState } from 'react';
import { DollarSign, Edit2, Save, X, Download, FileText } from 'lucide-react';

import { Student } from '../types';

interface MonthlyReportProps {
  subject: string;
  students: Student[];
  setStudents: (students: Student[]) => void;
}

export function MonthlyReport({ subject, students, setStudents }: MonthlyReportProps) {
  const currentMonth = new Date().toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' });
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editNote, setEditNote] = useState('');

  const startEditing = (student: Student) => {
    setEditingStudent(student.id);
    setEditAmount(student.amountPaid.toString());
    setEditNote(student.paymentNote || '');
  };

  const cancelEditing = () => {
    setEditingStudent(null);
    setEditAmount('');
    setEditNote('');
  };

  const savePayment = (studentId: string) => {
    const amount = parseInt(editAmount) || 0;
    setStudents(students.map(student => {
      if (student.id === studentId) {
        let status: 'paid' | 'pending' | 'partial';
        if (amount >= student.monthlyPayment) {
          status = 'paid';
        } else if (amount === 0) {
          status = 'pending';
        } else {
          status = 'partial';
        }
        
        return {
          ...student,
          amountPaid: amount,
          paymentNote: editNote.trim() || undefined,
          paymentStatus: status
        };
      }
      return student;
    }));
    cancelEditing();
  };

  // Calculate statistics based on selected month
  const getMonthlyStats = () => {
    const monthPrefix = selectedMonth; // Format: "2026-01"
    
    return students.map(student => {
      // Count attendance for the selected month
      const attendanceDates = Object.keys(student.attendance).filter(date => 
        date.startsWith(monthPrefix)
      );
      const totalLessons = attendanceDates.length;
      const attended = attendanceDates.filter(date => student.attendance[date] === true).length;
      
      return {
        ...student,
        totalLessons: totalLessons || 12, // Default to 12 if no data
        attended: attended
      };
    });
  };

  const studentsWithStats = getMonthlyStats();

  const totalRevenue = studentsWithStats.reduce((sum, s) => sum + s.amountPaid, 0);

  const averageAttendance = studentsWithStats.reduce((sum, s) => sum + (s.attended / s.totalLessons * 100), 0) / studentsWithStats.length;
  const paidCount = studentsWithStats.filter(s => s.paymentStatus === 'paid').length;
  const pendingCount = studentsWithStats.filter(s => s.paymentStatus === 'pending').length;

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">To'langan</span>;
      case 'pending':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Kutilmoqda</span>;
      case 'partial':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Qisman</span>;
      default:
        return null;
    }
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      {/* Month Selector */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Oylik hisobot</h2>
            <p className="text-sm text-gray-600 mt-1">
              O'quvchilarning davomat va to'lov statistikasi
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-gray-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              max={new Date().toISOString().slice(0, 7)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Jami o'quvchilar</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">O'rtacha davomat</p>
                <p className="text-2xl font-bold text-gray-900">{averageAttendance.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">To'langan / Jami</p>
                <p className="text-xl font-bold text-gray-900">{paidCount} / {students.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Jami daromad</p>
                <p className="text-xl font-bold text-gray-900">
                  {(totalRevenue / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Student Report */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Batafsil hisobot
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  #
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  O'quvchi
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Jami darslar
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Kelgan kunlar
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Davomat %
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Oylik to'lov (max)
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  To'langan summa
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Izoh
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Holat
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {studentsWithStats.map((student, index) => {
                const attendancePercentage = (student.attended / student.totalLessons * 100);
                const remainingAmount = student.monthlyPayment - student.amountPaid;
                return (
                  <tr key={student.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{student.name}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 font-semibold text-gray-900">
                        {student.totalLessons}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 font-semibold text-blue-900">
                        {student.attended}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full font-semibold ${getAttendanceColor(attendancePercentage)}`}>
                        {attendancePercentage.toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                      {student.monthlyPayment.toLocaleString('uz-UZ')} so'm
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-sm font-semibold ${
                          student.amountPaid === student.monthlyPayment 
                            ? 'text-green-600' 
                            : student.amountPaid > 0 
                              ? 'text-yellow-600' 
                              : 'text-red-600'
                        }`}>
                          {student.amountPaid.toLocaleString('uz-UZ')} so'm
                        </span>
                        {remainingAmount > 0 && (
                          <span className="text-xs text-red-600 mt-1">
                            -{remainingAmount.toLocaleString('uz-UZ')} so'm
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                      {student.paymentNote ? (
                        <span className="italic">{student.paymentNote}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getPaymentStatusBadge(student.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => startEditing(student)}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition"
                      >
                        <Edit2 className="w-4 h-4" />
                        Tahrirlash
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Download className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              Ma'lumot
            </h4>
            <p className="text-sm text-blue-800">
              Bu hisobot {selectedMonth} oyi uchun {subject} fanidan o'quvchilarning davomat va to'lov statistikasini ko'rsatadi. 
              Davomat 90% dan yuqori bo'lsa yashil, 75-90% oralig'ida sariq, 75% dan past bo'lsa qizil rangda ko'rsatiladi.
            </p>
          </div>
        </div>
      </div>

      {/* Edit Payment Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              To'lov ma'lumotlarini tahrirlash
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  To'langan summa (so'm)
                </label>
                <input
                  id="amount"
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                  Izoh (kamroq to'lagan bo'lsa sababini kiriting)
                </label>
                <textarea
                  id="note"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Masalan: Oilaviy muammo, keyinroq to'laydi..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => savePayment(editingStudent)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition"
              >
                <Save className="w-5 h-5" />
                Saqlash
              </button>
              <button
                onClick={cancelEditing}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition"
              >
                <X className="w-5 h-5" />
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}