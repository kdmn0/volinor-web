import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthPage.css';

const ResetPassword = () => {
    const { uid, token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Şifreler eşleşmiyor.');
            return;
        }

        if (password.length < 8) {
            setStatus('error');
            setMessage('Şifre en az 8 karakter olmalıdır.');
            return;
        }

        setStatus('loading');
        try {
            const response = await axios.post('http://localhost:8000/api/auth/password/reset/confirm/', {
                uid: uid,
                token: token,
                new_password1: password,
                new_password2: confirmPassword
            });
            setStatus('success');
            setMessage('Şifreniz başarıyla yenilendi. Giriş sayfasına yönlendiriliyorsunuz...');
            setTimeout(() => {
                navigate('/auth');
            }, 3000);
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.detail || err.response?.data?.new_password1?.[0] || 'Şifre yenileme başarısız oldu. Link geçersiz veya süresi dolmuş olabilir.');
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
                                <h2>Şifre Yenileme</h2>
                                <p>Lütfen yeni şifrenizi belirleyin.</p>
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
                                        <label htmlFor="new-password">Yeni Şifre</label>
                                        <input 
                                            type="password" 
                                            id="new-password" 
                                            placeholder="En az 8 karakter" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required 
                                        />
                                    </div>
                                    <div className="auth-input-group">
                                        <label htmlFor="confirm-password">Şifre Tekrar</label>
                                        <input 
                                            type="password" 
                                            id="confirm-password" 
                                            placeholder="Şifrenizi tekrar girin" 
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required 
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="auth-submit-btn"
                                        disabled={status === 'loading'}
                                    >
                                        {status === 'loading' ? 'İşleniyor...' : 'Şifreyi Yenile'}
                                    </button>
                                </form>
                            )}
                            
                            {status === 'success' && (
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

export default ResetPassword;
