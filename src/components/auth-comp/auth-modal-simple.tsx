"use client"

import { AuthPage } from "@/components/auth-comp/auth-page"

interface AuthModalSimpleProps {
  type: "login" | "signup"
  initialEmail?: string
  onClose: () => void
  onSwitchType: (type: "login" | "signup") => void
}

export function AuthModalSimple({ type, initialEmail, onClose, onSwitchType }: AuthModalSimpleProps) {
  return <AuthPage onClose={onClose} initialMode={type} initialEmail={initialEmail} />
}