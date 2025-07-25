"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, PlusCircle, Edit2, Trash2, Check, X, Save } from "lucide-react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { LumoraLogo } from "@/components/lumora"
import "@/styles/themes.css"

interface Todo {
  id: string
  date: Date
  text: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

// Initial dummy data
const initialTodos: Todo[] = [
  {
    id: "1",
    date: new Date(),
    text: "Finish the design mockups.",
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    date: new Date(),
    text: "Review PR from team.",
    completed: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    text: "Plan next week's sprint.",
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    text: "Deploy staging server.",
    completed: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "5",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    text: "Client follow-up call.",
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
]

export default function TodosPage() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date())
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodoText, setNewTodoText] = useState("")
  const [editingTodo, setEditingTodo] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('lumora-todos')
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        date: new Date(todo.date),
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt)
      }))
      setTodos(parsedTodos)
    } else {
      setTodos(initialTodos)
    }
  }, [])

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('lumora-todos', JSON.stringify(todos))
    }
  }, [todos])

  const selectedDayTodos = todos.filter(
    (todo) => todo.date.toDateString() === selectedDay?.toDateString()
  )

  const eventDays = todos.map(todo => todo.date)

  // CREATE: Add new todo
  const addTodo = () => {
    if (!newTodoText.trim() || !selectedDay) return

    const newTodo: Todo = {
      id: Date.now().toString(),
      date: selectedDay,
      text: newTodoText.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setTodos(prev => [...prev, newTodo])
    setNewTodoText("")
    setShowAddForm(false)
  }

  // UPDATE: Toggle todo completion
  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
        : todo
    ))
  }

  // UPDATE: Edit todo text
  const startEditing = (todo: Todo) => {
    setEditingTodo(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = (id: string) => {
    if (!editText.trim()) return

    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, text: editText.trim(), updatedAt: new Date() }
        : todo
    ))
    setEditingTodo(null)
    setEditText("")
  }

  const cancelEdit = () => {
    setEditingTodo(null)
    setEditText("")
  }

  // DELETE: Remove todo
  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action()
    }
  }

  return (
    <div className="flex h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center border-b border-[var(--border)] bg-[var(--card)] px-6">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <LumoraLogo />
          <h1 className="text-xl font-semibold">Todo Calendar</h1>
        </div>
        <div className="ml-auto text-sm text-[var(--muted-foreground)]">
          {todos.length} total tasks
        </div>
      </header>

      {/* Main Content */}
      <main className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-3">
        {/* Calendar */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 md:col-span-2 flex justify-center items-center">
          <div className="w-full flex justify-center">
            <DayPicker
              mode="single"
              selected={selectedDay}
              onSelect={setSelectedDay}
              modifiers={{ events: eventDays }}
              modifiersClassNames={{
                selected: 'rdp-day_selected',
                today: 'rdp-day_today',
                events: 'rdp-day_event',
              }}
              className="m-auto scale-125 md:scale-150" // Increase calendar size
            />
          </div>
        </div>

        {/* Selected Day's Todos */}
        <div className="flex flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <h2 className="text-lg font-semibold">
              Tasks for {selectedDay ? `${selectedDay.getFullYear()}-${String(selectedDay.getMonth()+1).padStart(2,'0')}-${String(selectedDay.getDate()).padStart(2,'0')}` : "..."}
            </h2>
            <span className="text-sm text-[var(--muted-foreground)]">
              {selectedDayTodos.length} tasks
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto">
            {selectedDayTodos.length > 0 ? (
              selectedDayTodos.map((todo) => (
                <div key={todo.id} className="group rounded-md border border-[var(--border)] p-3">
                  {editingTodo === todo.id ? (
                    // Edit mode
                    <div className="space-y-2">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, () => saveEdit(todo.id))}
                        className="min-h-[60px] resize-none"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => saveEdit(todo.id)}
                          className="flex-1"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEdit}
                          className="flex-1"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm break-words ${
                          todo.completed 
                            ? 'text-[var(--muted-foreground)] line-through' 
                            : 'text-[var(--foreground)]'
                        }`}>
                          {todo.text}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                          Created: {todo.createdAt.toLocaleString()}
                          {todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
                            <span> • Updated: {todo.updatedAt.toLocaleString()}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(todo)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteTodo(todo.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-[var(--muted-foreground)] py-8">
                No tasks for this day.
              </p>
            )}
          </div>

          {/* Add new todo */}
          {showAddForm ? (
            <div className="space-y-2 border-t border-[var(--border)] pt-4">
              <Textarea
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, addTodo)}
                placeholder="Enter your new task..."
                className="min-h-[60px] resize-none"
                autoFocus
              />
              <div className="flex gap-2">
                <Button onClick={addTodo} className="flex-1" disabled={!newTodoText.trim()}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setNewTodoText("")
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => setShowAddForm(true)}
              disabled={!selectedDay}
            >
              <PlusCircle className="h-4 w-4" />
              Add New Task
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
