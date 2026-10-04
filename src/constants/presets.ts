import { CognitiveLevelProfile, RegulatoryProfile } from '../types/assessment';

export const SUBJECT_OPTIONS: Record<string, string[]> = {
  thpt: [
    'Toán học',
    'Ngữ văn',
    'Vật lí',
    'Hóa học',
    'Sinh học',
    'Lịch sử',
    'Địa lí',
    'Giáo dục Kinh tế và Pháp luật',
    'Tin học',
    'Tiếng Anh',
    'Công nghệ'
  ],
  thcs: [
    'Toán học',
    'Ngữ văn',
    'Khoa học tự nhiên (Lí - Hóa - Sinh)',
    'Lịch sử và Địa lí',
    'Giáo dục công dân',
    'Tin học',
    'Tiếng Anh',
    'Công nghệ'
  ],
  tieuhoc: [
    'Toán học',
    'Tiếng Việt',
    'Khoa học',
    'Lịch sử và Địa lí',
    'Tin học và Công nghệ',
    'Tiếng Anh',
    'Đạo đức'
  ]
};

export const GRADE_OPTIONS: Record<string, string[]> = {
  thpt: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
  thcs: ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'],
  tieuhoc: ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5']
};

export const DEFAULT_COGNITIVE_PROFILES: CognitiveLevelProfile[] = [
  {
    id: 'gdpt_2018_standard',
    name: 'Khung 4 mức độ GDPT 2018 truyền thống',
    levels: ['Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao'],
    description: 'Phân loại 4 mức nhận thức phổ biến trong các đề kiểm tra định kì thông thường và đề thi các năm trước.',
    isOfficial: true
  },
  {
    id: 'cv_7991_appendix',
    name: 'Khung 3 mức độ theo Phụ lục Công văn 7991/BGDĐT-GDTrH',
    levels: ['Biết', 'Hiểu', 'Vận dụng'],
    description: 'Chỉ áp dụng khi xác minh theo Phụ lục CV 7991 (Không chứa mức "Vận dụng cao" độc lập).',
    isOfficial: true
  },
  {
    id: 'competency_based',
    name: 'Khung Đánh giá Năng lực (3 thành phần)',
    levels: ['Nhận thức khoa học', 'Tìm hiểu thế giới tự nhiên / Xã hội', 'Vận dụng kiến thức & kỹ năng'],
    description: 'Phù hợp các bài kiểm tra chuyên sâu định hướng năng lực và bài tập nghiên cứu thực tiễn.',
    isOfficial: false
  }
];

export const INITIAL_REGULATORY_PROFILES: RegulatoryProfile[] = [
  {
    id: 'cv7991',
    docNumber: '7991/BGDĐT-GDTrH',
    issueDate: '20/12/2023',
    issuingBody: 'Bộ Giáo dục và Đào tạo',
    title: 'Hướng dẫn xây dựng cấu trúc định dạng đề thi Kỳ thi tốt nghiệp THPT từ năm 2025',
    scope: 'Cấp THPT các môn trắc nghiệm và đánh giá định kì theo chương trình GDPT 2018',
    testType: 'Kiểm tra định kì, thi học kì, thi khảo sát tốt nghiệp THPT',
    gradeLevel: 'Cấp THPT (Lớp 10, 11, 12)',
    verificationSource: 'Cổng thông tin điện tử Bộ Giáo dục và Đào tạo (moet.gov.vn)',
    verificationDate: '20/12/2023',
    status: 'needs_confirmation',
    allowedLevels: ['Biết', 'Hiểu', 'Vận dụng'],
    rulesSummary: 'Đề thi trắc nghiệm chia theo: Phần I (Trắc nghiệm nhiều lựa chọn 4 phương án), Phần II (Trắc nghiệm Đúng - Sai có 4 ý a-b-c-d), Phần III (Trắc nghiệm trả lời ngắn). Mức độ đánh giá gồm 3 mức: Biết, Hiểu, Vận dụng.',
    officialDocUrl: 'https://moet.gov.vn'
  }
];

