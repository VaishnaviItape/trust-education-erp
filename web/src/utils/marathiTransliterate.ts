/**
 * Marathi / Devanagari Phonetic Transliteration & Dictionary Engine
 * Enables seamless English (Roman script) to Marathi (Devanagari script) typing
 * for statutory school documents: School Leaving Certificate (LC), Bonafide, and General Register (GR).
 */

// Common Maharashtra Names, Surnames, Locations & Kinship terms dictionary
export const COMMON_MARATHI_DICTIONARY: Record<string, string> = {
  // Surnames
  patil: 'पाटील',
  deshmukh: 'देशमुख',
  kulkarni: 'कुलकर्णी',
  shinde: 'शिंदे',
  jadhav: 'जाधव',
  pawar: 'पवार',
  chavan: 'चव्हाण',
  kadam: 'कदम',
  gaikwad: 'गायकवाड',
  mane: 'माने',
  kale: 'काळे',
  kamble: 'कांबळे',
  bhosale: 'भोसले',
  bhosle: 'भोसले',
  joshi: 'जोशी',
  more: 'मोरे',
  sawant: 'सावंत',
  sharma: 'शर्मा',
  gupta: 'गुप्ता',
  verma: 'वर्मा',
  salunkhe: 'साळुंखे',
  inamdar: 'इनामदार',
  sheikh: 'शेख',
  sayyad: 'सय्यद',
  ansari: 'अन्सारी',
  khan: 'खान',
  patel: 'पटेल',
  shah: 'शाह',
  itape: 'इटपे',
  itpe: 'इटपे',
  iyer: 'अय्यर',
  iyye: 'आयए',

  // First Names (Boys)
  aarav: 'आरव',
  aafan: 'आफान',
  ali: 'अली',
  vihaan: 'विहान',
  vishnu: 'विष्णू',
  aditya: 'आदित्य',
  rohit: 'रोहित',
  rahul: 'राहुल',
  amit: 'अमित',
  suresh: 'सुरेश',
  santosh: 'संतोष',
  vijay: 'विजय',
  sanjeev: 'संजीव',
  rajesh: 'राजेश',
  milind: 'मिलिंद',
  pranav: 'प्रणव',
  omkar: 'ओमकार',
  atharva: 'अथर्व',
  siddharth: 'सिद्धार्थ',
  aryan: 'आर्यन',
  yash: 'यश',
  shubham: 'शुभम',
  abhishek: 'अभिषेक',
  tanmay: 'तन्मय',
  ganesh: 'गणेश',
  sachin: 'सचिन',

  // First Names (Girls)
  ananya: 'अनन्या',
  sneha: 'स्नेहा',
  priya: 'प्रिया',
  roshni: 'रोशनी',
  sunita: 'सुनिता',
  taranum: 'तरन्नुम',
  rohini: 'रोहिणी',
  pooja: 'पूजा',
  neha: 'नेहा',
  shreya: 'श्रेया',
  pranjal: 'प्रांजल',
  tanvi: 'तन्वी',
  riddhi: 'रिद्धी',
  siddhi: 'सिद्धी',
  aarohi: 'आरोही',
  sakshi: 'साक्षी',
  aishwarya: 'ऐश्वर्या',
  vaishnavi: 'वैष्णवी',
  swati: 'स्वाती',

  // Locations in Maharashtra
  solapur: 'सोलापूर',
  pune: 'पुणे',
  bhose: 'भोसे',
  hinjawadi: 'हिंजवडी',
  mumbai: 'मुंबई',
  pandharpur: 'पंढरपूर',
  kolhapur: 'कोल्हापूर',
  satara: 'सातारा',
  sangli: 'सांगली',
  nashik: 'नाशिक',
  nagpur: 'नागपूर',
  aurangabad: 'औरंगाबाद',
  chhatrapati_sambhajinagar: 'छत्रपती संभाजीनगर',
  thane: 'ठाणे',
  navi_mumbai: 'नवी मुंबई',
  maharashtra: 'महाराष्ट्र',
  india: 'भारत',

  // Religions & Castes
  hindu: 'हिंदू',
  muslim: 'मुस्लिम',
  buddhist: 'बौद्ध',
  jain: 'जैन',
  christian: 'ख्रिश्चन',
  sikh: 'शीख',
  maratha: 'मराठा',
  brahmin: 'ब्राह्मण',
  dhangar: 'धनगर',
  mali: 'माळी',
  vanjari: 'वंजारी',
  open: 'खुला',
  general: 'सर्वसाधारण',
  obc: 'इ.मा.व.',
  sc: 'अनु. जाती',
  st: 'अनु. जमाती',
  nt: 'वि.जा.भ.ज.',

  // Common titles
  kumar: 'कुमार',
  kumari: 'कुमारी',
  shri: 'श्री.',
  shrimati: 'श्रीमती',
};

