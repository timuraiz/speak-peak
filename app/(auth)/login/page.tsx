'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import Button from '@/app/components/Button';
import Social from '@/app/components/Social';
import InputField from '@/app/components/InputField';
import { createClient } from '@/app/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const supabase = createClient();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    const result = z.email().safeParse(email);
    if (!result.success) { setEmailError('Invalid email address'); return; }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
    setLoading(false);

    if (error) { setEmailError(error.message); return; }

    setShowOtp(true);
    setResendTimer(60);
    setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');
    if (value && index < 5) otpInputRefs.current[index + 1]?.focus();
    if (value && index === 5 && newOtp.every(d => d)) verifyOtp(newOtp.join(''));
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpInputRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;
    const newOtp = Array.from({ length: 6 }, (_, i) => pasted[i] || '');
    setOtp(newOtp);
    otpInputRefs.current[Math.min(pasted.length - 1, 5)]?.focus();
    if (pasted.length === 6) verifyOtp(pasted);
  };

  const verifyOtp = async (token: string) => {
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });

    if (error) { setOtpError(error.message); setLoading(false); return; }

    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles').select('onboarding_completed').eq('id', user!.id).single();

    if (profile?.onboarding_completed) {
      sessionStorage.setItem('showWelcome', '1');
      router.push('/');
    } else {
      router.push('/onboarding');
    }
  };

  if (showOtp) {
    return (
      <div className="h-screen flex items-center justify-center bg-white rounded-3xl border border-border">
        <div className="w-full max-w-md flex flex-col gap-8 pt-32 pb-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-dark text-center">
              Check your email.<br /><span className="text-dark-50">We&apos;ve sent a 6-digit code</span>
            </h1>
          </div>
          <div>
            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <InputField
                  key={index}
                  ref={(el) => { otpInputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  className={`w-14 h-14 p-0 text-center text-2xl font-semibold rounded-2xl border transition-all ${otpError ? 'border-red' : 'border-border focus:border-accent'} ${digit ? 'text-dark' : 'text-dark-50'}`}
                />
              ))}
            </div>
            {otpError && <p className="text-xs text-red text-center mt-1">{otpError}</p>}
          </div>
          <div className="space-y-4">
            <Button variant="primary-no-icon" onClick={() => verifyOtp(otp.join(''))} className="w-full">
              {loading ? 'Verifying...' : 'Confirm'}
            </Button>
            <div className="text-center">
              <p className="text-sm text-dark-70 mb-2">Didn&apos;t receive the code?</p>
              <button
                onClick={() => { setResendTimer(60); supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } }); }}
                disabled={resendTimer > 0}
                className="text-sm text-accent font-medium hover:underline disabled:text-dark-50 disabled:cursor-not-allowed"
              >
                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
              </button>
            </div>
          </div>
          <button onClick={() => { setShowOtp(false); setOtp(['', '', '', '', '', '']); setOtpError(''); }} className="text-sm text-dark-70 hover:text-dark text-center">
            Change email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-white rounded-3xl border border-border">
      <div className="w-full max-w-md flex flex-col gap-8 pt-32 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-dark mb-2 text-center">
            Welcome back 👋<br />
            <span className="text-2xl font-semibold text-dark-50">Match. Talk. Improve.</span>
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          <Social icon="/Google.svg" text="Continue with Google" onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } })} />
          <Social icon="/Apple.svg" text="Continue with Apple" onClick={() => supabase.auth.signInWithOAuth({ provider: 'apple', options: { redirectTo: `${window.location.origin}/auth/callback` } })} />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 border-t border-border rounded-full" />
          <p className="text-sm text-dark-70">Or</p>
          <div className="flex-1 border-t border-border rounded-full" />
        </div>
        <form onSubmit={handleSendOtp} className="space-y-4">
          <InputField
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
            error={emailError}
          />
          <Button variant="primary-no-icon" type="submit" disabled={loading} className="w-full">
            {loading ? 'Sending code...' : 'Continue with email'}
          </Button>
        </form>
        <p className="text-center text-sm text-dark">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-accent font-medium hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
