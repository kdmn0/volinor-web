import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './AuthPage.css';

const AuthPage = () => {
    const [view, setView] = useState('login');
    const [authMessage, setAuthMessage] = useState('');
    const navigate = useNavigate();

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('idle');

    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerPassword2, setRegisterPassword2] = useState('');
    const [registerStatus, setRegisterStatus] = useState('idle');

    const switchView = (next) => {
        setView(next);
        setAuthMessage('');
    };

    const handleGoogleAuth = useGoogleLogin({
        onSuccess: async (googleResponse) => {
            try {
                const res = await axios.post('http://localhost:8000/api/auth/google/', {
                    access_token: googleResponse.access_token,
                });
                if (res.data.access_token) localStorage.setItem('access_token', res.data.access_token);
                setAuthMessage('Giriş Başarılı! Yönlendiriliyorsunuz...');
                setTimeout(() => navigate('/'), 1500);
            } catch (err) {
                setAuthMessage(
                    err.response?.status === 403
                        ? 'Hesabınız yönetici onayını bekliyor. Lütfen daha sonra tekrar deneyin.'
                        : 'Giriş yapılırken bir hata oluştu.'
                );
            }
        },
        onError: () => setAuthMessage('Google ile bağlantı kurulamadı.'),
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginStatus('loading');
        try {
            const res = await axios.post('http://localhost:8000/api/auth/login/', {
                email: loginEmail,
                password: loginPassword,
            });
            if (res.data.key) localStorage.setItem('access_token', res.data.key);
            setLoginStatus('success');
            setAuthMessage('Giriş Başarılı! Yönlendiriliyorsunuz...');
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            setLoginStatus('idle');
            setAuthMessage(parseApiError(err.response?.data, 'E-posta veya şifre hatalı.'));
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (registerPassword !== registerPassword2) {
            setAuthMessage('Şifreler eşleşmiyor.');
            return;
        }
        setRegisterStatus('loading');
        try {
            await axios.post('http://localhost:8000/api/auth/registration/', {
                email: registerEmail,
                password1: registerPassword,
                password2: registerPassword2,
            });
            setRegisterStatus('success');
            setAuthMessage('Hesabınız oluşturuldu! Doğrulama e-postası gönderildi, lütfen gelen kutunuzu kontrol edin.');
        } catch (err) {
            setRegisterStatus('idle');
            setAuthMessage(parseApiError(err.response?.data, 'Kayıt sırasında bir hata oluştu.'));
        }
    };

    const parseApiError = (data, fallback) => {
        if (!data) return fallback;
        if (typeof data === 'string') return data;
        const first = Object.values(data).flat().find(Boolean);
        return typeof first === 'string' ? first : fallback;
    };

    const messageStyle = (msg) => ({
        padding: '10px',
        marginBottom: '15px',
        borderRadius: '6px',
        fontSize: '0.9rem',
        textAlign: 'center',
        backgroundColor: msg.includes('Başarılı') || msg.includes('oluşturuldu')
            ? 'rgba(34, 197, 94, 0.1)'
            : 'rgba(239, 68, 68, 0.1)',
        color: msg.includes('Başarılı') || msg.includes('oluşturuldu') ? '#22c55e' : '#ef4444',
        border: `1px solid ${msg.includes('Başarılı') || msg.includes('oluşturuldu') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
    });

    const GoogleButton = ({ label }) => (
        <button className="auth-oauth-btn" onClick={handleGoogleAuth} type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {label}
        </button>
    );

    return (
        <div className="auth-page-wrapper">
            <Link to="/" className="auth-back-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Ana Sayfaya Dön
            </Link>
            <div className="auth-split-layout">
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

                <div className="auth-form-pane">
                    <div className="auth-form-container">

                        {/* Login View */}
                        <div className={`auth-view ${view === 'login' ? 'active' : ''}`}>
                            <div className="auth-form-header">
                                <h2>Hoş geldiniz</h2>
                                <p>Hesabınıza giriş yaparak devam edin.</p>
                            </div>

                            {authMessage && <div style={messageStyle(authMessage)}>{authMessage}</div>}

                            <form onSubmit={handleLogin} className="auth-form">
                                <div className="auth-input-group">
                                    <label htmlFor="login-email">E-posta adresi</label>
                                    <input
                                        type="email"
                                        id="login-email"
                                        placeholder="ornek@sirket.com"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="auth-input-group">
                                    <div className="auth-label-row">
                                        <label htmlFor="login-password">Şifre</label>
                                        <Link to="/forgot-password" className="auth-forgot-link">Şifremi unuttum</Link>
                                    </div>
                                    <input
                                        type="password"
                                        id="login-password"
                                        placeholder="••••••••"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="auth-submit-btn"
                                    disabled={loginStatus === 'loading'}
                                >
                                    {loginStatus === 'loading' ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                                </button>
                            </form>

                            <div className="auth-divider"><span>veya</span></div>
                            <div className="auth-oauth-group">
                                <GoogleButton label="Google ile devam et" />
                            </div>
                            <div className="auth-switch-view">
                                Hesabınız yok mu?{' '}
                                <a href="#register" onClick={(e) => { e.preventDefault(); switchView('register'); }}>
                                    Ücretsiz hesap oluşturun
                                </a>
                            </div>
                        </div>

                        {/* Register View */}
                        <div className={`auth-view ${view === 'register' ? 'active' : ''}`}>
                            <div className="auth-form-header">
                                <h2>Hesap Oluştur</h2>
                                <p>Platforma katılmak için bilgilerinizi girin.</p>
                            </div>

                            {authMessage && <div style={messageStyle(authMessage)}>{authMessage}</div>}

                            <form onSubmit={handleRegister} className="auth-form">
                                <div className="auth-input-group">
                                    <label htmlFor="register-email">E-posta adresi</label>
                                    <input
                                        type="email"
                                        id="register-email"
                                        placeholder="ornek@sirket.com"
                                        value={registerEmail}
                                        onChange={(e) => setRegisterEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="auth-input-group">
                                    <label htmlFor="register-password">Şifre</label>
                                    <input
                                        type="password"
                                        id="register-password"
                                        placeholder="En az 8 karakter"
                                        value={registerPassword}
                                        onChange={(e) => setRegisterPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="auth-input-group">
                                    <label htmlFor="register-password2">Şifre Tekrar</label>
                                    <input
                                        type="password"
                                        id="register-password2"
                                        placeholder="Şifrenizi tekrar girin"
                                        value={registerPassword2}
                                        onChange={(e) => setRegisterPassword2(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="auth-submit-btn"
                                    disabled={registerStatus === 'loading' || registerStatus === 'success'}
                                >
                                    {registerStatus === 'loading' ? 'Oluşturuluyor...' : 'Hesap Oluştur'}
                                </button>
                            </form>

                            <div className="auth-divider"><span>veya</span></div>
                            <div className="auth-oauth-group">
                                <GoogleButton label="Google ile kayıt ol" />
                            </div>
                            <div className="auth-switch-view">
                                Zaten hesabınız var mı?{' '}
                                <a href="#login" onClick={(e) => { e.preventDefault(); switchView('login'); }}>
                                    Giriş yapın
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
