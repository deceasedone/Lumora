"use client"

import { MOTIVATIONAL_QUOTES, SURPRISING_FACTS } from "@/data/misc"
import { Lightbulb, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function MotivationButton() {
  const showRandomQuote = () => {
    const quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    toast(quote, {
      icon: <Lightbulb className="h-4 w-4 text-yellow-400" />,
      duration: 5000, // 5 seconds
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={showRandomQuote}
      aria-label="Show random motivation"
    >
      <Lightbulb className="h-4 w-4" />
    </Button>
  );
}

export function SurpriseMeButton() {
  const showRandomFact = () => {
    const fact = SURPRISING_FACTS[Math.floor(Math.random() * SURPRISING_FACTS.length)];
    toast(fact, {
      icon: <Sparkles className="h-4 w-4 text-cyan-400" />,
      duration: 5000, // 5 seconds
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={showRandomFact}
      aria-label="Show surprising fact"
    >
      <Sparkles className="h-4 w-4" />
    </Button>
  );
}