"use client"

import { AuthPage } from "@/components/auth-comp/auth-page"

interface AuthModalSimpleProps {
  type: "login" | "signup"
  onClose: () => void
  onSwitchType: (type: "login" | "signup") => void
}

export function AuthModalSimple({ type, onClose, onSwitchType }: AuthModalSimpleProps) {
  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50">
      <AuthPage onClose={onClose} initialMode={type} />
    </div>
  )
}
