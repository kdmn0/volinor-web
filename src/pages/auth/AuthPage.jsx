import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './AuthPage.css';

const AuthPage = () => {
    const [view, setView] = useState('login'); // 'login' or 'register'
    const [authMessage, setAuthMessage] = useState(''); // Sistem mesajı için state
    const navigate = useNavigate();

    const handleGoogleAuth = useGoogleLogin({
        onSuccess: async (googleResponse) => {
            try {
                // 1. Google'dan gelen bileti bizim Django'ya fırlatıyoruz (BAĞLANTI BURADA KURULUYOR)
                const djangoCevap = await axios.post('http://localhost:8000/api/auth/google/', {
                    access_token: googleResponse.access_token,
                });

                // 2. Eğer buraya geldiyse kod 200 OK dönmüştür, adam VIP'dir.
                console.log("VIP Biletler Alındı:", djangoCevap.data);
                setAuthMessage("Giriş Başarılı! Yönlendiriliyorsunuz...");
                
                // Tokenları localStorage'a kaydetme örneği
                if (djangoCevap.data.access_token) {
                    localStorage.setItem('access_token', djangoCevap.data.access_token);
                }
                
                // Ana sayfaya yönlendir
                setTimeout(() => {
                    navigate('/');
                }, 1500);

            } catch (hata) {
                console.error("Google Auth hatası:", hata);
                // 3. Django adama kapıyı kapattıysa (Örn: 403 Onay Bekliyor)
                if (hata.response && hata.response.status === 403) {
                    setAuthMessage("Hesabınız yönetici onayını bekliyor. Lütfen daha sonra tekrar deneyin.");
                } else {
                    setAuthMessage("Giriş yapılırken bir hata oluştu.");
                }
            }
        },
        onError: () => setAuthMessage('Google ile bağlantı kurulamadı.'),
    });

    const handleLogin = (e) => {
        e.preventDefault();
        // Implement login logic here
        console.log('Login submitted');
    };

    const handleRegister = (e) => {
        e.preventDefault();
        // Implement register logic here
        console.log('Register submitted');
    };

    return (
        <div className="auth-page-wrapper">
            <Link to="/" className="auth-back-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Ana Sayfaya Dön
            </Link>
            <div className="auth-split-layout">
                {/* Left Pane: Visual Identity */}
                <div className="auth-visual-pane">
                    <div className="auth-ambient-glow"></div>
                    <div className="auth-noise-overlay"></div>
                    <div className="auth-brand-content">
                        <Link to="/" className="auth-logo" style={{ textDecoration: 'none' }}>
                            <img src="/logo_kucuk.png" alt="Volinor Logo Icon" style={{ height: '32px', width: 'auto' }} />
                            <img src="/logo_yazı.png" alt="Volinor" style={{ height: '36px', width: 'auto' }} />
                        </Link>
                        <h1>Dijital varlıklarınızı güvenle yönetin.</h1>
                        <p>Yeni nesil bulut altyapısı ile projelerinizi saniyeler içinde hayata geçirin.</p>
                    </div>
                </div>

                {/* Right Pane: Form Area */}
                <div className="auth-form-pane">
                    <div className="auth-form-container">
                        
                        {/* Login View */}
                        <div className={`auth-view ${view === 'login' ? 'active' : ''}`}>
                            <div className="auth-form-header">
                                <h2>Hoş geldiniz</h2>
                                <p>Hesabınıza giriş yaparak devam edin.</p>
                            </div>

                            {authMessage && (
                                <div style={{
                                    padding: '10px', marginBottom: '15px', borderRadius: '6px', fontSize: '0.9rem', textAlign: 'center',
                                    backgroundColor: authMessage.includes('Başarılı') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: authMessage.includes('Başarılı') ? '#22c55e' : '#ef4444',
                                    border: `1px solid ${authMessage.includes('Başarılı') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                }}>
                                    {authMessage}
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="auth-form">
                                <div className="auth-input-group">
                                    <label htmlFor="login-email">E-posta adresi</label>
                                    <input type="email" id="login-email" placeholder="ornek@sirket.com" required />
                                </div>
                                <div className="auth-input-group">
                                    <div className="auth-label-row">
                                        <label htmlFor="login-password">Şifre</label>
                                        <a href="#forgot" onClick={(e) => e.preventDefault()} className="auth-forgot-link">Şifremi unuttum</a>
                                    </div>
                                    <input type="password" id="login-password" placeholder="••••••••" required />
                                </div>
                                <button type="submit" className="auth-submit-btn">Giriş Yap</button>
                            </form>

                            <div className="auth-divider">
                                <span>veya</span>
                            </div>

                            <div className="auth-oauth-group">
                                <button className="auth-oauth-btn" onClick={handleGoogleAuth} type="button">
                                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    Google ile devam et
                                </button>
                            </div>

                            <div className="auth-switch-view">
                                Hesabınız yok mu? <a href="#register" onClick={(e) => { e.preventDefault(); setView('register'); }}>Ücretsiz hesap oluşturun</a>
                            </div>
                        </div>

                        {/* Register View */}
                        <div className={`auth-view ${view === 'register' ? 'active' : ''}`}>
                            <div className="auth-form-header">
                                <h2>Hesap Oluştur</h2>
                                <p>Platforma katılmak için bilgilerinizi girin.</p>
                            </div>

                            {authMessage && (
                                <div style={{
                                    padding: '10px', marginBottom: '15px', borderRadius: '6px', fontSize: '0.9rem', textAlign: 'center',
                                    backgroundColor: authMessage.includes('Başarılı') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: authMessage.includes('Başarılı') ? '#22c55e' : '#ef4444',
                                    border: `1px solid ${authMessage.includes('Başarılı') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                }}>
                                    {authMessage}
                                </div>
                            )}

                            <form onSubmit={handleRegister} className="auth-form">
                                <div className="auth-input-group">
                                    <label htmlFor="register-name">Ad Soyad</label>
                                    <input type="text" id="register-name" placeholder="John Doe" required />
                                </div>
                                <div className="auth-input-group">
                                    <label htmlFor="register-email">E-posta adresi</label>
                                    <input type="email" id="register-email" placeholder="ornek@sirket.com" required />
                                </div>
                                <div className="auth-input-group">
                                    <label htmlFor="register-password">Şifre</label>
                                    <input type="password" id="register-password" placeholder="En az 8 karakter" required />
                                </div>
                                <button type="submit" className="auth-submit-btn">Hesap Oluştur</button>
                            </form>

                            <div className="auth-divider">
                                <span>veya</span>
                            </div>

                            <div className="auth-oauth-group">
                                <button className="auth-oauth-btn" onClick={handleGoogleAuth} type="button">
                                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    Google ile kayıt ol
                                </button>
                            </div>

                            <div className="auth-switch-view">
                                Zaten hesabınız var mı? <a href="#login" onClick={(e) => { e.preventDefault(); setView('login'); }}>Giriş yapın</a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
