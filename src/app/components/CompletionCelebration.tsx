import { useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Award, RotateCcw, Download } from "lucide-react";
import confetti from "canvas-confetti";

interface CompletionCelebrationProps {
  onClose: () => void;
  onRestart: () => void;
}

export function CompletionCelebration({ onClose, onRestart }: CompletionCelebrationProps) {
  useEffect(() => {
    // Trigger confetti celebration
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  const handleDownloadCertificate = () => {
    // Create a simple certificate
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Border
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 10;
      ctx.strokeRect(20, 20, 760, 560);
      
      // Title
      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'bold 48px IBM Plex Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CERTIFICATE OF COMPLETION', 400, 120);
      
      // Subtitle
      ctx.font = '24px IBM Plex Sans, sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('This certifies that you have successfully completed', 400, 200);
      
      // Course name
      ctx.font = 'bold 36px IBM Plex Mono, monospace';
      ctx.fillStyle = '#60A5FA';
      ctx.fillText('EAST', 400, 260);
      ctx.font = '20px IBM Plex Sans, sans-serif';
      ctx.fillStyle = '#B0BDD0';
      ctx.fillText('Embryology Across Space and Time', 400, 295);
      
      // Description
      ctx.font = '18px IBM Plex Sans, sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('An Interactive Journey Through', 400, 360);
      ctx.fillText('Atrial Septal Defect Embryology, Hemodynamics,', 400, 390);
      ctx.fillText('and Clinical Presentation', 400, 420);
      
      // Date
      ctx.font = '16px IBM Plex Mono, monospace';
      ctx.fillStyle = '#64748B';
      const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      ctx.fillText(date, 400, 500);
      
      // Download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'EAST-Completion-Certificate.png';
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black border-2 border-blue-500 rounded-2xl shadow-2xl max-w-2xl w-full p-12 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Award Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50">
            <Award className="w-14 h-14 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl font-bold text-center text-[#E2E8F0] mb-4">
          Congratulations! 🎉
        </h2>

        {/* Description */}
        <p className="text-xl text-center text-[#B0BDD0] mb-8">
          You've completed the entire EAST learning journey!
        </p>

        {/* Achievement Summary */}
        <div className="bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-700">
          <h3 className="font-semibold text-[#E2E8F0] mb-4 text-center">What You've Mastered</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/30">
              <div className="text-blue-400 font-semibold mb-1">Embryology</div>
              <div className="text-[#B0BDD0] text-xs">Atrial septation stages & developmental fates</div>
            </div>
            <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/30">
              <div className="text-emerald-400 font-semibold mb-1">Hemodynamics</div>
              <div className="text-[#B0BDD0] text-xs">Cardiac catheterization & pressure changes</div>
            </div>
            <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/30">
              <div className="text-purple-400 font-semibold mb-1">Clinical Cases</div>
              <div className="text-[#B0BDD0] text-xs">Paradoxical embolism & Eisenmenger syndrome</div>
            </div>
            <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/30">
              <div className="text-amber-400 font-semibold mb-1">Anatomy</div>
              <div className="text-[#B0BDD0] text-xs">Week 5 cardiac structure identification</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleDownloadCertificate}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-6 rounded-xl shadow-lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Certificate
          </Button>
          <Button
            onClick={onRestart}
            variant="outline"
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-[#E2E8F0] py-6 rounded-xl border border-slate-600"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Restart Journey
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Share your achievement and help others learn!
        </p>
      </div>
    </div>
  );
}