// Vowel rules for standalone characters
const VOWELS: Record<string, string> = {
  a: 'अ',
  aa: 'आ',
  A: 'आ',
  i: 'इ',
  ee: 'ई',
  I: 'ई',
  u: 'उ',
  oo: 'ऊ',
  U: 'ऊ',
  e: 'ए',
  ai: 'ऐ',
  o: 'ओ',
  au: 'औ',
  ou: 'औ',
  am: 'अं',
  an: 'अं',
  ah: 'अः',
  ru: 'ऋ',
};

// Matras applied to preceding consonants
const MATRAS: Record<string, string> = {
  aa: 'ा',
  A: 'ा',
  a: '', // Inherent 'a' vowel
  i: 'ि',
  ee: 'ी',
  I: 'ी',
  u: 'ु',
  oo: 'ू',
  U: 'ू',
  e: 'े',
  ai: 'ै',
  o: 'ो',
  au: 'ौ',
  ou: 'ौ',
  am: 'ं',
  an: 'ं',
  ah: 'ः',
  ru: 'ृ',
};

// Consonant phonetic mappings
const CONSONANTS: Record<string, string> = {
  k: 'क',
  kh: 'ख',
  g: 'ग',
  gh: 'घ',
  ch: 'च',
  chh: 'छ',
  j: 'ज',
  jh: 'झ',
  t: 'त',
  th: 'थ',
  T: 'ट',
  Th: 'ठ',
  d: 'द',
  dh: 'ध',
  D: 'ड',
  Dh: 'ढ',
  n: 'न',
  N: 'ण',
  p: 'प',
  ph: 'फ',
  f: 'फ',
  b: 'ब',
  bh: 'भ',
  m: 'म',
  y: 'य',
  r: 'र',
  l: 'ल',
  v: 'व',
  w: 'व',
  sh: 'श',
  Sh: 'ष',
  shh: 'ष',
  s: 'स',
  h: 'ह',
  L: 'ळ',
  x: 'क्ष',
  ksh: 'क्ष',
  gy: 'ज्ञ',
  dny: 'ज्ञ',
  tr: 'त्र',
  shr: 'श्र',
};

/**
 * Phonetically transliterates a single English word to Marathi Devanagari.
 */
export function transliterateWord(rawWord: string): string {
  if (!rawWord) return '';

  const clean = rawWord.trim().toLowerCase();

  // 1. Check exact dictionary match
  if (COMMON_MARATHI_DICTIONARY[clean]) {
    return COMMON_MARATHI_DICTIONARY[clean];
  }

  // 2. Transliterate algorithmically
  let result = '';
  let i = 0;
  const len = rawWord.length;

  while (i < len) {
    // Check 3-character prefixes (e.g. ksh, chh, dny, shr)
    const three = rawWord.slice(i, i + 3).toLowerCase();
    if (CONSONANTS[three]) {
      const devConsonant = CONSONANTS[three];
      i += 3;
      // Check subsequent vowel/matra
      const { matra, consumed } = matchMatra(rawWord, i);
      i += consumed;
      result += devConsonant + matra;
      continue;
    }

    // Check 2-character prefixes (e.g. kh, gh, ch, jh, th, dh, ph, bh, sh, tr, gy, aa, ee, oo, ai, au)
    const two = rawWord.slice(i, i + 2).toLowerCase();
    if (CONSONANTS[two]) {
      const devConsonant = CONSONANTS[two];
      i += 2;
      const { matra, consumed } = matchMatra(rawWord, i);
      i += consumed;
      result += devConsonant + matra;
      continue;
    }

    if (i === 0 && VOWELS[two]) {
      result += VOWELS[two];
      i += 2;
      continue;
    }

    // Single character consonant
    const single = rawWord[i];
    const singleLower = single.toLowerCase();

    if (CONSONANTS[single] || CONSONANTS[singleLower]) {
      const devConsonant = CONSONANTS[single] || CONSONANTS[singleLower];
      i += 1;
      const { matra, consumed } = matchMatra(rawWord, i);
      i += consumed;
      result += devConsonant + matra;
      continue;
    }

    // Standalone vowel
    if (VOWELS[singleLower]) {
      result += VOWELS[singleLower];
      i += 1;
      continue;
    }

    // Keep numbers and punctuation as-is
    result += single;
    i += 1;
  }

  return result;
}

