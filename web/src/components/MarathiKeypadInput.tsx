import React, { useState, useRef, useEffect } from 'react';
import {
  Keyboard,
  Sparkles,
  Delete,
  Check,
  X,
  Languages,
  RotateCcw,
  User,
} from 'lucide-react';
import {
  transliterateToMarathi,
  getMarathiSuggestions,
  COMMON_MARATHI_DICTIONARY,
} from '../utils/marathiTransliterate';

export interface MarathiKeypadInputProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  helperText?: string;
  autoTransliterateDefault?: boolean;
  quickWords?: string[];
  showUserIcon?: boolean;
}

// Comprehensive Devanagari / Marathi Keypad Sections
const SWAR = [
  'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः', 'ॲ', 'ऑ'
];

const VYANJAN_GROUPS = [
  { label: 'कवर्ग', keys: ['क', 'ख', 'ग', 'घ', 'ङ'] },
  { label: 'चवर्ग', keys: ['च', 'छ', 'ज', 'झ', 'ञ'] },
  { label: 'टवर्ग', keys: ['ट', 'ठ', 'ड', 'ढ', 'ण'] },
  { label: 'तवर्ग', keys: ['त', 'थ', 'द', 'ध', 'न'] },
  { label: 'पवर्ग', keys: ['प', 'फ', 'ब', 'भ', 'म'] },
  { label: 'इतर', keys: ['य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह', 'ळ'] },
  { label: 'संयुक्त', keys: ['क्ष', 'ज्ञ', 'त्र', 'श्र'] },
];

const MATRAS = [
  { label: 'ा (आ)', char: 'ा' },
  { label: 'ि (इ)', char: 'ि' },
  { label: 'ी (ई)', char: 'ी' },
  { label: 'ु (उ)', char: 'ु' },
  { label: 'ू (ऊ)', char: 'ू' },
  { label: 'े (ए)', char: 'े' },
  { label: 'ै (ऐ)', char: 'ै' },
  { label: 'ो (ओ)', char: 'ो' },
  { label: 'ौ (औ)', char: 'ौ' },
  { label: 'ं (अनुस्वार)', char: 'ं' },
  { label: 'ः (विसर्ग)', char: 'ः' },
  { label: 'ॅ (ॲ)', char: 'ॅ' },
  { label: 'ॉ (ऑ)', char: 'ॉ' },
  { label: '् (हलंत/जोड)', char: '्' },
  { label: 'ृ (ऋ)', char: 'ृ' },
];

const COMMON_CHIPS = [
  'पाटील',
  'देशमुख',
  'शिंदे',
  'जाधव',
  'पवार',
  'कुलकर्णी',
  'कदम',
  'चव्हाण',
  'गायकवाड',
  'काळे',
  'श्री.',
  'श्रीमती',
  'कुमार',
  'कुमारी',
  'सोलापूर',
  'पुणे',
  'भोसे',
  'महाराष्ट्र',
];

