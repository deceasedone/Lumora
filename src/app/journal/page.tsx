"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Book, ChevronLeft, Download, FileText, Trash2, Plus } from "lucide-react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"

import { getJournalEntries, createJournalEntry, updateJournalEntry, deleteJournalEntry } from "@/utils/api";
import DOMPurify from "dompurify"

import { Button } from "@/components/ui/button"
import { LumoraLogo } from "@/components/lumora"
import "@/styles/themes.css"
import { useRouter } from "next/navigation";

// --------------------------------------------------
// IndexedDB and Type Definitions
// --------------------------------------------------

interface JournalEntry {
  id: string
  title: string
  date: string
  content: string // HTML content from Tiptap
}

interface ApiJournalEntry {
  id: string
  title: string
  created_at: string
  content: string
}

// ------------------------------------------------------------------
// PDF Generation: Browser Print-Based with Clean Formatting
// ------------------------------------------------------------------

// PDF generation uses browser's print functionality with sanitized HTML content

/**
 * Generate PDF using browser's print functionality
 */
function generatePDF(content: string, title: string, date?: string): void {
  if (!content.trim()) {
    alert('Please add some content before generating PDF');
    return;
  }

  // Create a new window for PDF generation
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate PDF');
    return;
  }
  
  const pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        @page {
            margin: 1in;
            size: A4;
        }
        
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.5;
            margin: 0;
            padding: 0;
            color: #000;
            background: white;
        }
        
        .content {
            max-width: 100%;
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
        }
        
        /* Prevent orphans and widows */
        p {
            orphans: 2;
            widows: 2;
            margin-bottom: 12pt;
            text-align: justify;
        }
        
        /* Bold text styling */
        .bold {
            font-weight: bold;
        }
        
        /* Italic text styling */
        .italic {
            font-style: italic;
        }
        
        /* Underline text styling */
        .underline {
            text-decoration: underline;
        }
        
        /* Ensure no breaking in middle of formatted text */
        .no-break {
            page-break-inside: avoid;
            break-inside: avoid;
        }
        
        /* Header styling */
        .header {
            text-align: center;
            margin-bottom: 24pt;
            padding-bottom: 12pt;
            border-bottom: 1px solid #ccc;
        }
        
        .entry {
            margin-bottom: 24pt;
            page-break-inside: avoid;
        }
        
        .entry-title {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 6pt;
            border-bottom: 1pt solid #ccc;
            padding-bottom: 3pt;
        }
        
        .entry-date {
            font-size: 10pt;
            color: #666;
            margin-bottom: 12pt;
        }
        
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .no-break {
                page-break-inside: avoid;
                break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>${title}</h2>
        ${date ? `<p>Date: ${date}</p>` : ''}
        <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>
    <div class="content">
        ${content.replace(/\*\*(.*?)\*\*/g, '<span class="bold no-break">$1</span>')
                 .replace(/\*(.*?)\*/g, '<span class="italic no-break">$1</span>')
                 .replace(/_(.*?)_/g, '<span class="underline no-break">$1</span>')
                 .replace(/\n/g, '<br>')
                 .split('<br>').map(line => line.trim() ? `<p class="no-break">${line}</p>` : '<p>&nbsp;</p>').join('')}
    </div>
</body>
</html>`;

  printWindow.document.write(pdfContent);
  printWindow.document.close();
  
  // Wait for content to load then trigger print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };
}

/**
 * Generate PDF for multiple journal entries (book format)
 */
function generateJournalBookPDF(entries: JournalEntry[]): void {
  if (entries.length === 0) {
    alert('No entries to export');
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate PDF');
    return;
  }
  
  const entriesHtml = entries
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => {
      const sanitizedContent = DOMPurify.sanitize(entry.content);
      return `
        <div class="entry">
          <div class="entry-title">${entry.title}</div>
          <div class="entry-date">${new Date(entry.date).toLocaleDateString()}</div>
          <div class="entry-content">${sanitizedContent}</div>
        </div>
      `;
    })
    .join('');
  
  const pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>My Journal</title>
    <style>
        @page {
            margin: 1in;
            size: A4;
        }
        
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.5;
            margin: 0;
            padding: 0;
            color: #000;
            background: white;
        }
        
        .header {
            text-align: center;
            margin-bottom: 24pt;
            padding-bottom: 12pt;
            border-bottom: 1px solid #ccc;
        }
        
        .entry {
            margin-bottom: 24pt;
            page-break-inside: avoid;
        }
        
        .entry-title {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 6pt;
            border-bottom: 1pt solid #ccc;
            padding-bottom: 3pt;
        }
        
        .entry-date {
            font-size: 10pt;
            color: #666;
            margin-bottom: 12pt;
        }
        
        .entry-content {
            text-align: justify;
        }
        
        .entry-content p {
            margin-bottom: 12pt;
            orphans: 2;
            widows: 2;
        }
        
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>My Journal</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
        <p>Total Entries: ${entries.length}</p>
    </div>
    ${entriesHtml}
</body>
</html>`;

  printWindow.document.write(pdfContent);
  printWindow.document.close();
  
  // Wait for content to load then trigger print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };
}