function matchMatra(str: string, index: number): { matra: string; consumed: number } {
  if (index >= str.length) {
    return { matra: '', consumed: 0 };
  }

  const two = str.slice(index, index + 2).toLowerCase();
  if (MATRAS[two] !== undefined) {
    return { matra: MATRAS[two], consumed: 2 };
  }

  const one = str[index].toLowerCase();
  if (MATRAS[one] !== undefined) {
    return { matra: MATRAS[one], consumed: 1 };
  }

  // Next char is another consonant -> apply Virama / Halant (्) for conjunct
  const nextIsConsonant = Boolean(CONSONANTS[one] || CONSONANTS[two]);
  if (nextIsConsonant) {
    return { matra: '्', consumed: 0 };
  }

  return { matra: '', consumed: 0 };
}

/**
 * Transliterates a full sentence / name with multiple words to Marathi Devanagari.
 * Example: "Aarav Santosh Patil" -> "आरव संतोष पाटील"
 */
export function transliterateToMarathi(text: string): string {
  if (!text) return '';

  return text
    .split(/(\s+)/)
    .map((token) => {
      if (/^\s+$/.test(token)) return token;
      return transliterateWord(token);
    })
    .join('');
}

/**
 * Returns phonetic suggestions for an input string.
 */
export function getMarathiSuggestions(input: string): string[] {
  if (!input || input.trim().length === 0) return [];

  const clean = input.trim().toLowerCase();
  const suggestions: string[] = [];

  // Special phonetic overrides like in Google Input Tools (e.g. iyye -> आयए, इय्ये, इयये, ईईई)
  const PHONETIC_PRESETS: Record<string, string[]> = {
    iyye: ['आयए', 'इय्ये', 'इयये', 'ईईई'],
    aye: ['आये', 'आयए', 'ऐये'],
    itape: ['इटपे', 'इतपे', 'ईटपे', 'ईतपे'],
    itpe: ['इटपे', 'इतपे', 'ईटपे'],
    vishnu: ['विष्णू', 'विष्णु', 'वीष्णू'],
    vaishnavi: ['वैष्णवी', 'वैष्णवि'],
    shinde: ['शिंदे', 'शिन्दे'],
    patil: ['पाटील', 'पाटिल'],
    pawar: ['पवार', 'पवाळ'],
    jadhav: ['जाधव', 'जाधो'],
    deshmukh: ['देशमुख', 'देशमूख'],
    kulkarni: ['कुलकर्णी', 'कुलकर्णि'],
  };

  if (PHONETIC_PRESETS[clean]) {
    return [...PHONETIC_PRESETS[clean], input];
  }

  // 1. Direct dictionary match
  if (COMMON_MARATHI_DICTIONARY[clean]) {
    suggestions.push(COMMON_MARATHI_DICTIONARY[clean]);
  }

  // 2. Dynamic algorithmic transliteration
  const dyn = transliterateToMarathi(input);
  if (dyn && !suggestions.includes(dyn)) {
    suggestions.push(dyn);
  }

  // 3. Match dictionary keys starting with query
  for (const [key, val] of Object.entries(COMMON_MARATHI_DICTIONARY)) {
    if (key.startsWith(clean) && !suggestions.includes(val)) {
      suggestions.push(val);
      if (suggestions.length >= 4) break;
    }
  }

  // 4. Generate common phonetic vowel / halant variations
  if (clean.includes('ee')) {
    const var1 = transliterateToMarathi(clean.replace(/ee/g, 'i'));
    if (var1 && !suggestions.includes(var1)) suggestions.push(var1);
  }
  if (clean.includes('oo')) {
    const var1 = transliterateToMarathi(clean.replace(/oo/g, 'u'));
    if (var1 && !suggestions.includes(var1)) suggestions.push(var1);
  }
  if (clean.endsWith('i')) {
    const var1 = transliterateToMarathi(clean.slice(0, -1) + 'ee');
    if (var1 && !suggestions.includes(var1)) suggestions.push(var1);
  }
  if (clean.endsWith('u')) {
    const var1 = transliterateToMarathi(clean.slice(0, -1) + 'oo');
    if (var1 && !suggestions.includes(var1)) suggestions.push(var1);
  }

  // Always append original English word as last choice
  if (!suggestions.includes(input)) {
    suggestions.push(input);
  }

  return suggestions.slice(0, 5);
}
