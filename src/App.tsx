import React, { useState, useEffect } from 'react';
import { 
  BlueprintRow, CognitiveLevelProfile, CreationMode, 
  ExamInfo, GeneratedAssessmentData, RegulatoryProfile, 
  SourceDocument, TemplateAnalysis, ValidationResult 
} from './types/assessment';
import { 
  DEFAULT_COGNITIVE_PROFILES, 
  INITIAL_REGULATORY_PROFILES, 
  SAMPLE_SOURCE_PACKS 
} from './constants/presets';
import { validateAssessmentConfig } from './utils/validation';
import { Header } from './components/Header';
import { Stepper } from './components/Stepper';
import { Step1Info } from './components/Step1Info';
import { Step2Mode } from './components/Step2Mode';
import { Step3Files } from './components/Step3Files';
import { Step4Blueprint } from './components/Step4Blueprint';
import { Step5Validation } from './components/Step5Validation';
import { Step6Results } from './components/Step6Results';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // 1. Exam Info State
  const [examInfo, setExamInfo] = useState<ExamInfo>({
    subject: 'Toán học',
    educationLevel: 'thpt',
    grade: 'Lớp 12',
    examObjective: 'periodic',
    examObjectiveCustom: '',
    durationMinutes: 50,
    knowledgeScope: 'Chương 1: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số.\n- Bài 1: Tính đơn điệu của hàm số (đồng biến, nghịch biến trên khoảng, dấu đạo hàm).\n- Bài 2: Cực trị của hàm số (điểm cực đại, cực tiểu, giá trị cực trị).\n- Giới hạn: Hàm đa thức bậc 3 và hàm phân thức (ax+b)/(cx+d). Không xét hàm vô tỉ phức tạp.',
    learningOutcomes: [
      'Nhận biết tính đồng biến, nghịch biến của hàm số thông qua bảng biến thiên hoặc đồ thị.',
      'Tìm các khoảng đơn điệu của hàm phân thức bậc nhất trên bậc nhất.',
      'Xác định điểm cực trị và giá trị cực trị của hàm số bậc ba từ đạo hàm.',
      'Vận dụng điều kiện cực trị để giải quyết bài toán tham số đơn giản.'
    ],
    totalScore: 10
  });

  // 2. Creation Mode State
  const [creationMode, setCreationMode] = useState<CreationMode>('custom');

  // 3. Template & Source Files State
  const [templateAnalysis, setTemplateAnalysis] = useState<TemplateAnalysis | null>(null);
  const [sourceDocuments, setSourceDocuments] = useState<SourceDocument[]>([]);

  // 4. Cognitive & Regulatory Profiles
  const [cognitiveProfile, setCognitiveProfile] = useState<CognitiveLevelProfile>(DEFAULT_COGNITIVE_PROFILES[0]);
  const [regulatoryProfile, setRegulatoryProfile] = useState<RegulatoryProfile>(INITIAL_REGULATORY_PROFILES[0]);

  // 5. Blueprint State
  const [blueprint, setBlueprint] = useState<BlueprintRow[]>([
    {
      id: 'row_init_1',
      topic: 'Tính đơn điệu của hàm số',
      learningOutcome: 'Nhận biết tính đồng biến, nghịch biến trên khoảng',
      questionType: 'multiple_choice',
      cognitiveLevel: 'Nhận biết',
      questionCount: 8,
      pointsPerQuestion: 0.25,
      totalPoints: 2.0
    },
    {
      id: 'row_init_2',
      topic: 'Cực trị của hàm số',
      learningOutcome: 'Hiểu cách xác định điểm cực trị từ đạo hàm',
      questionType: 'multiple_choice',
      cognitiveLevel: 'Thông hiểu',
      questionCount: 4,
      pointsPerQuestion: 0.25,
      totalPoints: 1.0
    },
    {
      id: 'row_init_3',
      topic: 'Khảo sát và ứng dụng thực tiễn',
      learningOutcome: 'Đánh giá tính đúng sai của các mệnh đề liên quan hàm số',
      questionType: 'true_false',
      cognitiveLevel: 'Thông hiểu',
      questionCount: 4,
      pointsPerQuestion: 1.0,
      totalPoints: 4.0
    },
    {
      id: 'row_init_4',
      topic: 'Bài toán tối ưu và tham số',
      learningOutcome: 'Vận dụng giải bài toán cực trị hoặc giá trị lớn nhất',
      questionType: 'short_answer',
      cognitiveLevel: 'Vận dụng',
      questionCount: 6,
      pointsPerQuestion: 0.5,
      totalPoints: 3.0
    }
  ]);

  // 6. Validation & Generated Assessment State
  const [validationResult, setValidationResult] = useState<ValidationResult>(() => 
    validateAssessmentConfig(examInfo, blueprint, sourceDocuments, cognitiveProfile, regulatoryProfile)
  );

  const [generatedAssessment, setGeneratedAssessment] = useState<GeneratedAssessmentData | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationDeficitError, setGenerationDeficitError] = useState<string | null>(null);

  // Auto-validate whenever relevant state changes
  useEffect(() => {
    const res = validateAssessmentConfig(
      examInfo,
      blueprint,
      sourceDocuments,
      cognitiveProfile,
      regulatoryProfile
    );
    setValidationResult(res);
  }, [examInfo, blueprint, sourceDocuments, cognitiveProfile, regulatoryProfile]);

  // Navigation handlers
  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const markStepCompleted = (stepNumber: number) => {
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps(prev => [...prev, stepNumber]);
    }
  };

  const handleNextFromStep1 = () => {
    markStepCompleted(1);
    setCurrentStep(2);
  };

  const handleNextFromStep2 = () => {
    markStepCompleted(2);
    setCurrentStep(3);
  };

  const handleNextFromStep3 = () => {
    markStepCompleted(3);
    setCurrentStep(4);
  };

  const handleNextFromStep4 = () => {
    markStepCompleted(4);
    setCurrentStep(5);
  };

  // Load sample pack into state
  const handleLoadSamplePack = (packId: string) => {
    const pack = SAMPLE_SOURCE_PACKS.find(p => p.id === packId);
    if (!pack) return;

    setExamInfo(prev => ({
      ...prev,
      subject: pack.subject,
      educationLevel: pack.educationLevel as any,
      grade: pack.grade,
      knowledgeScope: pack.scope,
      learningOutcomes: pack.outcomes
    }));

    // Add source doc
    const newDoc: SourceDocument = {
      id: `doc_sample_${Date.now()}`,
      fileName: pack.name,
      fileSize: pack.sampleContent.length,
      pageCount: 2,
      readStatus: 'success',
      recognizedTopics: pack.outcomes.slice(0, 3),
      errorPages: [],
      isConfirmedAsSource: true,
      contentSnippet: pack.sampleContent
    };

    setSourceDocuments([newDoc]);
  };

  // Generate Exam API trigger
  const handleGenerateExam = async () => {
    setIsGenerating(true);
    setGenerationDeficitError(null);

    try {
      // 1. Generate Assessment Questions & Unified Rubric
      const resp = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examInfo,
          blueprint,
          verifiedSources: sourceDocuments,
          cognitiveProfile,
          regulatoryProfile
        })
      });

      const examData = await resp.json();

      if (!resp.ok) {
        if (resp.status === 422 || examData.deficitError) {
          setGenerationDeficitError(examData.details || examData.message || 'Nguồn hiện tại chưa đủ dữ liệu đáng tin cậy để tạo đủ cấu trúc đã chọn.');
          setIsGenerating(false);
          return;
        }
        alert(examData.error || 'Lỗi khi tạo đề kiểm tra');
        setIsGenerating(false);
        return;
      }

      // 2. Run QA Engine
      const qaResp = await fetch('/api/run-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: examData.questions,
          examInfo,
          blueprint,
          regulatoryProfile
        })
      });

      const qaData = await qaResp.json();

      const assessmentResult: GeneratedAssessmentData = {
        examInfo,
        questions: examData.questions,
        blueprint,
        totalScore: examData.totalScore,
        totalQuestions: examData.totalQuestions,
        qaReport: qaData,
        generatedAt: examData.generatedAt
      };

      setGeneratedAssessment(assessmentResult);
      markStepCompleted(5);
      setCurrentStep(6);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Lỗi kết nối khi tạo đề');
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset entire workflow
  const handleReset = () => {
    if (confirm('Bạn có chắc chắn muốn làm mới toàn bộ cấu hình bài thi?')) {
      setCurrentStep(1);
      setCompletedSteps([]);
      setTemplateAnalysis(null);
      setSourceDocuments([]);
      setGeneratedAssessment(null);
      setCreationMode(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Main Navigation Header */}
      <Header
        validationResult={validationResult}
        onReset={handleReset}
      />

      {/* 6-Step Visual Wizard Bar */}
      <Stepper
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={goToStep}
      />

      {/* Main Content View by Step */}
      <main className="flex-1 pb-16">
        {generationDeficitError && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="bg-rose-50 border-2 border-rose-400 rounded-xl p-4 text-xs text-rose-950 flex items-start space-x-3">
              <span className="text-xl">🛑</span>
              <div className="space-y-1">
                <span className="font-bold text-sm text-rose-900 block">
                  Nguyên tắc Nguồn có kiểm soát từ chối suy đoán:
                </span>
                <p className="text-rose-800 leading-relaxed">
                  {generationDeficitError}
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline"
                  >
                    → Đến Bước 3 để tải thêm hoặc xác nhận tư liệu kiến thức
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <Step1Info
            examInfo={examInfo}
            onChange={(updated) => setExamInfo(prev => ({ ...prev, ...updated }))}
            onNext={handleNextFromStep1}
            onLoadSamplePack={handleLoadSamplePack}
          />
        )}

        {currentStep === 2 && (
          <Step2Mode
            creationMode={creationMode}
            onSelectMode={setCreationMode}
            onNext={handleNextFromStep2}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3Files
            creationMode={creationMode}
            templateAnalysis={templateAnalysis}
            onUpdateTemplateAnalysis={setTemplateAnalysis}
            sourceDocuments={sourceDocuments}
            onUpdateSourceDocuments={setSourceDocuments}
            onNext={handleNextFromStep3}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <Step4Blueprint
            creationMode={creationMode}
            examInfo={examInfo}
            blueprint={blueprint}
            onChangeBlueprint={setBlueprint}
            cognitiveProfile={cognitiveProfile}
            onChangeCognitiveProfile={setCognitiveProfile}
            regulatoryProfile={regulatoryProfile}
            templateAnalysis={templateAnalysis}
            onNext={handleNextFromStep4}
            onBack={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 5 && (
          <Step5Validation
            examInfo={examInfo}
            blueprint={blueprint}
            sourceDocuments={sourceDocuments}
            cognitiveProfile={cognitiveProfile}
            onChangeCognitiveProfile={setCognitiveProfile}
            regulatoryProfile={regulatoryProfile}
            onChangeRegulatoryProfile={setRegulatoryProfile}
            validationResult={validationResult}
            onRevalidate={() => {
              const res = validateAssessmentConfig(
                examInfo,
                blueprint,
                sourceDocuments,
                cognitiveProfile,
                regulatoryProfile
              );
              setValidationResult(res);
            }}
            onProceedToGenerate={handleGenerateExam}
            onBack={() => setCurrentStep(4)}
            isGenerating={isGenerating}
          />
        )}

        {currentStep === 6 && generatedAssessment && (
          <Step6Results
            assessmentData={generatedAssessment}
            examInfo={examInfo}
            blueprint={blueprint}
            cognitiveProfile={cognitiveProfile}
            regulatoryProfile={regulatoryProfile}
            onRegenerate={handleGenerateExam}
            onBackToEdit={() => setCurrentStep(4)}
            isRegenerating={isGenerating}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
            <span className="font-semibold text-slate-800">
              © 2026 Bản quyền: Eliza Tâm Dương
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="text-indigo-700 font-semibold">
              SĐT: 0962571826
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span>
              Hệ thống Khảo thí & Thiết kế Đề kiểm tra Chuẩn Giáo dục Việt Nam (GDPT 2018)
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Ưu tiên: Đúng kiến thức • Đúng phạm vi • Đúng cấu trúc • Đúng điểm • Kiểm soát nguồn tuyệt đối
          </span>
        </div>
      </footer>
    </div>
  );
}
