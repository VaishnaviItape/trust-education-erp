import React, { useState, useEffect, useMemo } from 'react';
import {
  FileQuestion,
  BookOpen,
  Calculator,
  Languages,
  Plus,
  Printer,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Edit3,
  Sparkles,
  Eye,
  X,
  FileSpreadsheet,
  Award,
  Layers,
  ChevronRight,
  HelpCircle,
  Clock,
  Check,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { BankQuestion, QuestionPaper, QuestionPaperSection } from '../types';
import { getInstitutionDetails } from '../utils/documentUtils';
import { useTableSort, SortableTh } from './TableSort';
import { usePagination, TablePagination } from './TablePagination';

interface QuestionBankPaperStudioProps {
  currentBranchScope?: 'ALL' | 'SCHOOL' | 'COLLEGE';
  academicYear?: string;
}

// Initial Question Bank Seed
const DEFAULT_QUESTIONS: BankQuestion[] = [
  // --------------------------------------------------------------------------
  // MATHEMATICS (Class 10 & 12)
  // --------------------------------------------------------------------------
  {
    id: 'qb-math-01',
    code: 'MATH-10-Q01',
    subject: 'Mathematics & Analytical Geometry',
    subjectCode: 'MATH-10',
    gradeOrClass: 'Class 10-A',
    branchScope: 'SCHOOL',
    chapterTopic: 'Quadratic Equations (वर्गसमीकरणे)',
    language: 'ENGLISH',
    questionType: 'NUMERICAL_MATH',
    marks: 4,
    difficulty: 'MEDIUM',
    bloomLevel: 'APPLY',
    questionText: 'Solve the quadratic equation: 2x² - 7x + 3 = 0 using the standard quadratic formula. Show the discriminant calculation Δ = b² - 4ac and determine the two distinct real roots.',
    formulaUsed: 'x = (-b ± √(b² - 4ac)) / (2a)',
    correctAnswer: 'Roots are x = 3 and x = 1/2',
    solutionExplanation: 'Here a = 2, b = -7, c = 3. Discriminant Δ = (-7)² - 4(2)(3) = 49 - 24 = 25 > 0. Hence x = (7 ± √25) / (2 × 2) = (7 ± 5) / 4. For (+): x = 12/4 = 3. For (-): x = 2/4 = 1/2.',
    tags: ['QuadraticFormula', 'Algebra', 'BoardExam'],
    createdAt: '2026-10-15',
  },
  {
    id: 'qb-math-02',
    code: 'MATH-10-Q02',
    subject: 'Mathematics & Analytical Geometry',
    subjectCode: 'MATH-10',
    gradeOrClass: 'Class 10-A',
    branchScope: 'SCHOOL',
    chapterTopic: 'Trigonometry & Pythagoras Theorem',
    language: 'ENGLISH',
    questionType: 'SHORT',
    marks: 3,
    difficulty: 'EASY',
    bloomLevel: 'UNDERSTAND',
    questionText: 'In a right-angled triangle ABC, ∠B = 90°, side AB = 6 cm, and side BC = 8 cm. Using Pythagoras Theorem AC² = AB² + BC², calculate hypotenuse AC. Hence determine exact values of sin(A) and cos(A).',
    formulaUsed: 'AC² = AB² + BC², sin(A) = Opposite / Hypotenuse, cos(A) = Adjacent / Hypotenuse',
    correctAnswer: 'AC = 10 cm, sin(A) = 8/10 = 4/5 (0.8), cos(A) = 6/10 = 3/5 (0.6)',
    solutionExplanation: 'AC = √(6² + 8²) = √(36 + 64) = √100 = 10 cm. sin(A) = BC/AC = 8/10 = 4/5. cos(A) = AB/AC = 6/10 = 3/5.',
    tags: ['Trigonometry', 'Pythagoras', 'Class10'],
    createdAt: '2026-10-15',
  },
  {
    id: 'qb-math-03',
    code: 'MATH-10-Q03',
    subject: 'Mathematics & Analytical Geometry',
    subjectCode: 'MATH-10',
    gradeOrClass: 'Class 10-A',
    branchScope: 'SCHOOL',
    chapterTopic: 'Mensuration & Surface Areas',
    language: 'ENGLISH',
    questionType: 'MCQ',
    marks: 1,
    difficulty: 'EASY',
    bloomLevel: 'REMEMBER',
    questionText: 'What is the curved surface area (CSA) of a right circular cone having base radius r = 7 cm and slant height l = 10 cm? (Use π = 22/7)',
    formulaUsed: 'CSA = π × r × l',
    options: [
      'A) 220 cm²',
      'B) 440 cm²',
      'C) 154 cm²',
      'D) 700 cm²',
    ],
    correctAnswer: 'A) 220 cm²',
    solutionExplanation: 'CSA = (22/7) × 7 × 10 = 22 × 10 = 220 cm².',
    tags: ['Mensuration', 'MCQ', 'Geometry'],
    createdAt: '2026-10-15',
  },
  {
    id: 'qb-math-04',
    code: 'MATH-12-Q04',
    subject: 'Mathematics & Analytical Geometry',
    subjectCode: 'MATH-12',
    gradeOrClass: 'Class 12-Science',
    branchScope: 'SCHOOL',
    chapterTopic: 'Definite Integration & Calculus',
    language: 'ENGLISH',
    questionType: 'NUMERICAL_MATH',
    marks: 4,
    difficulty: 'HARD',
    bloomLevel: 'ANALYZE',
    questionText: 'Evaluate the definite integral: I = ∫₀² (3x² - 4x + 5) dx. Show all antiderivative terms and apply the Fundamental Theorem of Calculus.',
    formulaUsed: '∫ xⁿ dx = xⁿ⁺¹ / (n + 1), I = [F(b) - F(a)]',
    correctAnswer: 'I = 10',
    solutionExplanation: 'Antiderivative F(x) = x³ - 2x² + 5x. Upper limit F(2) = 2³ - 2(2)² + 5(2) = 8 - 8 + 10 = 10. Lower limit F(0) = 0. Therefore I = 10 - 0 = 10.',
    tags: ['Calculus', 'Integration', 'SeniorSecondary'],
    createdAt: '2026-10-16',
  },

  // --------------------------------------------------------------------------
  // MARATHI (मराठी भाषा व व्याकरण)
  // --------------------------------------------------------------------------
  {
    id: 'qb-mar-01',
    code: 'MAR-10-Q01',
    subject: 'मराठी प्रथम भाषा व व्याकरण (Marathi Language)',
    subjectCode: 'MAR-10',
    gradeOrClass: 'Class 10-A',
    branchScope: 'SCHOOL',
    chapterTopic: 'मराठी व्याकरण - प्रयोग विचार (Marathi Grammar)',
    language: 'MARATHI',
    questionType: 'MCQ',
    marks: 1,
    difficulty: 'MEDIUM',
    bloomLevel: 'UNDERSTAND',
    questionText: 'खालील वाक्यातील योग्य "प्रयोग" ओळखा:\n"रामाने रावणास मारले."',
    options: [
      'A) कर्तरी प्रयोग (Subjective Construction)',
      'B) कर्मणी प्रयोग (Objective Construction)',
      'C) भावे प्रयोग (Neutral Construction)',
      'D) कर्मकर्तरी प्रयोग',
    ],
    correctAnswer: 'C) भावे प्रयोग (Neutral Construction)',
    solutionExplanation: 'या वाक्यात कर्त्याला (रामाने) व कर्माला (रावणास) प्रत्यय असून क्रियापद तृतीयपुरुषी, नपुंसकलिंगी, एकवचनी (मारले) आहे. म्हणून हा भावे प्रयोग आहे.',
    tags: ['मराठी', 'व्याकरण', 'प्रयोग', 'SSC-Board'],
    createdAt: '2026-10-16',
  },
  {
    id: 'qb-mar-02',
    code: 'MAR-10-Q02',
    subject: 'मराठी प्रथम भाषा व व्याकरण (Marathi Language)',
    subjectCode: 'MAR-10',
    gradeOrClass: 'Class 10-A',
    branchScope: 'SCHOOL',
    chapterTopic: 'मराठी शब्दसंग्रह - म्हणी व वाक्प्रचार',
    language: 'MARATHI',
    questionType: 'SHORT',
    marks: 2,
    difficulty: 'EASY',
    bloomLevel: 'REMEMBER',
    questionText: 'खालील म्हणीचा अचूक अर्थ स्पष्ट करा आणि स्वतःच्या वाक्यात उपयोग करा:\n"नाव मोठे लक्षण खोटे."',
    correctAnswer: 'अर्थ: बाह्य देखावा फार मोठा पण प्रत्यक्ष गुण किंवा वागणूक मात्र अगदी सामान्य असणे.',
    solutionExplanation: 'वाक्यात उपयोग: त्या नामांकित कोचिंग क्लासच्या भव्य जाहिराती होत्या, पण प्रत्यक्ष शिकवण्याची पातळी पाहून "नाव मोठे लक्षण खोटे" अशी अनुभूती आली.',
    tags: ['मराठी', 'म्हणी', 'वाक्प्रचार'],
    createdAt: '2026-10-16',
  },
  {
    id: 'qb-mar-03',
    code: 'MAR-10-Q03',
    subject: 'मराठी प्रथम भाषा व व्याकरण (Marathi Language)',
    subjectCode: 'MAR-10',
    gradeOrClass: 'Class 10-A',
    branchScope: 'SCHOOL',
    chapterTopic: 'मराठी व्याकरण - समास',
    language: 'MARATHI',
    questionType: 'SHORT',
    marks: 2,
    difficulty: 'MEDIUM',
    bloomLevel: 'APPLY',
    questionText: 'खालील सामासिक शब्दांचा विग्रह करून समासाचे नाव लिहा:\n(१) ज्ञानामृत\n(२) प्रतिदिन',
    correctAnswer: '(१) ज्ञानामृत = ज्ञान हेच अमृत (कर्मधारय समास), (२) प्रतिदिन = प्रत्येक दिवशी (अव्ययीभाव समास)',
    solutionExplanation: 'ज्ञानामृत मध्ये दोन्ही पदे एकाच विभक्तीत असून उपमेय-उपमान संबंध आहे (कर्मधारय). प्रतिदिन मध्ये पहिले पद अव्यय असून ते महत्त्वाचे आहे (अव्ययीभाव).',
    tags: ['मराठी', 'समास', 'व्याकरण'],
    createdAt: '2026-10-16',
  },
  {
    id: 'qb-mar-04',
    code: 'MAR-10-Q04',
    subject: 'मराठी प्रथम भाषा व व्याकरण (Marathi Language)',
    subjectCode: 'MAR-10',
    gradeOrClass: 'Class 10-A',
    branchScope: 'SCHOOL',
    chapterTopic: 'उपयोजित लेखन - निबंध लेखन (Essay Writing)',
    language: 'MARATHI',
    questionType: 'LONG',
    marks: 8,
    difficulty: 'HARD',
    bloomLevel: 'EVALUATE',
    questionText: 'खालीलपैकी कोणत्याही एका विषयावर सुमारे १५० ते २०० शब्दांत निबंध लिहा:\n(१) "माझे आवडते शास्त्रज्ञ - डॉ. ए. पी. जे. अब्दुल कलाम"\n(२) "पाण्याचे मोल व जलसंधारण: काळाची गरज"\n(३) "डिजिटल तंत्रज्ञान: शाप की वरदान?"',
    correctAnswer: 'मुद्देसूद मांडणी, भाषाशैली, प्रस्तावना, मध्य व निष्कर्ष या निकषांवर ८ गुणांचे मूल्यमापन करावे.',
    solutionExplanation: 'निबंधात विषयाचे महत्त्व, व्यक्तिमत्त्व पैलू किंवा समस्या व उपाय, समर्पक सुभाषिते व म्हणींचा वापर आणि प्रभावी समारोप असावा.',
    tags: ['मराठी', 'निबंध', 'उपयोजित-लेखन', 'BoardExam'],
    createdAt: '2026-10-16',
  },
  {
    id: 'qb-mar-math',
    code: 'MAR-MATH-05',
    subject: 'Mathematics & Analytical Geometry',
    subjectCode: 'MATH-10',
    gradeOrClass: 'Class 10-A',
    branchScope: 'SCHOOL',
    chapterTopic: 'भूमिती - त्रिकोणाचे क्षेत्रफळ (Geometry Marathi Medium)',
    language: 'MARATHI',
    questionType: 'NUMERICAL_MATH',
    marks: 3,
    difficulty: 'MEDIUM',
    bloomLevel: 'APPLY',
    questionText: 'एका काटकोन त्रिकोणात पाया b = १२ सेमी आणि उंची h = ५ सेमी असल्यास कर्णाची लांबी (c) आणि त्रिकोणाचे क्षेत्रफळ काढा. (पायथागोरस सूत्र: c² = a² + b²; क्षेत्रफळ = १/२ × पाया × उंची)',
    formulaUsed: 'कर्ण² = पाया² + उंची², क्षेत्रफळ = (१/२) × पाया × उंची',
    correctAnswer: 'कर्ण = १३ सेमी, क्षेत्रफळ = ३० चौ. सेमी',
    solutionExplanation: 'कर्ण = √(१२² + ५²) = √(१४४ + २५) = √१६९ = १३ सेमी. क्षेत्रफळ = १/२ × १२ × ५ = ६ × ५ = ३० चौ. सेमी.',
    tags: ['भूमिती', 'पायथागोरस', 'मराठी-माध्यम'],
    createdAt: '2026-10-16',
  },

  // --------------------------------------------------------------------------
  // HINDI (हिंदी राष्ट्रभाषा व साहित्य)
  // --------------------------------------------------------------------------
  {
    id: 'qb-hin-01',
    code: 'HIN-10-Q01',
    subject: 'हिंदी राष्ट्रभाषा एवं व्याकरण (Hindi Language)',
    subjectCode: 'HIN-10',
    gradeOrClass: 'Class 10-A',
    branchScope: 'SCHOOL',
    chapterTopic: 'हिंदी व्याकरण - संधि एवं विच्छेद',
    language: 'HINDI',
    questionType: 'SHORT',
    marks: 2,
    difficulty: 'EASY',
    bloomLevel: 'UNDERSTAND',
    questionText: 'निम्नलिखित शब्दों का सही संधि-विच्छेद कीजिए और संधि का नाम बताइए:\n(१) पुस्तकालय = ______ + ______\n(२) सूर्योदय = ______ + ______',
    correctAnswer: '(१) पुस्तकालय = पुस्तक + आलय (दीर्घ स्वर संधि), (२) सूर्योदय = सूर्य + उदय (गुण स्वर संधि)',
    solutionExplanation: 'पुस्तक + आलय में अ + आ मिलकर "आ" बनता है (दीर्घ संधि)। सूर्य + उदय में अ + उ मिलकर "ओ" बनता है (गुण संधि)।',
    tags: ['हिंदी', 'व्याकरण', 'संधि', 'Class10'],
    createdAt: '2026-10-17',
  },
  {
    id: 'qb-hin-02',
    code: 'HIN-10-Q02',
    subject: 'हिंदी राष्ट्रभाषा एवं व्याकरण (Hindi Language)',
    subjectCode: 'HIN-10',
    gradeOrClass: 'Class 10-A',
    branchScope: 'SCHOOL',
    chapterTopic: 'मुहावरे एवं लोकोक्तियाँ',
    language: 'HINDI',
    questionType: 'SHORT',
    marks: 3,
    difficulty: 'MEDIUM',
    bloomLevel: 'APPLY',
    questionText: 'निम्नलिखित मुहावरों का अर्थ लिखकर सार्थक वाक्यों में प्रयोग कीजिए:\n(१) आँखों का तारा होना\n(२) दाँतों तले उँगली दबाना',
    correctAnswer: '(१) अत्यधिक प्रिय होना, (२) आश्चर्यचकित होना বা स्तब्ध रह जाना',
    solutionExplanation: 'वाक्य प्रयोग: (१) राहुल अपने माता-पिता की आँखों का तारा है। (२) सर्कस के हैरतअंगेज़ करतब देखकर दर्शकों ने दाँतों तले उँगली दबा ली।',
    tags: ['हिंदी', 'मुहावरे', 'व्याकरण'],
    createdAt: '2026-10-17',
  },
  {
    id: 'qb-hin-03',
    code: 'HIN-10-Q03',
    subject: 'हिंदी राष्ट्रभाषा एवं व्याकरण (Hindi Language)',
    subjectCode: 'HIN-10',
    gradeOrClass: 'Class 10-A',
    branchScope: 'SCHOOL',
    chapterTopic: 'पद्य साहित्य - कबीर के दोहे',
    language: 'HINDI',
    questionType: 'LONG',
    marks: 4,
    difficulty: 'MEDIUM',
    bloomLevel: 'ANALYZE',
    questionText: 'संत कबीरदास जी के निम्नलिखित दोहे का संदर्भ सहित भावार्थ स्पष्ट कीजिए:\n"बड़ा भया तो क्या भया, जैसे पेड़ खजूर।\nपंथी को छाया नहीं, फल लागै अति दूर॥"',
    correctAnswer: 'भावार्थ: केवल आकार या धन-दौलत से बड़ा होना व्यर्थ है यदि वह दूसरों के किसी काम न आए।',
    solutionExplanation: 'कबीरदास जी कहते हैं कि खजूर का पेड़ बहुत ऊँचा होता है, किंतु न तो वह थके हुए राही को छाया दे सकता है और न ही उसके फल आसानी से तोड़े जा सकते हैं। उसी प्रकार परोपकार और विनम्रता के बिना मनुष्य की महानता निरर्थक है।',
    tags: ['हिंदी', 'साहित्य', 'कबीर-दोहा', 'BoardExam'],
    createdAt: '2026-10-17',
  },
  {
    id: 'qb-hin-04',
    code: 'HIN-10-Q04',
    subject: 'हिंदी राष्ट्रभाषा एवं व्याकरण (Hindi Language)',
    subjectCode: 'HIN-10',
    gradeOrClass: 'Class 10-A',
    branchScope: 'SCHOOL',
    chapterTopic: 'रचनात्मक लेखन - निबंध',
    language: 'HINDI',
    questionType: 'LONG',
    marks: 7,
    difficulty: 'HARD',
    bloomLevel: 'EVALUATE',
    questionText: 'निम्नलिखित में से किसी एक विषय पर १५० से २०० शब्दों में प्रभावशाली निबंध लिखिए:\n(१) पर्यावरण संरक्षण: समय की पुकार\n(२) मेरा भारत: महान विरासत और आधुनिक विकास\n(३) समय का सदुपयोग और विद्यार्थी जीवन',
    correctAnswer: 'प्रस्तावना, मुख्य विषय का विस्तार, उदाहरण, निष्कर्ष और शुद्ध वर्तनी के आधार पर ७ अंकों का मूल्यांकन करें।',
    solutionExplanation: 'निबंध में विषय वस्तु का स्पष्ट विश्लेषण, राष्ट्रीय व सामाजिक संदर्भ और प्रेरक उपसंहार अनिवार्य है।',
    tags: ['हिंदी', 'निबंध', 'BoardExam'],
    createdAt: '2026-10-17',
  },

  // --------------------------------------------------------------------------
  // COLLEGE (Hotel Management & Practical Culinary Sciences)
  // --------------------------------------------------------------------------
  {
    id: 'qb-hm-01',
    code: 'HM-COL-Q01',
    subject: 'Food Production & Culinary Operations',
    subjectCode: 'HM-101',
    gradeOrClass: 'B.Sc in Hospitality Studies - Semester 1',
    branchScope: 'COLLEGE',
    chapterTopic: 'French Mother Sauces & Derivatives',
    language: 'ENGLISH',
    questionType: 'LONG',
    marks: 5,
    difficulty: 'MEDIUM',
    bloomLevel: 'UNDERSTAND',
    questionText: 'Enumerate the five classical French Mother Sauces (Grandes Sauces) codified by Auguste Escoffier. Specify liquid base, thickening roux, and at least two daughter derivatives for Béchamel and Velouté.',
    correctAnswer: '1) Béchamel (Milk + White Roux; Derivatives: Mornay, Soubise), 2) Velouté (White Stock + Blond Roux; Derivatives: Supreme, Allemande), 3) Espagnole (Brown Stock + Brown Roux), 4) Tomato Sauce, 5) Hollandaise (Clarified Butter + Egg Yolk Emulsion).',
    solutionExplanation: 'Each sauce requires precise temperature control. Béchamel uses warm milk whisked into equal weight butter-flour roux.',
    tags: ['CulinaryArts', 'Escoffier', 'MotherSauces', 'BHM'],
    createdAt: '2026-10-18',
  },
  {
    id: 'qb-hm-02',
    code: 'HM-COL-Q02',
    subject: 'Food Production & Culinary Operations',
    subjectCode: 'HM-101',
    gradeOrClass: 'B.Sc in Hospitality Studies - Semester 1',
    branchScope: 'COLLEGE',
    chapterTopic: 'Kitchen Costing & Yield Mathematics',
    language: 'ENGLISH',
    questionType: 'NUMERICAL_MATH',
    marks: 4,
    difficulty: 'MEDIUM',
    bloomLevel: 'APPLY',
    questionText: 'In a 5-star hotel banquet kitchen, Opening Food Stock = ₹45,000, Monthly Food Purchases = ₹1,20,000, Closing Food Stock = ₹35,000, and Food Sales Revenue = ₹3,90,000. Calculate: (1) Cost of Food Consumed, and (2) Food Cost Percentage using the formula: Food Cost % = (Cost of Food Consumed / Food Sales) × 100.',
    formulaUsed: 'Cost of Food = Opening Stock + Purchases - Closing Stock; Food Cost % = (Cost / Revenue) × 100',
    correctAnswer: '(1) Cost of Food Consumed = ₹1,30,000, (2) Food Cost Percentage = 33.33%',
    solutionExplanation: 'Cost = ₹45,000 + ₹1,20,000 - ₹35,000 = ₹1,30,000. Food Cost % = (1,30,000 / 3,90,000) × 100 = 33.33%. Standard 5-star benchmark is 30-34%.',
    tags: ['KitchenCosting', 'Mathematics', 'HospitalityManagement'],
    createdAt: '2026-10-18',
  },
];

// Initial Seed Question Papers
const DEFAULT_PAPERS: QuestionPaper[] = [
  {
    id: 'qp-ssc-math-01',
    paperCode: 'QP-SSC-2026-MATH',
    title: 'Term-End Board Examination 2026 - Mathematics & Geometry',
    subject: 'Mathematics & Analytical Geometry',
    gradeOrClass: 'Class 10-A',
    branchScope: 'SCHOOL',
    language: 'ENGLISH',
    academicYear: '2026-2027',
    maxMarks: 40,
    timeAllowedMinutes: 120,
    generalInstructions: [
      'All questions are compulsory and carry specified marks.',
      'Draw neat and accurate geometric figures wherever necessary.',
      'Use of scientific calculators is strictly prohibited as per State Board norms.',
      'Marks on the right margin indicate full marks for that sub-question.',
    ],
    sections: [
      {
        sectionName: 'Section A - Objective & MCQs (4 Marks)',
        sectionInstructions: 'Choose the correct alternative for each question.',
        targetMarks: 4,
        questionIds: ['qb-math-03'],
      },
      {
        sectionName: 'Section B - Short Answer Conceptual Questions (12 Marks)',
        sectionInstructions: 'Solve any four questions with step-by-step working.',
        targetMarks: 12,
        questionIds: ['qb-math-02'],
      },
      {
        sectionName: 'Section C - Long Answer Problem Solving (24 Marks)',
        sectionInstructions: 'Show detailed algebraic solutions and quadratic formula deductions.',
        targetMarks: 24,
        questionIds: ['qb-math-01', 'qb-math-04'],
      },
    ],
    questions: DEFAULT_QUESTIONS.filter((q) =>
      ['qb-math-03', 'qb-math-02', 'qb-math-01', 'qb-math-04'].includes(q.id)
    ),
    status: 'PUBLISHED',
    createdDate: '2026-10-19',
    authorTeacher: 'Mrs. Neha Joshi (Senior Mathematics Faculty)',
  },
  {
    id: 'qp-ssc-mar-01',
    paperCode: 'QP-SSC-2026-MAR',
    title: 'सत्रान्त परीक्षा २०२६ - मराठी प्रथम भाषा व व्याकरण',
    subject: 'मराठी प्रथम भाषा व व्याकरण (Marathi Language)',
    gradeOrClass: 'Class 10-A',
    branchScope: 'SCHOOL',
    language: 'MARATHI',
    academicYear: '2026-2027',
    maxMarks: 80,
    timeAllowedMinutes: 180,
    generalInstructions: [
      'सर्व प्रश्न सोडवणे अनिवार्य आहे. उजवीकडील अंक पूर्ण गुण दर्शवितात.',
      'हस्ताक्षर सुवाच्य व व्याकरणदृष्ट्या शुद्ध असणे आवश्यक आहे.',
      'उपयोजित लेखनात दिलेल्या मुद्यांचा सविस्तर विचार करून निबंध व पत्र लिहावे.',
    ],
    sections: [
      {
        sectionName: 'विभाग १: गद्य व व्याकरण (Objective & Grammar)',
        targetMarks: 20,
        questionIds: ['qb-mar-01', 'qb-mar-02', 'qb-mar-03'],
      },
      {
        sectionName: 'विभाग २: उपयोजित लेखन व निबंध (Creative Writing)',
        targetMarks: 60,
        questionIds: ['qb-mar-04', 'qb-mar-math'],
      },
    ],
    questions: DEFAULT_QUESTIONS.filter((q) => q.language === 'MARATHI'),
    status: 'FINALIZED',
    createdDate: '2026-10-20',
    authorTeacher: 'श्री. राजेंद्र पाटील (वरिष्ठ मराठी शिक्षक)',
  },
  {
    id: 'qp-ssc-hin-01',
    paperCode: 'QP-SSC-2026-HIN',
    title: 'सत्रांत परीक्षा २०२६ - हिंदी द्वितीय भाषा (राष्ट्रभाषा)',
    subject: 'हिंदी राष्ट्रभाषा एवं व्याकरण (Hindi Language)',
    gradeOrClass: 'Class 10-A',
    branchScope: 'SCHOOL',
    language: 'HINDI',
    academicYear: '2026-2027',
    maxMarks: 50,
    timeAllowedMinutes: 120,
    generalInstructions: [
      'सभी प्रश्न अनिवार्य हैं। यथासंभव सभी प्रश्नों के उत्तर क्रमानुसार लिखिए।',
      'वर्तनी की शुद्धता एवं स्पष्ट लिखावट पर विशेष ध्यान दें।',
      'प्रश्नों के अंक दाईं ओर अंकित हैं।',
    ],
    sections: [
      {
        sectionName: 'खंड क: भाषा अध्ययन एवं व्याकरण',
        targetMarks: 20,
        questionIds: ['qb-hin-01', 'qb-hin-02'],
      },
      {
        sectionName: 'खंड ख: पद्य साहित्य एवं रचनात्मक निबंध',
        targetMarks: 30,
        questionIds: ['qb-hin-03', 'qb-hin-04'],
      },
    ],
    questions: DEFAULT_QUESTIONS.filter((q) => q.language === 'HINDI'),
    status: 'PUBLISHED',
    createdDate: '2026-10-20',
    authorTeacher: 'श्रीमती सुनीता कुलकर्णी (मुख्याध्यापिका)',
  },
];

// Mathematical & Symbol Palette
const MATH_AND_DEVANAGARI_SYMBOLS = [
  { symbol: '√', label: 'Square Root (√)' },
  { symbol: '²', label: 'Square (x²)' },
  { symbol: '³', label: 'Cube (x³)' },
  { symbol: '±', label: 'Plus-Minus (±)' },
  { symbol: 'π', label: 'Pi (π)' },
  { symbol: 'θ', label: 'Theta (θ)' },
  { symbol: 'Δ', label: 'Delta / Discriminant (Δ)' },
  { symbol: '∫', label: 'Integral (∫)' },
  { symbol: '∑', label: 'Summation (∑)' },
  { symbol: '≤', label: 'Less than or Equal (≤)' },
  { symbol: '≥', label: 'Greater than or Equal (≥)' },
  { symbol: '≠', label: 'Not Equal (≠)' },
  { symbol: '°', label: 'Degree (°)' },
  { symbol: '।', label: 'Devanagari Danda (।)' },
  { symbol: '॥', label: 'Devanagari Double Danda (॥)' },
  { symbol: 'ऽ', label: 'Avagraha (ऽ)' },
];

export const QuestionBankPaperStudio: React.FC<QuestionBankPaperStudioProps> = ({
  currentBranchScope = 'ALL',
  academicYear = '2026-2027',
}) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<'BANK' | 'PAPERS'>('BANK');

  // Question Bank State
  const [questions, setQuestions] = useState<BankQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('trust_question_bank');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_QUESTIONS;
  });

  // Question Papers State
  const [papers, setPapers] = useState<QuestionPaper[]>(() => {
    try {
      const saved = localStorage.getItem('trust_question_papers');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_PAPERS;
  });

  // Filters
  const [languageFilter, setLanguageFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showCreatePaperModal, setShowCreatePaperModal] = useState(false);
  const [showPrintPaperModal, setShowPrintPaperModal] = useState(false);
  const [selectedPaperForPrint, setSelectedPaperForPrint] = useState<QuestionPaper | null>(null);
  const [showSolutionsInPrint, setShowSolutionsInPrint] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Question Form
  const [newQuestionForm, setNewQuestionForm] = useState<Partial<BankQuestion>>({
    subject: 'Mathematics & Analytical Geometry',
    subjectCode: 'MATH-10',
    gradeOrClass: 'Class 10-A',
    branchScope: 'SCHOOL',
    chapterTopic: 'Algebra & Quadratic Equations',
    language: 'ENGLISH',
    questionType: 'NUMERICAL_MATH',
    marks: 4,
    difficulty: 'MEDIUM',
    bloomLevel: 'APPLY',
    questionText: '',
    formulaUsed: '',
    correctAnswer: '',
    solutionExplanation: '',
    tags: ['TermEnd', 'BoardExam'],
  });

  // New Paper Form
  const [newPaperForm, setNewPaperForm] = useState<Partial<QuestionPaper>>({
    title: 'Mid-Term Board Examination 2026',
    paperCode: `QP-${Date.now().toString().slice(-6)}`,
    subject: 'Mathematics & Analytical Geometry',
    gradeOrClass: 'Class 10-A',
    branchScope: 'SCHOOL',
    language: 'ENGLISH',
    academicYear,
    maxMarks: 40,
    timeAllowedMinutes: 120,
    generalInstructions: [
      'All questions are compulsory.',
      'Draw neat diagrams wherever applicable.',
      'Use of non-programmable calculators is prohibited.',
    ],
    sections: [
      {
        sectionName: 'Section A - Objective Questions',
        targetMarks: 10,
        questionIds: [],
      },
      {
        sectionName: 'Section B - Descriptive & Problem Solving',
        targetMarks: 30,
        questionIds: [],
      },
    ],
    questions: [],
    authorTeacher: 'Department Examination In-Charge',
  });

  // Selected Question IDs for Paper Assembling
  const [paperSelectedQuestionIds, setPaperSelectedQuestionIds] = useState<string[]>([]);

  // Synchronize localStorage
  useEffect(() => {
    try {
      localStorage.setItem('trust_question_bank', JSON.stringify(questions));
    } catch {
      // ignore
    }
  }, [questions]);

  useEffect(() => {
    try {
      localStorage.setItem('trust_question_papers', JSON.stringify(papers));
    } catch {
      // ignore
    }
  }, [papers]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (languageFilter !== 'ALL') {
        if (languageFilter === 'MATHEMATICS' && q.questionType !== 'NUMERICAL_MATH' && !q.subject.toLowerCase().includes('math'))
          return false;
        if (languageFilter === 'MARATHI' && q.language !== 'MARATHI') return false;
        if (languageFilter === 'HINDI' && q.language !== 'HINDI') return false;
        if (languageFilter === 'ENGLISH' && q.language !== 'ENGLISH') return false;
      }
      if (typeFilter !== 'ALL' && q.questionType !== typeFilter) return false;
      if (difficultyFilter !== 'ALL' && q.difficulty !== difficultyFilter) return false;
      if (!searchQuery) return true;
      const s = searchQuery.toLowerCase();
      return (
        q.questionText.toLowerCase().includes(s) ||
        q.chapterTopic.toLowerCase().includes(s) ||
        q.subject.toLowerCase().includes(s) ||
        q.code.toLowerCase().includes(s) ||
        (q.formulaUsed || '').toLowerCase().includes(s)
      );
    });
  }, [questions, languageFilter, typeFilter, difficultyFilter, searchQuery]);

  // Sort & Pagination for Questions
  const {
    sortedData: sortedQuestions,
    sortKey,
    sortDirection,
    handleSort,
  } = useTableSort<BankQuestion>(filteredQuestions, {
    defaultKey: 'code',
    defaultDirection: 'asc',
  });

  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    paginatedItems,
  } = usePagination(sortedQuestions, 6);

  // Summary Counts
  const metrics = useMemo(() => {
    const total = questions.length;
    const mathCount = questions.filter(
      (q) => q.questionType === 'NUMERICAL_MATH' || q.subject.toLowerCase().includes('math')
    ).length;
    const marathiCount = questions.filter((q) => q.language === 'MARATHI').length;
    const hindiCount = questions.filter((q) => q.language === 'HINDI').length;
    const englishCount = questions.filter((q) => q.language === 'ENGLISH').length;
    return { total, mathCount, marathiCount, hindiCount, englishCount, paperCount: papers.length };
  }, [questions, papers]);

  // Insert Symbol into Question Text
  const handleInsertSymbol = (sym: string) => {
    setNewQuestionForm((prev) => ({
      ...prev,
      questionText: (prev.questionText || '') + sym,
    }));
  };

  // Add Question to Bank
  const handleSaveNewQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionForm.questionText || !newQuestionForm.subject) return;

    const newQ: BankQuestion = {
      id: `qb-${Date.now()}`,
      code: `Q-${(newQuestionForm.subjectCode || 'GEN').toUpperCase()}-${Date.now().toString().slice(-4)}`,
      subject: newQuestionForm.subject || 'Mathematics & Geometry',
      subjectCode: newQuestionForm.subjectCode || 'MATH-10',
      gradeOrClass: newQuestionForm.gradeOrClass || 'Class 10-A',
      branchScope: newQuestionForm.branchScope || 'SCHOOL',
      chapterTopic: newQuestionForm.chapterTopic || 'General Topic',
      language: newQuestionForm.language || 'ENGLISH',
      questionType: newQuestionForm.questionType || 'SHORT',
      marks: Number(newQuestionForm.marks) || 2,
      difficulty: newQuestionForm.difficulty || 'MEDIUM',
      bloomLevel: newQuestionForm.bloomLevel || 'UNDERSTAND',
      questionText: newQuestionForm.questionText || '',
      formulaUsed: newQuestionForm.formulaUsed,
      correctAnswer: newQuestionForm.correctAnswer || 'See solution key',
      solutionExplanation: newQuestionForm.solutionExplanation,
      tags: newQuestionForm.tags || ['ExamQuestion'],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setQuestions((prev) => [newQ, ...prev]);
    triggerToast(`Question "${newQ.code}" added to Question Bank in ${newQ.language}!`);
    setShowAddQuestionModal(false);

    // Save to Backend API
    try {
      await fetch('http://localhost:5000/api/enterprise/question-bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQ),
      });
    } catch {
      // offline fallback
    }
  };

  // Delete Question
  const handleDeleteQuestion = async (id: string, code: string) => {
    if (confirm(`Remove question "${code}" from the question bank?`)) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      triggerToast(`Question ${code} removed.`);
      try {
        await fetch(`http://localhost:5000/api/enterprise/question-bank/${id}`, {
          method: 'DELETE',
        });
      } catch {
        // offline
      }
    }
  };

  // Auto-Pick Questions for Paper Assembling
  const handleAutoPickForPaper = () => {
    const targetMarks = Number(newPaperForm.maxMarks) || 40;
    const targetSubject = (newPaperForm.subject || '').toLowerCase();
    const targetLang = newPaperForm.language;

    const pool = questions.filter((q) => {
      const matchSub = q.subject.toLowerCase().includes(targetSubject) || targetSubject.includes(q.subject.toLowerCase());
      const matchLang = targetLang === 'BILINGUAL' || q.language === targetLang || targetLang === 'ENGLISH';
      return matchSub || matchLang;
    });

    let accumulated = 0;
    const picked: string[] = [];
    for (const q of pool) {
      if (accumulated + q.marks <= targetMarks + 2) {
        picked.push(q.id);
        accumulated += q.marks;
        if (accumulated >= targetMarks) break;
      }
    }

    setPaperSelectedQuestionIds(picked);
    triggerToast(`Smart algorithm auto-selected ${picked.length} questions totaling ${accumulated} marks!`);
  };

  // Save Assembled Question Paper
  const handleSaveAssembledPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedQuestions = questions.filter((q) => paperSelectedQuestionIds.includes(q.id));
    const totalSelectedMarks = resolvedQuestions.reduce((acc, q) => acc + q.marks, 0);

    const newPaper: QuestionPaper = {
      id: `qp-${Date.now()}`,
      paperCode: newPaperForm.paperCode || `QP-${Date.now().toString().slice(-6)}`,
      title: newPaperForm.title || 'Official Academic Examination Paper',
      subject: newPaperForm.subject || 'Mathematics',
      gradeOrClass: newPaperForm.gradeOrClass || 'Class 10-A',
      branchScope: newPaperForm.branchScope || 'SCHOOL',
      language: newPaperForm.language || 'ENGLISH',
      academicYear: newPaperForm.academicYear || academicYear,
      maxMarks: totalSelectedMarks || Number(newPaperForm.maxMarks) || 40,
      timeAllowedMinutes: Number(newPaperForm.timeAllowedMinutes) || 120,
      generalInstructions: newPaperForm.generalInstructions || [
        'All questions are compulsory.',
        'Figures to the right indicate full marks.',
      ],
      sections: [
        {
          sectionName:
            newPaperForm.language === 'MARATHI'
              ? 'विभाग १ - वस्तुनिष्ठ व संक्षिप्त प्रश्न'
              : newPaperForm.language === 'HINDI'
              ? 'खंड क - वस्तुनिष्ठ एवं लघु उत्तरीय प्रश्न'
              : 'Section A - Objective & Short Questions',
          targetMarks: Math.round(totalSelectedMarks * 0.4),
          questionIds: resolvedQuestions.slice(0, Math.ceil(resolvedQuestions.length / 2)).map((q) => q.id),
        },
        {
          sectionName:
            newPaperForm.language === 'MARATHI'
              ? 'विभाग २ - दीर्घोत्तरी व उपयोजित प्रश्न'
              : newPaperForm.language === 'HINDI'
              ? 'खंड ख - दीर्घ उत्तरीय एवं समस्या समाधान'
              : 'Section B - Long Answer & Problem Solving',
          targetMarks: Math.round(totalSelectedMarks * 0.6),
          questionIds: resolvedQuestions.slice(Math.ceil(resolvedQuestions.length / 2)).map((q) => q.id),
        },
      ],
      questions: resolvedQuestions,
      status: 'FINALIZED',
      createdDate: new Date().toISOString().split('T')[0],
      authorTeacher: newPaperForm.authorTeacher || 'Examination Cell',
    };

    setPapers((prev) => [newPaper, ...prev]);
    triggerToast(`Question Paper "${newPaper.title}" successfully created (${newPaper.maxMarks} marks)!`);
    setShowCreatePaperModal(false);
    setActiveTab('PAPERS');

    // Save to backend
    try {
      await fetch('http://localhost:5000/api/enterprise/question-papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPaper),
      });
    } catch {
      // offline
    }
  };

  const openPrintModal = (paper: QuestionPaper) => {
    setSelectedPaperForPrint(paper);
    setShowSolutionsInPrint(false);
    setShowPrintPaperModal(true);
  };

  const institution = getInstitutionDetails(
    selectedPaperForPrint?.branchScope === 'COLLEGE' ? 'COLLEGE' : 'SCHOOL'
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xl border border-emerald-700 animate-slide-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-600/20">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Question Bank & Question Paper Studio
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                Maths • मराठी • हिंदी • English
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Author mathematical formulas, Marathi & Hindi Devanagari questions, and assemble official board-format question papers
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setNewQuestionForm({
                subject: 'Mathematics & Analytical Geometry',
                subjectCode: 'MATH-10',
                gradeOrClass: 'Class 10-A',
                branchScope: 'SCHOOL',
                chapterTopic: 'Algebra & Quadratic Equations',
                language: 'ENGLISH',
                questionType: 'NUMERICAL_MATH',
                marks: 4,
                difficulty: 'MEDIUM',
                bloomLevel: 'APPLY',
                questionText: '',
                formulaUsed: '',
                correctAnswer: '',
                solutionExplanation: '',
                tags: ['TermEnd', 'BoardExam'],
              });
              setShowAddQuestionModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question to Bank</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPaperSelectedQuestionIds(['qb-math-01', 'qb-math-02', 'qb-math-03']);
              setShowCreatePaperModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Assemble Question Paper</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Mathematics & Formulas</div>
            <div className="text-xl font-extrabold text-slate-900">{metrics.mathCount} Questions</div>
            <div className="text-[11px] text-slate-500">Quadratic, Integrals, Geometry</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">मराठी भाषा (Marathi)</div>
            <div className="text-xl font-extrabold text-emerald-700">{metrics.marathiCount} Questions</div>
            <div className="text-[11px] text-emerald-600 font-medium">व्याकरण, समास, निबंध</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">हिंदी राष्ट्रभाषा (Hindi)</div>
            <div className="text-xl font-extrabold text-blue-700">{metrics.hindiCount} Questions</div>
            <div className="text-[11px] text-slate-500">संधि, मुहावरे, कबीर दोहे</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Assembled Papers</div>
            <div className="text-xl font-extrabold text-purple-700">{metrics.paperCount} Papers</div>
            <div className="text-[11px] text-slate-500">Board Ready & Printable</div>
          </div>
        </div>
      </div>

      {/* 3. Studio Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('BANK')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'BANK'
              ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-orange-600" />
          <span>Question Bank Repository ({questions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PAPERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'PAPERS'
              ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-orange-600" />
          <span>Official Question Papers ({papers.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. TAB 1: QUESTION BANK VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'BANK' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              {/* Language Pills */}
              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setLanguageFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    languageFilter === 'ALL' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Languages
                </button>
                <button
                  type="button"
                  onClick={() => setLanguageFilter('MATHEMATICS')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    languageFilter === 'MATHEMATICS' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Maths (गणित)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguageFilter('MARATHI')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    languageFilter === 'MARATHI' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  मराठी भाषा
                </button>
                <button
                  type="button"
                  onClick={() => setLanguageFilter('HINDI')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    languageFilter === 'HINDI' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  हिंदी
                </button>
                <button
                  type="button"
                  onClick={() => setLanguageFilter('ENGLISH')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    languageFilter === 'ENGLISH' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English
                </button>
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
              >
                <option value="ALL">All Question Types</option>
                <option value="NUMERICAL_MATH">Numerical / Math Formula</option>
                <option value="MCQ">Multiple Choice (MCQ)</option>
                <option value="SHORT">Short Answer (2-3 Marks)</option>
                <option value="LONG">Long Answer / Essay (4-8 Marks)</option>
              </select>

              {/* Difficulty Filter */}
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
              >
                <option value="ALL">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search formula, topic, शब्द..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          {/* Questions Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedItems.map((q) => {
              const isMarathi = q.language === 'MARATHI';
              const isHindi = q.language === 'HINDI';
              const isMath = q.questionType === 'NUMERICAL_MATH' || Boolean(q.formulaUsed);

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                          {q.code}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isMarathi
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : isHindi
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : isMath
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {q.language}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-extrabold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                          {q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            q.difficulty === 'EASY'
                              ? 'text-emerald-700 bg-emerald-50'
                              : q.difficulty === 'MEDIUM'
                              ? 'text-amber-700 bg-amber-50'
                              : 'text-rose-700 bg-rose-50'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Subject & Topic */}
                    <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                      <span className="font-bold text-slate-700">{q.subject}</span>
                      <span>{q.gradeOrClass}</span>
                    </div>
                    <div className="text-[11px] text-orange-700 font-semibold mb-2">
                      Topic: {q.chapterTopic}
                    </div>

                    {/* Question Text with Math/Devanagari Styling */}
                    <div
                      className={`text-slate-900 text-xs sm:text-sm font-medium whitespace-pre-line leading-relaxed ${
                        isMarathi || isHindi ? 'font-serif tracking-wide text-slate-950 text-sm' : ''
                      }`}
                    >
                      {q.questionText}
                    </div>

                    {/* Formula Callout */}
                    {q.formulaUsed && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-purple-50/80 border border-purple-200/80 text-[11px]">
                        <span className="font-bold text-purple-900 flex items-center gap-1">
                          <Calculator className="w-3.5 h-3.5 text-purple-600" />
                          Formula / सूत्र:
                        </span>
                        <div className="font-mono text-purple-950 font-bold mt-0.5 tracking-wide">
                          {q.formulaUsed}
                        </div>
                      </div>
                    )}

                    {/* MCQ Options */}
                    {q.options && q.options.length > 0 && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {q.options.map((opt, i) => (
                          <div
                            key={i}
                            className={`p-1.5 px-2.5 rounded-lg text-[11px] border ${
                              opt.startsWith(q.correctAnswer.charAt(0))
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Solution Snippet */}
                    <details className="mt-3 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                      <summary className="font-bold text-slate-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>View Model Answer & Marking Scheme</span>
                      </summary>
                      <div className="mt-2 pt-2 border-t border-slate-200 text-slate-800 space-y-1">
                        <div>
                          <strong className="text-emerald-800">Correct Answer: </strong>
                          {q.correctAnswer}
                        </div>
                        {q.solutionExplanation && (
                          <div className="text-slate-600 text-[10px]">
                            {q.solutionExplanation}
                          </div>
                        )}
                      </div>
                    </details>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {q.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setPaperSelectedQuestionIds((prev) =>
                            prev.includes(q.id) ? prev.filter((id) => id !== q.id) : [...prev, q.id]
                          );
                          triggerToast(
                            paperSelectedQuestionIds.includes(q.id)
                              ? `Question ${q.code} removed from paper staging.`
                              : `Question ${q.code} added to paper staging!`
                          );
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          paperSelectedQuestionIds.includes(q.id)
                            ? 'bg-emerald-600 text-white'
                            : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
                        }`}
                      >
                        {paperSelectedQuestionIds.includes(q.id) ? '✓ In Paper Staging' : '+ Add to Paper'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(q.id, q.code)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Question Bank Pagination */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200">
            <TablePagination
              currentPage={currentPage}
              totalItems={sortedQuestions.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 2: ASSEMBLED QUESTION PAPERS VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'PAPERS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {papers.map((paper) => {
              const totalQuestions = paper.questions.length;

              return (
                <div
                  key={paper.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Header Badge */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                        {paper.paperCode}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          paper.language === 'MARATHI'
                            ? 'bg-emerald-100 text-emerald-800'
                            : paper.language === 'HINDI'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {paper.language}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-slate-900 mt-2 leading-tight">
                      {paper.title}
                    </h3>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {paper.subject} • {paper.gradeOrClass}
                    </div>

                    {/* Paper Metrics Badge */}
                    <div className="my-3 p-3 rounded-xl bg-orange-50/70 border border-orange-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Max Marks</div>
                        <div className="text-base font-black text-orange-800">{paper.maxMarks} Marks</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Time Allowed</div>
                        <div className="text-base font-black text-slate-800">{paper.timeAllowedMinutes} Mins</div>
                      </div>
                    </div>

                    {/* Sections Preview */}
                    <div className="space-y-1.5 text-[11px] text-slate-600">
                      <div className="font-bold text-slate-700">Exam Sections:</div>
                      {paper.sections.map((sec, idx) => (
                        <div key={idx} className="flex items-center justify-between pl-2 border-l-2 border-orange-500">
                          <span className="truncate">{sec.sectionName}</span>
                          <span className="font-bold text-orange-700">{sec.targetMarks}M</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => openPrintModal(paper)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-xs cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Question Paper</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPaperForPrint(paper);
                        setShowSolutionsInPrint(true);
                        setShowPrintPaperModal(true);
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer"
                      title="View Marking Scheme & Solution Key"
                    >
                      Solutions
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: ADD QUESTION TO BANK */}
      {/* ========================================================================= */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileQuestion className="w-5 h-5" />
                <h2 className="font-extrabold text-sm sm:text-base">
                  Add Question to Bank (Maths • मराठी • हिंदी)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddQuestionModal(false)}
                className="p-1 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewQuestion} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Language & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Question Language / भाषा</label>
                  <select
                    value={newQuestionForm.language}
                    onChange={(e) =>
                      setNewQuestionForm((prev) => ({
                        ...prev,
                        language: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800"
                  >
                    <option value="ENGLISH">English (Mathematics / Science / Hospitality)</option>
                    <option value="MARATHI">मराठी (Marathi Language & Grammar)</option>
                    <option value="HINDI">हिंदी (Hindi Language & Literature)</option>
                    <option value="BILINGUAL_EN_MR">Bilingual (English + मराठी)</option>
                    <option value="BILINGUAL_EN_HI">Bilingual (English + हिंदी)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject & Grade</label>
                  <input
                    type="text"
                    required
                    value={newQuestionForm.subject}
                    onChange={(e) => setNewQuestionForm((prev) => ({ ...prev, subject: e.target.value }))}
                    placeholder="e.g. Mathematics & Geometry / मराठी व्याकरण"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                  />
                </div>
              </div>

              {/* Chapter & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chapter / Topic</label>
                  <input
                    type="text"
                    value={newQuestionForm.chapterTopic}
                    onChange={(e) => setNewQuestionForm((prev) => ({ ...prev, chapterTopic: e.target.value }))}
                    placeholder="e.g. Quadratic Equations"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Question Type</label>
                  <select
                    value={newQuestionForm.questionType}
                    onChange={(e) =>
                      setNewQuestionForm((prev) => ({
                        ...prev,
                        questionType: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="NUMERICAL_MATH">Numerical / Math Formula</option>
                    <option value="MCQ">Multiple Choice (MCQ)</option>
                    <option value="SHORT">Short Answer</option>
                    <option value="LONG">Long Answer / Essay</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marks Weightage</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={newQuestionForm.marks}
                    onChange={(e) => setNewQuestionForm((prev) => ({ ...prev, marks: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              {/* Math & Devanagari Quick Palette */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Calculator className="w-3.5 h-3.5 text-orange-600" />
                  <span>Quick Math & Devanagari Symbol Palette (Click to Insert):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {MATH_AND_DEVANAGARI_SYMBOLS.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleInsertSymbol(s.symbol)}
                      className="px-2 py-1 rounded-lg bg-white hover:bg-orange-100 hover:text-orange-900 border border-slate-200 text-xs font-bold transition-colors cursor-pointer"
                      title={s.label}
                    >
                      {s.symbol}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Question Text (Supports Math, मराठी, हिंदी) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={newQuestionForm.questionText}
                  onChange={(e) => setNewQuestionForm((prev) => ({ ...prev, questionText: e.target.value }))}
                  placeholder="Type examination question here. Use the palette above for √, ², π, Δ, or type in मराठी/हिंदी..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-orange-500/20 text-xs sm:text-sm"
                />
              </div>

              {/* Formula & Correct Answer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mathematical Formula Used (Optional)</label>
                  <input
                    type="text"
                    value={newQuestionForm.formulaUsed || ''}
                    onChange={(e) => setNewQuestionForm((prev) => ({ ...prev, formulaUsed: e.target.value }))}
                    placeholder="e.g. x = (-b ± √(b² - 4ac)) / (2a)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Correct Answer / Model Key</label>
                  <input
                    type="text"
                    required
                    value={newQuestionForm.correctAnswer || ''}
                    onChange={(e) => setNewQuestionForm((prev) => ({ ...prev, correctAnswer: e.target.value }))}
                    placeholder="e.g. x = 3, x = 1/2 or भावे प्रयोग"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                  />
                </div>
              </div>

              {/* Solution Explanation */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Teacher Solution & Scoring Scheme</label>
                <textarea
                  rows={2}
                  value={newQuestionForm.solutionExplanation || ''}
                  onChange={(e) => setNewQuestionForm((prev) => ({ ...prev, solutionExplanation: e.target.value }))}
                  placeholder="Step-by-step marking scheme for evaluator..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium text-xs"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-600/20 transition-all cursor-pointer"
                >
                  Save Question to Repository
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: ASSEMBLE NEW QUESTION PAPER */}
      {/* ========================================================================= */}
      {showCreatePaperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-200" />
                <h2 className="font-extrabold text-sm sm:text-base">
                  Assemble Official Question Paper
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowCreatePaperModal(false)}
                className="p-1 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssembledPaper} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Examination Title</label>
                  <input
                    type="text"
                    required
                    value={newPaperForm.title}
                    onChange={(e) => setNewPaperForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Term-End Examination October 2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject & Language Medium</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={newPaperForm.subject}
                      onChange={(e) => setNewPaperForm((prev) => ({ ...prev, subject: e.target.value }))}
                      placeholder="e.g. Mathematics"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                    />
                    <select
                      value={newPaperForm.language}
                      onChange={(e) =>
                        setNewPaperForm((prev) => ({
                          ...prev,
                          language: e.target.value as any,
                        }))
                      }
                      className="w-full px-2 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                    >
                      <option value="ENGLISH">English</option>
                      <option value="MARATHI">मराठी</option>
                      <option value="HINDI">हिंदी</option>
                      <option value="BILINGUAL">Bilingual</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Marks & Time */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Max Marks</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={newPaperForm.maxMarks}
                    onChange={(e) => setNewPaperForm((prev) => ({ ...prev, maxMarks: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-black text-orange-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Allowed (Mins)</label>
                  <input
                    type="number"
                    min="30"
                    max="240"
                    value={newPaperForm.timeAllowedMinutes}
                    onChange={(e) =>
                      setNewPaperForm((prev) => ({
                        ...prev,
                        timeAllowedMinutes: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                <div className="col-span-2 flex items-end">
                  <button
                    type="button"
                    onClick={handleAutoPickForPaper}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>Auto-Pick Questions from Bank</span>
                  </button>
                </div>
              </div>

              {/* Questions Picker Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-700">
                    Select Questions from Repository ({paperSelectedQuestionIds.length} Selected)
                  </label>
                  <span className="text-xs font-black text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    Total Marks: {questions.filter((q) => paperSelectedQuestionIds.includes(q.id)).reduce((a, b) => a + b.marks, 0)} / {newPaperForm.maxMarks}
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto border border-slate-200 p-2 rounded-2xl bg-slate-50">
                  {questions.map((q) => {
                    const isChecked = paperSelectedQuestionIds.includes(q.id);
                    return (
                      <label
                        key={q.id}
                        className={`flex items-start gap-2.5 p-2 rounded-xl border transition-all cursor-pointer select-none ${
                          isChecked ? 'bg-orange-50/80 border-orange-300' : 'bg-white border-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPaperSelectedQuestionIds((prev) => [...prev, q.id]);
                            } else {
                              setPaperSelectedQuestionIds((prev) => prev.filter((id) => id !== q.id));
                            }
                          }}
                          className="mt-0.5 rounded text-orange-600 focus:ring-orange-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 text-[11px]">
                            <span className="font-mono font-bold text-slate-900">{q.code}</span>
                            <span className="font-bold text-orange-700">{q.marks}M ({q.language})</span>
                          </div>
                          <p className="text-xs text-slate-700 truncate mt-0.5">{q.questionText}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreatePaperModal(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paperSelectedQuestionIds.length === 0}
                  className="px-5 py-2 rounded-xl font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  Generate Official Question Paper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL: OFFICIAL PRINTABLE QUESTION PAPER & MARKING SCHEME */}
      {/* ========================================================================= */}
      {showPrintPaperModal && selectedPaperForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-orange-400" />
                <span className="font-bold text-sm">
                  {showSolutionsInPrint ? 'Teacher Solution & Scoring Scheme' : 'Official Printable Question Paper'}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowSolutionsInPrint(!showSolutionsInPrint)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors cursor-pointer"
                >
                  {showSolutionsInPrint ? 'View Question Paper Only' : 'Include Solution Key'}
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPrintPaperModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Paper */}
            <div className="p-8 space-y-6 overflow-y-auto flex-1 bg-white text-slate-950 font-serif print:p-0">
              {/* Trust & Institute Header */}
              <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
                <div className="text-xs font-bold tracking-widest uppercase font-sans text-slate-500">
                  {institution.trustName}
                </div>
                <div className="text-xl font-black uppercase tracking-tight">
                  {institution.name}
                </div>
                <div className="text-sm font-bold tracking-wide mt-1">
                  {selectedPaperForPrint.title}
                </div>
              </div>

              {/* Exam Metadata & Roll No Block */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border-b border-slate-300 pb-3 font-sans">
                <div>
                  <span className="font-bold text-slate-600">Standard / Class: </span>
                  <span className="font-extrabold">{selectedPaperForPrint.gradeOrClass}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-600">Subject: </span>
                  <span className="font-extrabold">{selectedPaperForPrint.subject}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-600">Time / वेळ: </span>
                  <span className="font-extrabold">{selectedPaperForPrint.timeAllowedMinutes} Mins</span>
                </div>
                <div>
                  <span className="font-bold text-slate-600">Max Marks / गुण: </span>
                  <span className="font-extrabold text-orange-900">{selectedPaperForPrint.maxMarks}</span>
                </div>
              </div>

              {/* Student Seat No Block */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-300 font-sans text-xs">
                <div>
                  <strong>Seat No. / बैठक क्रमांक: </strong>
                  <span className="font-mono tracking-widest border-b border-dotted border-slate-500 px-8">
                    ___________________
                  </span>
                </div>
                <div>
                  <strong>Signature of Candidate: </strong>
                  <span className="border-b border-dotted border-slate-500 px-6">_____________</span>
                </div>
              </div>

              {/* General Instructions */}
              <div className="text-xs bg-slate-50/50 p-3 rounded border border-slate-200 space-y-1">
                <div className="font-bold font-sans">General Instructions / सर्वसाधारण सूचना:</div>
                <ol className="list-decimal list-inside space-y-0.5 text-slate-700">
                  {selectedPaperForPrint.generalInstructions.map((inst, idx) => (
                    <li key={idx}>{inst}</li>
                  ))}
                </ol>
              </div>

              {/* Paper Questions by Sections */}
              <div className="space-y-6 pt-2">
                {selectedPaperForPrint.sections.map((sec, secIdx) => {
                  const secQuestions = selectedPaperForPrint.questions.filter((q) =>
                    sec.questionIds.includes(q.id)
                  );

                  return (
                    <div key={secIdx} className="space-y-4">
                      {/* Section Header */}
                      <div className="border-b-2 border-slate-800 pb-1 flex items-center justify-between">
                        <h4 className="font-bold text-sm tracking-wide">{sec.sectionName}</h4>
                        <span className="font-sans font-bold text-xs">[{sec.targetMarks} Marks]</span>
                      </div>

                      {/* Questions */}
                      <div className="space-y-5">
                        {secQuestions.map((q, qIdx) => (
                          <div key={q.id} className="text-xs leading-relaxed space-y-2">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <span className="font-bold mr-2 font-sans">
                                  Q.{qIdx + 1})
                                </span>
                                <span className="whitespace-pre-line text-sm">{q.questionText}</span>

                                {/* Mathematical Formula Callout if any */}
                                {q.formulaUsed && (
                                  <div className="mt-1 font-mono text-[11px] bg-slate-50 p-1.5 rounded border border-slate-200">
                                    <strong>Formula: </strong> {q.formulaUsed}
                                  </div>
                                )}

                                {/* MCQ Options */}
                                {q.options && q.options.length > 0 && (
                                  <div className="grid grid-cols-2 gap-2 mt-2 pl-4">
                                    {q.options.map((opt, oIdx) => (
                                      <div key={oIdx}>{opt}</div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="font-sans font-bold text-xs whitespace-nowrap">
                                [{q.marks}]
                              </div>
                            </div>

                            {/* Optional Solution in Print */}
                            {showSolutionsInPrint && (
                              <div className="mt-2 p-3 rounded bg-emerald-50/80 border border-emerald-300 font-sans text-xs text-emerald-950">
                                <div className="font-bold text-emerald-900">
                                  Model Answer & Marking Scheme:
                                </div>
                                <div className="mt-0.5">{q.correctAnswer}</div>
                                {q.solutionExplanation && (
                                  <div className="text-slate-600 text-[10px] mt-1">
                                    {q.solutionExplanation}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* End of Question Paper */}
              <div className="text-center pt-8 border-t border-slate-300 text-xs text-slate-500 font-sans">
                *** END OF QUESTION PAPER / प्रश्नपत्रिका समाप्त ***
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
