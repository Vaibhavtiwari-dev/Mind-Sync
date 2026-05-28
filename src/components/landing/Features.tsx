import { Calendar, LayoutDashboard, Target, Brain } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Smart Planner',
    description: 'Predictive scheduling that learns your cognitive rhythms for optimal deep work sessions.',
    iconClass: 'bg-primary/10 text-primary',
  },
  {
    icon: LayoutDashboard,
    title: 'Kanban Board',
    description: 'Multidimensional visual task mapping with integrated node relations for complex projects.',
    iconClass: 'bg-secondary/10 text-secondary',
  },
  {
    icon: Target,
    title: 'Focus Mode',
    description: 'A high-fidelity immersive workspace that shields your attention from digital noise.',
    iconClass: 'bg-tertiary/10 text-tertiary',
  },
  {
    icon: Brain,
    title: 'Notes',
    description: 'Capturing raw thoughts and auto-associating them into a persistent knowledge graph.',
    iconClass: 'bg-primary/10 text-primary',
  },
];

export function Features() {
  return (
    <section className="py-32 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-16">
          <span className="font-label-sm text-primary mb-4 tracking-widest uppercase">System Capabilities</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Engineered for High-Performance Minds</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="glass-card p-8 rounded-xl flex flex-col gap-6">
              <div className={`size-12 rounded-lg flex items-center justify-center ${feature.iconClass}`}>
                <feature.icon className="size-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
