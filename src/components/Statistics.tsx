import { TrendingUp, Users, Award, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

import { Student } from '../types';

interface StatisticsProps {
  subject: string;
  students: Student[];
}

export function Statistics({ subject, students }: StatisticsProps) {
  // Calculate attendance statistics
  const getAttendancePercentage = (student: Student) => {
    const attendanceValues = Object.values(student.attendance);
    if (attendanceValues.length === 0) return 0;
    const attended = attendanceValues.filter(a => a).length;
    return (attended / attendanceValues.length) * 100;
  };

  const studentsWithStats = students.map(student => ({
    ...student,
    attendancePercentage: getAttendancePercentage(student),
    totalDays: Object.values(student.attendance).length,
    attendedDays: Object.values(student.attendance).filter(a => a).length,
  })).sort((a, b) => b.attendancePercentage - a.attendancePercentage);

  // Overall statistics
  const totalStudents = students.length;
  const averageAttendance = studentsWithStats.reduce((sum, s) => sum + s.attendancePercentage, 0) / (totalStudents || 1);
  
  const paidCount = students.filter(s => s.paymentStatus === 'paid').length;
  const partialCount = students.filter(s => s.paymentStatus === 'partial').length;
  const pendingCount = students.filter(s => s.paymentStatus === 'pending').length;

  const totalExpectedIncome = students.reduce((sum, s) => sum + s.monthlyPayment, 0);
  const totalReceivedIncome = students.reduce((sum, s) => sum + s.amountPaid, 0);
  const collectionRate = (totalReceivedIncome / (totalExpectedIncome || 1)) * 100;

  // Top and bottom performers
  const topPerformers = studentsWithStats.slice(0, 5);
  const needAttention = studentsWithStats.filter(s => s.attendancePercentage < 70);

  // Chart data
  const attendanceChartData = studentsWithStats.slice(0, 10).map(s => ({
    name: s.name.split(' ')[0],
    percentage: Math.round(s.attendancePercentage),
  }));

  const paymentPieData = [
    { name: "To'langan", value: paidCount, color: '#10b981' },
    { name: 'Qisman', value: partialCount, color: '#f59e0b' },
    { name: "To'lanmagan", value: pendingCount, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Statistika va tahlil</h2>
        <p className="text-gray-600 mt-1">{subject} fani bo'yicha batafsil statistika</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Jami o'quvchilar</p>
            <Users className="w-6 h-6 opacity-75" />
          </div>
          <p className="text-3xl font-bold">{totalStudents}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">O'rtacha davomat</p>
            <TrendingUp className="w-6 h-6 opacity-75" />
          </div>
          <p className="text-3xl font-bold">{averageAttendance.toFixed(1)}%</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">To'lov yig'ilishi</p>
            <Award className="w-6 h-6 opacity-75" />
          </div>
          <p className="text-3xl font-bold">{collectionRate.toFixed(1)}%</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">E'tibor talab</p>
            <AlertCircle className="w-6 h-6 opacity-75" />
          </div>
          <p className="text-3xl font-bold">{needAttention.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Bar Chart */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">Davomat foizi (Top 10)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="percentage" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Pie Chart */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">To'lov holati</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Students */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Eng yaxshi o'quvchilar
          </h3>
          <div className="space-y-3">
            {topPerformers.map((student, index) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">
                      {student.attendedDays}/{student.totalDays} dars
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    {student.attendancePercentage.toFixed(0)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Students Need Attention */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            E'tibor talab qiladigan o'quvchilar
          </h3>
          {needAttention.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Barcha o'quvchilar yaxshi darajada!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {needAttention.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">
                      {student.attendedDays}/{student.totalDays} dars
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">
                      {student.attendancePercentage.toFixed(0)}%
                    </p>
                    <p className="text-xs text-red-600">Past davomat</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Batafsil ro'yxat</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">O'quvchi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Davomat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Davomat %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To'lov holati</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To'langan / Jami</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {studentsWithStats.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.attendedDays}/{student.totalDays}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className={`h-2 rounded-full ${
                            student.attendancePercentage >= 80 ? 'bg-green-500' :
                            student.attendancePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${student.attendancePercentage}%` }}
                        />
                      </div>
                      <span className="font-medium">{student.attendancePercentage.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      student.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.paymentStatus === 'paid' ? "To'langan" :
                       student.paymentStatus === 'partial' ? 'Qisman' : "To'lanmagan"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {student.amountPaid.toLocaleString()} / {student.monthlyPayment.toLocaleString()} so'm
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
