'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/app/components/Button'

export default function OnboardingPage() {
    const [step, setStep] = useState(1)
    const [selectedLanguage, setSelectedLanguage] = useState<string>('')
    const [selectedLevel, setSelectedLevel] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const languages = [
        { id: 'english', name: 'English' },
        { id: 'spanish', name: 'Spanish' },
        { id: 'french', name: 'French' },
        { id: 'german', name: 'German' },
        { id: 'italian', name: 'Italian' },
        { id: 'portuguese', name: 'Portuguese' },
    ]

    const levels = [
        { id: 'beginner', name: 'Beginner' },
        { id: 'intermediate', name: 'Intermediate' },
        { id: 'advanced', name: 'Advanced' },
    ]

    const handleComplete = async () => {
        setLoading(true)
        // TODO: Implement onboarding completion logic
        setTimeout(() => {
            setLoading(false)
            router.push('/')
        }, 500)
    }

    const handleNext = () => {
        if (step === 1 && selectedLanguage) {
            setStep(2)
        } else if (step === 2 && selectedLevel) {
            handleComplete()
        }
    }

    return (
        <div className="h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex justify-center gap-2 mb-4">
                        {[1, 2].map((s) => (
                            <div
                                key={s}
                                className={`h-2 rounded-full transition-all ${s <= step ? 'bg-accent w-8' : 'bg-border w-2'
                                    }`}
                            />
                        ))}
                    </div>
                    <h1 className="text-3xl font-semibold text-dark mb-2">
                        {step === 1 ? 'What language do you want to learn?' : 'What\'s your level?'}
                    </h1>
                    <p className="text-sm text-dark-70">
                        {step === 1
                            ? 'Choose the language you want to practice'
                            : 'Select your current proficiency level'}
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    {step === 1 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {languages.map((lang) => (
                                <button
                                    key={lang.id}
                                    onClick={() => setSelectedLanguage(lang.id)}
                                    className={`p-4 rounded-2xl border-2 transition-all text-left ${selectedLanguage === lang.id
                                        ? 'border-accent bg-accent/5'
                                        : 'border-border bg-white hover:border-accent/50'
                                        }`}
                                >
                                    <span className="text-sm font-medium text-dark">{lang.name}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {levels.map((level) => (
                                <button
                                    key={level.id}
                                    onClick={() => setSelectedLevel(level.id)}
                                    className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${selectedLevel === level.id
                                        ? 'border-accent bg-accent/5'
                                        : 'border-border bg-white hover:border-accent/50'
                                        }`}
                                >
                                    <span className="text-sm font-medium text-dark">{level.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <Button
                    onClick={handleNext}
                    disabled={loading || (step === 1 && !selectedLanguage) || (step === 2 && !selectedLevel)}
                    className="w-full"
                    variant="primary-no-icon"
                >
                    {loading ? 'Completing...' : step === 2 ? 'Complete setup' : 'Continue'}
                </Button>
            </div>
        </div>
    )
}

