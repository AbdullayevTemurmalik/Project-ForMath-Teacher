import { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string, name?: string, subject?: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regSubject, setRegSubject] = useState('');
  
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      if (!regName || !regPhone || !regEmail || !regPassword || !regConfirmPassword) {
        setError('Iltimos, barcha maydonlarni to\'ldiring');
        return;
      }

      if (!regEmail.includes('@')) {
        setError('Email noto\'g\'ri formatda');
        return;
      }

      if (regPassword !== regConfirmPassword) {
        setError('Parollar mos emas');
        return;
      }

      onLogin(regEmail, regPassword, regName, regSubject);
    } else {
      if (!email || !password) {
        setError('Iltimos, email va parolni kiriting');
        return;
      }

      if (!email.includes('@')) {
        setError('Email noto\'g\'ri formatda');
        return;
      }

      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            O'qituvchi paneli
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Tizimga kirish uchun ma'lumotlaringizni kiriting
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegistering ? (
              <>
                <div>
                  <label htmlFor="regName" className="block text-sm font-medium text-gray-700 mb-2">
                    Ism
                  </label>
                  <input
                    id="regName"
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Ismingiz"
                  />
                </div>

                <div>
                  <label htmlFor="regPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon raqami
                  </label>
                  <input
                    id="regPhone"
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="+998 90 123 45 67"
                  />
                </div>

                <div>
                  <label htmlFor="regEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="regEmail"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="regSubject" className="block text-sm font-medium text-gray-700 mb-2">
                    Fan nomi
                  </label>
                  <input
                    id="regSubject"
                    type="text"
                    value={regSubject}
                    onChange={(e) => setRegSubject(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Matematika, Fizika, Ingliz tili..."
                  />
                </div>

                <div>
                  <label htmlFor="regPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Parol
                  </label>
                  <input
                    id="regPassword"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label htmlFor="regConfirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Parolni takrorlang
                  </label>
                  <input
                    id="regConfirmPassword"
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Parol
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              {isRegistering ? 'Ro\'yxatdan o\'tish' : 'Kirish'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              Demo kirish: Istalgan email va parol bilan kirishingiz mumkin
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              {isRegistering ? 'Kirishga o\'tish' : 'Ro\'yxatdan o\'tishga o\'tish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}