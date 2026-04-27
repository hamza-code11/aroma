import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // ✅ AuthContext ke login se user fetch hoga automatically
      login(token);
      navigate('/', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, []); // ✅ Sirf ek baar run

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-10 h-10 border-4 border-[#F7CE04] border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default GoogleCallback;