/**
 * Prepares and downloads a single journal entry.
 */
function downloadSingleEntryPDF(entry: JournalEntry): void {
  const sanitizedContent = DOMPurify.sanitize(entry.content);
  generatePDF(sanitizedContent, entry.title, new Date(entry.date).toLocaleDateString());
}

/**
 * Prepares and downloads the entire journal as a book.
 */
function downloadJournalBookPDF(entries: JournalEntry[]): void {
  generateJournalBookPDF(entries);
}


// ------------------------------------------------------------------
// The Full Journal Page Component
// ------------------------------------------------------------------
export default function JournalPage() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("authToken")) {
      router.push("/auth");
    }
  }, [router]);

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedEntry = entries.find(e => e.id === selectedId);
  const [isDownloading, setIsDownloading] = useState(false);

  // Load from backend on mount
  useEffect(() => {
    async function load() {
      try {
        const backendEntries = await getJournalEntries();
        // Safely cast the response to ApiJournalEntry[]
        const apiEntries = backendEntries as unknown as ApiJournalEntry[];
        const journalEntries: JournalEntry[] = apiEntries.map(e => ({
          id: e.id,
          title: e.title,
          date: e.created_at ? new Date(e.created_at).toISOString().split("T")[0] : "",
          content: e.content,
        }));
        setEntries(journalEntries);
        if (apiEntries.length) setSelectedId(apiEntries[0].id);
      } catch (error) {
        console.error("Failed to load journal entries:", error);
        setEntries([]);
      }
    }
    load();
  }, []);

  // Editor instance setup
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: "Start writing…" })],
    immediatelyRender: false, // Prevents SSR issues
    content: selectedEntry?.content || "",
    editable: true,
  });

  // Keep editor in sync with selected entry
  useEffect(() => {
    if (!editor || selectedId === null) return;
    const entry = entries.find(e => e.id === selectedId);
    if (entry && editor.getHTML() !== entry.content) {
      editor.commands.setContent(entry.content || "");
    }
  }, [selectedId, editor, entries]);

  // CRUD operations
  const createEntry = async () => {
    try {
      const newEntry = await createJournalEntry("Untitled Entry", "");
      // Safely cast the response to ApiJournalEntry
      const apiEntry = newEntry as unknown as ApiJournalEntry;
      const newJournalEntry: JournalEntry = {
        id: apiEntry.id,
        title: apiEntry.title,
        date: apiEntry.created_at ? new Date(apiEntry.created_at).toISOString().split("T")[0] : "",
        content: apiEntry.content,
      };
      
      setEntries(prev => [newJournalEntry, ...prev]);
      setSelectedId(apiEntry.id);
    } catch (error) {
      console.error('Failed to create journal entry:', error);
    }
  };

  const updateEntry = async (fields: Partial<JournalEntry>) => {
    if (!selectedId) return;
    const entry = entries.find(e => e.id === selectedId);
    if (!entry) return;
    
    try {
      const updated = await updateJournalEntry(selectedId, {
        title: fields.title ?? entry.title,
        content: fields.content ?? entry.content,
      }) as unknown as ApiJournalEntry;
      
      setEntries(prev => 
        prev.map(e => e.id === selectedId 
          ? {
              ...e,
              title: updated.title,
              content: updated.content,
              date: updated.created_at ? new Date(updated.created_at).toISOString().split("T")[0] : e.date,
            } 
          : e
        )
      );
    } catch (error) {
      console.error('Failed to update journal entry:', error);
    }
  };

  const deleteEntryHandler = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deleteJournalEntry(id);
      setEntries(prev => {
        const updatedEntries = prev.filter(entry => entry.id !== id);
        // If we deleted the selected entry, select the first available one or null
        if (id === selectedId) {
          setSelectedId(updatedEntries[0]?.id ?? null);
        }
        return updatedEntries;
      });
    } catch (error) {
      console.error('Failed to delete journal entry:', error);
    }
  };

  // Download handlers with loading state
  const handleDownloadSingle = () => {
    if (selectedEntry && !isDownloading) {
      setIsDownloading(true);
      try {
        downloadSingleEntryPDF(selectedEntry);
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        // Reset loading state after a short delay to account for popup opening
        setTimeout(() => setIsDownloading(false), 1000);
      }
    }
  };

  const handleDownloadBook = () => {
    if (entries.length > 0 && !isDownloading) {
      setIsDownloading(true);
      try {
        downloadJournalBookPDF(entries);
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        // Reset loading state after a short delay to account for popup opening
        setTimeout(() => setIsDownloading(false), 1000);
      }
    }
  };

  // Render the full UI
  return (
    <div className="flex h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-6">
        <div className="flex items-center gap-2">
          <Link href="/dashboard"><Button variant="ghost" size="icon"><ChevronLeft className="h-5 w-5" /></Button></Link>
          <LumoraLogo />
          <h1 className="text-xl font-semibold">My Journal</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={createEntry} variant="outline" className="gap-2" disabled={isDownloading}><Plus className="h-4 w-4" /> New</Button>
          <Button onClick={handleDownloadBook} variant="outline" className="gap-2" disabled={isDownloading}><Book className="h-4 w-4" /> {isDownloading ? "Downloading..." : "Download Book"}</Button>
        </div>
      </header>

      <main className="grid flex-1 grid-cols-1 gap-6 p-6 md:grid-cols-4">
        <aside className="flex flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 md:col-span-1">
          {entries.length === 0 && (<div className="p-4 text-center text-sm text-[var(--muted-foreground)]">No entries yet. Create one!</div>)}
          {entries.map(entry => (
            <button key={entry.id} onClick={() => setSelectedId(entry.id)} className={`w-full rounded-md p-3 text-left text-sm transition-colors ${selectedId === entry.id ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "hover:bg-[var(--accent)]"}`}>
              <h3 className="font-semibold">{entry.title}</h3>
              <p className={`text-xs ${selectedId === entry.id ? "text-[var(--primary-foreground)]/80" : "text-[var(--muted-foreground)]"}`}>{entry.date}</p>
            </button>
          ))}
        </aside>
        
        {selectedEntry ? (
          <section className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--card)] md:col-span-3">
            <div className="flex items-center gap-2 border-b border-[var(--border)] p-4">
              <input value={selectedEntry.title} onChange={e => updateEntry({ title: e.target.value })} className="flex-1 bg-transparent text-lg font-bold outline-none" disabled={isDownloading} />
              <Button onClick={handleDownloadSingle} variant="ghost" size="icon" title="Download PDF" disabled={isDownloading}><Download className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" onClick={() => deleteEntryHandler(selectedEntry.id)} title="Delete" disabled={isDownloading}><Trash2 className="h-5 w-5" /></Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <EditorContent editor={editor} className="prose prose-sm max-w-none" onBlur={() => updateEntry({ content: editor?.getHTML() || "" })} />
            </div>
          </section>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--card)] md:col-span-3">
            <FileText className="h-12 w-12 text-[var(--muted-foreground)]" />
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">Select an entry or create a new one</p>
          </div>
        )}
      </main>
    </div>
  )
}