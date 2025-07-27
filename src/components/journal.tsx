"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAtom } from "jotai"
import { openJournalAtom } from "@/context/data"
import { createStore, set } from "idb-keyval"
import { BookText, Save, BookOpen } from "lucide-react"

// --- TIPTAP IMPORTS FOR RICH TEXT EDITING ---
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { createJournalEntry } from "@/utils/api";

// --- Store and Type Definitions (Must match other journal files) ---
const journalStore = createStore("lumora-journal", "entries")

interface JournalEntry {
  id: string
  title: string
  date: string
  content: string // This will now store HTML from Tiptap
}

export function Journal() {
  const [isOpen, setIsOpen] = useAtom(openJournalAtom)
  const [title, setTitle] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // --- TIPTAP EDITOR SETUP ---
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing here...",
      }),
    ],
    immediatelyRender: false,
    // Basic editor styling to match the rest of the app
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none h-full',
      },
    },
  })

  const handleSave = async () => {
    if (!editor) return
    const contentText = editor.getText()
    if (!title && !contentText) {
      return;
    }
    setIsSaving(true)
    try {
      await createJournalEntry(title || "Untitled Entry", editor.getHTML())
      setTitle("")
      editor.commands.clearContent(true)
      setIsOpen(false)
    } catch (e) {}
    setIsSaving(false)
  }
  
  // Reset form state when the sheet is closed
  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      editor?.commands.clearContent(true);
    }
  }, [isOpen, editor]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex h-full w-full flex-col bg-[var(--popover)] text-[var(--popover-foreground)] p-0 sm:max-w-lg">
        <SheetHeader className="px-6 py-4 border-b border-[var(--border)]">
          <SheetTitle className="flex items-center gap-2 text-[var(--foreground)]">
            <BookText className="h-5 w-5" />
            New Journal Entry
          </SheetTitle>
          <SheetDescription className="text-[var(--muted-foreground)]">
            Capture a quick thought. Your entry will be saved with formatting.
          </SheetDescription>
        </SheetHeader>

        {/* --- LAYOUT FIX FOR SCROLLING --- */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-6 pt-4">
            <Input
              placeholder="Entry title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-[var(--input)] bg-transparent text-[var(--foreground)]"
            />
          </div>

          {/* This container will grow and allow the editor to scroll */}
          <div className="flex-1 overflow-y-auto">
            <EditorContent editor={editor} />
          </div>
        </div>

        <SheetFooter className="flex-col-reverse items-center gap-2 border-t border-[var(--border)] px-6 py-4 sm:flex-row sm:justify-between">
          <Link href="/journal" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full gap-2">
              <BookOpen className="h-4 w-4" />
              View All Entries
            </Button>
          </Link>
          <Button
            onClick={handleSave}
            disabled={isSaving || (!title && !editor?.getText())}
            className="w-full gap-2 sm:w-auto"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Entry"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}