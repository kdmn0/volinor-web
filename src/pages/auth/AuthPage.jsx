import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useConfigStore } from '../../store/useConfigStore';
import './AuthPage.css';

const AuthPage = () => {
    const { t } = useTranslation();
    const [view, setView] = useState('login');
    const [authMessage, setAuthMessage] = useState('');
    const [authMessageType, setAuthMessageType] = useState('error');
    const navigate = useNavigate();
    const setIsLoggedIn = useConfigStore((state) => state.setIsLoggedIn);
    const setUserEmail = useConfigStore((state) => state.setUserEmail);

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('idle');

    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerPassword2, setRegisterPassword2] = useState('');
    const [registerStatus, setRegisterStatus] = useState('idle');

    const [agreementChecked, setAgreementChecked] = useState(false);
    const [showAgreementModal, setShowAgreementModal] = useState(false);

    const setMessage = (msg, type = 'error') => {
        setAuthMessage(msg);
        setAuthMessageType(type);
    };

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
                if (res.data.access_token) {
                    localStorage.setItem('access_token', res.data.access_token);
                    const email = res.data.user?.email || '';
                    localStorage.setItem('user_email', email);
                    setUserEmail(email);
                }
                setIsLoggedIn(true);
                setMessage(t('auth.msg_login_success'), 'success');
                setTimeout(() => navigate('/model-kutuphanesi'), 1500);
            } catch (err) {
                setMessage(
                    err.response?.status === 403
                        ? t('auth.msg_pending_approval')
                        : t('auth.msg_login_error')
                );
            }
        },
        onError: () => setMessage(t('auth.msg_google_error')),
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!agreementChecked) {
            setMessage(t('auth.msg_agreement_required'));
            return;
        }
        setLoginStatus('loading');
        try {
            const res = await axios.post('http://localhost:8000/api/auth/login/', {
                email: loginEmail,
                password: loginPassword,
            });
            if (res.data.key) {
                localStorage.setItem('access_token', res.data.key);
                localStorage.setItem('user_email', loginEmail);
            }
            setLoginStatus('success');
            setIsLoggedIn(true);
            setUserEmail(loginEmail);
            setMessage(t('auth.msg_login_success'), 'success');
            setTimeout(() => navigate('/model-kutuphanesi'), 1500);
        } catch (err) {
            setLoginStatus('idle');
            setMessage(parseApiError(err.response?.data, t('auth.msg_login_invalid')));
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!agreementChecked) {
            setMessage(t('auth.msg_agreement_required'));
            return;
        }
        if (registerPassword !== registerPassword2) {
            setMessage(t('auth.msg_passwords_mismatch'));
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
            setMessage(t('auth.msg_register_success'), 'success');
        } catch (err) {
            setRegisterStatus('idle');
            setMessage(parseApiError(err.response?.data, t('auth.msg_register_error')));
        }
    };

    const parseApiError = (data, fallback) => {
        if (!data) return fallback;
        if (typeof data === 'string') return data;
        const first = Object.values(data).flat().find(Boolean);
        return typeof first === 'string' ? first : fallback;
    };

    const messageStyle = {
        padding: '10px',
        marginBottom: '15px',
        borderRadius: '6px',
        fontSize: '0.9rem',
        textAlign: 'center',
        backgroundColor: authMessageType === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        color: authMessageType === 'success' ? '#22c55e' : '#ef4444',
        border: `1px solid ${authMessageType === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
    };

    const GoogleButton = ({ label }) => (
        <button
            className="auth-oauth-btn"
            onClick={() => {
                if (!agreementChecked) {
                    setMessage(t('auth.msg_agreement_required'));
                    return;
                }
                handleGoogleAuth();
            }}
            type="button"
            style={{ opacity: agreementChecked ? 1 : 0.6, cursor: agreementChecked ? 'pointer' : 'not-allowed' }}
        >
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
                {t('auth.back_home')}
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
                        <h1>{t('auth.tagline')}</h1>
                        <p>{t('auth.tagline_sub')}</p>
                    </div>
                </div>

                <div className="auth-form-pane">
                    <div className="auth-form-container">

                        <div className={`auth-view ${view === 'login' ? 'active' : ''}`}>
                            <div className="auth-form-header">
                                <h2>{t('auth.login_title')}</h2>
                                <p>{t('auth.login_subtitle')}</p>
                            </div>

                            {authMessage && <div style={messageStyle}>{authMessage}</div>}

                            <form onSubmit={handleLogin} className="auth-form">
                                <div className="auth-input-group">
                                    <label htmlFor="login-email">{t('auth.email_label')}</label>
                                    <input
                                        type="email"
                                        id="login-email"
                                        placeholder={t('auth.email_placeholder')}
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="auth-input-group">
                                    <div className="auth-label-row">
                                        <label htmlFor="login-password">{t('auth.password_label')}</label>
                                        <Link to="/forgot-password" className="auth-forgot-link">{t('auth.forgot_password')}</Link>
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
                                <div className="auth-agreement-group">
                                    <label className="auth-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={agreementChecked}
                                            onChange={(e) => setAgreementChecked(e.target.checked)}
                                            required
                                        />
                                        <span>
                                            <a href="#sozlesme" onClick={(e) => { e.preventDefault(); setShowAgreementModal(true); }}>{t('auth.agreement_text')}</a>{t('auth.agreement_suffix')}
                                        </span>
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="auth-submit-btn"
                                    disabled={loginStatus === 'loading' || !agreementChecked}
                                >
                                    {loginStatus === 'loading' ? t('auth.login_loading') : t('auth.login_btn')}
                                </button>
                            </form>

                            <div className="auth-divider"><span>{t('auth.divider')}</span></div>
                            <div className="auth-oauth-group">
                                <GoogleButton label={t('auth.google_login')} />
                            </div>
                            <div className="auth-switch-view">
                                {t('auth.no_account')}{' '}
                                <a href="#register" onClick={(e) => { e.preventDefault(); switchView('register'); }}>
                                    {t('auth.create_account_link')}
                                </a>
                            </div>
                        </div>

                        <div className={`auth-view ${view === 'register' ? 'active' : ''}`}>
                            <div className="auth-form-header">
                                <h2>{t('auth.register_title')}</h2>
                                <p>{t('auth.register_subtitle')}</p>
                            </div>

                            {authMessage && <div style={messageStyle}>{authMessage}</div>}

                            <form onSubmit={handleRegister} className="auth-form">
                                <div className="auth-input-group">
                                    <label htmlFor="register-email">{t('auth.email_label')}</label>
                                    <input
                                        type="email"
                                        id="register-email"
                                        placeholder={t('auth.email_placeholder')}
                                        value={registerEmail}
                                        onChange={(e) => setRegisterEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="auth-input-group">
                                    <label htmlFor="register-password">{t('auth.password_label')}</label>
                                    <input
                                        type="password"
                                        id="register-password"
                                        placeholder={t('auth.password_placeholder')}
                                        value={registerPassword}
                                        onChange={(e) => setRegisterPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="auth-input-group">
                                    <label htmlFor="register-password2">{t('auth.password2_label')}</label>
                                    <input
                                        type="password"
                                        id="register-password2"
                                        placeholder={t('auth.password2_placeholder')}
                                        value={registerPassword2}
                                        onChange={(e) => setRegisterPassword2(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="auth-agreement-group">
                                    <label className="auth-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={agreementChecked}
                                            onChange={(e) => setAgreementChecked(e.target.checked)}
                                            required
                                        />
                                        <span>
                                            <a href="#sozlesme" onClick={(e) => { e.preventDefault(); setShowAgreementModal(true); }}>{t('auth.agreement_text')}</a>{t('auth.agreement_suffix')}
                                        </span>
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="auth-submit-btn"
                                    disabled={registerStatus === 'loading' || registerStatus === 'success' || !agreementChecked}
                                >
                                    {registerStatus === 'loading' ? t('auth.register_loading') : t('auth.register_btn')}
                                </button>
                            </form>

                            <div className="auth-divider"><span>{t('auth.divider')}</span></div>
                            <div className="auth-oauth-group">
                                <GoogleButton label={t('auth.google_register')} />
                            </div>
                            <div className="auth-switch-view">
                                {t('auth.has_account')}{' '}
                                <a href="#login" onClick={(e) => { e.preventDefault(); switchView('login'); }}>
                                    {t('auth.login_link')}
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {showAgreementModal && (
                <div className="auth-modal-overlay" onClick={() => setShowAgreementModal(false)}>
                    <div className="auth-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="auth-modal-header">
                            <h3>{t('auth.agreement_modal_title')}</h3>
                            <button className="auth-modal-close" onClick={() => setShowAgreementModal(false)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <div className="auth-modal-body">
                            <p><strong>{t('auth.agreement_1_title')}</strong> {t('auth.agreement_1_body')}</p>
                            <p><strong>{t('auth.agreement_2_title')}</strong> {t('auth.agreement_2_body')}</p>
                            <p><strong>{t('auth.agreement_3_title')}</strong> {t('auth.agreement_3_body')}</p>
                            <p><strong>{t('auth.agreement_4_title')}</strong> {t('auth.agreement_4_body')}</p>
                            <p><strong>{t('auth.agreement_5_title')}</strong> {t('auth.agreement_5_body')}</p>
                            <p><strong>{t('auth.agreement_6_title')}</strong> {t('auth.agreement_6_body')}</p>
                        </div>
                        <div className="auth-modal-footer">
                            <button className="auth-submit-btn" onClick={() => {
                                setAgreementChecked(true);
                                setShowAgreementModal(false);
                            }}>
                                {t('auth.agreement_accept')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthPage;
