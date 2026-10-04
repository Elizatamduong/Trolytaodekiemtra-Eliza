import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  shortDesc: string;
}

const STEPS: Step[] = [
  { id: 1, name: 'Bước 1', shortDesc: 'Khai báo thông tin' },
  { id: 2, name: 'Bước 2', shortDesc: 'Chọn cách tạo đề' },
  { id: 3, name: 'Bước 3', shortDesc: 'Tải đề mẫu/tư liệu' },
  { id: 4, name: 'Bước 4', shortDesc: 'Thiết lập cấu trúc' },
  { id: 5, name: 'Bước 5', shortDesc: 'Kiểm tra & xác nhận' },
  { id: 6, name: 'Bước 6', shortDesc: 'Tạo đề & Kết quả' },
];

interface StepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  completedSteps: number[];
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  onStepClick,
  completedSteps,
}) => {
  return (
    <nav aria-label="Tiến trình thiết kế đề kiểm tra" className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <ol className="grid grid-cols-2 md:grid-cols-6 gap-2 sm:gap-4">
          {STEPS.map((step) => {
            const isCurrent = step.id === currentStep;
            const isCompleted = completedSteps.includes(step.id);
            const isAccessible = isCompleted || step.id <= currentStep;

            return (
              <li key={step.id} className="relative">
                <button
                  type="button"
                  disabled={!isAccessible}
                  onClick={() => isAccessible && onStepClick(step.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex flex-col justify-between h-full ${
                    isCurrent
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-xs'
                      : isCompleted
                      ? 'border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/60 cursor-pointer'
                      : 'border-slate-200 bg-slate-50/50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span
                      className={`font-semibold tracking-wide uppercase text-[10px] ${
                        isCurrent
                          ? 'text-indigo-700'
                          : isCompleted
                          ? 'text-emerald-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.name}
                    </span>
                    {isCompleted && !isCurrent ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    ) : (
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isCurrent
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {step.id}
                      </span>
                    )}
                  </div>
                  <span
                    className={`font-medium truncate block ${
                      isCurrent
                        ? 'text-indigo-950 font-bold'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.shortDesc}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
