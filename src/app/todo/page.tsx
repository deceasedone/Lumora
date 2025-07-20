"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, PlusCircle } from "lucide-react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

import { Button } from "@/components/ui/button"
import { LumoraLogo } from "@/components/lumora"
import "@/styles/themes.css"

// Dummy Todo Data
const dummyTodos = [
  { id: "1", date: new Date(), text: "Finish the design mockups.", completed: false },
  { id: "2", date: new Date(), text: "Review PR from team.", completed: true },
  { id: "3", date: new Date(new Date().setDate(new Date().getDate() + 2)), text: "Plan next week's sprint.", completed: false },
  { id: "4", date: new Date(new Date().setDate(new Date().getDate() - 1)), text: "Deploy staging server.", completed: true },
  { id: "5", date: new Date(new Date().setDate(new Date().getDate() + 2)), text: "Client follow-up call.", completed: false },
];

export default function TodosPage() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());

  const selectedDayTodos = dummyTodos.filter(
    (todo) => todo.date.toDateString() === selectedDay?.toDateString()
  );

  const eventDays = dummyTodos.map(todo => todo.date);

  return (
    <div className="flex h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center border-b border-[var(--border)] bg-[var(--card)] px-6">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon"><ChevronLeft className="h-5 w-5" /></Button>
          </Link>
          <LumoraLogo />
          <h1 className="text-xl font-semibold">Todo Calendar</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-3">
        {/* Calendar */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 md:col-span-2">
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
            className="m-auto"
          />
        </div>

        {/* Selected Day's Todos */}
        <div className="flex flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
          <h2 className="border-b border-[var(--border)] pb-2 text-lg font-semibold">
            Tasks for {selectedDay ? selectedDay.toLocaleDateString() : "..."}
          </h2>
          <div className="flex-1 space-y-3 overflow-y-auto">
            {selectedDayTodos.length > 0 ? (
              selectedDayTodos.map((todo) => (
                <div key={todo.id} className={`rounded-md p-3 text-sm ${todo.completed ? 'bg-[var(--muted)] text-[var(--muted-foreground)] line-through' : 'bg-[var(--secondary)]'}`}>
                  {todo.text}
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-[var(--muted-foreground)]">No tasks for this day.</p>
            )}
          </div>
          <Button variant="outline" className="w-full gap-2">
            <PlusCircle className="h-4 w-4" /> Add New Task
          </Button>
        </div>
      </main>
    </div>
  );
}