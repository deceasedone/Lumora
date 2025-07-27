"use client"

import { useEffect, useState } from "react"
import { todoInfoAtom, TodosInfo } from "@/context/data"
// Import the correct Todo type from your API file
import { getTodos, createTodo, updateTodo, deleteTodo, Todo as ApiTodo } from "@/utils/api"; 
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useSetAtom } from "jotai"
import { PlusIcon, SearchIcon, Trash2Icon, CalendarIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"

import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Form, FormControl, FormField, FormItem } from "./ui/form"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"

// FIX 1: Use the single source of truth for the Todo type from your api.ts
// No need to define a separate TodoItemType here. We'll use ApiTodo directly.

// Form validation schema (renamed for clarity)
const todoFormSchema = z.object({
  task: z // FIX 2: Changed from 'title' to 'task' to match the API
    .string()
    .min(1, "Todo cannot be empty")
    .max(200, "Todo must be less than 200 characters")
    .trim(),
})

type TodoFormValues = z.infer<typeof todoFormSchema>

interface TodoInputProps {
  onTodoAdded: (task: string) => Promise<void> // Changed from 'title' to 'task'
  searchQuery: string
  onSearchChange: (query: string) => void
}

const formatDateToUTC_YYYYMMDD = (d: Date): string => {
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


export function Todo() {
  const setTodoStat = useSetAtom(todoInfoAtom)
  const [todos, setTodos] = useState<ApiTodo[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const backendTodos = await getTodos();
        
        // Use the UTC formatter to get today's date string.
        // This correctly handles the case where local "today" is different from UTC "today".
        const todayString = formatDateToUTC_YYYYMMDD(new Date());
        const todaysTodos = backendTodos.filter(t => t.date === todayString);
        
        setTodos(todaysTodos);

      } catch (error) {
        console.error("Dashboard: Failed to fetch todos", error);
        setTodos([])
      }
      setLoading(false)
    })()
  }, [])

  useEffect(() => {
    if (!Array.isArray(todos)) return;

    const completedTodo = todos.filter((todo) => todo.completed).length
    const totalTodos = todos.length

    const updatedTodoStat: TodosInfo = {
      completed: completedTodo,
      total: totalTodos,
    }

    setTodoStat(updatedTodoStat)
  }, [todos, setTodoStat])

  const filteredTodos = todos.filter((todo) =>
    todo.task.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleTodoAdded = async (task: string) => {
    try {
      // Use the UTC formatter when creating a todo from the dashboard.
      const todayString = formatDateToUTC_YYYYMMDD(new Date());
      const newTodo = await createTodo(task, todayString);
      setTodos((prev) => [newTodo, ...prev])
    } catch (error) {
      console.error("Dashboard: Failed to add todo", error);
    }
  }
  const handleTodoToggle = async (id: string, isCompleted: boolean) => {
    try {
      const todoToUpdate = todos.find((t) => t.id === id);
      if (!todoToUpdate) return;
      
      // We only need to send the 'completed' field, but sending task is fine
      const updatedTodo = await updateTodo(id, { task: todoToUpdate.task, completed: isCompleted });
      
      // Replace the old todo with the updated one from the API
      setTodos((prev) => prev.map((t) => (t.id === id ? updatedTodo : t)));
    } catch (error) {
      console.error("Dashboard: Failed to toggle todo", error);
    }
  }

  const handleTodoDelete = async (id: string) => {
    try {
      await deleteTodo(id)
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    } catch (error) {
      console.error("Dashboard: Failed to delete todo", error);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="shrink-0 pb-1">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Today's Todos
          </h2>
          <Link href="/todo">
            <Button variant="ghost" size="icon">
              <CalendarIcon className="h-4 w-4 text-[var(--muted-foreground)]" />
            </Button>
          </Link>
        </div>
        <TodoInput
          onTodoAdded={handleTodoAdded}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Todo List */}
      <div className="min-h-0 flex-1">
        <ScrollArea className="h-full max-h-72 lg:max-h-full">
          <div className="py-2">
            <AnimatePresence mode="wait">
              {loading ? (
                 <div className="text-center text-sm text-[var(--muted-foreground)] py-12">Loading...</div>
              ) : filteredTodos.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="text-sm text-[var(--muted-foreground)]">
                    {searchQuery
                      ? "No todos match your search"
                      : "No tasks for today!"}
                  </div>
                  {!searchQuery && (
                    <div className="mt-1 text-xs text-[var(--muted-foreground)] opacity-70">
                      Add one above to get started.
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="todo-list"
                  className="space-y-1"
                >
                  <AnimatePresence>
                    {filteredTodos.map((todo, index) => (
                      <TodoItem
                        key={todo.id}
                        id={todo.id}
                        isDone={todo.completed} // Pass 'completed' as 'isDone'
                        title={todo.task}       // Pass 'task' as 'title'
                        onToggle={handleTodoToggle}
                        onDelete={handleTodoDelete}
                        index={index}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}


function TodoInput({ onTodoAdded, searchQuery, onSearchChange }: TodoInputProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      task: "", // Changed from 'title' to 'task'
    },
  })

  const onSubmit = async (values: TodoFormValues) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await onTodoAdded(values.task) // Pass 'values.task'
      form.reset()
    } catch (error) {
      // handle error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      form.handleSubmit(onSubmit)()
    }
  }

  return (
    <div className="space-y-3 pb-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="relative flex-1">
              <FormField
                control={form.control}
                name="task" // Changed from 'title' to 'task'
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Add a new todo for today..."
                        {...field}
                        onKeyDown={handleKeyDown}
                        className={cn(
                          "border-[var(--border)] bg-[var(--input)] text-[var(--foreground)]",
                          form.formState.errors.task && "border-[var(--destructive)]" // Changed from title
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting || !form.watch("task")?.trim()} // Changed from title
                size="sm"
                variant="ghost"
                className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 p-0"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
        <Input
          placeholder="Search todos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  )
}

interface TodoItemProps {
  id: string
  isDone: boolean
  title: string
  index: number
  onToggle: (id: string, checked: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function TodoItem({ id, isDone, title, index, onToggle, onDelete }: TodoItemProps) {
  const [isChecked, setIsChecked] = useState(isDone)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggle = async (checked: boolean) => {
    if (isUpdating) return
    setIsUpdating(true)
    setIsChecked(checked)
    try {
      await onToggle(id, checked)
    } catch (error) {
      setIsChecked(!checked)
    } finally {
      setIsUpdating(false)
    }
  }
  const handleDelete = async () => {
    if (isDeleting) return
    setIsDeleting(true)
    try {
      await onDelete(id)
    } catch (error) {
      setIsDeleting(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          delay: index * 0.05,
          duration: 0.3,
          ease: "easeOut",
        },
      }}
      exit={{
        opacity: 0,
        x: -100,
        scale: 0.95,
        transition: {
          duration: 0.2,
          ease: "easeIn",
        },
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5",
        "border border-transparent transition-all duration-200 ease-in-out",
        "hover:border-[var(--border)] hover:bg-[var(--card)]",
        isChecked && "opacity-60",
        isDeleting && "pointer-events-none opacity-30"
      )}
    >
      <motion.div
        animate={isChecked ? { scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Checkbox
          checked={isChecked}
          onCheckedChange={handleToggle}
          disabled={isUpdating}
          className={cn(
            "border-[var(--border)] transition-all duration-200",
            "data-[state=checked]:border-[var(--todo-completed)]",
            "data-[state=checked]:bg-[var(--todo-completed)] data-[state=checked]:text-[var(--background)]",
            "hover:border-[var(--ring)]"
          )}
        />
      </motion.div>
      <motion.span
        animate={isChecked ? { x: 10 } : { x: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "flex-1 text-sm leading-relaxed transition-all duration-200",
          isChecked
            ? "text-[var(--muted-foreground)] line-through opacity-60"
            : "text-[var(--foreground)]"
        )}
      >
        {title}
      </motion.span>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-7 p-0 opacity-0 transition-all duration-200 ease-in-out",
            "group-hover:opacity-100",
            "text-[var(--muted-foreground)] hover:text-[var(--destructive)]",
            "hover:border-[var(--border)] hover:bg-[var(--card)]",
            "border border-transparent"
          )}
          disabled={isDeleting}
          onClick={handleDelete}
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  )
}
