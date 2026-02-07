import { Heart } from "lucide-react";

export function DevelopmentIntro() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-6 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <Heart className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-medium">Before We Begin</span>
          </div>
          <h1 className="text-5xl text-slate-100 mb-4 font-bold">
            Understanding Cardiac Development
          </h1>
        </div>

        {/* Floating Text Content */}
        <div className="space-y-8">
          {/* First paragraph with beating animation */}
          <p className="text-2xl text-slate-200 leading-relaxed">
            Cardiac development begins with heart tubes fusing and forming a singular, muscle tube. The heart is beating by{" "}
            <span className="text-blue-400 font-bold inline-block animate-heartbeat">
              week 4
            </span>.
          </p>

          {/* Second paragraph */}
          <p className="text-2xl text-slate-200 leading-relaxed">
            In EAST, we will learn the development of the heart at{" "}
            <span className="text-emerald-400 font-semibold">week 5</span>. At this point, the heart has partitioned into{" "}
            <span className="text-emerald-400 font-semibold">4 chambers</span> and separation begins. It is also visible on{" "}
            <span className="text-purple-400 font-semibold">Transvaginal Ultrasound (TVUS)</span> by{" "}
            <span className="text-purple-400 font-semibold">week 6</span>.
          </p>
        </div>

        {/* Add custom heartbeat animation styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes heartbeat {
              0%, 100% {
                transform: scale(1);
              }
              14% {
                transform: scale(1.2);
              }
              28% {
                transform: scale(1);
              }
              42% {
                transform: scale(1.2);
              }
              56% {
                transform: scale(1);
              }
            }
            
            .animate-heartbeat {
              animation: heartbeat 2s ease-in-out infinite;
              display: inline-block;
            }
          `
        }} />
      </div>
    </section>
  );
}
