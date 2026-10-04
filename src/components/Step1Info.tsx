import React, { useState } from 'react';
import { EducationLevel, ExamInfo, ExamObjective } from '../types/assessment';
import { SUBJECT_OPTIONS, GRADE_OPTIONS, SAMPLE_SOURCE_PACKS } from '../constants/presets';
import { Plus, Trash2, ArrowRight, Sparkles, Clock, Target, Award, BookOpen } from 'lucide-react';

interface Step1InfoProps {
  examInfo: ExamInfo;
  onChange: (updated: Partial<ExamInfo>) => void;
  onNext: () => void;
  onLoadSamplePack?: (packId: string) => void;
}

export const Step1Info: React.FC<Step1InfoProps> = ({
  examInfo,
  onChange,
  onNext,
  onLoadSamplePack
}) => {
  const [newOutcome, setNewOutcome] = useState('');
  const [customSubjectMode, setCustomSubjectMode] = useState(false);

  const availableSubjects = SUBJECT_OPTIONS[examInfo.educationLevel] || [];
  const availableGrades = GRADE_OPTIONS[examInfo.educationLevel] || [];

  const handleEducationLevelChange = (level: EducationLevel) => {
    const grades = GRADE_OPTIONS[level] || [];
    const subjects = SUBJECT_OPTIONS[level] || [];
    onChange({
      educationLevel: level,
      grade: grades[0] || 'Lớp 1',
      subject: subjects[0] || 'Toán học'
    });
  };

  const handleAddOutcome = () => {
    if (newOutcome.trim()) {
      onChange({
        learningOutcomes: [...examInfo.learningOutcomes, newOutcome.trim()]
      });
      setNewOutcome('');
    }
  };

  const handleRemoveOutcome = (index: number) => {
    const updated = examInfo.learningOutcomes.filter((_, idx) => idx !== index);
    onChange({ learningOutcomes: updated });
  };

  const isFormValid = 
    examInfo.subject.trim() !== '' &&
    examInfo.grade.trim() !== '' &&
    examInfo.durationMinutes > 0 &&
    examInfo.totalScore > 0 &&
    examInfo.knowledgeScope.trim().length >= 10;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Sample Fast Preload Banner */}
      <div className="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-indigo-950">
              Điền nhanh mẫu chuẩn bị sẵn (Khảo sát GDPT 2018)
            </h3>
            <p className="text-xs text-indigo-700/80">
              Tải sẵn phạm vi kiến thức và yêu cầu cần đạt thực tế để kiểm thử nhanh quy trình.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          {SAMPLE_SOURCE_PACKS.map(pack => (
            <button
              key={pack.id}
              type="button"
              onClick={() => onLoadSamplePack && onLoadSamplePack(pack.id)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-indigo-800 hover:bg-indigo-50 font-medium transition-colors shadow-2xs"
            >
              {pack.subject} ({pack.grade})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Declaration Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4 mb-5">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <span>1. Khai báo thông tin bài kiểm tra</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Khai báo chính xác thông số cơ bản. AI tuyệt đối không vượt ngoài phạm vi kiến thức giáo viên xác định.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Cấp học */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Cấp học <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'tieuhoc', label: 'Tiểu học' },
                    { id: 'thcs', label: 'THCS' },
                    { id: 'thpt', label: 'THPT' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => handleEducationLevelChange(lvl.id as EducationLevel)}
                      className={`text-xs py-2 px-3 rounded-lg border font-medium transition-colors ${
                        examInfo.educationLevel === lvl.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Khối lớp */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Khối lớp <span className="text-rose-500">*</span>
                </label>
                <select
                  value={examInfo.grade}
                  onChange={(e) => onChange({ grade: e.target.value })}
                  className="w-full text-xs rounded-lg border border-slate-300 py-2.5 px-3 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {availableGrades.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Môn học */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Môn học <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setCustomSubjectMode(!customSubjectMode)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {customSubjectMode ? '← Chọn từ danh sách môn' : '+ Nhập tên môn khác'}
                  </button>
                </div>
                {customSubjectMode ? (
                  <input
                    type="text"
                    placeholder="Ví dụ: Khoa học máy tính chuyên đề, Tiếng Pháp..."
                    value={examInfo.subject}
                    onChange={(e) => onChange({ subject: e.target.value })}
                    className="w-full text-xs rounded-lg border border-slate-300 py-2.5 px-3 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <select
                    value={examInfo.subject}
                    onChange={(e) => onChange({ subject: e.target.value })}
                    className="w-full text-xs rounded-lg border border-slate-300 py-2.5 px-3 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {availableSubjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Mục tiêu kiểm tra */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mục tiêu kiểm tra <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'input', label: 'Đánh giá đầu vào' },
                    { id: 'regular', label: 'Kiểm tra thường xuyên' },
                    { id: 'periodic', label: 'Kiểm tra định kì' },
                    { id: 'post_topic', label: 'Đánh giá sau bài/chủ đề' },
                    { id: 'other', label: 'Khác (Tự định nghĩa)' },
                  ].map((obj) => (
                    <button
                      key={obj.id}
                      type="button"
                      onClick={() => onChange({ examObjective: obj.id as ExamObjective })}
                      className={`text-xs py-2 px-3 rounded-lg border text-left font-medium transition-colors ${
                        examInfo.examObjective === obj.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {obj.label}
                    </button>
                  ))}
                </div>
                {examInfo.examObjective === 'other' && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      placeholder="Nhập mục tiêu kiểm tra cụ thể..."
                      value={examInfo.examObjectiveCustom}
                      onChange={(e) => onChange({ examObjectiveCustom: e.target.value })}
                      className="w-full text-xs rounded-lg border border-slate-300 py-2 px-3 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>

              {/* Thời gian làm bài */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Thời gian làm bài (Phút) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={examInfo.durationMinutes}
                    onChange={(e) => onChange({ durationMinutes: Math.max(1, parseInt(e.target.value) || 0) })}
                    className="w-full text-xs rounded-lg border border-slate-300 py-2.5 pl-3 pr-10 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs text-slate-400 font-medium">
                    phút
                  </div>
                </div>
              </div>

              {/* Tổng điểm */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tổng điểm của đề <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="100"
                    value={examInfo.totalScore}
                    onChange={(e) => onChange({ totalScore: Math.max(0.5, parseFloat(e.target.value) || 0) })}
                    className="w-full text-xs rounded-lg border border-slate-300 py-2.5 pl-3 pr-12 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs text-slate-400 font-medium">
                    điểm
                  </div>
                </div>
              </div>
            </div>

            {/* Phạm vi kiến thức */}
            <div className="mt-5 pt-5 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nội dung / Phạm vi kiến thức cho phép <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={examInfo.knowledgeScope}
                onChange={(e) => onChange({ knowledgeScope: e.target.value })}
                placeholder="Nhập các bài học, chương, hoặc đơn vị kiến thức cụ thể. Chỉ ra rõ những gì ĐƯỢC PHÉP và KHÔNG ĐƯỢC PHÉP vượt quá..."
                className="w-full text-xs rounded-lg border border-slate-300 p-3 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono leading-relaxed"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Nguyên tắc nguồn có kiểm soát: AI chỉ tạo câu hỏi trong phạm vi này, không tự mở rộng.
              </p>
            </div>

            {/* Yêu cầu cần đạt / Năng lực */}
            <div className="mt-5 pt-5 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Yêu cầu cần đạt / Năng lực cần đánh giá
              </label>
              <div className="space-y-2 mb-3">
                {examInfo.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-slate-700">{outcome}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOutcome(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Thêm yêu cầu cần đạt (ví dụ: Tìm được khoảng đơn điệu của hàm số phân thức...)"
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOutcome())}
                  className="flex-1 text-xs rounded-lg border border-slate-300 py-2 px-3 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddOutcome}
                  className="inline-flex items-center space-x-1 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Configuration Summary Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                <span>Tóm tắt cấu hình bài thi</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  Bước 1
                </span>
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start justify-between">
                  <span className="text-slate-500 flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Môn & Cấp:</span>
                  </span>
                  <span className="font-semibold text-slate-900 text-right">
                    {examInfo.subject} ({examInfo.grade})
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <span className="text-slate-500 flex items-center space-x-1.5">
                    <Target className="w-3.5 h-3.5 text-slate-400" />
                    <span>Mục tiêu:</span>
                  </span>
                  <span className="font-semibold text-slate-900 text-right max-w-[160px] truncate">
                    {examInfo.examObjective === 'other' ? (examInfo.examObjectiveCustom || 'Tự định nghĩa') : {
                      input: 'Đánh giá đầu vào',
                      regular: 'Kiểm tra thường xuyên',
                      periodic: 'Kiểm tra định kì',
                      post_topic: 'Đánh giá sau bài/chủ đề',
                      other: 'Khác'
                    }[examInfo.examObjective]}
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <span className="text-slate-500 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Thời gian làm bài:</span>
                  </span>
                  <span className="font-bold text-indigo-700">
                    {examInfo.durationMinutes} phút
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <span className="text-slate-500 flex items-center space-x-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tổng điểm mục tiêu:</span>
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {examInfo.totalScore} điểm
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Phạm vi kiến thức khai báo:
                  </span>
                  <p className="text-slate-700 text-[11px] line-clamp-3 bg-slate-50 p-2 rounded-md border border-slate-200/80 font-mono">
                    {examInfo.knowledgeScope || 'Chưa nhập phạm vi kiến thức...'}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Yêu cầu cần đạt:
                  </span>
                  <span className="text-slate-700 font-medium">
                    {examInfo.learningOutcomes.length} tiêu chí năng lực đã thiết lập
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onNext}
                  disabled={!isFormValid}
                  className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-xs ${
                    isFormValid
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Tiếp tục: Bước 2 – Chọn cách tạo đề</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {!isFormValid && (
                  <p className="text-[11px] text-rose-500 text-center mt-2">
                    Vui lòng nhập đầy đủ môn học, thời gian, tổng điểm và phạm vi kiến thức (tối thiểu 10 ký tự).
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
