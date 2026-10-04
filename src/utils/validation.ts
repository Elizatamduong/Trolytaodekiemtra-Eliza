import { BlueprintRow, CognitiveLevelProfile, ExamInfo, RegulatoryProfile, SourceDocument, ValidationItem, ValidationResult } from '../types/assessment';

export function validateAssessmentConfig(
  examInfo: ExamInfo,
  blueprint: BlueprintRow[],
  sourceDocuments: SourceDocument[],
  cognitiveProfile: CognitiveLevelProfile,
  regulatoryProfile: RegulatoryProfile
): ValidationResult {
  const items: ValidationItem[] = [];

  // 1. Check Total Score
  const totalScoreCalculated = blueprint.reduce((sum, row) => sum + (Number(row.totalPoints) || 0), 0);
  const targetScore = Number(examInfo.totalScore) || 10;
  const scoreDiff = totalScoreCalculated - targetScore;

  if (blueprint.length === 0) {
    items.push({
      id: 'val_score_empty',
      type: 'error',
      category: 'score',
      title: 'Ma trận câu hỏi chưa được thiết lập',
      detail: 'Chưa có hàng cấu hình câu hỏi nào trong bản đặc tả ma trận đề thi.',
      fixSuggestion: 'Thêm ít nhất 1 hàng cấu hình hoặc sử dụng tính năng "Gợi ý cấu trúc thông minh".'
    });
  } else if (Math.abs(scoreDiff) > 0.001) {
    items.push({
      id: 'val_score_mismatch',
      type: 'error',
      category: 'score',
      title: 'Tổng điểm ma trận không khớp với khai báo',
      detail: `Tổng điểm hiện tại của các hàng là ${totalScoreCalculated.toFixed(2)} điểm, trong khi tổng điểm khai báo ở Bước 1 là ${targetScore.toFixed(2)} điểm (Lệch: ${scoreDiff > 0 ? '+' : ''}${scoreDiff.toFixed(2)} điểm).`,
      fixSuggestion: scoreDiff > 0 
        ? `Giảm điểm hoặc số câu ở các hàng để bớt ${scoreDiff.toFixed(2)} điểm.`
        : `Tăng điểm hoặc số câu ở các hàng để bù thêm ${Math.abs(scoreDiff).toFixed(2)} điểm.`
    });
  } else {
    items.push({
      id: 'val_score_ok',
      type: 'valid',
      category: 'score',
      title: 'Tổng điểm tuyệt đối chính xác',
      detail: `Tổng điểm ma trận đạt chính xác ${targetScore.toFixed(2)} / ${targetScore.toFixed(2)} điểm.`
    });
  }

  // 2. Check Question counts
  const invalidRows = blueprint.filter(r => !r.questionCount || r.questionCount <= 0 || !Number.isInteger(r.questionCount));
  if (invalidRows.length > 0) {
    items.push({
      id: 'val_count_invalid',
      type: 'error',
      category: 'count',
      title: 'Số câu hỏi không hợp lệ',
      detail: `Có ${invalidRows.length} hàng cấu hình có số câu rỗng, bằng 0 hoặc không phải số nguyên dương.`,
      fixSuggestion: 'Điều chỉnh số câu hỏi thành số nguyên dương lớn hơn 0.'
    });
  } else if (blueprint.length > 0) {
    const totalQuestions = blueprint.reduce((sum, r) => sum + r.questionCount, 0);
    items.push({
      id: 'val_count_ok',
      type: 'valid',
      category: 'count',
      title: 'Số lượng câu hỏi hợp lệ',
      detail: `Tổng số câu hỏi của toàn bài: ${totalQuestions} câu.`
    });
  }

  // 3. Check Cognitive Levels vs Profile
  const unknownLevels = blueprint.filter(r => !cognitiveProfile.levels.includes(r.cognitiveLevel));
  if (unknownLevels.length > 0) {
    items.push({
      id: 'val_level_mismatch',
      type: 'error',
      category: 'level',
      title: 'Mức độ nhận thức không thuộc profile áp dụng',
      detail: `Có câu hỏi đang sử dụng mức độ "${unknownLevels[0].cognitiveLevel}" không nằm trong profile "${cognitiveProfile.name}" (${cognitiveProfile.levels.join(', ')}).`,
      fixSuggestion: 'Đổi mức độ nhận thức của câu về một trong các mức cho phép hoặc chuyển đổi profile nhận thức.'
    });
  } else if (blueprint.length > 0) {
    items.push({
      id: 'val_level_ok',
      type: 'valid',
      category: 'level',
      title: 'Phân loại mức độ nhận thức chuẩn xác',
      detail: `Tất cả câu hỏi đều tuân thủ khung mức độ: ${cognitiveProfile.levels.join(', ')}.`
    });
  }

  // 4. Check Duration Feasibility
  let estimatedMinutes = 0;
  blueprint.forEach(r => {
    let perQuestionMin = 1.5;
    if (r.questionType === 'multiple_choice') perQuestionMin = 1.25;
    if (r.questionType === 'true_false') perQuestionMin = 3.5;
    if (r.questionType === 'short_answer') perQuestionMin = 2.5;
    if (r.questionType === 'essay') perQuestionMin = 7.0;

    // Weight by level
    if (r.cognitiveLevel.includes('Vận dụng') || r.cognitiveLevel.includes('Vận dụng cao')) {
      perQuestionMin *= 1.3;
    }
    estimatedMinutes += r.questionCount * perQuestionMin;
  });

  const declaredDuration = Number(examInfo.durationMinutes) || 45;
  if (estimatedMinutes > declaredDuration * 1.2) {
    items.push({
      id: 'val_time_warning',
      type: 'warning',
      category: 'time',
      title: 'Dung lượng hiện tại có nguy cơ vượt thời gian làm bài',
      detail: `Ước tính học sinh cần khoảng ${Math.round(estimatedMinutes)} phút để hoàn thành số câu hiện tại, trong khi thời gian làm bài là ${declaredDuration} phút (vượt ${(estimatedMinutes - declaredDuration).toFixed(0)} phút).`,
      fixSuggestion: 'Khuyến nghị giảm số câu hoặc giảm câu hỏi ở mức độ vận dụng cao nếu muốn kiểm tra đúng thời lượng.'
    });
  } else if (estimatedMinutes < declaredDuration * 0.5 && blueprint.length > 0) {
    items.push({
      id: 'val_time_short',
      type: 'warning',
      category: 'time',
      title: 'Dung lượng đề có thể hơi ngắn so với thời gian',
      detail: `Ước tính học sinh làm xong trong ~${Math.round(estimatedMinutes)} phút, so với ${declaredDuration} phút cho phép.`,
      fixSuggestion: 'Có thể bổ sung câu hỏi hoặc tăng độ sâu phân hóa nếu là bài kiểm tra định kì quan trọng.'
    });
  } else if (blueprint.length > 0) {
    items.push({
      id: 'val_time_ok',
      type: 'valid',
      category: 'time',
      title: 'Thời lượng làm bài phù hợp',
      detail: `Ước tính thời gian làm bài (~${Math.round(estimatedMinutes)} phút) tương thích tốt với thời lượng ${declaredDuration} phút.`
    });
  }

  // 5. Knowledge Source Check
  const confirmedSources = sourceDocuments.filter(d => d.isConfirmedAsSource);
  const hasScopeText = examInfo.knowledgeScope && examInfo.knowledgeScope.trim().length >= 20;

  if (confirmedSources.length === 0 && !hasScopeText) {
    items.push({
      id: 'val_source_missing',
      type: 'error',
      category: 'source',
      title: 'Chưa xác nhận nguồn kiến thức hoặc phạm vi bài học',
      detail: 'Để tuân thủ nguyên tắc "Nguồn có kiểm soát", giáo viên phải xác nhận ít nhất 1 tài liệu tư liệu học tập hoặc nhập phạm vi kiến thức chi tiết ở Bước 1.',
      fixSuggestion: 'Quay lại Bước 3 và nhấn "Xác nhận làm nguồn" cho tư liệu hoặc nhập chi tiết phạm vi kiến thức ở Bước 1.'
    });
  } else {
    items.push({
      id: 'val_source_ok',
      type: 'valid',
      category: 'source',
      title: 'Nguồn kiến thức được kiểm soát chặt chẽ',
      detail: confirmedSources.length > 0 
        ? `Đã xác nhận ${confirmedSources.length} tài liệu làm nguồn chính thức. AI chỉ tạo câu hỏi trong phạm vi này.`
        : 'Sử dụng phạm vi bài học chi tiết do giáo viên khai báo làm ranh giới kiến thức duy nhất.'
    });
  }

  // 6. Regulatory Check
  const regulatoryConflicts: any[] = [];
  if (regulatoryProfile.status === 'verified') {
    // Check if using 7991 profile but cognitive profile has "Vận dụng cao"
    if (regulatoryProfile.docNumber.includes('7991')) {
      if (cognitiveProfile.levels.includes('Vận dụng cao')) {
        regulatoryConflicts.push({
          targetField: 'Hệ mức độ nhận thức',
          regulationRule: 'Phụ lục Công văn 7991 quy định 3 mức: Biết, Hiểu, Vận dụng.',
          currentValue: cognitiveProfile.levels.join(', '),
          recommendedValue: 'Biết, Hiểu, Vận dụng'
        });

        items.push({
          id: 'val_reg_cv7991_conflict',
          type: 'warning',
          category: 'regulation',
          title: 'Cấu hình hiện tại có điểm chưa phù hợp với quy định đang áp dụng (CV 7991)',
          detail: 'Theo Phụ lục Công văn 7991/BGDĐT-GDTrH, hệ mức độ đánh giá gồm 3 mức: Biết, Hiểu, Vận dụng (không chứa mức "Vận dụng cao" độc lập). Cấu hình hiện tại đang có mức "Vận dụng cao".',
          fixSuggestion: 'Chuyển sang Khung 3 mức độ của CV 7991 hoặc điều chỉnh các câu "Vận dụng cao" thành "Vận dụng".'
        });
      }

      // Check if primary grade is THPT
      if (examInfo.educationLevel !== 'thpt') {
        items.push({
          id: 'val_reg_scope_warning',
          type: 'warning',
          category: 'regulation',
          title: 'Phạm vi áp dụng của Công văn 7991',
          detail: `Công văn 7991 hướng dẫn định dạng đề thi tốt nghiệp THPT từ 2025 (Cấp THPT), trong khi cấp học bạn chọn là "${examInfo.educationLevel.toUpperCase()}".`,
          fixSuggestion: 'Xem xét chuyển trạng thái xác minh của Công văn 7991 sang "Không áp dụng cho cấu hình hiện tại" nếu đây là bài kiểm tra THCS hoặc Tiểu học.'
        });
      }
    }
  }

  const hasErrors = items.some(item => item.type === 'error');

  return {
    isValid: !hasErrors,
    canProceed: !hasErrors && blueprint.length > 0,
    items,
    totalScoreCalculated,
    totalScoreTarget: targetScore,
    scoreDifference: scoreDiff,
    estimatedDuration: Math.round(estimatedMinutes),
    declaredDuration,
    regulatoryConflicts: regulatoryConflicts.length > 0 ? regulatoryConflicts : undefined
  };
}
