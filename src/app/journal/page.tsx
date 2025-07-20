"use client"

import { useState } from "react"
import Link from "next/link"
import { Book, ChevronLeft, Download, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { LumoraLogo } from "@/components/lumora"
import "@/styles/themes.css"

// Dummy Journal Data
const dummyEntries = [
  { id: 1, title: "Project Brainstorm", date: "2025-07-18", content: "Initial ideas for the new dashboard feature. Focus on user experience and clean UI. Maybe add gamification?" },
  { id: 2, title: "Weekly Reflection", date: "2025-07-15", content: "This week was productive. Met all my deadlines. Need to focus more on deep work next week and avoid distractions." },
  { id: 3, title: "A Random Thought", date: "2025-07-12", content: "What if we could measure focus not just in time, but in quality? An interesting concept to explore." },
];

export default function JournalPage() {
  const [selectedEntry, setSelectedEntry] = useState(dummyEntries[0]);

  const downloadEntry = (entry: typeof selectedEntry) => {
    const blob = new Blob([`# ${entry.title}\n\n**Date:** ${entry.date}\n\n---\n\n${entry.content}`], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entry.title.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadBook = () => {
    const fullBookContent = dummyEntries.map(entry => `# ${entry.title}\n\n**Date:** ${entry.date}\n\n---\n\n${entry.content}`).join('\n\n\n---\nPage Break\n---\n\n\n');
    const blob = new Blob([fullBookContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'My_Lumora_Journal.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-6">
        <div className="flex items-center gap-2">
          <Link href="/dashboard"><Button variant="ghost" size="icon"><ChevronLeft className="h-5 w-5" /></Button></Link>
          <LumoraLogo />
          <h1 className="text-xl font-semibold">My Journal</h1>
        </div>
        <Button onClick={downloadBook} variant="outline" className="gap-2">
          <Book className="h-4 w-4" /> Download as Book
        </Button>
      </header>

      {/* Main Content */}
      <main className="grid flex-1 grid-cols-1 gap-6 p-6 md:grid-cols-4">
        {/* Entry List */}
        <aside className="flex flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 md:col-span-1">
          {dummyEntries.map(entry => (
            <button key={entry.id} onClick={() => setSelectedEntry(entry)} className={`w-full rounded-md p-3 text-left text-sm ${selectedEntry.id === entry.id ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'hover:bg-[var(--accent)]'}`}>
              <h3 className="font-semibold">{entry.title}</h3>
              <p className={`${selectedEntry.id === entry.id ? 'text-[var(--primary-foreground)]/80' : 'text-[var(--muted-foreground)]'}`}>{entry.date}</p>
            </button>
          ))}
        </aside>

        {/* Selected Entry */}
        <section className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--card)] md:col-span-3">
          <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
            <div>
              <h2 className="text-xl font-bold">{selectedEntry.title}</h2>
              <p className="text-sm text-[var(--muted-foreground)]">{selectedEntry.date}</p>
            </div>
            <Button onClick={() => downloadEntry(selectedEntry)} variant="ghost" size="icon" aria-label="Download Entry">
              <Download className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 leading-relaxed">
            <p>{selectedEntry.content}</p>
          </div>
        </section>
      </main>
    </div>
  );
}