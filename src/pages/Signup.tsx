import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail, Lock, Eye, EyeOff, Loader2,
  User as UserIcon, Shield, CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── Zod schema ───────────────────────────────────────────────────────────────
const schema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(60, 'Full name is too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
});
type FormData = z.infer<typeof schema>;

type UserData = { uid: string; email: string | null; displayName: string | null; photoURL: string | null };

interface SignupProps {
  onAuthStateChange: (user: UserData | null) => void;
}

// ── Google SVG icon ───────────────────────────────────────────────────────────
const GoogleIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
    <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"/>
    <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09z"/>
    <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
  </svg>
);

// ── Password strength ────────────────────────────────────────────────────────
function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '#E5E7EB' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: 'Weak', color: '#EF4444' };
  if (score === 2) return { score, label: 'Fair', color: '#F59E0B' };
  if (score === 3) return { score, label: 'Good', color: '#3B82F6' };
  return { score, label: 'Strong', color: '#10B981' };
}

// ── Styles ───────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'var(--c-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  blob1: {
    position: 'fixed',
    top: '10%',
    right: '5%',
    width: 350,
    height: 350,
    borderRadius: '50%',
    background: 'radial-gradient(circle, var(--c-accent-glow) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  blob2: {
    position: 'fixed',
    bottom: '10%',
    left: '5%',
    width: 300,
    height: 300,
    borderRadius: '50%',
    background: 'radial-gradient(circle, var(--c-accent-glow-sm) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: 'var(--c-bg-card)',
    borderRadius: 16,
    padding: '32px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
    border: '1px solid var(--c-border)',
    position: 'relative',
    zIndex: 1,
  },
  logoWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
  },
  logoBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: 'linear-gradient(135deg, var(--c-accent), var(--c-accent-dark))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px var(--c-accent-glow)',
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: 'var(--c-text-primary)',
    margin: 0,
    letterSpacing: '-0.025em',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: 'var(--c-text-secondary)',
    margin: 0,
    textAlign: 'center',
    lineHeight: 1.6,
  },
  socialRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 20,
  },
  socialBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    padding: '11px 16px',
    border: '1px solid var(--c-border)',
    borderRadius: 10,
    background: 'var(--c-surface)',
    color: 'var(--c-text-primary)',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 150ms ease',
    outline: 'none',
    fontFamily: 'inherit',
  },
  dividerWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '20px 0',
  },
  dividerLine: { flex: 1, height: 1, background: 'var(--c-border)' },
  dividerText: { fontSize: 13, color: 'var(--c-text-secondary)', fontWeight: 500 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 13, fontWeight: 500, color: 'var(--c-text-secondary)' },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: {
    position: 'absolute',
    left: 12,
    color: 'var(--c-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '12px 14px 12px 40px',
    border: '1px solid var(--c-input-border)',
    borderRadius: 10,
    fontSize: 14,
    color: 'var(--c-text-primary)',
    background: 'var(--c-input-bg)',
    outline: 'none',
    transition: 'border-color 150ms ease, box-shadow 150ms ease',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--c-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    padding: 2,
    borderRadius: 4,
    transition: 'color 150ms ease',
  },
  errorMsg: { fontSize: 12, color: '#EF4444', marginTop: 2 },
  primaryBtn: {
    width: '100%',
    padding: '13px 16px',
    background: 'linear-gradient(135deg, var(--c-accent), var(--c-accent-dark))',
    border: 'none',
    borderRadius: 10,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'all 150ms ease',
    fontFamily: 'inherit',
    outline: 'none',
    boxShadow: '0 4px 12px var(--c-accent-glow)',
  },
  redirectText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'var(--c-text-secondary)',
    marginTop: 20,
    marginBottom: 0,
  },
  redirectLink: {
    color: 'var(--c-accent)',
    fontWeight: 600,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    fontSize: 14,
    fontFamily: 'inherit',
    transition: 'color 150ms ease',
  },
  errorBanner: {
    padding: '10px 12px',
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: 8,
    fontSize: 13,
    color: '#DC2626',
    marginBottom: 16,
  },
  strengthBarWrap: {
    display: 'flex',
    gap: 4,
    marginTop: 8,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 4,
    transition: 'background 300ms ease',
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: 600,
    marginTop: 4,
    transition: 'color 300ms ease',
  },
  requirementsWrap: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  reqRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: 'var(--c-text-secondary)',
  },
};

