import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const { error } = await signIn(email, password);
        if (error) {
            setError(error);
            setIsLoading(false);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg-pattern" />
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">The Global Sanctum</div>
                        <div className="auth-logo-subtitle">Internal Portal</div>
                        <h1 className="auth-title">Welcome Back</h1>
                        <p className="auth-subtitle">Sign in to your admin account</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <span className="auth-error-icon">!</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="email">Email Address</label>
                            <div className="auth-input-wrapper">
                                <Mail size={18} className="auth-input-icon" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@theglobalsanctum.com"
                                    className="auth-input"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label className="auth-label" htmlFor="password">Password</label>
                            <div className="auth-input-wrapper">
                                <Lock size={18} className="auth-input-icon" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="auth-input"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="auth-toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="auth-submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="auth-spinner" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/signup" className="auth-link">Create one</Link>
                        </p>
                    </div>
                </div>

                <div className="auth-brand-side">
                    <div className="auth-brand-content">
                        <div className="auth-brand-icon">
                            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                                <circle cx="32" cy="32" r="30" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                                <circle cx="32" cy="32" r="20" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                                <circle cx="32" cy="32" r="10" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                                <circle cx="32" cy="32" r="3" fill="rgba(255,255,255,0.8)" />
                            </svg>
                        </div>
                        <h2 className="auth-brand-title">Manage Your Wellness Empire</h2>
                        <p className="auth-brand-text">
                            A premium admin portal for managing venues, retreat hosts, wellness guests, and everything in between.
                        </p>
                        <div className="auth-brand-features">
                            <div className="auth-brand-feature">
                                <span className="auth-feature-dot" />
                                Venue Management
                            </div>
                            <div className="auth-brand-feature">
                                <span className="auth-feature-dot" />
                                Analytics & Insights
                            </div>
                            <div className="auth-brand-feature">
                                <span className="auth-feature-dot" />
                                Team Collaboration
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
