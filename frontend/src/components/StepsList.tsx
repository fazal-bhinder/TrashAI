import { Files, CheckCircle } from 'lucide-react'; // <-- added CheckCircle icon
import { Step } from '../types';

interface StepsListProps {
  steps: Step[];
  currentStep: Step | null;
  onStepClick: (step: Step) => void;
}

interface StepNodeProps {
  item: Step;
  depth: number;
  onStepClick: (step: Step) => void;
}

function StepNode({ item, depth, onStepClick }: StepNodeProps) {
  const handleClick = () => {
    onStepClick(item);
  };

  return (
    <div
      className="flex items-center gap-2 text-gray-400 text-sm hover:bg-sky-500/5 p-2 rounded-lg cursor-pointer transition-colors"
      style={{ paddingLeft: `${depth * 1.5}rem` }}
      onClick={handleClick}
    >
      {item.status === 'completed' && (
        <CheckCircle className="w-4 h-4 text-green-400" />
      )}
      <span>{item.title}</span>
    </div>
  );
}

export function StepsList({ steps, onStepClick }: StepsListProps) {
  return (
    <div className="w-64 bg-zinc-900 border-r border-sky-500/20 p-4 h-full overflow-auto">
      <div className="flex items-center gap-2 mb-4">
        <Files className="w-5 h-5 text-sky-400" />
        <h2 className="font-semibold text-gray-100">Steps</h2>
      </div>
      <div className="space-y-1">
        {steps.map((step) => (
          <StepNode
            key={step.id}
            item={step}
            depth={0}
            onStepClick={onStepClick}
          />
        ))}
      </div>
    </div>
  );
}
