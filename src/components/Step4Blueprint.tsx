import React, { useState } from 'react';
import { 
  BlueprintRow, CognitiveLevelProfile, CreationMode, 
  ExamInfo, QuestionType, RegulatoryProfile, TemplateAnalysis 
} from '../types/assessment';
import { DEFAULT_COGNITIVE_PROFILES } from '../constants/presets';
import { 
  Plus, Trash2, Sparkles, ArrowLeft, ArrowRight, 
  HelpCircle, SlidersHorizontal, Calculator, AlertCircle, Copy
} from 'lucide-react';

interface Step4BlueprintProps {
  creationMode: CreationMode;
  examInfo: ExamInfo;
  blueprint: BlueprintRow[];
  onChangeBlueprint: (updated: BlueprintRow[]) => void;
  cognitiveProfile: CognitiveLevelProfile;
  onChangeCognitiveProfile: (profile: CognitiveLevelProfile) => void;
  regulatoryProfile: RegulatoryProfile;
  templateAnalysis: TemplateAnalysis | null;
  onNext: () => void;
  onBack: () => void;
}

export const Step4Blueprint: React.FC<Step4BlueprintProps> = ({
  creationMode,
  examInfo,
  blueprint,
  onChangeBlueprint,
  cognitiveProfile,
  onChangeCognitiveProfile,
  regulatoryProfile,
  templateAnalysis,
  onNext,
  onBack,
}) => {
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionNote, setSuggestionNote] = useState<string | null>(null);
  const [customProfileName, setCustomProfileName] = useState('');
  const [customLevelsText, setCustomLevelsText] = useState('');
  const [showCustomProfileModal, setShowCustomProfileModal] = useState(false);

  // Totals calculations
  const totalScoreCalculated = blueprint.reduce((sum, r) => sum + (Number(r.totalPoints) || 0), 0);
  const totalQuestions = blueprint.reduce((sum, r) => sum + (Number(r.questionCount) || 0), 0);
  const scoreDifference = totalScoreCalculated - examInfo.totalScore;

  // Add new blank row
  const handleAddRow = () => {
    const defaultTopic = examInfo.knowledgeScope.split('\n')[0]?.replace(/^[-•\d.]\s*/, '').slice(0, 40) || 'Chủ đề kiến thức mới';
    const defaultOutcome = examInfo.learningOutcomes[0] || 'Yêu cầu cần đạt mục tiêu';
    const newRow: BlueprintRow = {
      id: `row_${Date.now()}_${blueprint.length + 1}`,
      topic: defaultTopic,
      learningOutcome: defaultOutcome,
      questionType: 'multiple_choice',
      cognitiveLevel: cognitiveProfile.levels[0] || 'Biết',
      questionCount: 4,
      pointsPerQuestion: 0.25,
      totalPoints: 1.0
    };
    onChangeBlueprint([...blueprint, newRow]);
  };

  const handleUpdateRow = (rowId: string, updates: Partial<BlueprintRow>) => {
    const updated = blueprint.map(r => {
      if (r.id === rowId) {
        const merged = { ...r, ...updates };
        // Recalculate totalPoints if count or pointsPerQuestion changed
        if (updates.questionCount !== undefined || updates.pointsPerQuestion !== undefined) {
          merged.totalPoints = Number((merged.questionCount * merged.pointsPerQuestion).toFixed(2));
        }
        return merged;
      }
      return r;
    });
    onChangeBlueprint(updated);
  };

  const handleDeleteRow = (rowId: string) => {
    onChangeBlueprint(blueprint.filter(r => r.id !== rowId));
  };

  // Convert Template Analysis to Blueprint Rows
  const handleInheritFromTemplate = () => {
    if (!templateAnalysis || templateAnalysis.sections.length === 0) return;
    const defaultTopic = examInfo.knowledgeScope.split('\n')[0]?.replace(/^[-•\d.]\s*/, '').slice(0, 50) || 'Kiến thức theo đề mẫu';
    const defaultOutcome = examInfo.learningOutcomes[0] || 'Yêu cầu cần đạt theo đề mẫu';

    const newRows: BlueprintRow[] = templateAnalysis.sections.map((sec, idx) => ({
      id: `row_tpl_${Date.now()}_${idx + 1}`,
      topic: `${defaultTopic} (${sec.name.split(':')[0] || 'Phần'})`,
      learningOutcome: defaultOutcome,
      questionType: sec.questionType,
      cognitiveLevel: cognitiveProfile.levels[Math.min(idx, cognitiveProfile.levels.length - 1)] || cognitiveProfile.levels[0],
      questionCount: sec.questionCount,
      pointsPerQuestion: sec.pointsPerQuestion,
      totalPoints: sec.totalPoints
    }));

    onChangeBlueprint(newRows);
  };

  // AI Suggest Blueprint
  const handleSuggestBlueprint = async () => {
    setIsSuggesting(true);
    setSuggestionNote(null);
    try {
      const resp = await fetch('/api/suggest-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examInfo,
          cognitiveProfile,
          regulatoryProfile
        })
      });
      const data = await resp.json();
      if (resp.ok && data.blueprintRows) {
        onChangeBlueprint(data.blueprintRows);
        setSuggestionNote(data.suggestionNote || 'Cấu trúc đề được tối ưu hóa dựa trên thông số bài thi.');
      } else {
        alert(data.error || 'Lỗi khi gợi ý cấu trúc');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSuggesting(false);
    }
  };

  // Create Custom Cognitive Profile
  const handleSaveCustomProfile = () => {
    if (!customProfileName.trim() || !customLevelsText.trim()) return;
    const levels = customLevelsText.split(',').map(l => l.trim()).filter(Boolean);
    if (levels.length === 0) return;

    const newProf: CognitiveLevelProfile = {
      id: `custom_prof_${Date.now()}`,
      name: customProfileName.trim(),
      levels,
      description: 'Profile nhận thức do giáo viên tự thiết lập riêng cho bài kiểm tra.',
      isOfficial: false
    };

    onChangeCognitiveProfile(newProf);
    setShowCustomProfileModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header & Cognitive Profile Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">
                Bước 4 – Thiết lập cấu trúc đề (Assessment Blueprint Builder)
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                Ma trận đề thi
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Xây dựng ma trận câu hỏi linh hoạt. Kiểm soát chặt chẽ điểm số, dạng câu và mức độ nhận thức.
            </p>
          </div>

          {/* Profile Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xs">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Hệ mức độ nhận thức áp dụng:
              </label>
              <select
                value={cognitiveProfile.id}
                onChange={(e) => {
                  const found = DEFAULT_COGNITIVE_PROFILES.find(p => p.id === e.target.value);
                  if (found) onChangeCognitiveProfile(found);
                }}
                className="text-xs font-semibold rounded-lg border border-slate-300 py-1.5 px-3 bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500"
              >
                {DEFAULT_COGNITIVE_PROFILES.map(prof => (
                  <option key={prof.id} value={prof.id}>
                    {prof.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowCustomProfileModal(true)}
              className="text-xs self-end py-1.5 px-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-600 font-medium"
            >
              + Tạo Profile riêng
            </button>
          </div>
        </div>

        {/* Cognitive Profile Active Badge & Disclaimer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Các mức độ đang hỗ trợ:</span>
            <div className="flex items-center space-x-1.5">
              {cognitiveProfile.levels.map((lvl, idx) => (
                <span key={idx} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                  {lvl}
                </span>
              ))}
            </div>
          </div>
          <span className="text-[11px] text-slate-400 italic">
            {cognitiveProfile.description}
          </span>
        </div>
      </div>

      {/* Action Toolbar: Suggestion & Inherit */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-indigo-50/60 border border-indigo-100 rounded-xl p-3.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* AI Suggest Button */}
          <button
            type="button"
            onClick={handleSuggestBlueprint}
            disabled={isSuggesting}
            className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg transition-colors flex items-center space-x-1.5 shadow-2xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSuggesting ? 'AI đang phân tích...' : 'Gợi ý cấu trúc thông minh'}</span>
          </button>

          {/* Inherit from Template (if mode 1) */}
          {templateAnalysis && (
            <button
              type="button"
              onClick={handleInheritFromTemplate}
              className="text-xs font-semibold bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 px-3.5 py-2 rounded-lg transition-colors flex items-center space-x-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Kế thừa cấu trúc từ Đề mẫu Khu A</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleAddRow}
            className="text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg transition-colors flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm hàng cấu hình</span>
          </button>
        </div>

        {/* Suggestion Mandatory Disclaimer */}
        <div className="text-[11px] text-indigo-900/80 font-medium">
          💡 “Đây là phương án gợi ý, giáo viên có thể chỉnh sửa trước khi xác nhận.”
        </div>
      </div>

      {suggestionNote && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900 flex items-center justify-between">
          <span>✨ <strong>AI:</strong> {suggestionNote}</span>
          <button type="button" onClick={() => setSuggestionNote(null)} className="text-emerald-700 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Blueprint Table Builder */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="py-3 px-3 text-left font-bold w-12 text-center">STT</th>
                <th className="py-3 px-3 text-left font-bold min-w-[200px]">Nội dung / Chủ đề</th>
                <th className="py-3 px-3 text-left font-bold min-w-[200px]">Yêu cầu cần đạt</th>
                <th className="py-3 px-2 text-left font-bold min-w-[140px]">Dạng câu hỏi</th>
                <th className="py-3 px-2 text-left font-bold min-w-[110px]">Mức độ</th>
                <th className="py-3 px-2 text-center font-bold w-16">Số câu</th>
                <th className="py-3 px-2 text-center font-bold w-20">Điểm/câu</th>
                <th className="py-3 px-3 text-center font-bold w-20">Tổng điểm</th>
                <th className="py-3 px-2 text-center font-bold w-12">Xóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {blueprint.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Chưa có cấu hình câu hỏi nào. Nhấn <strong>"Gợi ý cấu trúc thông minh"</strong> hoặc <strong>"Thêm hàng cấu hình"</strong> bên trên.
                  </td>
                </tr>
              ) : (
                blueprint.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Index */}
                    <td className="py-2.5 px-3 text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>

                    {/* Topic */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={row.topic}
                        onChange={(e) => handleUpdateRow(row.id, { topic: e.target.value })}
                        placeholder="Chủ đề kiến thức..."
                        className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    {/* Learning Outcome */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={row.learningOutcome}
                        onChange={(e) => handleUpdateRow(row.id, { learningOutcome: e.target.value })}
                        placeholder="Yêu cầu cần đạt..."
                        className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    {/* Question Type */}
                    <td className="py-2.5 px-2">
                      <select
                        value={row.questionType}
                        onChange={(e) => handleUpdateRow(row.id, { questionType: e.target.value as QuestionType })}
                        className="w-full border border-slate-300 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-indigo-500 font-medium"
                      >
                        <option value="multiple_choice">Nhiều lựa chọn (4 PA)</option>
                        <option value="true_false">Đúng - Sai (4 ý)</option>
                        <option value="short_answer">Trả lời ngắn</option>
                        <option value="essay">Tự luận</option>
                      </select>
                    </td>

                    {/* Cognitive Level */}
                    <td className="py-2.5 px-2">
                      <select
                        value={row.cognitiveLevel}
                        onChange={(e) => handleUpdateRow(row.id, { cognitiveLevel: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800"
                      >
                        {cognitiveProfile.levels.map(lvl => (
                          <option key={lvl} value={lvl}>
                            {lvl}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Question Count */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min="1"
                        value={row.questionCount}
                        onChange={(e) => handleUpdateRow(row.id, { questionCount: parseInt(e.target.value) || 0 })}
                        className="w-14 text-center border border-slate-300 rounded py-1 text-xs font-semibold focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    {/* Points Per Question */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        step="0.05"
                        min="0.05"
                        value={row.pointsPerQuestion}
                        onChange={(e) => handleUpdateRow(row.id, { pointsPerQuestion: parseFloat(e.target.value) || 0 })}
                        className="w-16 text-center border border-slate-300 rounded py-1 text-xs font-semibold focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    {/* Total Points of Row */}
                    <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                      {row.totalPoints.toFixed(2)}
                    </td>

                    {/* Delete Action */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(row.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Xóa hàng này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Blueprint Footer Totals & Strict Match Check */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <span className="text-slate-600">
              Tổng số câu: <strong className="text-slate-900 text-sm">{totalQuestions} câu</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">
              Mục tiêu khai báo: <strong className="text-slate-900 text-sm">{examInfo.totalScore.toFixed(2)} điểm</strong>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-slate-600 font-medium">Tổng điểm ma trận:</span>
            <span className={`text-base font-extrabold px-3 py-1 rounded-lg border ${
              Math.abs(scoreDifference) < 0.001
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
            }`}>
              {totalScoreCalculated.toFixed(2)} điểm
            </span>
            {Math.abs(scoreDifference) > 0.001 && (
              <span className="text-[11px] font-bold text-rose-600">
                (Lệch: {scoreDifference > 0 ? '+' : ''}{scoreDifference.toFixed(2)} điểm)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Custom Profile Modal */}
      {showCustomProfileModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Tạo Profile Mức độ Nhận thức Tùy biến
            </h3>
            <p className="text-xs text-slate-500">
              Giáo viên tự quy định các mức nhận thức phù hợp với chương trình nhà trường hoặc mục đích đánh giá riêng.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên Profile
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Khung Đánh giá Chuyên đề Nâng cao..."
                  value={customProfileName}
                  onChange={(e) => setCustomProfileName(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Các mức độ (phân tách bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Tái hiện, Kết nối, Phản biện"
                  value={customLevelsText}
                  onChange={(e) => setCustomLevelsText(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomProfileModal(false)}
                className="text-xs text-slate-600 px-3 py-1.5 rounded-lg border border-slate-300"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveCustomProfile}
                className="text-xs font-semibold bg-indigo-600 text-white px-4 py-1.5 rounded-lg"
              >
                Lưu Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 px-4 py-2.5 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Bước 3</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center space-x-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition-colors shadow-xs"
        >
          <span>Tiếp tục: Bước 5 – Kiểm tra & xác nhận</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