export const SAMPLE_SOURCE_PACKS = [
  {
    id: 'sample_toan12_hamso',
    subject: 'Toán học',
    educationLevel: 'thpt',
    grade: 'Lớp 12',
    name: 'Tư liệu mẫu: Tính đơn điệu và cực trị hàm số (Toán 12 GDPT 2018)',
    scope: 'Chương 1: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số.\n- Bài 1: Tính đơn điệu của hàm số (đồng biến, nghịch biến trên khoảng, dấu đạo hàm y\').\n- Bài 2: Cực trị của hàm số (điểm cực đại, điểm cực tiểu, giá trị cực trị, điều kiện f\'(x0)=0 và đổi dấu).\n- Giới hạn phạm vi: Chỉ xét các hàm đa thức bậc 3, hàm phân thức bậc nhất trên bậc nhất y=(ax+b)/(cx+d). Không xét hàm chứa căn phức tạp hay hàm lượng giác.',
    outcomes: [
      'Nhận biết tính đồng biến, nghịch biến của hàm số thông qua bảng biến thiên hoặc đồ thị đạo hàm.',
      'Tìm các khoảng đơn điệu của hàm số phân thức bậc nhất trên bậc nhất y=(ax+b)/(cx+d).',
      'Xác định điểm cực trị, giá trị cực trị của hàm số bậc ba từ bảng xét dấu y\'.',
      'Vận dụng điều kiện cực trị để giải quyết bài toán tham số đơn giản.'
    ],
    sampleContent: `TƯ LIỆU NGUỒN CHUẨN XÁC:
1. ĐỊNH NGHĨA VÀ ĐỊNH LÝ TÍNH ĐƠN ĐIỆU:
- Cho hàm số y = f(x) xác định trên khoảng K.
- f(x) đồng biến trên K nếu với mọi x1 < x2 thuộc K thì f(x1) < f(x2).
- f(x) nghịch biến trên K nếu với mọi x1 < x2 thuộc K thì f(x1) > f(x2).
- Định lý: Giả sử f(x) có đạo hàm trên K. Nếu f'(x) >= 0 với mọi x thuộc K (f'(x) = 0 chỉ tại hữu hạn điểm) thì f(x) đồng biến trên K. Nếu f'(x) <= 0 với mọi x thuộc K (f'(x) = 0 chỉ tại hữu hạn điểm) thì f(x) nghịch biến trên K.
- Hàm phân thức y = (ax+b)/(cx+d) có đạo hàm y' = (ad - bc)/(cx + d)^2. Do đó hàm số luôn đồng biến trên từng khoảng xác định khi ad - bc > 0, hoặc nghịch biến trên từng khoảng xác định khi ad - bc < 0. Tuyệt đối không viết đồng biến trên R \\ {-d/c} hoặc trên tập hợp hợp.

2. CỰC TRỊ CỦA HÀM SỐ:
- Giả sử hàm số f liên tục trên khoảng (a; b) chứa x0 và có đạo hàm trên (a; b) \\ {x0}.
- Nếu f'(x) đổi dấu từ dương sang âm khi x qua x0 (theo chiều tăng) thì x0 là điểm cực đại của hàm số. Khi đó f(x0) là giá trị cực đại.
- Nếu f'(x) đổi dấu từ âm sang dương khi x qua x0 (theo chiều tăng) thì x0 là điểm cực tiểu của hàm số. Khi đó f(x0) là giá trị cực tiểu.
- Điểm cực trị của đồ thị hàm số là điểm M(x0; f(x0)) trong mặt phẳng Oxy.`
  },
  {
    id: 'sample_vatli11_dien',
    subject: 'Vật lí',
    educationLevel: 'thpt',
    grade: 'Lớp 11',
    name: 'Tư liệu mẫu: Điện trường & Điện thế (Vật lí 11 GDPT 2018)',
    scope: 'Chương: Điện trường.\n- Khái niệm điện trường, cường độ điện trường E = F/q, đơn vị V/m hoặc N/C.\n- Đường sức điện trường: đặc điểm, quy ước chiều từ điện tích dương ra vô cùng hoặc kết thúc ở điện tích âm.\n- Công của lực điện trong điện trường đều: A = qEd, không phụ thuộc hình dạng đường đi.\n- Điện thế và hiệu điện thế: U_MN = V_M - V_N = A_MN/q.',
    outcomes: [
      'Nêu được định nghĩa và đơn vị của cường độ điện trường.',
      'Giải thích được đặc điểm công của lực điện trường đều độc lập với dạng quỹ đạo.',
      'Tính được hiệu điện thế giữa hai điểm trong điện trường đều theo công thức U = E.d.'
    ],
    sampleContent: `TƯ LIỆU NGUỒN CHUẨN XÁC:
1. ĐIỆN TRƯỜNG:
- Điện trường là dạng vật chất bao quanh điện tích và truyền tương tác điện.
- Cường độ điện trường tại một điểm: Vectơ E = Vectơ F / q. Độ lớn E = F / |q|. Đơn vị: V/m (hoặc N/C).
- Cường độ điện trường gây bởi điện tích điểm Q trong chân không: E = k.|Q| / r^2, với k = 9.10^9 N.m^2/C^2. Hướng ra xa Q nếu Q > 0, hướng về Q nếu Q < 0.

2. CÔNG CỦA LỰC ĐIỆN VÀ HIỆU ĐIỆN THẾ:
- Công của lực điện làm dịch chuyển điện tích q trong điện trường đều E: A_MN = q.E.d, trong đó d là hình chiếu của đoạn MN lên phương đường sức (d > 0 nếu cùng chiều đường sức, d < 0 nếu ngược chiều đường sức).
- Công của lực điện trường không phụ thuộc hình dạng đường đi mà chỉ phụ thuộc vị trí điểm đầu và điểm cuối (lực thế).
- Hiệu điện thế giữa 2 điểm M và N: U_MN = V_M - V_N = A_MN / q = E.d. Đơn vị: Vôn (V).`
  }
];
