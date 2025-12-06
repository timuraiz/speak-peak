'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'
import Button from '@/app/components/Button'
import Social from '@/app/components/Social'
import InputField from '@/app/components/InputField'

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
})

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
})

type SignupFormData = z.infer<typeof signupSchema>
type OtpFormData = z.infer<typeof otpSchema>

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [showOtp, setShowOtp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({})
  const [otpError, setOtpError] = useState<string>('')
  const [resendTimer, setResendTimer] = useState(0)
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  // Resend timer effect
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const result = signupSchema.safeParse({ name, email })

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof SignupFormData] = issue.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    // TODO: Implement auth logic - send OTP to email
    setTimeout(() => {
      setLoading(false)
      setShowOtp(true)
      setResendTimer(60) // 60 seconds cooldown
      // Focus first OTP input
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100)
    }, 500)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setOtpError('')

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits are entered
    if (value && index === 5 && newOtp.every(digit => digit !== '')) {
      const otpString = newOtp.join('')
      handleOtpVerification(otpString)
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || ''
    }
    setOtp(newOtp)
    setOtpError('')

    // Focus the last filled input or the last input
    const lastIndex = Math.min(pastedData.length - 1, 5)
    otpInputRefs.current[lastIndex]?.focus()

    // Auto-submit if 6 digits
    if (pastedData.length === 6) {
      handleOtpVerification(pastedData)
    }
  }

  const handleOtpVerification = async (otpString?: string) => {
    const otpValue = otpString || otp.join('')
    setOtpError('')

    const result = otpSchema.safeParse({ otp: otpValue })

    if (!result.success) {
      setOtpError(result.error.issues[0]?.message || 'Invalid OTP')
      return
    }

    setLoading(true)
    // TODO: Implement OTP verification logic
    setTimeout(() => {
      setLoading(false)
      router.push('/onboarding')
    }, 500)
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) return

    setResendLoading(true)
    // TODO: Implement resend OTP logic
    setTimeout(() => {
      setResendLoading(false)
      setResendTimer(60)
      setOtp(['', '', '', '', '', ''])
      setOtpError('')
      otpInputRefs.current[0]?.focus()
    }, 500)
  }

  if (true) {
    return (
      <div className="h-screen flex items-center justify-center bg-white rounded-3xl border border-border">
        <div className="w-full max-w-md flex flex-col gap-8 pt-32 pb-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-dark text-center">Check your email.<br /> <span className='text-dark-50'>We’ve send 6-digit code</span></h1>
          </div>
          <div>
            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <InputField
                  key={index}
                  ref={(el) => {
                    otpInputRefs.current[index] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  className={`w-14 h-14 p-0 text-center text-2xl font-semibold rounded-2xl border transition-all ${otpError
                    ? 'border-red focus:border-red'
                    : 'border-border focus:border-accent'
                    } ${digit ? 'text-dark' : 'text-dark-50'}`}
                />
              ))}
            </div>
            {otpError && (
              <p className="text-xs text-red text-center mt-1">{otpError}</p>
            )}
          </div>

          <div className="space-y-4">
            <Button
              variant="primary-no-icon"
              onClick={() => handleOtpVerification()}
              className="w-full"
            >
              {loading ? 'Verifying...' : 'Confirm'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-dark-70 mb-2">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || resendLoading}
                className="text-sm text-accent font-medium hover:underline disabled:text-dark-50 disabled:cursor-not-allowed"
              >
                {resendTimer > 0
                  ? `Resend code in ${resendTimer}s`
                  : resendLoading
                    ? 'Sending...'
                    : 'Resend code'}
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              setShowOtp(false)
              setOtp(['', '', '', '', '', ''])
              setOtpError('')
              setResendTimer(0)
            }}
            className="text-sm text-dark-70 hover:text-dark text-center"
          >
            Change email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex items-center justify-center bg-white rounded-3xl border border-border">
      <div className="w-full max-w-md flex flex-col gap-8 pt-32 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-dark mb-2 text-center">Welcome to SpeakPeak 👋<br /><span className="text-2xl font-semibold text-dark-50 mb-2 text-center line-height-0.8">Match. Talk. Improve.</span></h1>
        </div>
        <div className="flex flex-col gap-2">
          <Social icon="/Google.svg" text="Continue with Google" onClick={() => { }} />
          <Social icon="/Apple.svg" text="Continue with Apple" onClick={() => { }} />
        </div>

        <div className="flex items-center gap-2">
          <div className='flex-1 border-t border-border rounded-full'></div>
          <p className="text-sm text-dark-70">Or</p>
          <div className='flex-1 border-t border-border rounded-full'></div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <InputField
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) {
                setErrors(prev => ({ ...prev, email: undefined }))
              }
            }}
            error={errors.email}
          />
          <Button variant="primary-no-icon" type="submit" disabled={loading} className="w-full">
            {loading ? 'Sending code...' : 'Continue with email'}
          </Button>
        </form>

        <p className="text-center text-sm text-dark">
          Don't have an account yet?{' '}
          <Link href="/login" className="text-accent font-medium hover:underline">
            Sign In
          </Link>
        </p>
        <p className='text-center text-sm text-dark-50 mt-24'>By signing up, you agree to our Terms of service & Privacy Policy</p>
      </div>
    </div>
  )
}

