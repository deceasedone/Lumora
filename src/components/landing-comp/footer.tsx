"use client"

import { Footerdemo } from "@/components/landing-comp/footer-section"

interface FooterProps {
  onSubscribe?: (email: string) => void
}

export function Footer({ onSubscribe }: FooterProps) {
  return <Footerdemo onSubscribe={onSubscribe} />
}