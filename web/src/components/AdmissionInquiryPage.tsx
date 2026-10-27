import React, { useState } from 'react';
import {
  School,
  UtensilsCrossed,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Send,
  Printer,
  Sparkles,
  ShieldCheck,
  Building,
  HelpCircle,
  FileCheck,
  MessageCircle,
  AlertCircle,
  Award,
  Compass,
} from 'lucide-react';
import { AdmissionEnquiry } from '../types';
import { TrustLogo } from './TrustLogo';

interface AdmissionInquiryPageProps {
  onGoToHome: () => void;
  onGoToPortal: () => void;
  onSubmitEnquiry: (enquiry: AdmissionEnquiry) => Promise<any> | void;
}

export const AdmissionInquiryPage: React.FC<AdmissionInquiryPageProps> = ({
  onGoToHome,
  onGoToPortal,
  onSubmitEnquiry,
}) => {
  const [targetBranch, setTargetBranch] = useState<'SCHOOL' | 'COLLEGE'>('SCHOOL');
  const [formData, setFormData] = useState({
    applicantName: '',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
    dob: '',
    targetClassOrCourse: 'STD 8 - Secondary',
    previousSchool: '',
    previousPercentage: '',
    parentName: '',
    parentRelation: 'Father',
    phone: '',
    altPhone: '',
    email: '',
    city: 'Bhose / Solapur',
    address: '',
    needTransportOrHostel: true,
    preferredContactTime: 'Morning (9:00 AM - 12:00 PM)',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<AdmissionEnquiry | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Course / Grade Options based on Branch
  const schoolGradeOptions = [
    'Nursery / Jr. KG / Sr. KG (Pre-Primary)',
    'STD 1 - Primary',
    'STD 2 - Primary',
    'STD 3 - Primary',
    'STD 4 - Primary',
    'STD 5 - Primary',
    'STD 6 - Middle School',
    'STD 7 - Middle School',
    'STD 8 - Secondary',
    'STD 9 - Secondary (CBSE)',
    'STD 10 - Secondary Board (CBSE)',
    'STD 11 - Science (Junior College)',
    'STD 11 - Commerce (Junior College)',
    'STD 12 - Science (HSC / CBSE)',
    'STD 12 - Commerce (HSC / CBSE)',
  ];

  const collegeCourseOptions = [
    'B.Sc in Hospitality & Hotel Administration (3 Years Degree)',
    'Diploma in Food Production & Culinary Arts (1.5 Years)',
    'Diploma in Bakery & Confectionery (1.5 Years)',
    'Diploma in Front Office & Accommodation Operations (1 Year)',
    'Craftsmanship Course in Food & Beverage Service (6 Months)',
    'Executive Chef Fast-Track Certificate (1 Year)',
  ];

  const handleBranchChange = (branch: 'SCHOOL' | 'COLLEGE') => {
    setTargetBranch(branch);
    if (branch === 'SCHOOL') {
      setFormData((prev) => ({
        ...prev,
        targetClassOrCourse: 'STD 8 - Secondary',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        targetClassOrCourse: 'B.Sc in Hospitality & Hotel Administration (3 Years Degree)',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.applicantName.trim()) {
      setErrorMsg('Please enter student / applicant full name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile contact number.');
      return;
    }
    if (!formData.parentName.trim()) {
      setErrorMsg('Please enter parent or guardian name.');
      return;
    }

    setIsSubmitting(true);

    const generatedId = `INQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEnquiry: AdmissionEnquiry = {
      id: generatedId,
      applicantName: formData.applicantName.trim(),
      parentName: formData.parentName.trim(),
      parentRelation: formData.parentRelation,
      phone: formData.phone.trim(),
      altPhone: formData.altPhone.trim() || undefined,
      email: formData.email.trim() || undefined,
      targetBranch,
      targetClassOrCourse: formData.targetClassOrCourse,
      gender: formData.gender,
      dob: formData.dob || undefined,
      previousSchool: formData.previousSchool.trim() || undefined,
      city: formData.city.trim() || undefined,
      address: formData.address.trim() || undefined,
      needTransportOrHostel: formData.needTransportOrHostel,
      preferredContactTime: formData.preferredContactTime,
      notes: formData.notes.trim() || undefined,
      status: 'NEW',
      createdAt: new Date().toISOString().split('T')[0],
    };

    try {
      if (onSubmitEnquiry) {
        await onSubmitEnquiry(newEnquiry);
      }
      setSubmittedEnquiry(newEnquiry);
    } catch (err: any) {
      console.error('Error submitting enquiry:', err);
      setErrorMsg('Failed to submit admission enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const handleResetForm = () => {
    setSubmittedEnquiry(null);
    setFormData({
      applicantName: '',
      gender: 'MALE',
      dob: '',
      targetClassOrCourse: targetBranch === 'SCHOOL' ? 'STD 8 - Secondary' : 'B.Sc in Hospitality & Hotel Administration (3 Years Degree)',
      previousSchool: '',
      previousPercentage: '',
      parentName: '',
      parentRelation: 'Father',
      phone: '',
      altPhone: '',
      email: '',
      city: 'Bhose / Solapur',
      address: '',
      needTransportOrHostel: true,
      preferredContactTime: 'Morning (9:00 AM - 12:00 PM)',
      notes: '',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. Top Header & Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div
            onClick={onGoToHome}
            className="flex items-center gap-3 cursor-pointer select-none"
            title="Return to Home"
          >
            <TrustLogo variant="horizontal" size="md" />
            <div className="hidden md:block border-l border-slate-200 pl-3">
              <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                Admissions Portal
              </span>
              <p className="text-[11px] text-slate-500 font-medium">
                Academic Year 2026-2027
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToHome}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-orange-600 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Website</span>
            </button>

            <a
              href="tel:+919823011999"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200 px-3 py-2 rounded-xl hover:bg-orange-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Helpline: +91 98230 11999</span>
            </a>

            <button
              onClick={onGoToPortal}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden xs:inline">Staff</span> Sign In
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {submittedEnquiry ? (
            /* 3. SUCCESS / CONFIRMATION SLIP */
            <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl overflow-hidden animate-fade-in print:border-none print:shadow-none">
              {/* Slip Banner */}
              <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-8 text-center relative overflow-hidden">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-xs">
                  <CheckCircle2 className="w-10 h-10 text-emerald-100" />
                </div>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-wider text-emerald-100 mb-2">
                  Inquiry Recorded In Real-Time
                </span>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Admission Inquiry Successfully Registered!
                </h1>
                <p className="text-emerald-100 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
                  Your admission enquiry has been instantly transmitted to the <strong>Zep Foundation Bhose Central ERP System</strong>. Our senior admissions counselor will contact you shortly.
                </p>

                <div className="mt-4 inline-flex items-center gap-2 bg-white text-emerald-900 font-mono font-black text-sm sm:text-base px-4 py-2 rounded-xl shadow-sm">
                  <span>Reference ID:</span>
                  <span className="text-emerald-700">{submittedEnquiry.id}</span>
                </div>
              </div>

              {/* Slip Details Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Student Name</span>
                    <p className="font-black text-slate-900 text-base">{submittedEnquiry.applicantName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Gender: {submittedEnquiry.gender || 'Not specified'} | DOB: {submittedEnquiry.dob || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Institution & Program</span>
                    <p className="font-extrabold text-orange-600 text-sm">
                      {submittedEnquiry.targetBranch === 'SCHOOL'
                        ? 'Modern Public School And Junior College Bhose'
                        : 'Modern College Of Hotel Management And Technology Solapur'}
                    </p>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">
                      {submittedEnquiry.targetClassOrCourse}
                    </p>
                  </div>

                  <div className="border-t border-slate-200 pt-3">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Parent / Guardian Details</span>
                    <p className="font-bold text-slate-800 text-sm">
                      {submittedEnquiry.parentName} ({submittedEnquiry.parentRelation || 'Guardian'})
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Phone: <strong className="text-slate-900">{submittedEnquiry.phone}</strong>
                      {submittedEnquiry.email && ` | Email: ${submittedEnquiry.email}`}
                    </p>
                  </div>

                  <div className="border-t border-slate-200 pt-3">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Logistics & Preferred Window</span>
                    <p className="text-xs text-slate-700 font-medium">
                      Location: <strong>{submittedEnquiry.city || 'Bhose / Solapur'}</strong>
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Callback: {submittedEnquiry.preferredContactTime || 'Morning'}
                    </p>
                    <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                      {submittedEnquiry.needTransportOrHostel
                        ? submittedEnquiry.targetBranch === 'SCHOOL'
                          ? '✓ GPS School Bus Facility Requested'
                          : '✓ College Hostel Facility Requested'
                        : 'Own Transport Arrangements'}
                    </p>
                  </div>
                </div>

                {/* 4 Steps Counselor Timeline */}
                <div className="border border-slate-200 rounded-2xl p-5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4">
                    Next Steps in the Admission Process
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                      <div className="font-bold text-emerald-800">1. Instant Sync</div>
                      <div className="text-[11px] text-emerald-600 mt-0.5">Inquiry posted to Super Admin live dashboard.</div>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
                      <div className="font-bold text-orange-800">2. Tele-Counseling</div>
                      <div className="text-[11px] text-orange-600 mt-0.5">Academic advisor calls you to answer syllabus & fee queries.</div>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                      <div className="font-bold text-amber-800">3. Campus Visit</div>
                      <div className="text-[11px] text-amber-600 mt-0.5">Tour smart classrooms, science labs, or culinary kitchens.</div>
                    </div>
                    <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-200">
                      <div className="font-bold text-indigo-800">4. Final Admission</div>
                      <div className="text-[11px] text-indigo-600 mt-0.5">Document verification & formal seat confirmation.</div>
                    </div>
                  </div>
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 print:hidden">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrintSlip}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print / Save Acknowledgment
                    </button>

                    <a
                      href={`https://wa.me/919823011999?text=Hello%20Zep%20Foundation,%20I%20have%20submitted%20an%20admission%20inquiry%20(Ref:%20${submittedEnquiry.id})%20for%20${encodeURIComponent(submittedEnquiry.applicantName)}.%20Please%20guide%20me.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp Admissions Desk
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="inline-flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-orange-200 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Submit Another Inquiry
                    </button>

                    <button
                      type="button"
                      onClick={onGoToHome}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2"
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 4. ADMISSION INQUIRY FORM */
            <div className="bg-white rounded-3xl border border-orange-200 shadow-xl overflow-hidden">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white p-6 sm:p-10 relative">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-orange-100 border border-white/30 mb-3">
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  Official Admission Inquiry &bull; Academic Year 2026-2027
                </div>

                <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                  Prospective Student Admission Form
                </h1>

                <p className="text-orange-100 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                  Welcome to <strong>Zep Foundation Bhose</strong>. Please fill out this inquiry form to register your interest for <strong>Modern Public School Bhose</strong> or <strong>Modern College of Hotel Management and Technology Solapur</strong>.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 text-center text-xs">
                  <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/20">
                    <div className="font-extrabold text-amber-200 text-sm">Direct Callback</div>
                    <div className="text-[10px] text-orange-100">Within 24 Hours</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/20">
                    <div className="font-extrabold text-amber-200 text-sm">₹0 Application Fee</div>
                    <div className="text-[10px] text-orange-100">Free Registration</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/20">
                    <div className="font-extrabold text-amber-200 text-sm">Campus Visit</div>
                    <div className="text-[10px] text-orange-100">Guided Tours Open</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/20">
                    <div className="font-extrabold text-amber-200 text-sm">Live ERP Sync</div>
                    <div className="text-[10px] text-orange-100">Instant Super Admin Notification</div>
                  </div>
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
                {errorMsg && (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-800 text-xs animate-shake">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Section 1: Campus Selection */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="w-4 h-4 text-orange-600" />
                    <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
                      Step 1: Choose Desired Institution *
                    </h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* School Option */}
                    <button
                      type="button"
                      onClick={() => handleBranchChange('SCHOOL')}
                      className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                        targetBranch === 'SCHOOL'
                          ? 'border-orange-500 bg-orange-50/60 shadow-md shadow-orange-600/10'
                          : 'border-slate-200 bg-white hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center mb-3">
                          <School className="w-5 h-5" />
                        </div>
                        {targetBranch === 'SCHOOL' && (
                          <span className="bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                            Selected
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        Modern Public School And Junior College Bhose
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        CBSE & State Board Curriculum &bull; Nursery to 12th Std &bull; Science Labs & Sports
                      </p>
                      <span className="inline-block mt-3 text-[11px] font-bold text-orange-700">
                        Includes GPS Bus Facility &rarr;
                      </span>
                    </button>

                    {/* College Option */}
                    <button
                      type="button"
                      onClick={() => handleBranchChange('COLLEGE')}
                      className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                        targetBranch === 'COLLEGE'
                          ? 'border-amber-500 bg-amber-50/60 shadow-md shadow-amber-600/10'
                          : 'border-slate-200 bg-white hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                          <UtensilsCrossed className="w-5 h-5" />
                        </div>
                        {targetBranch === 'COLLEGE' && (
                          <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                            Selected
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        Modern College Of Hotel Management And Technology Solapur
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Hospitality & Culinary Arts &bull; Commercial Kitchens &bull; 100% 5-Star Placement
                      </p>
                      <span className="inline-block mt-3 text-[11px] font-bold text-amber-700">
                        Includes Taj & Marriott Internships &rarr;
                      </span>
                    </button>
                  </div>
                </div>

                {/* Section 2: Student & Academic Details */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-orange-600" />
                    <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
                      Step 2: Student & Academic Information
                    </h2>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Student Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aarav Ramesh Sharma"
                        value={formData.applicantName}
                        onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Gender
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Date of Birth (Optional)
                      </label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Target Grade or Course *
                      </label>
                      <select
                        value={formData.targetClassOrCourse}
                        onChange={(e) => setFormData({ ...formData, targetClassOrCourse: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white font-medium"
                      >
                        {targetBranch === 'SCHOOL'
                          ? schoolGradeOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))
                          : collegeCourseOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Current / Previous School or College
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Z.P. High School Bhose / Modern English Medium"
                        value={formData.previousSchool}
                        onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Previous Marks / Percentage
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 88.5% or Grade A"
                        value={formData.previousPercentage}
                        onChange={(e) => setFormData({ ...formData, previousPercentage: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Parent & Contact Details */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="w-4 h-4 text-orange-600" />
                    <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
                      Step 3: Parent & Communication Details
                    </h2>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Parent / Guardian Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Baburao Sharma"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Relationship
                      </label>
                      <select
                        value={formData.parentRelation}
                        onChange={(e) => setFormData({ ...formData, parentRelation: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Legal Guardian</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Primary Mobile Phone * (WhatsApp Enabled)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="9823011999"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full text-xs pl-12 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Alternate Contact / Landline
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 0217-2608800 or 98220XXXXX"
                        value={formData.altPhone}
                        onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. parent@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Address, Logistics & Preferences */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
                      Step 4: Location, Transport & Callback Preferences
                    </h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Town / Village / City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bhose, Pandharpur, Solapur, Barshi"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Preferred Window for Counselor Call
                      </label>
                      <select
                        value={formData.preferredContactTime}
                        onChange={(e) => setFormData({ ...formData, preferredContactTime: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      >
                        <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                        <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12:00 PM - 4:00 PM)</option>
                        <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
                        <option value="Anytime">Anytime during working hours</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Residential Address / Area
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Near Old Temple, Post Bhose, Taluka Pandharpur, Dist Solapur"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    {/* Facility Checkbox */}
                    <div className="sm:col-span-2 bg-orange-50/70 border border-orange-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="transportCheck"
                          checked={formData.needTransportOrHostel}
                          onChange={(e) =>
                            setFormData({ ...formData, needTransportOrHostel: e.target.checked })
                          }
                          className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500 cursor-pointer"
                        />
                        <label htmlFor="transportCheck" className="text-xs text-slate-800 font-semibold cursor-pointer select-none">
                          {targetBranch === 'SCHOOL'
                            ? 'Opt for GPS-Tracked School Bus Transport Facility (Safe daily pickup)'
                            : 'Opt for Verified College Hostel & Food Facility (Boys / Girls hostels)'}
                        </label>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                        Recommended
                      </span>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Specific Questions, Special Talents or Remarks
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Inquiring about sports academy, science lab robotics, or fee payment installment structure..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-sm py-4 rounded-2xl shadow-lg shadow-orange-600/25 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting Inquiry to Trust ERP...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Admission Inquiry & Request Callback</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-400 mt-3">
                    By submitting, you agree to receive a counseling call and admission updates from Zep Foundation Bhose.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* 5. Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 print:hidden">
        <p>
          &copy; {new Date().getFullYear()} Zep Foundation Bhose (Reg. No: MH/EDU/TR-18452/SOLAPUR). All Rights Reserved.
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          Integrated Multi-Branch Education ERP Platform
        </p>
      </footer>
    </div>
  );
};
