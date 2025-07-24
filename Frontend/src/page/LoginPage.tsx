import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { apiService} from '../services/api';
import type { LoginData } from '../services/api';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<LoginData>({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    // Check if there's a success message from registration
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      setError('Username wajib diisi');
      return false;
    }
    
    if (!formData.password) {
      setError('Password wajib diisi');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await apiService.login(formData);
      
      // Store user data in localStorage (you might want to use a more secure method)
      if (response.user) {
        localStorage.setItem('kodino_user', JSON.stringify(response.user));
      }
      
      setSuccess(response.message);
      
      // Redirect to dashboard or home page
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Header />

      <main className="main-content">
        <div className="login-container">
          <div className="welcome-section">
            <h2 className="welcome-title">Halo! Selamat datang Kembali</h2>
            <p className="welcome-subtitle">Yuk! Lanjutin lagi materi kamu!</p>
            <Link to="/register" className="switch-button">
              Daftar
            </Link>
          </div>

          <div className="form-section">
            <h2 className="form-title">Sudah Punya Akun?</h2>
            <p className="form-subtitle">Ayo masuk dulu!</p>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <input
                type="text"
                name="username"
                placeholder="Nama User kamu ..."
                value={formData.username}
                onChange={handleInputChange}
                className="form-input"
                required
                disabled={isLoading}
              />
              
              <input
                type="password"
                name="password"
                placeholder="Sandi/Pengaman kamu ..."
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                required
                disabled={isLoading}
              />

              <p className="forgot-password">Kamu lupa Sandi?</p>

              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Masuk...' : 'Masuk'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;