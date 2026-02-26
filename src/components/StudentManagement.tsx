import { useState } from 'react';
import { UserPlus, Edit2, Trash2, Search, X, Save, Phone, MapPin, User } from 'lucide-react';

import { Student } from '../types';

interface StudentManagementProps {
  subject: string;
  students: Student[];
  setStudents: (students: Student[]) => void;
}

export function StudentManagement({ subject, students, setStudents }: StudentManagementProps) {
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    parentPhone: '',
    address: '',
    monthlyPayment: 300000,
  });

  const handleAddStudent = () => {
    if (!formData.name.trim()) {
      alert("Iltimos, o'quvchi ismini kiriting");
      return;
    }

    const newStudent: Student = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      parentPhone: formData.parentPhone,
      address: formData.address,
      attendance: {},
      monthlyPayment: formData.monthlyPayment,
      amountPaid: 0,
      paymentStatus: 'pending',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setStudents([...students, newStudent]);
    resetForm();
    setIsAddingStudent(false);
  };

  const handleEditStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setFormData({
        name: student.name,
        phone: student.phone,
        parentPhone: student.parentPhone,
        address: student.address,
        monthlyPayment: student.monthlyPayment,
      });
      setEditingStudent(studentId);
    }
  };

  const handleUpdateStudent = () => {
    if (!formData.name.trim()) {
      alert("Iltimos, o'quvchi ismini kiriting");
      return;
    }

    setStudents(students.map(student => 
      student.id === editingStudent
        ? {
            ...student,
            name: formData.name,
            phone: formData.phone,
            parentPhone: formData.parentPhone,
            address: formData.address,
            monthlyPayment: formData.monthlyPayment,
          }
        : student
    ));
    resetForm();
    setEditingStudent(null);
  };

  const handleDeleteStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student && confirm(`${student.name}ni o'chirmoqchimisiz?`)) {
      setStudents(students.filter(s => s.id !== studentId));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      parentPhone: '',
      address: '',
      monthlyPayment: 300000,
    });
  };

  const cancelEdit = () => {
    resetForm();
    setEditingStudent(null);
    setIsAddingStudent(false);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.phone.includes(searchQuery) ||
    student.parentPhone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">O'quvchilar boshqaruvi</h2>
          <p className="text-gray-600 mt-1">Jami o'quvchilar: {students.length} ta</p>
        </div>
        <button
          onClick={() => setIsAddingStudent(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <UserPlus className="w-5 h-5" />
          Yangi o'quvchi
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="O'quvchi ismi yoki telefon raqami bo'yicha qidirish..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Add/Edit Form */}
      {(isAddingStudent || editingStudent) && (
        <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingStudent ? "O'quvchini tahrirlash" : "Yangi o'quvchi qo'shish"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Ism-sharif *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Aliyev Rustam"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                O'quvchi telefoni
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+998 90 123 45 67"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Ota-ona telefoni *
              </label>
              <input
                type="tel"
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                placeholder="+998 90 123 45 67"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Manzil
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Toshkent, Chilonzor tumani"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oylik to'lov (so'm)
              </label>
              <input
                type="number"
                value={formData.monthlyPayment}
                onChange={(e) => setFormData({ ...formData, monthlyPayment: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={editingStudent ? handleUpdateStudent : handleAddStudent}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Save className="w-5 h-5" />
              {editingStudent ? 'Saqlash' : "Qo'shish"}
            </button>
            <button
              onClick={cancelEdit}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <X className="w-5 h-5" />
              Bekor qilish
            </button>
          </div>
        </div>
      )}

      {/* Students List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ism-sharif</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">O'quvchi tel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ota-ona tel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manzil</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oylik to'lov</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qo'shilgan sana</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    {searchQuery ? "O'quvchi topilmadi" : "Hozircha o'quvchilar yo'q"}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.parentPhone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.address || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {student.monthlyPayment.toLocaleString()} so'm
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(student.joinedDate).toLocaleDateString('uz-UZ')}
                    </td>
                    <td className="px-6 py-4 text-right text-sm space-x-2">
                      <button
                        onClick={() => handleEditStudent(student.id)}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
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