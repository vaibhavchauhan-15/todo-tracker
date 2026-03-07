import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, Loader2, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── Zod schema ──────────────────────────────────────────────────────────────
const schema = z.object({
  identifier: z.string().min(1, 'This field is required'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

// ── Google SVG icon ──────────────────────────────────────────────────────────
const GoogleIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
    <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"/>
    <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09z"/>
    <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
  </svg>
);

// ── Apple SVG icon ───────────────────────────────────────────────────────────
const AppleIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.53 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

type UserData = { uid: string; email: string | null; displayName: string | null; photoURL: string | null };

interface LoginProps {
  onAuthStateChange: (user: UserData | null) => void;
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
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
  dividerLine: {
    flex: 1,
    height: 1,
    background: 'var(--c-border)',
  },
  dividerText: {
    fontSize: 13,
    color: 'var(--c-text-secondary)',
    fontWeight: 500,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--c-text-secondary)',
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
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
  errorMsg: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 2,
  },
  forgotWrap: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: -8,
  },
  forgotLink: {
    fontSize: 13,
    color: 'var(--c-text-secondary)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'inherit',
    transition: 'color 150ms ease',
  },
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
    color: '#EF4444',
    marginBottom: 16,
  },
};

// ── InputField sub-component ─────────────────────────────────────────────────
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
    <div style={styles.fieldGroup}>
      <label htmlFor={id} style={styles.label}>{label} <span style={{ color: '#EF4444' }}>*</span></label>
      <div style={styles.inputWrap}>
        <span style={{ ...styles.inputIcon, color: focused ? 'var(--c-accent)' : 'var(--c-text-secondary)' }}>
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
            ...styles.input,
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
        <span id={`${id}-error`} role="alert" style={styles.errorMsg}>
          {error}
        </span>
      )}
    </div>
  );
};

// ── Login Component ──────────────────────────────────────────────────────────
const Login: React.FC<LoginProps> = ({ onAuthStateChange }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [googleHover, setGoogleHover] = useState(false);
  const [appleHover, setAppleHover] = useState(false);
  const [submitHover, setSubmitHover] = useState(false);
  const [forgotHover, setForgotHover] = useState(false);
  const [signupHover, setSignupHover] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

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
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.identifier,
        password: data.password,
      });
      if (error) throw error;
      if (authData.user) {
        const u = authData.user;
        onAuthStateChange({
          uid: u.id,
          email: u.email ?? null,
          displayName: u.user_metadata?.full_name || u.user_metadata?.name || null,
          photoURL: u.user_metadata?.avatar_url || null,
        });
      }
    } catch (err: any) {
      setAuthError(friendlyError(err.message));
    }
  };

  return (
    <div style={styles.page} role="main">
      <div style={styles.blob1 as React.CSSProperties} aria-hidden="true" />
      <div style={styles.blob2 as React.CSSProperties} aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 420, zIndex: 1 }}
      >
        <motion.div
          style={styles.card}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          {/* Logo & header */}
          <div style={styles.logoWrap}>
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img src="/logo.png" alt="Logo" style={{ width: 64, height: 64, objectFit: 'contain' }} />
            </motion.div>
            <h1 style={styles.title}>Welcome back</h1>
            <p style={styles.description}>
              Login to access your dashboard and manage your account.
            </p>
          </div>

          {/* Social buttons */}
          <div style={styles.socialRow}>
            <motion.button
              type="button"
              aria-label="Continue with Google"
              style={{
                ...styles.socialBtn,
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

            <motion.button
              type="button"
              aria-label="Continue with Apple"
              style={{
                ...styles.socialBtn,
                background: appleHover ? '#F9FAFB' : '#ffffff',
                borderColor: appleHover ? 'var(--c-accent)' : '#E5E7EB',
              }}
              onMouseEnter={() => setAppleHover(true)}
              onMouseLeave={() => setAppleHover(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AppleIcon size={18} />
              Continue with Apple
            </motion.button>
          </div>

          {/* Divider */}
          <div style={styles.dividerWrap} role="separator" aria-hidden="true">
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <div style={styles.dividerLine} />
          </div>

          {/* Auth error banner */}
          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={styles.errorBanner}
              role="alert"
            >
              {authError}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate style={styles.form}>
            <InputField
              id="identifier"
              label="Email / Username / Phone"
              type="text"
              placeholder="Enter email, username, or phone number"
              icon={<UserIcon size={16} />}
              error={errors.identifier?.message}
              registration={register('identifier')}
            />

            <InputField
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              icon={<Lock size={16} />}
              error={errors.password?.message}
              registration={register('password')}
              rightElement={
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={styles.eyeBtn}
                  onClick={() => setShowPassword(v => !v)}
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
              }
            />

            {/* Forgot password */}
            <div style={styles.forgotWrap}>
              <button
                type="button"
                style={{
                  ...styles.forgotLink,
                  color: forgotHover ? 'var(--c-accent)' : '#6B7280',
                  textDecoration: forgotHover ? 'underline' : 'none',
                }}
                onMouseEnter={() => setForgotHover(true)}
                onMouseLeave={() => setForgotHover(false)}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              aria-label="Login"
              disabled={isSubmitting || googleLoading}
              style={{
                ...styles.primaryBtn,
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
                  Signing in…
                </>
              ) : (
                'Login'
              )}
            </motion.button>
          </form>

          {/* Signup redirect */}
          <p style={styles.redirectText}>
            Don't have an account?{' '}
            <button
              type="button"
              style={{
                ...styles.redirectLink,
                color: signupHover ? '#6D28D9' : '#7C3AED',
              }}
              onMouseEnter={() => setSignupHover(true)}
              onMouseLeave={() => setSignupHover(false)}
              onClick={() => navigate('/signup')}
            >
              Sign up
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

// ── Friendly error messages ───────────────────────────────────────────────────
function friendlyError(message: string): string {
  if (!message) return 'Something went wrong. Please try again.';
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials') || m.includes('invalid credentials')) {
    return 'Invalid email or password. Please check your credentials.';
  }
  if (m.includes('email not confirmed')) {
    return 'Please verify your email before signing in.';
  }
  if (m.includes('too many requests') || m.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (m.includes('user not found')) {
    return 'No account found with this email.';
  }
  return 'Something went wrong. Please try again.';
}

export default Login;
