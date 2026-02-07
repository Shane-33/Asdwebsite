import { RotateCw, ZoomIn, RotateCcw } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useState } from "react";

export function HeroSection() {
  const [tasks, setTasks] = useState([
    { id: 1, label: "Truncus Arteriosus", checked: false },
    { id: 2, label: "Bulbus Cordis", checked: false },
    { id: 3, label: "Primitive Ventricle", checked: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, checked: !task.checked } : task
    ));
  };

  return (
    <section className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12">
        {/* Left Column: 3D Viewport */}
        <div className="flex flex-col">
          <div className="relative bg-slate-50 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            {/* Viewport Label */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-sm font-medium text-slate-700 z-10">
              3D_Viewport
            </div>
            
            {/* Image */}
            <div className="aspect-square relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1715111965952-12f4cd5e66f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWJyeW9uaWMlMjBoZWFydCUyMGRldmVsb3BtZW50fGVufDF8fHx8MTc2ODM0NzUzN3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Embryonic heart at week 5"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Toolbar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-white rounded-full shadow-xl p-2 border border-slate-200">
              <Button 
                size="icon" 
                variant="ghost" 
                className="rounded-full hover:bg-[#005EB8] hover:text-white transition-colors"
                title="Rotate"
              >
                <RotateCw className="h-5 w-5" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="rounded-full hover:bg-[#005EB8] hover:text-white transition-colors"
                title="Zoom"
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="rounded-full hover:bg-[#005EB8] hover:text-white transition-colors"
                title="Reset"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Task List */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-slate-900 mb-4">
              The Heart at <span className="text-[#005EB8]">Week 5</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Explore the embryonic heart development and understand the critical structures that form during this crucial period.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">
              Identify Key Structures
            </h3>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-colors">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.checked}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="data-[state=checked]:bg-[#005EB8] data-[state=checked]:border-[#005EB8]"
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`flex-1 cursor-pointer select-none ${
                      task.checked ? 'text-slate-500 line-through' : 'text-slate-900'
                    }`}
                  >
                    {task.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="bg-[#005EB8] hover:bg-[#004A93] text-white px-8 py-6 rounded-lg">
              Start Learning
            </Button>
            <Button variant="outline" className="border-slate-300 px-8 py-6 rounded-lg">
              View Resources
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
