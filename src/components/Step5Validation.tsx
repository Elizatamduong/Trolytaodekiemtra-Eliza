import React from 'react';
import { 
  BlueprintRow, CognitiveLevelProfile, ExamInfo, 
  RegulatoryProfile, SourceDocument, ValidationResult, VerificationStatus 
} from '../types/assessment';
import { 
  CheckCircle2, AlertTriangle, XCircle, ArrowLeft, 
  ArrowRight, ShieldCheck, Scale, Clock, Award, 
  FileCheck2, AlertCircle, Info, RefreshCw
} from 'lucide-react';

interface Step5ValidationProps {
  examInfo: ExamInfo;
  blueprint: BlueprintRow[];
  sourceDocuments: SourceDocument[];
  cognitiveProfile: CognitiveLevelProfile;
  onChangeCognitiveProfile: (profile: CognitiveLevelProfile) => void;
  regulatoryProfile: RegulatoryProfile;
  onChangeRegulatoryProfile: (profile: RegulatoryProfile) => void;
  validationResult: ValidationResult;
  onRevalidate: () => void;
  onProceedToGenerate: () => void;
  onBack: () => void;
  isGenerating?: boolean;
}

export const Step5Validation: React.FC<Step5ValidationProps> = ({
  examInfo,
  blueprint,
  sourceDocuments,
  cognitiveProfile,
  onChangeCognitiveProfile,
  regulatoryProfile,
  onChangeRegulatoryProfile,
  validationResult,
  onRevalidate,
  onProceedToGenerate,
  onBack,
  isGenerating = false,
}) => {
  const errorItems = validationResult.items.filter(i => i.type === 'error');
  const warningItems = validationResult.items.filter(i => i.type === 'warning');
  const validItems = validationResult.items.filter(i => i.type === 'valid');

  const handleUpdateRegulatoryStatus = (newStatus: VerificationStatus) => {
    onChangeRegulatoryProfile({
      ...regulatoryProfile,
      status: newStatus
    });
    setTimeout(() => onRevalidate(), 50);
  };

  const handleAlignWith7991 = () => {
    // Switch cognitive profile to 7991 3-level
    onChangeCognitiveProfile({
      id: 'cv_7991_appendix',
      name: 'Khung 3 mức độ theo Phụ lục Công văn 7991/BGDĐT-GDTrH',
      levels: ['Biết', 'Hiểu', 'Vận dụng'],
      description: 'Chỉ áp dụng khi xác minh theo Phụ lục CV 7991 (Không chứa mức "Vận dụng cao" độc lập).',
      isOfficial: true
    });
    setTimeout(() => onRevalidate(), 50);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Title Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <span>Bước 5 – Kiểm tra tính nhất quán cấu hình & Thẩm định chuyên môn</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Validation Engine quét toàn diện: điểm số, thời lượng, số câu, ranh giới nguồn và tính pháp lý trước khi sinh đề.
            </p>
          </div>
          <button
            type="button"
            onClick={onRevalidate}
            className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 self-start sm:self-auto transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Quét lại cấu hình</span>
          </button>
        </div>
      </div>

      {/* Validation Status Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Valid Card */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-950 uppercase block">
              ✅ Hợp lệ ({validItems.length})
            </span>
            <span className="text-[11px] text-emerald-800">
              Đạt chuẩn kỹ thuật khảo thí và kiểm soát nguồn.
            </span>
          </div>
        </div>

        {/* Warning Card */}
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-950 uppercase block">
              ⚠️ Cần xem xét ({warningItems.length})
            </span>
            <span className="text-[11px] text-amber-800">
              Khuyến nghị sư phạm (cho phép tạo đề nếu giáo viên đồng ý).
            </span>
          </div>
        </div>

        {/* Error Card */}
        <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-rose-950 uppercase block">
              ❌ Phải sửa ({errorItems.length})
            </span>
            <span className="text-[11px] text-rose-800">
              {errorItems.length === 0 ? 'Không có lỗi chặn. Đủ điều kiện tạo đề.' : 'Lỗi bắt buộc phải khắc phục trước khi tạo đề.'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Validation Details & Regulatory Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Detailed Diagnostic Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">
              Báo cáo rà soát cấu hình kỹ thuật
            </h3>

            {/* If has critical errors */}
            {errorItems.length > 0 && (
              <div className="mb-4 space-y-3">
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wide block">
                  Lỗi nghiêm trọng (Phải sửa trước khi tạo đề):
                </span>
                {errorItems.map((item) => (
                  <div key={item.id} className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-950 space-y-1.5">
                    <div className="flex items-center space-x-2 font-bold text-rose-800">
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{item.title}</span>
                    </div>
                    <p className="text-slate-700 pl-6 leading-relaxed">{item.detail}</p>
                    {item.fixSuggestion && (
                      <div className="pl-6 pt-1 text-[11px] text-rose-700 font-semibold">
                        👉 Hướng dẫn khắc phục: {item.fixSuggestion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Warnings */}
            {warningItems.length > 0 && (
              <div className="mb-4 space-y-3">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide block">
                  Cảnh báo chuyên môn (Cần lưu ý):
                </span>
                {warningItems.map((item) => (
                  <div key={item.id} className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 space-y-1.5">
                    <div className="flex items-center space-x-2 font-bold text-amber-800">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{item.title}</span>
                    </div>
                    <p className="text-slate-700 pl-6 leading-relaxed">{item.detail}</p>
                    {item.fixSuggestion && (
                      <div className="pl-6 pt-1 text-[11px] text-amber-800 font-medium">
                        💡 Khuyến nghị: {item.fixSuggestion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Valid Criteria List */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide block">
                Tiêu chuẩn đã kiểm tra thành công:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {validItems.map((item) => (
                  <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block">{item.title}</span>
                      <span className="text-[11px] text-slate-500">{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Regulatory Verification Card (Công văn 7991/BGDĐT-GDTrH) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Scale className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Mô-đun Kiểm chứng Công văn 7991
                </h3>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                Pháp lý
              </span>
            </div>

            <div className="text-xs space-y-2.5 text-slate-600">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Số hiệu văn bản:</span>
                <span className="font-bold text-slate-900">{regulatoryProfile.docNumber}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Cơ quan ban hành & Ngày:</span>
                <span className="font-medium text-slate-800">{regulatoryProfile.issuingBody} (Ban hành {regulatoryProfile.issueDate})</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Trích yếu nội dung:</span>
                <span className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed">
                  {regulatoryProfile.title}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Phạm vi áp dụng:</span>
                <span className="text-[11px] text-slate-700">{regulatoryProfile.scope}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Nguồn & Ngày xác minh:</span>
                <span className="text-[11px] text-slate-700 font-mono">
                  {regulatoryProfile.verificationSource} ({regulatoryProfile.verificationDate})
                </span>
              </div>

              {/* Status Selector */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                  Trạng thái pháp lý hiện tại:
                </label>
                <select
                  value={regulatoryProfile.status}
                  onChange={(e) => handleUpdateRegulatoryStatus(e.target.value as VerificationStatus)}
                  className={`w-full text-xs font-bold rounded-lg border py-2 px-3 focus:ring-2 focus:ring-indigo-500 ${
                    regulatoryProfile.status === 'verified'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      : regulatoryProfile.status === 'needs_confirmation'
                      ? 'border-amber-300 bg-amber-50 text-amber-800'
                      : 'border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <option value="needs_confirmation">⚠️ Cần giáo viên xác nhận</option>
                  <option value="verified">✅ Đã xác minh & áp dụng</option>
                  <option value="not_applicable">⚪ Không áp dụng cho cấu hình hiện tại</option>
                  <option value="not_verified">❌ Chưa xác minh</option>
                </select>
              </div>

              {/* Conflict Notification & Resolution Engine */}
              {validationResult.regulatoryConflicts && validationResult.regulatoryConflicts.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs space-y-2 mt-3">
                  <div className="flex items-center space-x-1.5 font-bold text-amber-900">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Xung đột quy định đang áp dụng:</span>
                  </div>
                  {validationResult.regulatoryConflicts.map((conf, cIdx) => (
                    <div key={cIdx} className="text-[11px] text-amber-900 space-y-1">
                      <div>• <strong>Mục xung đột:</strong> {conf.targetField}</div>
                      <div>• <strong>Quy định CV 7991:</strong> {conf.regulationRule}</div>
                      <div>• <strong>Cấu hình hiện tại:</strong> {conf.currentValue}</div>
                      <button
                        type="button"
                        onClick={handleAlignWith7991}
                        className="mt-1.5 w-full py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold text-[11px] transition-colors"
                      >
                        Đồng bộ về Khung 3 mức CV 7991 (Biết - Hiểu - Vận dụng)
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 italic">
              Tuyệt đối không tự ý gắn nhãn tuân thủ nếu văn bản chưa được xác minh từ nguồn chính thức.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 px-4 py-2.5 rounded-lg transition-colors self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Bước 4: Thiết lập cấu trúc</span>
        </button>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          {!validationResult.canProceed && (
            <span className="text-xs text-rose-600 font-semibold">
              Còn {errorItems.length} lỗi bắt buộc cần sửa trước khi tạo đề!
            </span>
          )}

          <button
            type="button"
            onClick={onProceedToGenerate}
            disabled={!validationResult.canProceed || isGenerating}
            className={`inline-flex items-center space-x-2 text-xs font-bold px-6 py-3 rounded-lg transition-all shadow-xs ${
              validationResult.canProceed && !isGenerating
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-sm hover:shadow'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{isGenerating ? 'Hệ thống đang kiểm định & sinh đề...' : 'Tạo đề kiểm tra (Chuyển sang Bước 6)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
