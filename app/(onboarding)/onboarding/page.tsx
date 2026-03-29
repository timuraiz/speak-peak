"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import InputField from "@/app/components/InputField";
import { createClient } from "@/app/lib/supabase/client";
import { useAuth } from "@/app/contexts/AuthContext";

const AVATARS = [...Array.from({ length: 30 }, (_, i) => `${i + 1}.png`)];

const steps = [
  {
    title: "Let's get to know each other.",
    subtitle: "What's your name?",
    hint: "We'll show your name to your speaking partner during the call",
  },
  {
    title: "Let's give you a look.",
    subtitle: "Pick your avatar.",
    hint: "We'll show your avatar to your speaking partner during the call",
  },
  {
    title: "Let's set your daily goal.",
    subtitle: "You'll make progress every day",
    hint: null,
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [animPhase, setAnimPhase] = useState<"idle" | "out" | "in">("idle");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [goalHours, setGoalHours] = useState("");
  const [goalMinutes, setGoalMinutes] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { refreshProfile } = useAuth();

  const handleComplete = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const totalMinutes =
      parseInt(goalHours || "0") * 60 + parseInt(goalMinutes || "0");

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      name: name.trim(),
      avatar: selectedAvatar ? `/faces/${selectedAvatar}` : null,
      daily_goal_minutes: totalMinutes || null,
      onboarding_completed: true,
    });

    if (error) {
      console.error("profiles upsert error:", error);
      setLoading(false);
      return;
    }

    await refreshProfile();
    sessionStorage.setItem("showWelcome", "1");
    router.push("/");
  };

  const goToStep = (newStep: number) => {
    setAnimPhase("out");
    setTimeout(() => {
      setStep(newStep);
      setAnimPhase("in");
      setTimeout(() => setAnimPhase("idle"), 300);
    }, 200);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) {
        setNameError("Please enter your name");
        return;
      }
      goToStep(2);
    } else if (step === 2) {
      goToStep(3);
    } else if (step === 3) {
      handleComplete();
    }
  };

  const current = steps[step - 1];
  const isLastStep = step === steps.length;

  return (
    <div className="h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col gap-8">
        {/* Heading */}
        <div
          className={`text-center ${animPhase === "out" ? "step-exit" : animPhase === "in" ? "step-enter" : ""}`}
        >
          <h1 className="text-2xl font-semibold text-dark">{current.title}</h1>
          <p className="text-2xl font-semibold text-dark-50">
            {current.subtitle}
          </p>
        </div>

        {/* Content */}
        <div
          className={
            animPhase === "out"
              ? "step-exit"
              : animPhase === "in"
                ? "step-enter"
                : ""
          }
        >
          {step === 1 && (
            <InputField
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
              error={nameError}
              autoFocus
            />
          )}

          {step === 2 && (
            <div className="grid grid-cols-5 gap-3">
              {AVATARS.map((file) => (
                <button
                  key={file}
                  onClick={() => setSelectedAvatar(file)}
                  className={`rounded-full transition-all aspect-square overflow-hidden ${selectedAvatar === file ? "ring-2 ring-accent ring-offset-2" : "opacity-80 hover:opacity-100"}`}
                >
                  <img
                    src={`/faces/${file}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={goalHours}
                  onChange={(e) =>
                    setGoalHours(
                      String(
                        Math.min(23, Math.max(0, parseInt(e.target.value) || 0))
                      )
                    )
                  }
                  placeholder="0"
                  className="w-16 h-16 rounded-2xl bg-background text-center text-xl font-semibold text-dark outline-none focus:ring-2 focus:ring-accent"
                />
                <span className="text-xl font-semibold text-dark">h</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={goalMinutes}
                  onChange={(e) =>
                    setGoalMinutes(
                      String(
                        Math.min(59, Math.max(0, parseInt(e.target.value) || 0))
                      )
                    )
                  }
                  placeholder="0"
                  className="w-16 h-16 rounded-2xl bg-background text-center text-xl font-semibold text-dark outline-none focus:ring-2 focus:ring-accent"
                />
                <span className="text-xl font-semibold text-dark">min</span>
              </div>
            </div>
          )}
        </div>

        {/* Button + hint */}
        <div className="flex flex-col items-center gap-3">
          <Button
            onClick={handleNext}
            disabled={loading}
            className="w-full"
            variant="primary-no-icon"
          >
            {loading ? "Saving..." : isLastStep ? "Get Started" : "Continue"}
          </Button>
          {current.hint && (
            <p className="text-xs text-dark-50 text-center">{current.hint}</p>
          )}
        </div>
      </div>
    </div>
  );
}
