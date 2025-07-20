"use client"

import { useState } from "react"
import Link from "next/link" // <-- Import Link
import { openJournalAtom } from "@/context/data"
import { useAtom } from "jotai"
import { BookText, FilePlus2, Save, BookOpen } from "lucide-react" // <-- Import BookOpen

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"

export function Journal() {
  const [isOpen, setIsOpen] = useAtom(openJournalAtom)
  const [content, setContent] = useState("")
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    console.log("Journal content saved:", content)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex h-full w-full flex-col bg-[var(--popover)] text-[var(--popover-foreground)] sm:max-w-lg">
        <SheetHeader className="px-6 py-4">
          <SheetTitle className="flex items-center gap-2 text-[var(--foreground)]">
            <BookText className="h-5 w-5" />
            New Journal Entry
          </SheetTitle>
          <SheetDescription className="text-[var(--muted-foreground)]">
            Capture a quick thought. View all entries in your journal page.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 px-6 py-2">
          <Textarea
            placeholder="Start writing here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-full resize-none border-[var(--input)] bg-transparent text-[var(--foreground)]"
          />
        </div>

        <SheetFooter className="flex-col-reverse items-center gap-2 border-t border-[var(--border)] px-6 py-4 sm:flex-row sm:justify-between">
          {/* THE FIX: Add a link to the full journal page */}
          <Link href="/journal" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full gap-2">
              <BookOpen className="h-4 w-4" />
              View All Entries
            </Button>
          </Link>
          <Button onClick={handleSave} className="w-full gap-2 sm:w-auto">
            <Save className="h-4 w-4" />
            {isSaved ? "Saved!" : "Save Entry"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}