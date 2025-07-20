"use client"
import HowItWorksDemo from "@/components/landing-comp/how-it-works-interactive"

export function HowItWorks() {
  return <HowItWorksDemo />
}

// const steps = [
//   {
//     step: "01",
//     icon: Sparkles,
//     title: "Choose Your Reality",
//     description:
//       "Select your perfect environment - from serene zen gardens to cyberpunk terminals. Your workspace transforms instantly to match your energy.",
//     color: "purple",
//   },
//   {
//     step: "02",
//     icon: Zap,
//     title: "Craft Your Soundscape",
//     description:
//       "Layer binaural beats, nature sounds, and focus frequencies. Create the perfect audio environment that enhances your cognitive performance.",
//     color: "blue",
//   },
//   {
//     step: "03",
//     icon: Target,
//     title: "Enter Flow State",
//     description:
//       "Launch intelligent Pomodoro sessions that adapt to your rhythm. Your tasks, timer, and environment sync for maximum productivity.",
//     color: "violet",
//   },
//   {
//     step: "04",
//     icon: Rocket,
//     title: "Evolve & Grow",
//     description:
//       "Track insights, analyze patterns, and receive AI-powered suggestions. Transform your productivity journey into continuous growth.",
//     color: "cyan",
//   },
// ]

// const colorMap = {
//   purple: {
//     gradient: "from-purple-500 to-violet-600",
//     glow: "shadow-purple-500/25",
//     border: "border-purple-500/30",
//     text: "text-purple-400",
//   },
//   blue: {
//     gradient: "from-blue-500 to-cyan-600",
//     glow: "shadow-blue-500/25",
//     border: "border-blue-500/30",
//     text: "text-blue-400",
//   },
//   violet: {
//     gradient: "from-violet-500 to-purple-600",
//     glow: "shadow-violet-500/25",
//     border: "border-violet-500/30",
//     text: "text-violet-400",
//   },
//   cyan: {
//     gradient: "from-cyan-500 to-blue-600",
//     glow: "shadow-cyan-500/25",
//     border: "border-cyan-500/30",
//     text: "text-cyan-400",
//   },
// }

// return (
//   <section id="how-it-works" className="py-32 relative overflow-hidden">
//     {/* Background */}
//     <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/10 to-black" />

//     <div className="container mx-auto px-4 relative z-10">
//       <div className="text-center mb-20">
//         <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
//           <span className="text-blue-400 text-sm font-medium">🚀 Simple Process</span>
//         </div>
//         <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
//           Your Journey to
//           <br />
//           <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
//             Peak Focus
//           </span>
//         </h2>
//         <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
//           Transform your productivity in four simple steps. No complex setup, just pure focus enhancement.
//         </p>
//       </div>

//       <div className="max-w-6xl mx-auto">
//         {steps.map((step, index) => (
//           <div key={index} className="flex flex-col lg:flex-row items-center mb-16 last:mb-0 group">
//             {/* Step Number & Icon */}
//             <div className="flex-shrink-0 mb-8 lg:mb-0 lg:mr-12 relative">
//               <div
//                 className={`w-32 h-32 bg-gradient-to-br ${colorMap[step.color as keyof typeof colorMap].gradient} rounded-3xl flex flex-col items-center justify-center text-white shadow-2xl ${colorMap[step.color as keyof typeof colorMap].glow} group-hover:scale-110 transition-all duration-300`}
//               >
//                 <step.icon className="w-10 h-10 mb-2" />
//                 <span className="text-2xl font-bold">{step.step}</span>
//               </div>
//               {/* Glow effect */}
//               <div
//                 className={`absolute inset-0 bg-gradient-to-br ${colorMap[step.color as keyof typeof colorMap].gradient} rounded-3xl blur-xl opacity-30 -z-10 group-hover:opacity-50 transition-opacity duration-300`}
//               />
//             </div>

//             {/* Content */}
//             <Card
//               className={`flex-1 bg-black/60 backdrop-blur-xl ${colorMap[step.color as keyof typeof colorMap].border} hover:border-opacity-60 transition-all duration-500 group-hover:bg-black/80`}
//             >
//               <CardContent className="p-10">
//                 <h3 className="text-3xl font-bold mb-6 text-white group-hover:text-opacity-90 transition-colors">
//                   {step.title}
//                 </h3>
//                 <p className="text-gray-300 text-lg leading-relaxed">{step.description}</p>
//               </CardContent>
//             </Card>

//             {/* Arrow */}
//             {index < steps.length - 1 && (
//               <div className="hidden lg:block ml-12">
//                 <ArrowRight
//                   className={`w-8 h-8 ${colorMap[step.color as keyof typeof colorMap].text} opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300`}
//                 />
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   </section>
// )
