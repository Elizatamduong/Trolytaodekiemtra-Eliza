import React, { useState } from 'react';
import { CreationMode, SourceDocument, TemplateAnalysis, TemplateSectionAnalysis } from '../types/assessment';
import { 
  FileText, Upload, CheckCircle2, AlertTriangle, Eye, Plus, 
  Trash2, ArrowLeft, ArrowRight, ShieldAlert, Sparkles, Layers,
  HelpCircle, Edit2, FileSpreadsheet
} from 'lucide-react';

interface Step3FilesProps {
  creationMode: CreationMode;
  templateAnalysis: TemplateAnalysis | null;
  onUpdateTemplateAnalysis: (analysis: TemplateAnalysis | null) => void;
  sourceDocuments: SourceDocument[];
  onUpdateSourceDocuments: (docs: SourceDocument[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3Files: React.FC<Step3FilesProps> = ({
  creationMode,
  templateAnalysis,
  onUpdateTemplateAnalysis,
  sourceDocuments,
  onUpdateSourceDocuments,
  onNext,
  onBack,
}) => {
  const [analyzingTemplate, setAnalyzingTemplate] = useState(false);
  const [templateInputText, setTemplateInputText] = useState('');
  const [showTemplateTextInput, setShowTemplateTextInput] = useState(false);

  const [analyzingSource, setAnalyzingSource] = useState(false);
  const [sourceInputText, setSourceInputText] = useState('');
  const [sourceFileName, setSourceFileName] = useState('');
  const [showSourceTextInput, setShowSourceTextInput] = useState(false);

  // File Upload Handlers for Area A (Template)
  const handleTemplateFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzingTemplate(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const textContent = typeof reader.result === 'string' ? reader.result : '';
        await runAnalyzeTemplate(file.name, textContent);
      };
      reader.readAsText(file);
    } catch (err) {
      console.error(err);
      setAnalyzingTemplate(false);
    }
  };

  const handleTemplatePasteSubmit = async () => {
    if (!templateInputText.trim()) return;
    setAnalyzingTemplate(true);
    await runAnalyzeTemplate('Đề_mẫu_dan_van_ban.txt', templateInputText);
    setShowTemplateTextInput(false);
  };

  const loadSampleTemplate = async () => {
    setAnalyzingTemplate(true);
    const sampleText = `ĐỀ KIỂM TRA ĐỊNH KÌ TOÁN 12 - THỜI GIAN 50 PHÚT
PHẦN I: Câu trắc nghiệm nhiều phương án lựa chọn (Thí sinh trả lời từ câu 1 đến câu 12. Mỗi câu hỏi thí sinh chỉ chọn một phương án). Mỗi câu 0,25 điểm. Tổng 3,0 điểm.
PHẦN II: Câu trắc nghiệm đúng sai (Thí sinh trả lời từ câu 1 đến câu 4. Trong mỗi ý a, b, c, d ở mỗi câu, thí sinh chọn đúng hoặc sai). Mỗi câu 1,0 điểm. Tổng 4,0 điểm.
PHẦN III: Câu trắc nghiệm trả lời ngắn (Thí sinh trả lời từ câu 1 đến câu 6). Mỗi câu 0,5 điểm. Tổng 3,0 điểm.
(Ghi chú: Đề thi không ghi nhãn mức độ nhận thức cho từng câu).`;

    await runAnalyzeTemplate('De_mau_Toan12_GDPT2018.docx', sampleText);
  };

  const runAnalyzeTemplate = async (name: string, content: string) => {
    try {
      const resp = await fetch('/api/analyze-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: name,
          textContent: content
        })
      });
      const data = await resp.json();
      if (resp.ok) {
        onUpdateTemplateAnalysis(data);
      } else {
        alert(data.error || 'Lỗi phân tích đề mẫu');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingTemplate(false);
    }
  };

  const handleUpdateSection = (sectionId: string, updatedFields: Partial<TemplateSectionAnalysis>) => {
    if (!templateAnalysis) return;
    const updatedSections = templateAnalysis.sections.map(s => {
      if (s.id === sectionId) {
        const merged = { ...s, ...updatedFields };
        merged.totalPoints = Number((merged.questionCount * merged.pointsPerQuestion).toFixed(2));
        return merged;
      }
      return s;
    });

    const newTotal = updatedSections.reduce((sum, s) => sum + s.totalPoints, 0);

    onUpdateTemplateAnalysis({
      ...templateAnalysis,
      sections: updatedSections,
      detectedTotalScore: Number(newTotal.toFixed(2))
    });
  };

  const handleConfirmTemplate = () => {
    if (!templateAnalysis) return;
    onUpdateTemplateAnalysis({
      ...templateAnalysis,
      isConfirmed: true
    });
  };

  // Handlers for Area B (Source Documents)
  const handleSourceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const text = typeof reader.result === 'string' ? reader.result : '';
        await runAnalyzeSource(file.name, text);
      };
      reader.readAsText(file);
    });
  };

  const handleSourcePasteSubmit = async () => {
    if (!sourceInputText.trim()) return;
    const name = sourceFileName.trim() || `Tu_lieu_nguon_${sourceDocuments.length + 1}.txt`;
    await runAnalyzeSource(name, sourceInputText);
    setSourceInputText('');
    setSourceFileName('');
    setShowSourceTextInput(false);
  };

  const loadSampleSourceDoc = async () => {
    const text = `TƯ LIỆU BÀI HỌC: TÍNH ĐƠN ĐIỆU VÀ CỰC TRỊ CỦA HÀM SỐ
1. TÍNH ĐƠN ĐIỆU CỦA HÀM SỐ:
- Định nghĩa: Hàm số f(x) đồng biến trên K nếu mọi x1 < x2 thuộc K thì f(x1) < f(x2).
- Mối liên hệ đạo hàm: Cho f(x) có đạo hàm trên K. Nếu f'(x) > 0 với mọi x thuộc K thì f(x) đồng biến trên K. Nếu f'(x) < 0 với mọi x thuộc K thì f(x) nghịch biến trên K.
- Hàm phân thức bậc nhất y = (ax+b)/(cx+d) có y' = (ad-bc)/(cx+d)^2. Đồng biến trên từng khoảng xác định khi ad-bc > 0, nghịch biến khi ad-bc < 0.

2. CỰC TRỊ CỦA HÀM SỐ:
- Điểm cực đại, điểm cực tiểu: f'(x) đổi dấu từ dương sang âm qua x0 thì x0 là điểm cực đại. f'(x) đổi dấu từ âm sang dương qua x0 thì x0 là điểm cực tiểu.
- Hàm số bậc ba y = ax^3 + bx^2 + cx + d có tối đa 2 điểm cực trị (khi phương trình y'=0 có 2 nghiệm phân biệt).

[LỖI TRANG] Trang 3: Bản in bị nhòe hình vẽ đồ thị hàm số và mất công thức tham số m ở ví dụ 4.`;

    await runAnalyzeSource('Tu_lieu_chuan_Toan12_KhaoSat.docx', text);
  };

  const runAnalyzeSource = async (name: string, content: string) => {
    setAnalyzingSource(true);
    try {
      const resp = await fetch('/api/analyze-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: [{ fileName: name, contentSnippet: content }]
        })
      });
      const data = await resp.json();
      if (resp.ok && data.documents) {
        onUpdateSourceDocuments([...sourceDocuments, ...data.documents]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingSource(false);
    }
  };

  const toggleConfirmSource = (docId: string) => {
    const updated = sourceDocuments.map(doc => {
      if (doc.id === docId) {
        return { ...doc, isConfirmedAsSource: !doc.isConfirmedAsSource };
      }
      return doc;
    });
    onUpdateSourceDocuments(updated);
  };

  const removeSourceDoc = (docId: string) => {
    onUpdateSourceDocuments(sourceDocuments.filter(d => d.id !== docId));
  };

  const confirmedSourcesCount = sourceDocuments.filter(d => d.isConfirmedAsSource).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Overview Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Bước 3 – Quản lý file: Đề mẫu & Tư liệu nguồn kiến thức
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Phân định rạch ròi giữa Nguồn cấu trúc (Khu A) và Nguồn kiến thức (Khu B). Không dùng kiến thức trong đề mẫu để tạo câu hỏi trừ khi được xác nhận.
            </p>
          </div>
          <div className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-medium self-start sm:self-auto">
            Chế độ: <span className="font-bold text-indigo-700">{creationMode === 'template' ? 'Cách 1 – Tạo theo đề mẫu' : 'Cách 2 – Tự thiết lập cấu trúc'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ================= KHU A: ĐỀ MẪU ================= */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                  A
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  KHU A – ĐỀ MẪU
                </h3>
              </div>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                Nguồn Cấu trúc
              </span>
            </div>

            {/* Prominent Mandatory Notice */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg mb-4 text-xs text-amber-900 font-medium leading-relaxed">
              ⚠️ <strong>Lưu ý chuyên môn bắt buộc:</strong> Đề mẫu chỉ dùng để bóc tách cấu trúc (số phần, dạng câu, số câu, cách chia điểm). Không mặc định dùng làm nguồn kiến thức tạo câu hỏi mới.
            </div>

            {/* Upload Area for Template */}
            {!templateAnalysis ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors bg-slate-50/50">
                  <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">
                    Tải file đề mẫu (DOC, DOCX, PDF, Ảnh JPG/PNG)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 mb-4">
                    AI sẽ bóc tách các phần thi, dạng câu hỏi và phân bổ điểm.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <label className="cursor-pointer text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors shadow-2xs">
                      <span>Chọn file từ máy</span>
                      <input
                        type="file"
                        accept=".doc,.docx,.pdf,.png,.jpg,.jpeg,.txt"
                        onChange={handleTemplateFileUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowTemplateTextInput(!showTemplateTextInput)}
                      className="text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg transition-colors"
                    >
                      Dán văn bản đề
                    </button>
                    <button
                      type="button"
                      onClick={loadSampleTemplate}
                      className="text-xs font-semibold bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Nạp đề mẫu chuẩn Toán 12</span>
                    </button>
                  </div>
                </div>

                {showTemplateTextInput && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                    <textarea
                      rows={5}
                      placeholder="Dán nội dung đề mẫu vào đây..."
                      value={templateInputText}
                      onChange={(e) => setTemplateInputText(e.target.value)}
                      className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowTemplateTextInput(false)}
                        className="text-xs text-slate-500 px-2 py-1"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={handleTemplatePasteSubmit}
                        disabled={analyzingTemplate}
                        className="text-xs font-semibold bg-indigo-600 text-white px-3 py-1 rounded-md"
                      >
                        {analyzingTemplate ? 'Đang phân tích...' : 'Phân tích văn bản'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Editable Template Analysis Result Table */
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <span className="font-semibold text-slate-900 block truncate max-w-[200px]">
                      {templateAnalysis.fileName}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Tổng số phần: {templateAnalysis.sections.length} | Tổng điểm: {templateAnalysis.detectedTotalScore} điểm
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdateTemplateAnalysis(null)}
                    className="text-xs text-slate-500 hover:text-rose-600 font-medium"
                  >
                    Đổi file khác
                  </button>
                </div>

                {/* Cognitive Ambiguity Warning */}
                {templateAnalysis.hasAmbiguousLevels && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Cảnh báo tính minh bạch khảo thí:</span>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        {templateAnalysis.ambiguityNote || 'Đề mẫu không phân định rõ mức độ nhận thức cho từng câu. Hệ thống không tự ý đoán mức độ và chuyển quyền xác nhận cho giáo viên.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Editable Section Table */}
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="min-w-full text-xs divide-y divide-slate-200">
                    <thead className="bg-slate-50 text-slate-700">
                      <tr>
                        <th className="py-2 px-2.5 text-left font-semibold">Tên phần & Dạng câu</th>
                        <th className="py-2 px-2 text-center font-semibold">Số câu</th>
                        <th className="py-2 px-2 text-center font-semibold">Điểm/câu</th>
                        <th className="py-2 px-2 text-center font-semibold">Tổng điểm</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {templateAnalysis.sections.map((sec) => (
                        <tr key={sec.id} className="hover:bg-slate-50/70">
                          <td className="py-2 px-2.5">
                            <span className="font-semibold text-slate-900 block truncate max-w-[150px]">
                              {sec.name}
                            </span>
                            <span className="text-[10px] text-indigo-600 font-medium uppercase">
                              {sec.questionType} {sec.subStatementsCount ? `(${sec.subStatementsCount} ý)` : ''}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              min="1"
                              value={sec.questionCount}
                              onChange={(e) => handleUpdateSection(sec.id, { questionCount: parseInt(e.target.value) || 1 })}
                              className="w-12 text-center border border-slate-300 rounded py-0.5 text-xs"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              step="0.05"
                              value={sec.pointsPerQuestion}
                              onChange={(e) => handleUpdateSection(sec.id, { pointsPerQuestion: parseFloat(e.target.value) || 0 })}
                              className="w-14 text-center border border-slate-300 rounded py-0.5 text-xs"
                            />
                          </td>
                          <td className="py-2 px-2 text-center font-bold text-slate-800">
                            {sec.totalPoints.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-slate-600">
                    Tổng điểm đề mẫu:{' '}
                    <span className="font-bold text-slate-900">
                      {templateAnalysis.detectedTotalScore.toFixed(2)} điểm
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleConfirmTemplate}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-colors ${
                      templateAnalysis.isConfirmed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{templateAnalysis.isConfirmed ? 'Đã xác nhận cấu trúc' : 'Xác nhận cấu trúc đề mẫu'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Khu A hoàn tất khi bạn xác nhận cấu trúc sẽ kế thừa sang Bước 4.
          </div>
        </div>

        {/* ================= KHU B: TƯ LIỆU NGUỒN ================= */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  B
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  KHU B – TƯ LIỆU NGUỒN
                </h3>
              </div>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                Nguồn Kiến thức
              </span>
            </div>

            {/* Mandatory Instruction */}
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-r-lg mb-4 text-xs text-emerald-950 font-medium leading-relaxed">
              📘 <strong>Nguyên tắc nguồn có kiểm soát:</strong> Dùng làm nguồn kiến thức để tạo câu hỏi. Chỉ những tài liệu có trạng thái "Đã xác nhận làm nguồn" mới được AI sử dụng. Nếu file có lỗi, mờ hoặc mất công thức, hệ thống sẽ cảnh báo chính xác vị trí!
            </div>

            {/* Upload & Actions */}
            <div className="space-y-3 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-1.5 shadow-2xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Tải tư liệu học tập</span>
                  <input
                    type="file"
                    multiple
                    accept=".doc,.docx,.pdf,.txt"
                    onChange={handleSourceUpload}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setShowSourceTextInput(!showSourceTextInput)}
                  className="text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg transition-colors"
                >
                  + Dán bài giảng / SGK
                </button>
                <button
                  type="button"
                  onClick={loadSampleSourceDoc}
                  className="text-xs font-semibold bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 px-3 py-2 rounded-lg transition-colors flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tải tư liệu mẫu (Kèm cảnh báo lỗi trang)</span>
                </button>
              </div>

              {showSourceTextInput && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                  <input
                    type="text"
                    placeholder="Tên tài liệu / bài học..."
                    value={sourceFileName}
                    onChange={(e) => setSourceFileName(e.target.value)}
                    className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
                  />
                  <textarea
                    rows={4}
                    placeholder="Dán nội dung kiến thức chuẩn xác từ SGK hoặc đề cương..."
                    value={sourceInputText}
                    onChange={(e) => setSourceInputText(e.target.value)}
                    className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowSourceTextInput(false)}
                      className="text-xs text-slate-500 px-2 py-1"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={handleSourcePasteSubmit}
                      className="text-xs font-semibold bg-emerald-600 text-white px-3 py-1 rounded-md"
                    >
                      Thêm vào danh sách nguồn
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Source Documents List */}
            {sourceDocuments.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-500 bg-slate-50/40">
                Chưa có tư liệu học tập nào được tải lên. Nhấn nút bên trên để nạp tư liệu kiến thức hoặc dán văn bản bài học.
              </div>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {sourceDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className={`rounded-xl border p-3.5 text-xs transition-all ${
                      doc.isConfirmedAsSource
                        ? 'border-emerald-300 bg-emerald-50/20 ring-1 ring-emerald-500/20'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-start space-x-2">
                        <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${doc.isConfirmedAsSource ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <div>
                          <span className="font-semibold text-slate-900 block truncate max-w-[220px]">
                            {doc.fileName}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Ước lượng: {doc.pageCount} trang ({Math.round(doc.fileSize / 1024 * 10) / 10} KB)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleConfirmSource(doc.id)}
                          className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-colors flex items-center space-x-1 ${
                            doc.isConfirmedAsSource
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-300'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{doc.isConfirmedAsSource ? 'Đã xác nhận làm nguồn' : 'Xác nhận làm nguồn'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSourceDoc(doc.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Detected Topics */}
                    <div className="mb-2">
                      <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Chủ đề nhận diện trong file:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {doc.recognizedTopics.map((top, tIdx) => (
                          <span key={tIdx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                            {top}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Defect Warnings (Blur, Corrupted formulas, Missing pages) */}
                    {doc.errorPages && doc.errorPages.length > 0 && (
                      <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-[11px] text-rose-900 mt-2 space-y-1">
                        <div className="flex items-center space-x-1.5 font-bold text-rose-700">
                          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                          <span>Cảnh báo khu vực mờ / lỗi trang / mất công thức:</span>
                        </div>
                        {doc.errorPages.map((err, eIdx) => (
                          <div key={eIdx} className="pl-5 text-rose-800">
                            • Trang {err.pageNumber}: {err.reason} ({err.locationSnippet})
                          </div>
                        ))}
                        <p className="text-[10px] text-rose-700 italic pl-5 mt-1 font-medium">
                          Hệ thống không tự ý suy đoán dữ liệu bị thiếu. Yêu cầu giáo viên xác nhận phạm vi trước khi tạo câu hỏi.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] flex items-center justify-between text-slate-500">
            <span>
              Đã xác nhận nguồn: <strong className="text-emerald-700">{confirmedSourcesCount} tài liệu</strong>
            </span>
            {confirmedSourcesCount === 0 && (
              <span className="text-amber-600 font-medium">
                Cần xác nhận ít nhất 1 tài liệu hoặc sử dụng phạm vi kiến thức đã nhập.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 px-4 py-2.5 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Bước 2</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center space-x-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition-colors shadow-xs"
        >
          <span>Tiếp tục: Bước 4 – Thiết lập cấu trúc</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