// ── InputField ────────────────────────────────────────────────────────────────
interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  error?: string;
  registration: object;
  rightElement?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  id, label, type, placeholder, icon, error, registration, rightElement,
}) => {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const getBorderAndShadow = () => {
    if (error) return { border: '1px solid #EF4444', boxShadow: focused ? '0 0 0 3px rgba(239,68,68,0.12)' : 'none' };
    if (focused) return { border: '1px solid var(--c-accent)', boxShadow: '0 0 0 3px var(--c-accent-glow-sm)' };
    if (hovered) return { border: '1px solid var(--c-accent)', boxShadow: 'none' };
    return { border: '1px solid var(--c-input-border)', boxShadow: 'none' };
  };

  return (
    <div style={s.fieldGroup}>
      <label htmlFor={id} style={s.label}>
        {label} <span style={{ color: '#EF4444' }}>*</span>
      </label>
      <div style={s.inputWrap}>
        <span style={{ ...s.inputIcon, color: focused ? 'var(--c-accent)' : 'var(--c-text-secondary)' }}>
          {icon}
        </span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          aria-label={label}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          style={{
            ...s.input,
            ...getBorderAndShadow(),
            paddingRight: rightElement ? 42 : 14,
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          {...(registration as any)}
        />
        {rightElement}
      </div>
      {error && (
        <span id={`${id}-error`} role="alert" style={s.errorMsg}>
          {error}
        </span>
      )}
    </div>
  );
};

// ── PasswordStrengthMeter ─────────────────────────────────────────────────────
const PasswordStrengthMeter: React.FC<{ password: string }> = ({ password }) => {
  const { score, label, color } = getStrength(password);
  if (!password) return null;

  const requirements = [
    { text: 'Minimum 8 characters', met: password.length >= 8 },
    { text: '1 uppercase letter', met: /[A-Z]/.test(password) },
    { text: '1 number', met: /[0-9]/.test(password) },
    { text: '1 special character', met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Strength bars */}
      <div style={s.strengthBarWrap} role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={4} aria-label={`Password strength: ${label}`}>
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            style={{
              ...s.strengthBar,
              background: i <= score ? color : '#E5E7EB',
            }}
          />
        ))}
      </div>
      {label && (
        <div style={{ ...s.strengthLabel, color }}>
          {label}
        </div>
      )}

      {/* Requirements */}
      <div style={s.requirementsWrap} aria-label="Password requirements">
        {requirements.map(req => (
          <div key={req.text} style={s.reqRow}>
            <CheckCircle
              size={12}
              style={{ color: req.met ? '#10B981' : '#D1D5DB', flexShrink: 0 }}
            />
            <span style={{ color: req.met ? '#374151' : '#9CA3AF' }}>{req.text}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ── Signup Component ──────────────────────────────────────────────────────────
const Signup: React.FC<SignupProps> = ({ onAuthStateChange }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [googleHover, setGoogleHover] = useState(false);
  const [submitHover, setSubmitHover] = useState(false);
  const [loginHover, setLoginHover] = useState(false);
  const [watchedPw, setWatchedPw] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const pwValue = watch('password', '');
  useEffect(() => { setWatchedPw(pwValue || ''); }, [pwValue]);

  const signInWithGoogle = async () => {
    setAuthError('');
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/app' },
      });
      if (error) throw error;
    } catch (err: any) {
      setAuthError(friendlyError(err.message));
      setGoogleLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setAuthError('');
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            name: data.fullName,
          },
        },
      });
      if (error) throw error;
      if (authData.user) {
        const u = authData.user;
        onAuthStateChange({
          uid: u.id,
          email: u.email ?? null,
          displayName: u.user_metadata?.full_name || null,
          photoURL: null,
        });
      }
    } catch (err: any) {
      setAuthError(friendlyError(err.message));
    }
  };

  return (
    <div style={s.page} role="main">
      <div style={s.blob1 as React.CSSProperties} aria-hidden="true" />
      <div style={s.blob2 as React.CSSProperties} aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 420, zIndex: 1 }}
      >
        <motion.div
          style={s.card}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          {/* Logo & header */}
          <div style={s.logoWrap}>
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img src="/logo.png" alt="Logo" style={{ width: 64, height: 64, objectFit: 'contain' }} />
            </motion.div>
            <h1 style={s.title}>Create your account</h1>
            <p style={s.description}>
              Sign up to start managing your tasks and tracking your productivity.
            </p>
          </div>

          {/* Google */}
          <div style={s.socialRow}>
            <motion.button
              type="button"
              aria-label="Continue with Google"
              style={{
                ...s.socialBtn,
                background: googleHover ? '#F9FAFB' : '#ffffff',
                borderColor: googleHover ? 'var(--c-accent)' : '#E5E7EB',
              }}
              onClick={signInWithGoogle}
              onMouseEnter={() => setGoogleHover(true)}
              onMouseLeave={() => setGoogleHover(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={googleLoading || isSubmitting}
            >
              {googleLoading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ display: 'flex' }}
                >
                  <Loader2 size={18} />
                </motion.span>
              ) : (
                <GoogleIcon size={18} />
              )}
              Continue with Google
            </motion.button>
          </div>

          {/* Divider */}
          <div style={s.dividerWrap} role="separator" aria-hidden="true">
            <div style={s.dividerLine} />
            <span style={s.dividerText}>or</span>
            <div style={s.dividerLine} />
          </div>

          {/* Auth error */}
          <AnimatePresence>
            {authError && (
              <motion.div
                key="auth-err"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                style={s.errorBanner}
                role="alert"
              >
                {authError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate style={s.form}>
            {/* Full Name */}
            <InputField
              id="fullName"
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              icon={<UserIcon size={16} />}
              error={errors.fullName?.message}
              registration={register('fullName')}
            />

            {/* Email */}
            <InputField
              id="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              registration={register('email')}
            />

            {/* Password */}
            <div style={s.fieldGroup}>
              <label htmlFor="password" style={s.label}>
                Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <PasswordInputField
                id="password"
                placeholder="Create a password"
                icon={<Lock size={16} />}
                error={errors.password?.message}
                registration={register('password')}
                showPassword={showPassword}
                onToggle={() => setShowPassword(v => !v)}
              />
              <PasswordStrengthMeter password={watchedPw} />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              aria-label="Create account"
              disabled={isSubmitting || googleLoading}
              style={{
                ...s.primaryBtn,
                marginTop: 4,
                opacity: isSubmitting ? 0.82 : 1,
                background: submitHover && !isSubmitting
                  ? 'linear-gradient(135deg, var(--c-accent-dark), #5B21B6)'
                  : 'linear-gradient(135deg, var(--c-accent), var(--c-accent-dark))',
                boxShadow: submitHover && !isSubmitting
                  ? '0 6px 20px var(--c-accent-glow)'
                  : '0 4px 12px var(--c-accent-glow-sm)',
              }}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              onMouseEnter={() => setSubmitHover(true)}
              onMouseLeave={() => setSubmitHover(false)}
            >
              {isSubmitting ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'flex' }}
                  >
                    <Loader2 size={16} />
                  </motion.span>
                  Creating account…
                </>
              ) : (
                <>
                  <Shield size={16} />
                  Create Account
                </>
              )}
            </motion.button>
          </form>

          {/* Login redirect */}
          <p style={s.redirectText}>
            Already have an account?{' '}
            <button
              type="button"
              style={{
                ...s.redirectLink,
                color: loginHover ? 'var(--c-accent-dark)' : 'var(--c-accent)',
              }}
              onMouseEnter={() => setLoginHover(true)}
              onMouseLeave={() => setLoginHover(false)}
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

