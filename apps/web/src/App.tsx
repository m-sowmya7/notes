import { ArrowRight, NotebookPen } from 'lucide-react'
import { Link } from 'react-router-dom'

function App() {
  return (
    <main
      className="
        relative min-h-screen overflow-hidden
        grid place-items-center
        px-6 pt-24
        bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.85),transparent_44%),radial-gradient(circle_at_50%_0%,rgba(243,232,221,0.95),rgba(245,238,231,0.82)_48%,rgba(236,227,215,0.96)_100%)]
        before:content-['']
        before:absolute
        before:inset-0
        before:pointer-events-none
        before:bg-[linear-gradient(rgba(108,91,72,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(108,91,72,0.035)_1px,transparent_1px)]
        before:bg-size[34px_34px]
      "
    >
      {/* Brand */}
      <div
        className="
          absolute top-4.5 left-4.5
          z-20
          grid h-12 w-12 place-items-center
          rounded-lg
          border border-[rgba(63,52,39,0.45)]
          bg-[rgba(246,240,232,0.9)]
          text-xl font-black text-[#2c241d]
          shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_4px_12px_rgba(78,61,44,0.12)]
        "
      >
        <NotebookPen />
      </div>

      {/* Hero */}
      <section
        className="
          relative z-10
          mb-[12vh]
          max-w-140
          text-left text-[#2a231d]
        "
      >
        <p
          className="
            mb-6
            text-[12px]
            font-semibold
            uppercase
            tracking-[0.36em]
            text-[rgba(74,60,47,0.62)]
          "
        >
          Creative workspace
        </p>

        <h1
          className="
            inline-flex flex-col gap-0.5
            text-[clamp(3.4rem,8vw,5.25rem)]
            font-black
            leading-[0.93]
            tracking-[-0.06em]
            uppercase
          "
        >
          PROJECT

          <span className="inline-flex items-center gap-3">
            PLANNING
          </span>

          <span className="inline-flex items-center gap-3">
            BOARD

            <span
              aria-hidden="true"
              className="
                ml-[2px]
                translate-y-[-0.08em]
                text-[0.5em]
                text-[#8b735d]
              "
            >
              ✦ ✦
            </span>
          </span>
        </h1>

        <p
          className="
            mt-5
            max-w-90
            text-[1.02rem]
            leading-[1.55]
            text-[rgba(47,38,31,0.88)]
          "
        >
          Plan, organize and explore creative ideas for your projects.
        </p>

        <Link
          to="/pages"
          className="
        mt-7
        inline-flex items-center gap-3
        rounded-[8px]
        bg-gradient-to-b from-[#7c69ff] to-[#6652f0]
        px-[22px] py-[14px]
        text-[1rem] font-bold text-white
        shadow-[0_18px_30px_rgba(81,67,229,0.25)]
        transition-all duration-150
        hover:-translate-y-[1px]
        hover:brightness-[1.02]
        hover:shadow-[0_22px_36px_rgba(81,67,229,0.3)]
        focus-visible:outline
        focus-visible:outline-4
        focus-visible:outline-[rgba(101,82,240,0.32)]
      "
        >
          Get Started

          <span aria-hidden="true">
            <ArrowRight />
          </span>
        </Link>
      </section>

      {/* Torn Paper */}
      <div
        aria-hidden="true"
        className="
          absolute inset-x-[-4%] bottom-0
          h-[23vh]
          opacity-100
          shadow-[inset_0_-1px_0_rgba(93,76,56,0.1)]
          bg-[radial-gradient(circle_at_3%_0,rgba(215,194,171,0.35)_0_18px,transparent_19px),linear-gradient(180deg,rgba(223,205,184,0.88),rgba(214,194,171,0.97))]
          [background-size:88px_22px,auto]
          [clip-path:polygon(0_28%,5%_38%,11%_26%,18%_44%,25%_32%,33%_48%,41%_30%,49%_42%,58%_24%,67%_44%,75%_34%,83%_48%,91%_30%,100%_40%,100%_100%,0_100%)]
        "
      />
    </main>
  )
}

export default App