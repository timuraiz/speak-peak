'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'
import Button from '@/app/components/Button'
import Social from '@/app/components/Social'
import InputField from '@/app/components/InputField'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const result = loginSchema.safeParse({ email, password })

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof LoginFormData] = issue.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    // TODO: Implement auth logic
    setTimeout(() => {
      setLoading(false)
      router.push('/onboarding')
    }, 500)
  }

  return (
    <div className="h-screen flex items-center justify-center bg-white rounded-3xl border border-border">
      <div className="w-full max-w-md flex flex-col gap-8 pt-32 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-dark mb-2 text-center">Welcome back 👋<br /><span className="text-2xl font-semibold text-dark-50 mb-2 text-center line-height-0.8">Match. Talk. Improve.</span></h1>
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

        <form onSubmit={handleLogin} className="space-y-4">
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
          <InputField
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) {
                setErrors(prev => ({ ...prev, password: undefined }))
              }
            }}
            error={errors.password}
          />
          <Button variant="primary-no-icon" type="submit" disabled={loading} className="w-full">
            {loading ? 'Logging in...' : 'Continue with email'}
          </Button>
        </form>

        <p className="text-center text-sm text-dark">
          Don't have an account yet?{' '}
          <Link href="/signup" className="text-accent font-medium hover:underline">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  )
}

