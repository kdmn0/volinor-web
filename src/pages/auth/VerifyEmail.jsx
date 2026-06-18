import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthPage.css';

const VerifyEmail = () => {
    const { key } = useParams();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('E-posta adresiniz doğrulanıyor...');
    const navigate = useNavigate();
    const hasVerified = useRef(false);

    useEffect(() => {
        if (!key || hasVerified.current) return;
        hasVerified.current = true;

        const verify = async () => {
            try {
                const response = await axios.post('http://localhost:8000/api/auth/registration/verify-email/', {
                    key: key
                });
                setStatus('success');
                setMessage('E-posta adresiniz başarıyla doğrulandı. Yönlendiriliyorsunuz...');
                setTimeout(() => {
                    navigate('/auth');
                }, 3000);
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.detail || 'E-posta doğrulama başarısız oldu veya link geçersiz.');
            }
        };

        verify();
    }, [key, navigate]);

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
                        <div className="auth-view active">
                            <div className="auth-form-header">
                                <h2>E-posta Doğrulama</h2>
                                <p>Hesabınızın e-posta doğrulama işlemi gerçekleştiriliyor.</p>
                            </div>

                            <div style={{
                                padding: '15px', borderRadius: '6px', fontSize: '0.95rem', textAlign: 'center',
                                backgroundColor: status === 'success' ? 'rgba(34, 197, 94, 0.1)' : status === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                color: status === 'success' ? '#22c55e' : status === 'error' ? '#ef4444' : '#3b82f6',
                                border: `1px solid ${status === 'success' ? 'rgba(34, 197, 94, 0.2)' : status === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`
                            }}>
                                {message}
                            </div>
                            
                            {status === 'error' && (
                                <div style={{marginTop: '20px', textAlign: 'center'}}>
                                    <Link to="/auth" className="auth-submit-btn" style={{display: 'inline-block', textDecoration: 'none', width: 'auto', padding: '0.65rem 1.5rem'}}>
                                        Giriş Sayfasına Dön
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
