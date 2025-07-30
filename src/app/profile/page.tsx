"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Clock, Flame, TrendingUp } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { LumoraLogo } from "@/components/lumora"
import "@/styles/themes.css"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Dummy data for the profile page
const user = {
  name: "Alex Doe",
  email: "alex.doe@example.com",
  avatar: "https://i.pravatar.cc/150?u=alexdoe",
}

const weeklyStats = [
  { day: "Mon", time: 3600000 }, // 1 hour
  { day: "Tue", time: 7200000 }, // 2 hours
  { day: "Wed", time: 5400000 }, // 1.5 hours
  { day: "Thu", time: 9000000 }, // 2.5 hours
  { day: "Fri", time: 10800000 }, // 3 hours
  { day: "Sat", time: 2700000 }, // 0.75 hours
  { day: "Sun", time: 6300000 }, // 1.75 hours
]

const totalFocusTime = 45000000 // 12.5 hours
const totalSessions = 25
const currentStreak = 5

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

// Animation variants used in the component

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
}

const barVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: (height: number) => ({
    height: `${height}%`,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: 0.2,
      ease: "easeOut",
    },
  }),
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
}

export default function ProfilePage() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("authToken")) {
      router.push("/auth");
    }
  }, [router]);

  const maxTime = Math.max(...weeklyStats.map((s) => s.time), 1)
  const chartRef = useRef(null)
  const isChartInView = useInView(chartRef, { once: true, margin: "-100px" })

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex h-16 items-center border-b border-[var(--border)] bg-[var(--card)] px-6"
      >
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </motion.div>
          </Link>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <LumoraLogo />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl font-semibold"
          >
            Profile & Stats
          </motion.h1>
        </div>
      </motion.header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto max-w-4xl p-4 py-8 md:p-8"
      >
        {/* User Info Card */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="mb-8 flex flex-col items-center gap-6 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 sm:flex-row"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Image
              src={user.avatar || "/placeholder.svg"}
              alt="User Avatar"
              width={96}
              height={96}
              className="h-24 w-24 rounded-full border-2 border-[var(--primary)] object-cover"
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-center text-2xl font-bold sm:text-left"
            >
              {user.name}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-center text-[var(--muted-foreground)] sm:text-left"
            >
              {user.email}
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Lifetime Stats */}
        <motion.div variants={containerVariants} className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 text-center"
          >
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6, ease: "easeInOut" }}>
              <Clock className="mx-auto mb-2 h-8 w-8 text-[var(--primary)]" />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              className="text-2xl font-bold"
            >
              {(totalFocusTime / 3600000).toFixed(1)}h
            </motion.div>
            <p className="text-sm text-[var(--muted-foreground)]">Total Focus</p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 text-center"
          >
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
              <TrendingUp className="mx-auto mb-2 h-8 w-8 text-green-500" />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              className="text-2xl font-bold"
            >
              {totalSessions}
            </motion.div>
            <p className="text-sm text-[var(--muted-foreground)]">Total Sessions</p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <Flame className="mx-auto mb-2 h-8 w-8 text-orange-500" />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
              className="text-2xl font-bold"
            >
              {currentStreak} days
            </motion.div>
            <p className="text-sm text-[var(--muted-foreground)]">Current Streak</p>
          </motion.div>
        </motion.div>

        {/* Weekly Focus Chart */}
        <motion.div
          variants={cardVariants}
          ref={chartRef}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6"
        >
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mb-6 text-lg font-semibold"
          >
            This Week&apos;s Focus
          </motion.h3>
          <div className="flex h-64 items-end justify-between gap-2 text-center">
            {weeklyStats.map((stat, index) => (
              <motion.div
                key={stat.day}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={isChartInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
              >
                <motion.div
                  variants={barVariants}
                  initial="hidden"
                  animate={isChartInView ? "visible" : "hidden"}
                  whileHover="hover"
                  custom={(stat.time / maxTime) * 100}
                  className="w-full rounded-t-md bg-[var(--primary)] transition-colors duration-300 hover:bg-[var(--accent)] cursor-pointer"
                  style={{
                    minHeight: "4px",
                    background: `linear-gradient(to top, var(--primary), var(--accent))`,
                  }}
                />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={isChartInView ? { opacity: 1 } : {}}
                  transition={{ delay: 1.5 + index * 0.1, duration: 0.3 }}
                  className="text-xs font-medium text-[var(--muted-foreground)]"
                >
                  {stat.day}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.main>
    </div>
  )
}
