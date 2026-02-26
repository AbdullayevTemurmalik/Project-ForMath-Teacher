import { useState } from 'react';
import { Clock, MapPin, Calendar, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

export interface ScheduleDay {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  location: string;
  isActive: boolean;
}

interface ScheduleProps {
  subject: string;
}

const dayNames = {
  Monday: 'Dushanba',
  Tuesday: 'Seshanba',
  Wednesday: 'Chorshanba',
  Thursday: 'Payshanba',
  Friday: 'Juma',
  Saturday: 'Shanba',
  Sunday: 'Yakshanba',
};

const daysOrder: Array<keyof typeof dayNames> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function Schedule({ subject }: ScheduleProps) {
  const [schedule, setSchedule] = useState<ScheduleDay[]>([
    { id: '1', day: 'Monday', startTime: '15:00', endTime: '17:00', location: 'Uy manzil, Chilonzor 12', isActive: true },
    { id: '2', day: 'Wednesday', startTime: '15:00', endTime: '17:00', location: 'Uy manzil, Chilonzor 12', isActive: true },
    { id: '3', day: 'Friday', startTime: '15:00', endTime: '17:00', location: 'Uy manzil, Chilonzor 12', isActive: true },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    day: 'Monday' as keyof typeof dayNames,
    startTime: '15:00',
    endTime: '17:00',
    location: '',
  });

  const handleAdd = () => {
    if (!formData.location.trim()) {
      alert('Iltimos, dars joyini kiriting');
      return;
    }

    const newSchedule: ScheduleDay = {
      id: Date.now().toString(),
      day: formData.day,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location,
      isActive: true,
    };

    setSchedule([...schedule, newSchedule]);
    resetForm();
    setIsAdding(false);
  };

  const handleEdit = (id: string) => {
    const item = schedule.find(s => s.id === id);
    if (item) {
      setFormData({
        day: item.day,
        startTime: item.startTime,
        endTime: item.endTime,
        location: item.location,
      });
      setEditingId(id);
    }
  };

  const handleUpdate = () => {
    if (!formData.location.trim()) {
      alert('Iltimos, dars joyini kiriting');
      return;
    }

    setSchedule(schedule.map(item =>
      item.id === editingId
        ? {
            ...item,
            day: formData.day,
            startTime: formData.startTime,
            endTime: formData.endTime,
            location: formData.location,
          }
        : item
    ));
    resetForm();
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu darsni o\'chirmoqchimisiz?')) {
      setSchedule(schedule.filter(s => s.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setSchedule(schedule.map(item =>
      item.id === id
        ? { ...item, isActive: !item.isActive }
        : item
    ));
  };

  const resetForm = () => {
    setFormData({
      day: 'Monday',
      startTime: '15:00',
      endTime: '17:00',
      location: '',
    });
  };

  const cancelEdit = () => {
    resetForm();
    setEditingId(null);
    setIsAdding(false);
  };

  const sortedSchedule = [...schedule].sort((a, b) => {
    return daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
  });

  const getNextClass = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Convert to our day format
    const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    for (let i = 0; i < 7; i++) {
      const checkDayIndex = (currentDay + i) % 7;
      const checkDay = dayMap[checkDayIndex] as keyof typeof dayNames;
      
      const todayClasses = schedule.filter(s => s.day === checkDay && s.isActive);
      
      for (const cls of todayClasses) {
        const [startHour, startMin] = cls.startTime.split(':').map(Number);
        const classTime = startHour * 60 + startMin;
        
        if (i === 0 && classTime > currentTime) {
          return cls;
        } else if (i > 0) {
          return cls;
        }
      }
    }
    return null;
  };

  const nextClass = getNextClass();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dars jadvali</h2>
          <p className="text-gray-600 mt-1">{subject} fani uchun haftalik jadval</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          Dars qo'shish
        </button>
      </div>

      {/* Next Class Card */}
      {nextClass && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Keyingi dars</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">{dayNames[nextClass.day]}</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {nextClass.startTime} - {nextClass.endTime}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {nextClass.location}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Darsni tahrirlash' : 'Yangi dars qo\'shish'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kun
              </label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value as keyof typeof dayNames })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {daysOrder.map(day => (
                  <option key={day} value={day}>{dayNames[day]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Boshlanish vaqti
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tugash vaqti
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Dars joyi
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Uy manzil yoki o'quv markaz"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Save className="w-5 h-5" />
              {editingId ? 'Saqlash' : 'Qo\'shish'}
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

      {/* Schedule Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kun</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vaqt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedSchedule.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Hozircha dars jadvali yo'q
                  </td>
                </tr>
              ) : (
                sortedSchedule.map((item) => (
                  <tr key={item.id} className={`hover:bg-gray-50 ${!item.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {dayNames[item.day]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {item.startTime} - {item.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {item.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => toggleActive(item.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.isActive ? 'Faol' : 'Nofaol'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 shadow">
          <p className="text-sm text-gray-600 mb-1">Haftalik darslar</p>
          <p className="text-3xl font-bold text-gray-900">{schedule.filter(s => s.isActive).length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <p className="text-sm text-gray-600 mb-1">Jami soatlar</p>
          <p className="text-3xl font-bold text-gray-900">
            {schedule.filter(s => s.isActive).reduce((total, item) => {
              const [startH, startM] = item.startTime.split(':').map(Number);
              const [endH, endM] = item.endTime.split(':').map(Number);
              const hours = (endH * 60 + endM - startH * 60 - startM) / 60;
              return total + hours;
            }, 0).toFixed(1)} soat
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <p className="text-sm text-gray-600 mb-1">Eng ko'p dars bor kun</p>
          <p className="text-3xl font-bold text-gray-900">
            {(() => {
              const dayCounts: Record<string, number> = {};
              schedule.filter(s => s.isActive).forEach(item => {
                dayCounts[item.day] = (dayCounts[item.day] || 0) + 1;
              });
              const maxDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0];
              return maxDay ? dayNames[maxDay[0] as keyof typeof dayNames] : '-';
            })()}
          </p>
        </div>
      </div>
    </div>
  );
}
