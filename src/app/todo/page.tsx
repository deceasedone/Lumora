"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, PlusCircle, Edit2, Trash2, Save, X } from "lucide-react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { LumoraLogo } from "@/components/lumora"
import "@/styles/themes.css"
import { getTodos, createTodo, updateTodo, deleteTodo, Todo } from "@/utils/api";

// =================================================================================
// THE DEFINITIVE TIMEZONE FIX
// =================================================================================

// 1. A robust formatter that ALWAYS uses UTC components.
const formatDateToUTC_YYYYMMDD = (d: Date | undefined): string => {
  if (!d || isNaN(d.getTime())) return '';
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0'); // getUTCMonth is 0-indexed
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function TodosPage() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("authToken")) {
      router.push("/auth");
    }
  }, [router]);

  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date())
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodoText, setNewTodoText] = useState("")
  const [editingTodo, setEditingTodo] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTodos() {
      setLoading(true);
      try {
        const backendTodos = await getTodos();
        setTodos(backendTodos);
      } catch (error) {
        console.error('Failed to fetch todos:', error);
        setTodos([]);
      }
      setLoading(false);
    }
    fetchTodos();
  }, []);

  const selectedDayString = formatDateToUTC_YYYYMMDD(selectedDay);
  const selectedDayTodos = todos.filter(
    (todo) => todo.date === selectedDayString
  );

  // 2. Create UTC Date objects for the event markers to match DayPicker's timezone.
  const eventDays = todos
    .map(todo => {
      if (!todo.date) return null;
      const [year, month, day] = todo.date.split('-').map(Number);
      // Create a date explicitly in UTC.
      const date = new Date(Date.UTC(year, month - 1, day));
      return isNaN(date.getTime()) ? null : date;
    })
    .filter((d): d is Date => d !== null);

  const addTodo = async () => {
    if (!newTodoText.trim() || !selectedDay) return;
    try {
      const dateString = formatDateToUTC_YYYYMMDD(selectedDay);
      const newTodo = await createTodo(newTodoText.trim(), dateString);
      setTodos(prev => [newTodo, ...prev]);
      setNewTodoText("");
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  }

  // No changes needed in toggle/save/delete, they correctly pass the date string.
  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    try {
      const updated = await updateTodo(id, { completed: !todo.completed, date: todo.date });
      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  }

  const saveEdit = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!editText.trim() || !todo) return;
    try {
      const updated = await updateTodo(id, { task: editText.trim(), date: todo.date });
      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
      setEditingTodo(null);
      setEditText("");
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  }
  
  const startEditing = (todo: Todo) => { setEditingTodo(todo.id); setEditText(todo.task); }
  const cancelEdit = () => { setEditingTodo(null); setEditText(""); }
  const deleteTodoHandler = async (id: string) => { 
    try { 
      await deleteTodo(id); 
      setTodos(prev => prev.filter(t => t.id !== id)); 
    } catch (error) {
      console.error('Error deleting todo:', error);
    } 
  }
  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => { if (e.key === 'Enter') action() }

  return (
    <div className="flex h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
      <header className="flex h-16 shrink-0 items-center border-b border-[var(--border)] bg-[var(--card)] px-6">
        <div className="flex items-center gap-2">
          <Link href="/dashboard"><Button variant="ghost" size="icon"><ChevronLeft className="h-5 w-5" /></Button></Link>
          <LumoraLogo />
          <h1 className="text-xl font-semibold">Todo Calendar</h1>
        </div>
        <div className="ml-auto text-sm text-[var(--muted-foreground)]">{todos.length} total tasks</div>
      </header>
      <main className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-3">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 md:col-span-2 flex justify-center items-center">
          <div className="w-full flex justify-center">
            {/* 3. Tell DayPicker to work exclusively in UTC. */}
            <DayPicker
              mode="single"
              selected={selectedDay}
              onSelect={setSelectedDay}
              modifiers={{ events: eventDays }}
              modifiersClassNames={{ selected: 'rdp-day_selected', today: 'rdp-day_today', events: 'rdp-day_event' }}
              className="m-auto scale-125 md:scale-150"
              timeZone="UTC" 
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <h2 className="text-lg font-semibold">Tasks for {selectedDayString || "..."}</h2>
            <span className="text-sm text-[var(--muted-foreground)]">{selectedDayTodos.length} tasks</span>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto">
            {loading ? (<p className="text-center text-sm text-[var(--muted-foreground)] py-8">Loading tasks...</p>) : selectedDayTodos.length > 0 ? (selectedDayTodos.map((todo) => (
              <div key={todo.id} className="group rounded-md border border-[var(--border)] p-3">
                {editingTodo === todo.id ? (
                  <div className="space-y-2">
                    <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => handleKeyPress(e, () => saveEdit(todo.id))} className="min-h-[60px] resize-none" autoFocus />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => saveEdit(todo.id)} className="flex-1"><Save className="h-3 w-3 mr-1" /> Save</Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit} className="flex-1"><X className="h-3 w-3 mr-1" /> Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} className="mt-0.5" />
                    <div className="flex-1 min-w-0"><p className={`text-sm break-words ${todo.completed ? 'text-[var(--muted-foreground)] line-through' : 'text-[var(--foreground)]'}`}>{todo.task}</p></div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" onClick={() => startEditing(todo)} className="h-8 w-8 p-0"><Edit2 className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteTodoHandler(todo.id)} className="h-8 w-8 p-0 text-red-500 hover:text-red-600"><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                )}
              </div>
            ))) : (<p className="text-center text-sm text-[var(--muted-foreground)] py-8">No tasks for this day.</p>)}
          </div>
          {showAddForm ? (
            <div className="space-y-2 border-t border-[var(--border)] pt-4">
              <Textarea value={newTodoText} onChange={(e) => setNewTodoText(e.target.value)} onKeyDown={(e) => handleKeyPress(e, addTodo)} placeholder="Enter your new task..." className="min-h-[60px] resize-none" autoFocus />
              <div className="flex gap-2">
                <Button onClick={addTodo} className="flex-1" disabled={!newTodoText.trim()}><PlusCircle className="h-4 w-4 mr-2" /> Add Task</Button>
                <Button variant="outline" onClick={() => { setShowAddForm(false); setNewTodoText(""); }} className="flex-1">Cancel</Button>
              </div>
            </div>
          ) : (<Button variant="outline" className="w-full gap-2" onClick={() => setShowAddForm(true)} disabled={!selectedDay}><PlusCircle className="h-4 w-4" /> Add New Task</Button>)}
        </div>
      </main>
    </div>
  )
}