export const MarathiKeypadInput: React.FC<MarathiKeypadInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'मराठीत नाव टाईप करा (उदा. वैष्णवी विष्णू इटपे)...',
  required = false,
  className = '',
  helperText,
  autoTransliterateDefault = true,
  quickWords,
  showUserIcon = true,
}) => {
  const [showKeypad, setShowKeypad] = useState(false);
  const [autoTransliterate, setAutoTransliterate] = useState(autoTransliterateDefault);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Commit chosen suggestion into the input text
  const commitSuggestion = (suggested: string) => {
    const text = value || '';
    const words = text.split(' ');
    // Replace the trailing active word
    words[words.length - 1] = suggested;
    const combined = words.join(' ') + ' ';
    onChange(combined);
    setSuggestions([]);
    setShowDropdown(false);
    setSelectedIndex(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Keyboard navigation for dropdown suggestions (Up, Down, Enter, Tab, Space, Escape)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showDropdown && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        commitSuggestion(suggestions[selectedIndex] || suggestions[0]);
        return;
      }
      if (e.key === ' ') {
        e.preventDefault();
        commitSuggestion(suggestions[selectedIndex] || suggestions[0]);
        return;
      }
      if (e.key === 'Escape') {
        setShowDropdown(false);
        setSuggestions([]);
        return;
      }
    }
  };

  // Handle standard input change with smart phonetic transliteration
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;

    if (autoTransliterate) {
      // If user typed trailing space, commit transliteration immediately
      if (newVal.endsWith(' ') && newVal.trim().length > 0) {
        const words = newVal.trim().split(/\s+/);
        const lastWord = words[words.length - 1];
        if (/[a-zA-Z]/.test(lastWord)) {
          const converted = transliterateToMarathi(newVal);
          onChange(converted);
          setShowDropdown(false);
          setSuggestions([]);
          return;
        }
      }

      // Check the current active word being typed
      const words = newVal.split(' ');
      const currentWord = words[words.length - 1];

      if (/[a-zA-Z]/.test(currentWord) && currentWord.length >= 1) {
        const suggs = getMarathiSuggestions(currentWord);
        setSuggestions(suggs);
        setSelectedIndex(0);
        setShowDropdown(suggs.length > 0);
      } else {
        setShowDropdown(false);
        setSuggestions([]);
      }
    }

    onChange(newVal);
  };

  // Direct paste support: auto-transliterates English text pasted into Marathi field
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (pasted && /[a-zA-Z]/.test(pasted)) {
      e.preventDefault();
      const marathiPasted = transliterateToMarathi(pasted);
      const input = inputRef.current;
      if (input) {
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        const current = value || '';
        const updated = current.slice(0, start) + marathiPasted + current.slice(end);
        onChange(updated);
        setTimeout(() => {
          input.setSelectionRange(start + marathiPasted.length, start + marathiPasted.length);
        }, 0);
      } else {
        onChange(marathiPasted);
      }
      setShowDropdown(false);
      setSuggestions([]);
    }
  };

  // Append key from Indian Devanagari keypad
  const handleKeyClick = (char: string) => {
    const updated = (value || '') + char;
    onChange(updated);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Backspace on keypad
  const handleBackspace = () => {
    if (!value || value.length === 0) return;
    const updated = value.slice(0, -1);
    onChange(updated);
  };

  // Clear text
  const handleClear = () => {
    onChange('');
    setSuggestions([]);
    setShowDropdown(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (ev: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(ev.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(ev.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label & Transliteration Controls Header */}
      <div className="flex items-center justify-between flex-wrap gap-1">
        {label && (
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}

        <div className="flex items-center gap-1.5 ml-auto text-[11px]">
          {/* Smart Transliteration Mode Indicator */}
          <button
            type="button"
            onClick={() => setAutoTransliterate(!autoTransliterate)}
            title="Toggle English-to-Marathi phonetic typing"
            className={`px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer border ${
              autoTransliterate
                ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800'
                : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            <Languages className="w-3 h-3" />
            <span>मराठी ऑटो-टाईप: {autoTransliterate ? 'चालू' : 'बंद'}</span>
          </button>

          {/* Keypad Trigger Button */}
          <button
            type="button"
            onClick={() => setShowKeypad(!showKeypad)}
            title="Open On-Screen Marathi Devanagari Keypad"
            className={`px-2.5 py-0.5 rounded-lg font-extrabold flex items-center gap-1 transition-all cursor-pointer border shadow-2xs ${
              showKeypad
                ? 'bg-orange-600 text-white border-orange-600'
                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-orange-400 hover:text-orange-600'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            <span>कीपॅड</span>
          </button>
        </div>
      </div>

      {/* Input Field Container with Person Icon & Floating Suggestions Popup */}
      <div className="relative">
        {showUserIcon && (
          <User className="w-4 h-4 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
        )}

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          required={required}
          className={`w-full text-xs font-bold ${
            showUserIcon ? 'pl-9' : 'pl-3.5'
          } pr-8 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-sans`}
        />

        {value && value.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            title="Clear text"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Floating Google Input Tools / Indic IME Dropdown Popup */}
        {showDropdown && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute left-8 top-full mt-1 z-50 w-44 bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in"
          >
            {suggestions.map((sug, idx) => {
              const isSelected = selectedIndex === idx;
              const isOriginalEnglish = idx === suggestions.length - 1 && /[a-zA-Z]/.test(sug);

              return (
                <button
                  key={idx}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    commitSuggestion(sug);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3 py-2 text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#38b2ac] text-white'
                      : isOriginalEnglish
                      ? 'text-slate-500 border-t border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-mono text-[11px]'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="font-sans">{sug}</span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-white shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {helperText && (
        <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-1">
          {helperText}
        </p>
      )}

      {/* Interactive Indian Devanagari On-Screen Keypad Popover */}
      {showKeypad && (
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-orange-400/80 shadow-2xl space-y-3 animate-scale-in text-xs z-30">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center font-black text-xs">
                म
              </span>
              <div>
                <h4 className="font-black text-slate-900 dark:text-white leading-tight">
                  भारतीय मराठी देवनागरी कीपॅड
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  अक्षरे किंवा मात्रा क्लिक करा. इंग्रजीत टाइप केल्यास आपोआप मराठी होईल.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowKeypad(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Common Words & Surnames */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              प्रचलित आडनावे व पदवी (Quick Chips)
            </div>
            <div className="flex items-center gap-1.5 flex-wrap max-h-20 overflow-y-auto erp-workspace-scroll py-0.5">
              {(quickWords && quickWords.length > 0 ? quickWords : COMMON_CHIPS).map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleKeyClick(chip + ' ')}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* 1. स्वर (Vowels) */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              स्वर (Vowels)
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {SWAR.map((char) => (
                <button
                  key={char}
                  type="button"
                  onClick={() => handleKeyClick(char)}
                  className="w-8 h-8 rounded-lg font-extrabold text-sm bg-slate-50 dark:bg-slate-800 hover:bg-orange-600 hover:text-white text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  {char}
                </button>
              ))}
            </div>
          </div>

          {/* 2. मात्रा व चिन्हे (Matras) */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              मात्रा व चिन्हे (Vowel Diacritics & Halant)
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {MATRAS.map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => handleKeyClick(m.char)}
                  title={m.label}
                  className="px-2 h-8 rounded-lg font-extrabold text-sm bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-600 hover:text-white text-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-800 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  {m.char}
                </button>
              ))}
            </div>
          </div>

          {/* 3. व्यंजन (Consonants) */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              व्यंजन (Consonants)
            </div>
            <div className="space-y-1">
              {VYANJAN_GROUPS.map((grp) => (
                <div key={grp.label} className="flex items-center gap-1 flex-wrap">
                  {grp.keys.map((char) => (
                    <button
                      key={char}
                      type="button"
                      onClick={() => handleKeyClick(char)}
                      className="w-8 h-8 rounded-lg font-bold text-sm bg-slate-50 dark:bg-slate-800 hover:bg-orange-600 hover:text-white text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                    >
                      {char}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Keypad Utility Bar */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleKeyClick(' ')}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                ␣ स्पेस (Space)
              </button>

              <button
                type="button"
                onClick={handleBackspace}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1 cursor-pointer"
              >
                <Delete className="w-3.5 h-3.5" />
                <span>मागे (⌫)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowKeypad(false)}
              className="px-4 py-1.5 rounded-xl text-xs font-extrabold bg-orange-600 hover:bg-orange-700 text-white shadow-xs cursor-pointer flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>झाले (Done)</span>
            </button>
          </div>
        </div>
      )}

      {helperText && (
        <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">
          {helperText}
        </p>
      )}
    </div>
  );
};
