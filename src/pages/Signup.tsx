import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, User, Loader2 } from 'lucide-react';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setIsLoading(true);
        const { error } = await signUp(email, password);

        if (error) {
            setError(error);
            setIsLoading(false);
        } else {
            setSuccess('Account created! Check your email to confirm your account, then sign in.');
            setIsLoading(false);
            setTimeout(() => navigate('/login'), 4000);
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
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Set up your admin access</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <span className="auth-error-icon">!</span>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="auth-success">
                            <span className="auth-success-icon">✓</span>
                            {success}
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
                                    placeholder="Minimum 6 characters"
                                    className="auth-input"
                                    required
                                    autoComplete="new-password"
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

                        <div className="auth-field">
                            <label className="auth-label" htmlFor="confirmPassword">Confirm Password</label>
                            <div className="auth-input-wrapper">
                                <User size={18} className="auth-input-icon" />
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter your password"
                                    className="auth-input"
                                    required
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <button type="submit" className="auth-submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="auth-spinner" />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="auth-link">Sign in</Link>
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
                        <h2 className="auth-brand-title">Join The Global Sanctum</h2>
                        <p className="auth-brand-text">
                            Get access to the admin portal to manage venues, track analytics, and coordinate your wellness team.
                        </p>
                        <div className="auth-brand-features">
                            <div className="auth-brand-feature">
                                <span className="auth-feature-dot" />
                                Secure Access
                            </div>
                            <div className="auth-brand-feature">
                                <span className="auth-feature-dot" />
                                Role-Based Permissions
                            </div>
                            <div className="auth-brand-feature">
                                <span className="auth-feature-dot" />
                                Real-Time Syncing
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
