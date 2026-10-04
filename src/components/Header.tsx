import React from 'react';
import { BookOpen, CheckCircle2, AlertTriangle, XCircle, RotateCcw } from 'lucide-react';
import { ValidationResult } from '../types/assessment';

interface HeaderProps {
  validationResult?: ValidationResult;
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ validationResult, onReset }) => {
  const hasErrors = validationResult?.items.some(i => i.type === 'error') ?? false;
  const hasWarnings = validationResult?.items.some(i => i.type === 'warning') ?? false;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  TRỢ LÝ TẠO ĐỀ KIỂM TRA
                </h1>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Assessment Studio
                </span>
                <span className="hidden sm:inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                  Bản quyền: Eliza Tâm Dương • 0962571826
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Thiết kế cấu trúc – tạo đề – đáp án – hướng dẫn chấm có kiểm soát chuyên môn
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* System Status Indicators */}
            <div className="flex items-center space-x-3 text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50/70">
              <div className="flex items-center space-x-1.5" title="Chỉ số Đạt chuẩn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-600 font-medium">Đạt chuẩn</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center space-x-1.5" title="Chỉ số Cần xem xét">
                <AlertTriangle className={`w-4 h-4 ${hasWarnings ? 'text-amber-500' : 'text-slate-400'}`} />
                <span className="text-slate-600 font-medium">Cần xem xét</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center space-x-1.5" title="Chỉ số Lỗi cần sửa">
                <XCircle className={`w-4 h-4 ${hasErrors ? 'text-rose-600 animate-pulse' : 'text-slate-400'}`} />
                <span className="text-slate-600 font-medium">Lỗi cần sửa</span>
              </div>
            </div>

            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 px-2.5 py-1.5 rounded-md font-medium transition-colors"
                title="Làm mới toàn bộ cấu hình"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm mới</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
