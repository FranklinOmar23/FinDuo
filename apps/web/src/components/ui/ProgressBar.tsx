interface ProgressBarProps {
  value: number;
  total: number;
}

export const ProgressBar = ({ value, total }: ProgressBarProps) => {
  const percent = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-pine">
        <span>Progreso</span>
        <span>{percent}%</span>
      </div>
      <div className="h-3 rounded-full bg-teal/10">
        <div className="h-3 rounded-full bg-coral transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};
