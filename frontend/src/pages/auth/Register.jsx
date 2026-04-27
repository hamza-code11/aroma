import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiUserLine, RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine, RiGoogleFill } from 'react-icons/ri';
import { useTheme } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { API_URL } from '../../../config';

const Register = () => {
  const { isDarkMode } = useTheme();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!form.name || !form.email || !form.password) return setErrors({ general: 'All fields required' });
    if (form.password !== form.password_confirmation) return setErrors({ password_confirmation: 'Passwords do not match' });
    if (form.password.length < 6) return setErrors({ password: 'At least 6 characters' });
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        // Laravel validation errors
        if (data.errors) {
          const fieldErrors = {};
          Object.keys(data.errors).forEach(key => {
            fieldErrors[key] = data.errors[key][0];
          });
          setErrors(fieldErrors);
          return;
        }
        setErrors({ general: data.message || 'Registration failed' });
        return;
      }


      login(
        { name: data.user?.name || form.name, email: form.email, role: data.user?.role || data.role || 'user' },
        data.access_token
      );
      navigate('/', { replace: true });
    } catch {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => window.location.href = `${API_URL}/auth/google/redirect`;

  const input = (field) => `w-full pl-11 pr-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all ${errors[field] ? 'border-red-500 focus:ring-red-500' :
      isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-[#F7CE04]/50 focus:border-[#F7CE04]'
        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-[#F7CE04]/50 focus:border-[#F7CE04]'
    }`;

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Montserrat', 'Poppins', sans-serif" }}>
      <main className={`flex-1 flex items-center justify-center py-12 px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`w-full max-w-md rounded-2xl shadow-xl border p-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-2xl font-semibold text-center mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create Account</h2>
          <p className={`text-sm text-center mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Join us to start shopping</p>

          {/* General Error */}
          {errors.general && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">{errors.general}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Full Name</label>
              <div className="relative mt-1"><RiUserLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input name="name" value={form.name} onChange={handleChange} className={input('name')} placeholder="John Doe" /></div>
              {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
            </div>
            <div>
              <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</label>
              <div className="relative mt-1"><RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input name="email" type="email" value={form.email} onChange={handleChange} className={input('email')} placeholder="email@example.com" /></div>
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
            </div>
            <div>
              <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Password</label>
              <div className="relative mt-1">
                <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="password" type={show ? 'text' : 'password'} value={form.password} onChange={handleChange} className={input('password')} placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{show ? <RiEyeOffLine /> : <RiEyeLine />}</button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
            </div>
            <div>
              <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Confirm Password</label>
              <div className="relative mt-1"><RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input name="password_confirmation" type="password" value={form.password_confirmation} onChange={handleChange} className={input('password_confirmation')} placeholder="••••••••" /></div>
              {errors.password_confirmation && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password_confirmation}</p>}
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-[#F7CE04] hover:bg-[#E5B800] text-gray-900 rounded-xl font-semibold transition-all disabled:opacity-50">{loading ? 'Creating...' : 'Sign Up'}</button>
          </form>

          <div className="relative my-5"><div className="absolute inset-0 flex items-center"><span className={`w-full border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`} /></div><div className="relative flex justify-center text-xs uppercase"><span className={`px-2 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>Or join with</span></div></div>
          <button onClick={handleGoogleLogin} className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl border text-sm font-semibold transition-all ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}><RiGoogleFill className="w-5 h-5 text-red-500" /> Sign Up with Google</button>
          <p className={`text-center text-sm mt-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Already have an account? <Link to="/login" className="text-[#F7CE04] font-semibold hover:underline">Sign In</Link></p>
        </div>
      </main>
    </div>
  );
};

export default Register;