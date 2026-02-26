import { useState } from 'react';
import { Check, X, Calendar, Users } from 'lucide-react';

import { Student } from '../types';

interface AttendanceTrackingProps {
  subject: string;
  students: Student[];
  setStudents: (students: Student[]) => void;
}

export function AttendanceTracking({ subject, students, setStudents }: AttendanceTrackingProps) {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const markAttendance = (studentId: string, present: boolean) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          attendance: {
            ...student.attendance,
            [selectedDate]: present
          }
        };
      }
      return student;
    }));
  };

  const presentCount = students.filter(s => s.attendance[selectedDate] === true).length;
  const absentCount = students.filter(s => s.attendance[selectedDate] === false).length;
  const notMarkedCount = students.length - presentCount - absentCount;

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Darsga davomat</h2>
            <p className="text-sm text-gray-600 mt-1">
              O'quvchilarning darsga kelganini belgilang
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={today}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Kelgan</p>
                <p className="text-2xl font-bold text-gray-900">{presentCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Kelmagan</p>
                <p className="text-2xl font-bold text-gray-900">{absentCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Belgilanmagan</p>
                <p className="text-2xl font-bold text-gray-900">{notMarkedCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Oylik to'lov
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Davomat
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student, index) => {
                const attendanceStatus = student.attendance[selectedDate];
                return (
                  <tr key={student.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{student.name}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.monthlyPayment.toLocaleString('uz-UZ')} so'm
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => markAttendance(student.id, true)}
                          className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition ${
                            attendanceStatus === true
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          Keldi
                        </button>
                        <button
                          onClick={() => markAttendance(student.id, false)}
                          className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition ${
                            attendanceStatus === false
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-700'
                          }`}
                        >
                          <X className="w-4 h-4" />
                          Kelmadi
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}