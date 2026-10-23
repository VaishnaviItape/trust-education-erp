import React, { useState } from 'react';
import {
  GraduationCap,
  School,
  UtensilsCrossed,
  CheckCircle2,
  Award,
  Send,
  Building,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { AdmissionEnquiry } from '../types';

interface PublicWebsiteProps {
  onGoToPortal: (branch: 'TRUST' | 'SCHOOL' | 'COLLEGE') => void;
  enquiries: AdmissionEnquiry[];
  onAddEnquiry: (enquiry: AdmissionEnquiry) => void;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({
  onGoToPortal,
  enquiries,
  onAddEnquiry,
}) => {
  const [formData, setFormData] = useState({
    applicantName: '',
    parentName: '',
    phone: '',
    targetBranch: 'SCHOOL' as 'SCHOOL' | 'COLLEGE',
    targetClassOrCourse: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicantName || !formData.phone) return;

    const newEnquiry: AdmissionEnquiry = {
      id: `enq-${Date.now()}`,
      applicantName: formData.applicantName,
      parentName: formData.parentName || 'Guardian',
      phone: formData.phone,
      targetBranch: formData.targetBranch,
      targetClassOrCourse:
        formData.targetClassOrCourse ||
        (formData.targetBranch === 'SCHOOL' ? 'Class 7 (CBSE)' : 'B.Sc in Hotel Management'),
      status: 'NEW',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddEnquiry(newEnquiry);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        applicantName: '',
        parentName: '',
        phone: '',
        targetBranch: 'SCHOOL',
        targetClassOrCourse: '',
      });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-orange-100 border border-white/30 mb-6">
            <Award className="w-4 h-4 text-amber-300" />
            Admissions Open for Academic Year 2026-2027
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
            Empowering Minds in <span className="text-amber-200 underline decoration-amber-300/40">Academics</span> & <span className="text-amber-200 underline decoration-amber-300/40">Hospitality</span>
          </h1>

          <p className="text-base sm:text-xl text-orange-100 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Under <strong>Zep Foundation Bhose</strong>, we nurture well-rounded scholars through world-class school education and groom future executive chefs, technology innovators & hospitality leaders.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#admissions-form"
              className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-orange-950/20 text-sm transition-all transform hover:-translate-y-0.5"
            >
              Apply for Admission Now
            </a>
            <a
              href="#campuses"
              className="bg-orange-700/60 hover:bg-orange-700 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/25 text-sm transition-all"
            >
              Explore Our Campuses &rarr;
            </a>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto text-left">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="text-3xl font-extrabold text-white">300+</div>
              <div className="text-xs text-orange-200 font-medium">Students Enrolled</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="text-3xl font-extrabold text-white">100%</div>
              <div className="text-xs text-orange-200 font-medium">Hotel Internships</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="text-3xl font-extrabold text-white">CBSE</div>
              <div className="text-xs text-orange-200 font-medium">School Curriculum</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="text-3xl font-extrabold text-white">21+</div>
              <div className="text-xs text-orange-200 font-medium">Years of Excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Two Institutions */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
            Our Campuses
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-3 tracking-tight">
            Two Premier Centers of Learning
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Tailored learning journeys from primary school to professional culinary & hospitality careers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1: School */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <School className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
              School & Junior College (CBSE / State Board)
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-3">
              Modern Public School And Junior College Bhose
            </h3>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              Nurturing character, academic excellence, STEM science labs, robotics, sports arenas, and safe GPS-tracked school bus transport.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                Live GPS Bus Tracking for parents on mobile
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                Smart digital classrooms with 100% attendance tracking
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                Dedicated Parent Mobile App with digital fee receipts
              </li>
            </ul>

            <a
              href="#admissions-form"
              className="mt-8 w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-xs"
            >
              Apply for School Admission
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Card 2: Hotel Management College */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md">
              Hospitality, Technology & Culinary Arts
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-3">
              Modern College Of Hotel Management And Technology Solapur
            </h3>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              State-of-the-art commercial training kitchens, bakery labs, mock cocktail bar, and guaranteed 6-month industrial internships in 5-star luxury hotels.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                Commercial Kitchens: BTK, Quantity Kitchen & Bakery
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                Internship Placements with Taj, Marriott, Oberoi & Hyatt
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                Student Mobile App with practical rosters & digital ID card
              </li>
            </ul>

            <a
              href="#admissions-form"
              className="mt-8 w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl text-xs transition-colors"
            >
              Apply for College Admission
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 3. Luxury 5-Star Hotel Placement Partners Strip */}
      <section className="bg-slate-50 border-y border-slate-200/90 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs uppercase tracking-widest text-slate-500 font-bold mb-6">
            Official 5-Star Hospitality Training & Placement Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-slate-600 font-extrabold text-base tracking-wider">
            <span className="hover:text-orange-600 transition-colors">TAJ HOTELS & RESORTS</span>
            <span className="hover:text-orange-600 transition-colors">JW MARRIOTT</span>
            <span className="hover:text-orange-600 transition-colors">THE OBEROI GROUP</span>
            <span className="hover:text-orange-600 transition-colors">HYATT REGENCY</span>
            <span className="hover:text-orange-600 transition-colors">ITC LUXURY HOTELS</span>
          </div>
        </div>
      </section>

      {/* 4. Online Admission Enquiry Form */}
      <section id="admissions-form" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-orange-200 shadow-xl shadow-orange-600/5">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
              Quick Application
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              Apply for Admission / Request a Callback
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Fill in your details below. Our admissions counselor will contact you within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-900 animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-bold text-lg">Enquiry Submitted Successfully!</h3>
              <p className="text-xs text-emerald-700 mt-1">
                Your enquiry has been instantly recorded into our Trust ERP database. Our team will contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student / Applicant Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={formData.applicantName}
                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Parent / Guardian Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Sharma"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98230 XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Interested Institution *
                  </label>
                  <select
                    value={formData.targetBranch}
                    onChange={(e) =>
                      setFormData({ ...formData, targetBranch: e.target.value as any })
                    }
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="SCHOOL">Modern Public School And Junior College Bhose</option>
                    <option value="COLLEGE">Modern College Of Hotel Management And Technology Solapur</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Grade or Course of Interest
                </label>
                <input
                  type="text"
                  placeholder={
                    formData.targetBranch === 'SCHOOL'
                      ? 'e.g. Class 7 or Nursery'
                      : 'e.g. B.Sc in Hospitality / Diploma in Bakery'
                  }
                  value={formData.targetClassOrCourse}
                  onChange={(e) =>
                    setFormData({ ...formData, targetClassOrCourse: e.target.value })
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-md shadow-orange-600/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Admission Enquiry
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 5. Footer & Trust Information */}
      <footer className="bg-white border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-3">
              <GraduationCap className="w-5 h-5 text-orange-600" />
              Zep Foundation Bhose
            </div>
            <p className="leading-relaxed">
              Reg. No: MH/EDU/TR-18452/SOLAPUR. Dedicated to progressive K-12 schooling at Bhose and premier professional hospitality & technology education at Solapur.
            </p>
          </div>
          <div>
            <div className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
              Campus Contacts
            </div>
            <p className="flex items-center gap-2 mb-2">
              <Phone className="w-3.5 h-3.5 text-orange-600" />
              +91 (0217) 260-8800 / +91 98230 11999
            </p>
            <p className="flex items-center gap-2 mb-2">
              <Mail className="w-3.5 h-3.5 text-orange-600" />
              admissions@zepfoundationbhose.org
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              Modern Campus, Bhose & Solapur, Maharashtra
            </p>
          </div>
          <div>
            <div className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
              Trust Administration
            </div>
            <button
              onClick={() => onGoToPortal('TRUST')}
              className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 font-bold px-4 py-2 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors text-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              Staff & Trustee Sign In &rarr;
            </button>
            <p className="mt-3 text-[11px] text-slate-400">
              &copy; {new Date().getFullYear()} Zep Foundation Bhose. All Rights Reserved.
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Developed by <strong className="text-orange-400 font-bold">Vishnu Software Solutions</strong>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
