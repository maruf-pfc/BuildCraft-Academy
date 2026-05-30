import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/90 via-primary/70 to-cyan-600/80 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center">
              <Image
                src="/logo-transparent.png"
                alt="Logo"
                width={100}
                height={100}
              />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Victory Technologies & Construction Ltd.</span>
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Build Knowledge.<br />Build Futures.
            </h2>
            <p className="text-white/80 text-lg leading-relaxed max-w-sm">
              Join over 2,500 professionals who have advanced their careers with expert-led construction and design courses.
            </p>
            <div className="flex gap-4">
              {["2,500+ Students", "15+ Courses", "50+ Projects"].map((stat) => (
                <div key={stat} className="px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                  <span className="text-white text-sm font-medium">{stat}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/50 text-xs">© {new Date().getFullYear()} Victory Design & Construction Ltd. All rights reserved.</p>
        </div>
      </div>

      {/* Right: form area */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        {children}
      </div>
    </div>
  );
}
