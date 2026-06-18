import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AuthPage.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await axios.post('http://localhost:8000/api/auth/password/reset/', { email });
            setStatus('success');
            setMessage('Şifre sıfırlama linki e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.');
        } catch (err) {
            setStatus('error');
            setMessage(
                err.response?.data?.email?.[0] ||
                err.response?.data?.detail ||
                'Bir hata oluştu. Lütfen tekrar deneyin.'
            );
        }
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
                        <div className="auth-view active">
                            <div className="auth-form-header">
                                <h2>Şifremi Unuttum</h2>
                                <p>E-posta adresinizi girin, sıfırlama linkini gönderelim.</p>
                            </div>

                            {message && (
                                <div style={{
                                    padding: '10px', marginBottom: '15px', borderRadius: '6px', fontSize: '0.9rem', textAlign: 'center',
                                    backgroundColor: status === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: status === 'success' ? '#22c55e' : '#ef4444',
                                    border: `1px solid ${status === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                }}>
                                    {message}
                                </div>
                            )}

                            {status !== 'success' && (
                                <form onSubmit={handleSubmit} className="auth-form">
                                    <div className="auth-input-group">
                                        <label htmlFor="reset-email">E-posta Adresi</label>
                                        <input
                                            type="email"
                                            id="reset-email"
                                            placeholder="ornek@mail.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="auth-submit-btn"
                                        disabled={status === 'loading'}
                                    >
                                        {status === 'loading' ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
                                    </button>
                                </form>
                            )}

                            <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.875rem' }}>
                                <Link to="/auth" style={{ color: '#888', textDecoration: 'none' }}>
                                    Giriş sayfasına dön
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
