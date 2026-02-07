import { useEffect, useRef, useState } from 'react';

interface HeartModel3DProps {
  stage: number; // 0-6
}

export function HeartModel3D({ stage }: HeartModel3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);

  // Auto-rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Draw the heart model
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const rad = (rotation * Math.PI) / 180;

    // Create 3D perspective effect
    const scale = 1 + Math.sin(rad) * 0.1;

    // Draw main heart chambers
    ctx.save();
    ctx.translate(centerX, centerY);
    
    // Right Atrium (Red - deoxygenated in diagram)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(-60 * scale, -40, 70 * scale, 60, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Left Atrium (Blue - oxygenated in diagram)
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.ellipse(60 * scale, -40, 70 * scale, 60, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw septum primum (Stage 1+)
    if (stage >= 1) {
      const septumHeight = Math.min(stage * 30, 120);
      
      // Septum Primum
      const gradient1 = ctx.createLinearGradient(0, -50, 0, septumHeight);
      gradient1.addColorStop(0, '#60a5fa');
      gradient1.addColorStop(1, '#3b82f6');
      
      ctx.fillStyle = gradient1;
      ctx.fillRect(-5 * scale, -50, 10 * scale, septumHeight);
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 1;
      ctx.strokeRect(-5 * scale, -50, 10 * scale, septumHeight);

      // Add label
      ctx.fillStyle = '#60a5fa';
      ctx.font = '11px sans-serif';
      ctx.fillText('Septum Primum', -50, -60);
    }

    // Draw ostium primum (Stage 2-3)
    if (stage >= 2 && stage <= 3) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 50, 15 * scale, 0, Math.PI * 2);
      ctx.stroke();
      
      // Glow effect
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 50, 18 * scale, 0, Math.PI * 2);
      ctx.stroke();

      // Label
      ctx.fillStyle = '#3b82f6';
      ctx.font = '10px sans-serif';
      ctx.fillText('Ostium Primum', -45, 80);
    }

    // Draw ostium secundum (Stage 3-4)
    if (stage >= 3 && stage <= 4) {
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -20, 12 * scale, 0, Math.PI * 2);
      ctx.stroke();
      
      // Glow effect
      ctx.strokeStyle = '#a78bfa';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, -20, 15 * scale, 0, Math.PI * 2);
      ctx.stroke();

      // Label
      ctx.fillStyle = '#8b5cf6';
      ctx.font = '10px sans-serif';
      ctx.fillText('Ostium Secundum', 20, -25);
    }

    // Close ostium primum (Stage 4+)
    if (stage >= 4) {
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(0, 50, 15 * scale, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw septum secundum (Stage 5+)
    if (stage >= 5) {
      const gradient2 = ctx.createLinearGradient(20, -50, 20, 70);
      gradient2.addColorStop(0, '#10b981');
      gradient2.addColorStop(1, '#059669');
      
      ctx.fillStyle = gradient2;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(15 * scale, -50, 10 * scale, 120);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#065f46';
      ctx.lineWidth = 1;
      ctx.strokeRect(15 * scale, -50, 10 * scale, 120);

      // Label
      ctx.fillStyle = '#10b981';
      ctx.font = '11px sans-serif';
      ctx.fillText('Septum Secundum', 35, -60);
    }

    // Draw foramen ovale (Stage 6)
    if (stage === 6) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(20 * scale, 10, 18 * scale, 25, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();
      
      // Glow effect
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(20 * scale, 10, 22 * scale, 29, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();

      // Label
      ctx.fillStyle = '#f59e0b';
      ctx.font = '11px sans-serif';
      ctx.fillText('Foramen Ovale', 45, 25);
    }

    // Draw ventricles (background)
    ctx.globalAlpha = 0.3;
    
    // Right Ventricle
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(-60 * scale, 80, 65 * scale, 70, 0, 0, Math.PI * 2);
    ctx.fill();

    // Left Ventricle
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.ellipse(60 * scale, 80, 65 * scale, 70, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.restore();

    // Draw stage indicator
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`Stage ${stage}/6`, 10, 30);

  }, [rotation, stage]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-900">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="max-w-full max-h-full"
      />
    </div>
  );
}
