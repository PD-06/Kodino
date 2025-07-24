import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { apiService } from '../services/api';
import type { RegisterData } from '../services/api';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    hasEmail: false,
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError('Nama lengkap wajib diisi');
      return false;
    }
    
    if (!formData.username.trim()) {
      setError('Username wajib diisi');
      return false;
    }
    
    if (formData.username.length < 3) {
      setError('Username minimal 3 karakter');
      return false;
    }
    
    if (!formData.password) {
      setError('Password wajib diisi');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return false;
    }
    
    if (formData.hasEmail && !formData.email.trim()) {
      setError('Email wajib diisi jika dipilih');
      return false;
    }
    
    if (formData.hasEmail && !isValidEmail(formData.email)) {
      setError('Format email tidak valid');
      return false;
    }
    
    return true;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await apiService.register(formData);
      setSuccess(response.message);
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Registrasi berhasil! Silakan login.' }
        });
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mendaftar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Header />

      <main className="main-content">
        <div className="register-container">
          <div className="welcome-section">
            <h2 className="welcome-title">Belum Punya Akun?</h2>
            <p className="welcome-subtitle">Ayo kita daftar dulu!</p>
            <Link to="/login" className="switch-button">
              Masuk
            </Link>
          </div>

          <div className="form-section">
            <h2 className="form-title">Halo! Selamat datang</h2>
            <p className="form-subtitle">Yuk, bergabung dengan Kodino!</p>

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
                name="fullName"
                placeholder="Nama lengkap kamu ..."
                value={formData.fullName}
                onChange={handleInputChange}
                className="form-input"
                required
                disabled={isLoading}
              />
              
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

              <input
                type="password"
                name="confirmPassword"
                placeholder="Konfirmasi sandi kamu ..."
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-input"
                required
                disabled={isLoading}
              />

              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="hasEmail"
                  name="hasEmail"
                  checked={formData.hasEmail}
                  onChange={handleInputChange}
                  className="form-checkbox"
                  disabled={isLoading}
                />
                <label htmlFor="hasEmail" className="checkbox-label">
                  Kamu punya Email?
                </label>
              </div>

              {formData.hasEmail && (
                <input
                  type="email"
                  name="email"
                  placeholder="Email kamu ..."
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={isLoading}
                />
              )}

              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Mendaftar...' : 'Daftar'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;