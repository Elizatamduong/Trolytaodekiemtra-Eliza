import React from 'react';
import { CreationMode } from '../types/assessment';
import { FileSpreadsheet, Sliders, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Step2ModeProps {
  creationMode: CreationMode;
  onSelectMode: (mode: CreationMode) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Mode: React.FC<Step2ModeProps> = ({
  creationMode,
  onSelectMode,
  onNext,
  onBack,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Bước 2 – Chọn phương thức thiết kế cấu trúc đề
        </h2>
        <p className="text-xs text-slate-500 max-w-xl mx-auto mt-1.5">
          Hệ thống không áp đặt phương thức mặc định. Giáo viên vui lòng chọn 1 trong 2 cách tiếp cận sau để kiểm soát cấu trúc và điểm số:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Cách 1: Tạo theo đề mẫu */}
        <div
          onClick={() => onSelectMode('template')}
          className={`relative rounded-xl border-2 p-6 cursor-pointer transition-all flex flex-col justify-between ${
            creationMode === 'template'
              ? 'border-indigo-600 bg-indigo-50/40 shadow-md ring-2 ring-indigo-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
          }`}
        >
          {creationMode === 'template' && (
            <div className="absolute top-4 right-4 text-indigo-600">
              <CheckCircle2 className="w-5 h-5 fill-indigo-100" />
            </div>
          )}
          <div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
              creationMode === 'template' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Cách 1 – Tạo theo đề mẫu
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tải đề Word, PDF hoặc ảnh. AI phân tích cấu trúc để tạo một đề mới có cấu trúc tương tự nhưng nội dung bám phạm vi kiến thức đã xác nhận.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Áp dụng khi có sẵn file đề mẫu</span>
            <span className="font-semibold text-indigo-600">Bóc tách cấu trúc →</span>
          </div>
        </div>

        {/* Cách 2: Tự thiết lập */}
        <div
          onClick={() => onSelectMode('custom')}
          className={`relative rounded-xl border-2 p-6 cursor-pointer transition-all flex flex-col justify-between ${
            creationMode === 'custom'
              ? 'border-indigo-600 bg-indigo-50/40 shadow-md ring-2 ring-indigo-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
          }`}
        >
          {creationMode === 'custom' && (
            <div className="absolute top-4 right-4 text-indigo-600">
              <CheckCircle2 className="w-5 h-5 fill-indigo-100" />
            </div>
          )}
          <div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
              creationMode === 'custom' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Cách 2 – Tự thiết lập cấu trúc
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ứng dụng gợi ý cấu trúc phù hợp, giáo viên chủ động điều chỉnh dạng câu, số câu, mức độ và điểm.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Linh hoạt cấu hình thủ công / Gợi ý AI</span>
            <span className="font-semibold text-indigo-600">Bản đặc tả tự do →</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 px-4 py-2.5 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Bước 1</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!creationMode}
          className={`inline-flex items-center space-x-2 text-xs font-semibold px-5 py-2.5 rounded-lg transition-all shadow-xs ${
            creationMode
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Tiếp tục: Bước 3 – Quản lý file</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