// ── PasswordInputField ─────────────────────────────────────────────────────────
// Separate sub-component so the parent can pass showPassword control
interface PasswordInputFieldProps {
  id: string;
  placeholder: string;
  icon: React.ReactNode;
  error?: string;
  registration: object;
  showPassword: boolean;
  onToggle: () => void;
}

const PasswordInputField: React.FC<PasswordInputFieldProps> = ({
  id, placeholder, icon, error, registration, showPassword, onToggle,
}) => {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const getBorderAndShadow = () => {
    if (error) return { border: '1px solid #EF4444', boxShadow: focused ? '0 0 0 3px rgba(239,68,68,0.12)' : 'none' };
    if (focused) return { border: '1px solid var(--c-accent)', boxShadow: '0 0 0 3px var(--c-accent-glow-sm)' };
    if (hovered) return { border: '1px solid var(--c-accent)', boxShadow: 'none' };
    return { border: '1px solid var(--c-input-border)', boxShadow: 'none' };
  };

  return (
    <>
      <div style={s.inputWrap}>
        <span style={{ ...s.inputIcon, color: focused ? 'var(--c-accent)' : 'var(--c-text-secondary)' }}>
          {icon}
        </span>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          aria-label="Password"
          aria-describedby={error ? `${id}-error` : `${id}-requirements`}
          aria-invalid={!!error}
          style={{
            ...s.input,
            ...getBorderAndShadow(),
            paddingRight: 42,
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          {...(registration as any)}
        />
        <button
          type="button"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          style={s.eyeBtn}
          onClick={onToggle}
        >
          <motion.span
            key={showPassword ? 'hide' : 'show'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            style={{ display: 'flex' }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </motion.span>
        </button>
      </div>
      {error && (
        <span id={`${id}-error`} role="alert" style={s.errorMsg}>
          {error}
        </span>
      )}
    </>
  );
};

// ── Friendly error messages ────────────────────────────────────────────────────
function friendlyError(message: string): string {
  if (!message) return 'Something went wrong. Please try again.';
  const m = message.toLowerCase();
  if (m.includes('already registered') || m.includes('user already exists') || m.includes('already been registered')) {
    return 'An account with this email already exists. Please sign in.';
  }
  if (m.includes('invalid email')) {
    return 'Invalid email address.';
  }
  if (m.includes('password should be at least') || m.includes('weak password')) {
    return 'Password is too weak. Please choose a stronger password.';
  }
  if (m.includes('too many requests') || m.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  return 'Something went wrong. Please try again.';
}

export default Signup;
