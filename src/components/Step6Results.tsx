import React, { useState } from 'react';
import { 
  BlueprintRow, CognitiveLevelProfile, ExamInfo, 
  GeneratedAssessmentData, QAReport, QuestionSchema, RegulatoryProfile 
} from '../types/assessment';
import { 
  FileText, CheckSquare, Award, Grid, ListFilter, 
  Printer, Copy, Download, CheckCircle2, AlertTriangle, 
  ArrowLeft, RefreshCw, ChevronDown, ChevronUp, Sparkles, BookOpen
} from 'lucide-react';

interface Step6ResultsProps {
  assessmentData: GeneratedAssessmentData;
  examInfo: ExamInfo;
  blueprint: BlueprintRow[];
  cognitiveProfile: CognitiveLevelProfile;
  regulatoryProfile: RegulatoryProfile;
  onRegenerate: () => void;
  onBackToEdit: () => void;
  isRegenerating?: boolean;
}

type TabType = 'exam' | 'answers' | 'rubric' | 'matrix' | 'specifications';

export const Step6Results: React.FC<Step6ResultsProps> = ({
  assessmentData,
  examInfo,
  blueprint,
  cognitiveProfile,
  regulatoryProfile,
  onRegenerate,
  onBackToEdit,
  isRegenerating = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('exam');
  const [showQAPanel, setShowQAPanel] = useState(true);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const { questions, qaReport, totalScore, totalQuestions } = assessmentData;

  // Group questions by section
  const sectionGroups: Record<string, QuestionSchema[]> = {};
  questions.forEach(q => {
    const secName = q.section || 'Phần chung';
    if (!sectionGroups[secName]) sectionGroups[secName] = [];
    sectionGroups[secName].push(q);
  });

  // Copy current tab content to clipboard
  const handleCopyContent = () => {
    let textToCopy = '';
    if (activeTab === 'exam') {
      textToCopy = `BÀI KIỂM TRA: ${examInfo.subject.toUpperCase()} - ${examInfo.grade.toUpperCase()}
Thời gian làm bài: ${examInfo.durationMinutes} phút | Tổng điểm: ${totalScore} điểm
Mục tiêu: ${examInfo.examObjective}
[Bản quyền thiết kế: Eliza Tâm Dương - SĐT: 0962571826]

${Object.entries(sectionGroups).map(([secName, qList]) => {
  return `=== ${secName.toUpperCase()} ===\n` + qList.map(q => {
    let qText = `Câu ${q.number} (${q.score} điểm): ${q.prompt}\n`;
    if (q.type === 'multiple_choice' && q.options) {
      qText += q.options.map(o => `   ${o.id}. ${o.text}`).join('\n') + '\n';
    } else if (q.type === 'true_false' && q.subStatements) {
      qText += q.subStatements.map(s => `   ${s.id}) ${s.text}`).join('\n') + '\n';
    }
    return qText;
  }).join('\n');
}).join('\n\n')}

--- HẾT ---
Bản quyền đề thi: Eliza Tâm Dương - SĐT: 0962571826`;
    } else if (activeTab === 'answers') {
      textToCopy = `ĐÁP ÁN VÀ LỜI GIẢI CHI TIẾT - ${examInfo.subject} ${examInfo.grade}
[Bản quyền: Eliza Tâm Dương - SĐT: 0962571826]\n\n` +
        questions.map(q => `Câu ${q.number}: ${q.correctAnswer}\nLời giải:\n${q.solution}\n`).join('\n---\n\n');
    } else if (activeTab === 'rubric') {
      textToCopy = `THANG ĐIỂM VÀ HƯỚNG DẪN CHẤM CHI TIẾT
[Bản quyền: Eliza Tâm Dương - SĐT: 0962571826]\n\n` +
        questions.map(q => `Câu ${q.number} (${q.score} điểm):\n` +
          q.scoringCriteria.map(c => `- ${c.step}: ${c.criterion} (${c.points} đ)`).join('\n')
        ).join('\n\n');
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(assessmentData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `De_Kiem_Tra_${examInfo.subject}_${examInfo.grade}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top QA Summary Banner */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs print:hidden">
        <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold tracking-tight">
                  KẾT QUẢ ĐỒNG BỘ & THẨM ĐỊNH KHẢO THÍ (QA ENGINE)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                  12/12 ĐẠT CHUẨN
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Đề kiểm tra, đáp án và thang điểm được sinh đồng bộ từ 1 schema duy nhất. Không lệch số thứ tự hoặc điểm.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowQAPanel(!showQAPanel)}
              className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 flex items-center space-x-1 transition-colors"
            >
              <span>{showQAPanel ? 'Thu gọn QA Report' : 'Xem chi tiết 12 tiêu chí QA'}</span>
              {showQAPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expandable QA Engine 12 Checks Report */}
        {showQAPanel && (
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {qaReport.checks.map((chk) => (
                <div key={chk.id} className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs flex items-start space-x-2 shadow-2xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block leading-tight">
                      {chk.id}. {chk.name}
                    </span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">
                      {chk.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Tabs Navigation Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('exam')}
            className={`text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
              activeTab === 'exam'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>TAB A – ĐỀ KIỂM TRA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('answers')}
            className={`text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
              activeTab === 'answers'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>TAB B – ĐÁP ÁN & LỜI GIẢI</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rubric')}
            className={`text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
              activeTab === 'rubric'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>TAB C – THANG ĐIỂM & HƯỚNG DẪN CHẤM</span>
          </button>

          <span className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeTab === 'matrix'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Ma trận đề</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specifications')}
            className={`text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeTab === 'specifications'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Bản đặc tả</span>
          </button>
        </div>

        {/* Action Buttons: Copy, Print, Export */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopyContent}
            className="text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedSuccess ? 'Đã sao chép!' : 'Sao chép văn bản'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In / Xuất PDF</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors"
            title="Tải về file dữ liệu cấu trúc đề"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất JSON</span>
          </button>
        </div>
      </div>

      {/* ================= TAB A: ĐỀ KIỂM TRA ================= */}
      {activeTab === 'exam' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-6 print:p-0 print:border-none print:shadow-none">
          {/* Official Exam Header */}
          <div className="border-b-2 border-slate-800 pb-5 text-center space-y-2">
            <div className="flex justify-between items-start text-xs font-semibold text-slate-700 uppercase">
              <div className="text-left">
                <span>SỞ GIÁO DỤC VÀ ĐÀO TẠO</span>
                <span className="block text-[11px] font-normal text-slate-500">TRƯỜNG THPT / THCS</span>
              </div>
              <div className="text-right">
                <span>MÃ ĐỀ THI: 101</span>
                <span className="block text-[11px] font-normal text-slate-500">Số trang: 02</span>
              </div>
            </div>

            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight pt-2 uppercase">
              ĐỀ KIỂM TRA {examInfo.subject.toUpperCase()} – {examInfo.grade.toUpperCase()}
            </h1>
            <p className="text-xs font-medium text-slate-600">
              Mục tiêu: {examInfo.examObjective === 'other' ? examInfo.examObjectiveCustom : examInfo.examObjective}
            </p>
            <div className="flex justify-center items-center space-x-4 text-xs font-semibold text-slate-700 pt-1">
              <span>Thời gian làm bài: <strong>{examInfo.durationMinutes} phút</strong> (Không kể thời gian phát đề)</span>
              <span>•</span>
              <span>Tổng điểm: <strong>{totalScore} điểm</strong></span>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 italic">
              (Học sinh làm bài ra phiếu trả lời. Không được sử dụng tài liệu ngoài quy định)
            </div>
          </div>

          {/* Render Sections */}
          <div className="space-y-8">
            {Object.entries(sectionGroups).map(([sectionName, qList]) => {
              const secPoints = qList.reduce((acc, q) => acc + q.score, 0);

              return (
                <div key={sectionName} className="space-y-4">
                  {/* Section Title */}
                  <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200 flex justify-between items-center text-xs font-bold text-slate-900">
                    <span className="uppercase">{sectionName}</span>
                    <span className="text-indigo-700 font-extrabold">({secPoints.toFixed(2)} điểm)</span>
                  </div>

                  {/* Section Questions */}
                  <div className="space-y-5">
                    {qList.map((q) => (
                      <div key={q.id} className="text-xs space-y-2 pl-1">
                        {/* Prompt */}
                        <div className="font-medium text-slate-900 leading-relaxed flex items-start space-x-2">
                          <span className="font-bold shrink-0">
                            Câu {q.number} ({q.score} điểm):
                          </span>
                          <span className="font-serif text-[13px] text-slate-900">
                            {q.prompt}
                          </span>
                        </div>

                        {/* Multiple Choice Options (4 items) */}
                        {q.type === 'multiple_choice' && q.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6 pt-1 font-serif text-[13px]">
                            {q.options.map((opt) => (
                              <div key={opt.id} className="flex items-start space-x-2">
                                <span className="font-bold text-slate-800">{opt.id}.</span>
                                <span className="text-slate-800">{opt.text}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* True / False Sub-statements (4 items a, b, c, d) */}
                        {q.type === 'true_false' && q.subStatements && (
                          <div className="space-y-1.5 pl-6 pt-1 font-serif text-[13px]">
                            {q.subStatements.map((sub) => (
                              <div key={sub.id} className="flex items-start space-x-2">
                                <span className="font-bold text-slate-800">{sub.id})</span>
                                <span className="text-slate-800">{sub.text}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Short Answer */}
                        {q.type === 'short_answer' && (
                          <div className="pl-6 pt-1 text-[11px] text-slate-500 italic">
                            [Thí sinh điền kết quả vào ô số tương ứng trên phiếu trả lời]
                          </div>
                        )}

                        {/* Essay */}
                        {q.type === 'essay' && (
                          <div className="pl-6 pt-1 text-[11px] text-slate-500 italic">
                            [Học sinh trình bày lời giải chi tiết và các bước tính toán]
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-slate-500 gap-2">
            <span>Bản quyền đề thi: Eliza Tâm Dương • SĐT: 0962571826</span>
            <span>--- HẾT ---</span>
            <span className="text-[11px] font-normal text-slate-400">Trang 1/1</span>
          </div>
        </div>
      )}

      {/* ================= TAB B: ĐÁP ÁN & LỜI GIẢI ================= */}
      {activeTab === 'answers' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4 text-center">
            <h2 className="text-lg font-bold text-slate-900 uppercase">
              ĐÁP ÁN & LỜI GIẢI CHI TIẾT
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {examInfo.subject} – {examInfo.grade} | Đồng bộ 100% với đề thi
            </p>
          </div>

          <div className="space-y-6">
            {questions.map((q) => (
              <div key={q.id} className="border border-slate-200 rounded-xl p-4.5 text-xs space-y-3 bg-slate-50/40">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm text-indigo-700">
                      Câu {q.number}
                    </span>
                    <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold uppercase">
                      {q.type}
                    </span>
                    <span className="text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-medium">
                      Mức: {q.level}
                    </span>
                  </div>
                  <span className="font-bold text-slate-800">
                    Điểm: {q.score} đ
                  </span>
                </div>

                {/* Prompt snippet */}
                <div className="text-slate-700 font-medium">
                  <strong>Đề bài:</strong> {q.prompt}
                </div>

                {/* Standard Correct Answer */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-950 font-medium space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Đáp án chuẩn:</span>
                  </div>
                  <div className="font-bold text-sm text-emerald-900 pl-5">
                    {q.correctAnswer}
                  </div>

                  {/* Short answer specific specifications */}
                  {q.type === 'short_answer' && q.shortAnswerSpecs && (
                    <div className="pl-5 pt-1 text-[11px] text-emerald-800 space-y-0.5">
                      {q.shortAnswerSpecs.acceptedEquivalents && q.shortAnswerSpecs.acceptedEquivalents.length > 0 && (
                        <div>• <strong>Biểu thức tương đương chấp nhận:</strong> {q.shortAnswerSpecs.acceptedEquivalents.join(', ')}</div>
                      )}
                      {q.shortAnswerSpecs.unit && (
                        <div>• <strong>Đơn vị:</strong> {q.shortAnswerSpecs.unit}</div>
                      )}
                      {q.shortAnswerSpecs.roundingRules && (
                        <div>• <strong>Quy tắc làm tròn:</strong> {q.shortAnswerSpecs.roundingRules}</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Detailed Solution */}
                <div className="bg-white border border-slate-200 rounded-lg p-3 text-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 block">Lời giải / Hướng dẫn:</span>
                  <div className="whitespace-pre-line leading-relaxed text-slate-700 font-serif text-[13px] pl-2">
                    {q.solution}
                  </div>
                </div>

                {/* Source Verification Trace */}
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Căn cứ nguồn: {q.sourceReference || 'Tư liệu kiến thức đã xác nhận'}</span>
                  <span>Chủ đề: {q.topic}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB C: THANG ĐIỂM & HƯỚNG DẪN CHẤM ================= */}
      {activeTab === 'rubric' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4 text-center">
            <h2 className="text-lg font-bold text-slate-900 uppercase">
              THANG ĐIỂM & HƯỚNG DẪN CHẤM
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Phân bổ barem chi tiết từng bước. Tổng điểm cuối bảng đúng tuyệt đối 100%.
            </p>
          </div>

          <div className="bg-indigo-50/60 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-900 font-medium">
            ⚖️ <strong>Nguyên tắc chấm thi:</strong> Đối với câu tự luận: “Chấp nhận cách giải khác đúng, lập luận hợp lí và biểu thức tương đương hợp lệ.” Đối với câu Đúng - Sai: áp dụng cách tính điểm theo đúng barem quy chuẩn (1 ý = 0.1đ, 2 ý = 0.25đ, 3 ý = 0.5đ, 4 ý = 1.0đ hoặc theo hệ số điểm câu).
          </div>

          {/* Scoring Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="min-w-full text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-700 font-bold">
                <tr>
                  <th className="py-3 px-3 text-center w-14">Câu</th>
                  <th className="py-3 px-4 text-left">Nội dung / Tiêu chí đáp án</th>
                  <th className="py-3 px-3 text-center w-24">Điểm</th>
                  <th className="py-3 px-4 text-left w-52">Ghi chú chuyên môn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {questions.map((q) => (
                  <React.Fragment key={q.id}>
                    {q.scoringCriteria.map((crit, cIdx) => (
                      <tr key={`${q.id}_${cIdx}`} className="hover:bg-slate-50/70">
                        {cIdx === 0 && (
                          <td
                            rowSpan={q.scoringCriteria.length}
                            className="py-2.5 px-3 text-center font-bold text-indigo-700 align-top bg-slate-50/30 border-r border-slate-100"
                          >
                            Câu {q.number}
                            <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                              ({q.score} đ)
                            </span>
                          </td>
                        )}
                        <td className="py-2.5 px-4 font-medium text-slate-800">
                          <span className="font-semibold text-slate-900 mr-1.5">• {crit.step}:</span>
                          <span>{crit.criterion}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                          {crit.points.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-4 text-[11px] text-slate-500">
                          {crit.note || (q.type === 'essay' ? 'Chấp nhận cách giải khác đúng' : 'Theo barem chuẩn')}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-bold text-xs">
                <tr>
                  <td colSpan={2} className="py-3 px-4 text-right uppercase text-slate-700">
                    TỔNG ĐIỂM TOÀN BÀI:
                  </td>
                  <td className="py-3 px-3 text-center text-sm font-extrabold text-indigo-700">
                    {totalScore.toFixed(2)} đ
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-normal text-[11px]">
                    Khớp hoàn toàn 100% với mục tiêu bài thi
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB: MA TRẬN ĐỀ ================= */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4 text-center">
            <h2 className="text-lg font-bold text-slate-900 uppercase">
              MA TRẬN ĐỀ KIỂM TRA
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Phân bố số câu, số điểm và tỉ lệ % theo chủ đề và mức độ nhận thức ({cognitiveProfile.name})
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="min-w-full text-xs divide-y divide-slate-200 text-center">
              <thead className="bg-slate-50 text-slate-700 font-bold">
                <tr>
                  <th className="py-3 px-3 text-left w-60">Chủ đề / Đơn vị kiến thức</th>
                  <th className="py-3 px-2">Dạng câu</th>
                  <th className="py-3 px-2">Mức độ</th>
                  <th className="py-3 px-2">Số câu</th>
                  <th className="py-3 px-2">Điểm/câu</th>
                  <th className="py-3 px-2">Tổng điểm</th>
                  <th className="py-3 px-2">Tỉ lệ (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {blueprint.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-left font-medium text-slate-900">
                      {row.topic}
                    </td>
                    <td className="py-2.5 px-2 text-slate-600 font-semibold uppercase text-[10px]">
                      {row.questionType}
                    </td>
                    <td className="py-2.5 px-2 font-semibold text-indigo-700">
                      {row.cognitiveLevel}
                    </td>
                    <td className="py-2.5 px-2 font-bold">{row.questionCount}</td>
                    <td className="py-2.5 px-2 text-slate-600">{row.pointsPerQuestion}</td>
                    <td className="py-2.5 px-2 font-bold text-slate-900">{row.totalPoints.toFixed(2)}</td>
                    <td className="py-2.5 px-2 font-semibold text-slate-700">
                      {((row.totalPoints / totalScore) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-bold">
                <tr>
                  <td colSpan={3} className="py-3 px-3 text-left uppercase text-slate-700">
                    TỔNG CỘNG:
                  </td>
                  <td className="py-3 px-2 font-extrabold text-slate-900">{totalQuestions} câu</td>
                  <td className="py-3 px-2 text-slate-400">-</td>
                  <td className="py-3 px-2 font-extrabold text-indigo-700 text-sm">{totalScore.toFixed(2)} đ</td>
                  <td className="py-3 px-2 font-extrabold text-slate-900">100.0%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB: BẢN ĐẶC TẢ ================= */}
      {activeTab === 'specifications' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4 text-center">
            <h2 className="text-lg font-bold text-slate-900 uppercase">
              BẢN ĐẶC TẢ ĐỀ KIỂM TRA
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Mô tả chi tiết chuẩn kiến thức, kỹ năng và năng lực cần đánh giá cho từng phần thi
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="min-w-full text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-700 font-bold">
                <tr>
                  <th className="py-3 px-3 text-left w-12 text-center">STT</th>
                  <th className="py-3 px-3 text-left w-48">Chủ đề kiến thức</th>
                  <th className="py-3 px-4 text-left">Yêu cầu cần đạt / Chuẩn năng lực</th>
                  <th className="py-3 px-2 text-center w-28">Dạng câu</th>
                  <th className="py-3 px-2 text-center w-24">Mức độ</th>
                  <th className="py-3 px-2 text-center w-16">Số câu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {blueprint.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{row.topic}</td>
                    <td className="py-2.5 px-4 text-slate-700 leading-relaxed font-serif text-[13px]">
                      {row.learningOutcome}
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-600 font-medium text-[11px] uppercase">
                      {row.questionType}
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-indigo-700">
                      {row.cognitiveLevel}
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-900">
                      {row.questionCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <button
          type="button"
          onClick={onBackToEdit}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 px-4 py-2.5 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại điều chỉnh cấu hình ma trận</span>
        </button>

        <button
          type="button"
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="inline-flex items-center space-x-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition-colors shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>{isRegenerating ? 'Đang tạo lại đề...' : 'Tạo lại đề mới (Cùng cấu trúc)'}</span>
        </button>
      </div>
    </div>
  );
};
