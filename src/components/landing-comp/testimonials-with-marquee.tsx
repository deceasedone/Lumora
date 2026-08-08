import { cn } from "@/lib/utils"
import { TestimonialCard, type TestimonialAuthor } from "@/components/landing-comp/testimonial-card"

interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({ title, description, testimonials, className }: TestimonialsSectionProps) {
  return (
    <section id="testimonials" className={cn("bg-[#F8F6F2] text-[#2C3338] relative overflow-hidden", "py-12 sm:py-24 md:py-32 px-0", className)}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center sm:gap-16 relative z-10">
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-8">
          <div className="inline-block mb-4 px-4 py-2 bg-[#E8F0EC] border border-[#A8C5D4]/40 rounded-full">
            <span className="text-[#7AB8A8] text-sm font-medium">💚 Community Love</span>
          </div>
          <h2 className="max-w-[720px] text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight text-[#2C3338]">
            {title}
          </h2>
          <p className="text-md max-w-[600px] font-medium text-[#2C3338]/70 sm:text-xl">{description}</p>
        </div>        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-row [--duration:40s]">
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
              {[...Array(4)].map((_, setIndex) =>
                testimonials.map((testimonial, i) => <TestimonialCard key={`${setIndex}-${i}`} {...testimonial} />),
              )}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-[#F8F6F2] sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-[#F8F6F2] sm:block" />        </div>
      </div>
    </section>
  )
}
