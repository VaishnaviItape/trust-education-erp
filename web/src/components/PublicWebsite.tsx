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
  ChevronLeft,
  ChevronRight,
  Star,
  Search,
  BookOpen,
  Calendar,
  Sparkles,
  Users,
  Compass,
  FileQuestion,
  Clock,
  Check,
  ExternalLink,
  ChefHat,
  Bus,
  Layers,
  Quote,
} from 'lucide-react';
import { AdmissionEnquiry } from '../types';
import { TrustLogo } from './TrustLogo';

interface PublicWebsiteProps {
  onGoToPortal: (branch: 'TRUST' | 'SCHOOL' | 'COLLEGE') => void;
  enquiries: AdmissionEnquiry[];
  onAddEnquiry: (enquiry: AdmissionEnquiry) => void;
  onGoToInquiry?: () => void;
}

interface CourseItem {
  id: string;
  title: string;
  category: 'SCHOOL' | 'COLLEGE';
  department: string;
  campus: string;
  duration: string;
  rating: number;
  reviewsCount: number;
  feeEstimate: string;
  image: string;
  description: string;
  highlights: string[];
}

interface EventItem {
  id: string;
  title: string;
  day: string;
  month: string;
  time: string;
  campus: string;
  image: string;
  description: string;
  isFeatured?: boolean;
}

interface NewsItem {
  id: string;
  title: string;
  date: string;
  author: string;
  category: string;
  image: string;
  excerpt: string;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({
  onGoToPortal,
  enquiries,
  onAddEnquiry,
  onGoToInquiry,
}) => {
  // 1. Hero Carousel State
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  const heroSlides = [
    {
      tagline: 'FOSTERING EDUCATION FOR AMBITION',
      headline: 'WELCOME TO ZEP FOUNDATION',
      subHeadline: 'Modern Public School Bhose & Modern College of Hotel Management Solapur',
      description:
        'Empowering the next generation through holistic K-12 schooling with STEM innovation and grooming future executive chefs & hospitality leaders with guaranteed 5-star hotel internships.',
      primaryActionText: 'ADMISSION ENQUIRY 2026-27',
      secondaryActionText: 'EXPLORE OUR INSTITUTES',
      bgImage:
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=80',
    },
    {
      tagline: 'PREMIER 5-STAR HOSPITALITY CAREERS',
      headline: 'HOTEL MANAGEMENT & CULINARY ARTS',
      subHeadline: 'Modern College Of Hotel Management And Technology Solapur',
      description:
        'State-of-the-art commercial training kitchens, bakery labs, mock cocktail lounge, and industrial training placements with Taj, Marriott, Oberoi & Hyatt luxury resorts.',
      primaryActionText: 'APPLY FOR HOTEL MGMT',
      secondaryActionText: 'VIEW CULINARY LABS',
      bgImage:
        'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1800&q=80',
    },
    {
      tagline: 'PROGRESSIVE SCHOLASTIC EXCELLENCE',
      headline: 'MODERN PUBLIC SCHOOL & JUNIOR COLLEGE',
      subHeadline: 'Bhose, Tal. Pandharpur, Dist. Solapur • CBSE & Maharashtra State Board',
      description:
        'Nurturing scientific curiosity, robotics, smart digital classrooms, sports arenas, and safe live GPS-tracked bus transportation across rural and urban Solapur.',
      primaryActionText: 'APPLY FOR SCHOOL ADMISSION',
      secondaryActionText: 'EXPLORE ACADEMICS',
      bgImage:
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1800&q=80',
    },
  ];

  const handlePrevSlide = () => {
    setCurrentHeroSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentHeroSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  // 2. Popular Courses Data & Filtering
  const [courseFilter, setCourseFilter] = useState<'ALL' | 'SCHOOL' | 'COLLEGE'>('ALL');
  const [courseSlideIndex, setCourseSlideIndex] = useState(0);

  const courses: CourseItem[] = [
    {
      id: 'crs-bhm',
      title: 'B.Sc in Hotel Management & Catering Technology',
      category: 'COLLEGE',
      department: 'Hospitality & Culinary Management',
      campus: 'Hotel Mgmt Campus Solapur',
      duration: '3 Years (6 Semesters)',
      rating: 4.9,
      reviewsCount: 142,
      feeEstimate: '₹75,000 / Year',
      image:
        'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80',
      description:
        'Comprehensive degree program covering food production, beverage service, front office operations, and hospitality finance with guaranteed 5-star hotel internships.',
      highlights: ['BTK & Quantity Kitchen Labs', 'Taj & Marriott Internships', 'University Degree'],
    },
    {
      id: 'crs-jc',
      title: 'Junior College Science & Commerce (STD 11th - 12th)',
      category: 'SCHOOL',
      department: 'Higher Secondary Scholastic',
      campus: 'Modern Public School Bhose',
      duration: '2 Years (State Board + NEET/JEE)',
      rating: 4.8,
      reviewsCount: 98,
      feeEstimate: '₹42,000 / Year',
      image:
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      description:
        'Rigorous higher secondary education integrated with competitive exam mentoring in Physics, Chemistry, Mathematics, Biology, and Accountancy.',
      highlights: ['Advanced Science Labs', 'NEET & JEE Foundation', 'Smart Digital Classrooms'],
    },
    {
      id: 'crs-cbse',
      title: 'Secondary High School CBSE (STD 6th to 10th)',
      category: 'SCHOOL',
      department: 'Secondary School Education',
      campus: 'Modern Public School Bhose',
      duration: 'CBSE Curriculum',
      rating: 4.9,
      reviewsCount: 156,
      feeEstimate: '₹38,000 / Year',
      image:
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
      description:
        'Holistic education balancing STEM robotics, languages, mathematics, social sciences, arts, and physical fitness in an expansive eco-friendly campus.',
      highlights: ['Robotics & Coding Lab', 'GPS School Bus Fleet', '100% Board Exam Pass Record'],
    },
    {
      id: 'crs-bakery',
      title: 'Diploma in Food Production & Bakery Confectionery',
      category: 'COLLEGE',
      department: 'Culinary Arts & Patisserie',
      campus: 'Hotel Mgmt Campus Solapur',
      duration: '1.5 Years Professional',
      rating: 4.7,
      reviewsCount: 84,
      feeEstimate: '₹55,000 Total',
      image:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      description:
        'Hands-on vocational program focusing on artisan breads, French pastries, chocolate tempering, fondant cakes, and commercial bakery production.',
      highlights: ['Dedicated Bakery & Oven Suite', 'Industry Chef Mentorship', '100% Placement'],
    },
  ];

  const filteredCourses = courses.filter(
    (c) => courseFilter === 'ALL' || c.category === courseFilter
  );

  // 3. Search / Filter State for Search Banner
  const [searchProgramQuery, setSearchProgramQuery] = useState('');
  const [selectedCourseModal, setSelectedCourseModal] = useState<CourseItem | null>(null);

  // 4. Upcoming Events Data
  const events: EventItem[] = [
    {
      id: 'evt-1',
      title: 'Inter-School Science, Robotics & Innovation Expo',
      day: '15',
      month: 'NOV',
      time: '10:00 AM - 4:30 PM',
      campus: 'Bhose Campus Auditorium',
      image:
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
      description:
        'Over 30 schools competing in smart automation, drone robotics, renewable energy models, and working science exhibits evaluated by university professors.',
    },
    {
      id: 'evt-2',
      title: 'National Culinary Arts & Bakery Expo 2026',
      day: '29',
      month: 'OCT',
      time: '9:30 AM - 6:00 PM',
      campus: 'Hotel Management Campus, Solapur',
      image:
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      description:
        'Annual flagship hospitality convention featuring live masterclasses by 5-star executive chefs, mocktail mixology competitions, artisan bread display, and career recruitment panels.',
      isFeatured: true,
    },
    {
      id: 'evt-3',
      title: 'Annual Inter-House Sports & Cricket Championship',
      day: '08',
      month: 'DEC',
      time: '8:00 AM - 5:00 PM',
      campus: 'Bhose Sports Complex',
      image:
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
      description:
        'Athletics, cricket, volleyball, and kho-kho tournament celebrating teamwork, sportsmanship, and physical wellness across all standards.',
    },
  ];

  // 5. Testimonials Data
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const testimonials = [
    {
      name: 'Pooja Gaikwad',
      role: 'Parent of Class 10th Student, Bhose Campus',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      quote:
        'Modern Public School Bhose provides the ideal blend of academic rigor and moral values. The digital smart classrooms, caring teachers, and live GPS bus tracking give our family complete peace of mind. My daughter scored 94% in her prelims!',
      rating: 5,
    },
    {
      name: 'Chef Rahul Deshmukh',
      role: 'Alumni • Executive Sous Chef, Taj Hotels Mumbai',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      quote:
        'Studying at Modern College Of Hotel Management Solapur was the turning point of my life. The commercial kitchen practicals, bakery suites, and discipline drilled into us by the chef instructors prepared me directly for 5-star luxury hotel kitchens.',
      rating: 5,
    },
    {
      name: 'Rajendra Patil',
      role: 'Parent of Junior College Science Student',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      quote:
        'The specialized NEET and JEE preparation integrated right into the daily schedule saved us from expensive coaching classes in Pune. The teachers conduct doubt-clearing sessions every evening. Highly recommended!',
      rating: 5,
    },
  ];

  // 6. Recent News Data
  const newsList: NewsItem[] = [
    {
      id: 'news-1',
      title: 'Solapur University Honors Hotel Management Students for Culinary Innovation',
      date: '20 Oct 2026',
      author: 'College Desk',
      category: 'Hospitality Accolades',
      image:
        'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80',
      excerpt:
        'Third-year culinary interns won 1st prize at the State Hospitality Conclave for innovative millet-based bakery and confectionery recipes.',
    },
    {
      id: 'news-2',
      title: '100% Board Exam Result: Modern Public School Bhose Felicitates Toppers',
      date: '15 Oct 2026',
      author: 'Principal Desk',
      category: 'School Academics',
      image:
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
      excerpt:
        'For the fourth consecutive year, students achieved a flawless 100% pass result in CBSE board evaluations with 28 students securing distinction.',
    },
    {
      id: 'news-3',
      title: 'State-of-the-Art Commercial Bakery 2.0 Lab Inaugurated by Tourism Council',
      date: '10 Oct 2026',
      author: 'Trustee Board',
      category: 'Infrastructure',
      image:
        'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=600&q=80',
      excerpt:
        'Modern College Of Hotel Management expands its technical infrastructure with high-capacity rotary deck ovens, chocolate tempering units, and blast chillers.',
    },
  ];

  // 7. Embedded Quick Inquiry Form State
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
    }, 4500);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-orange-500 selection:text-white">
      {/* ========================================================= */}
      {/* 1. HERO SECTION (Full-Width Cinematic Carousel Banner)    */}
      {/* ========================================================= */}
      <section id="home" className="relative min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-slate-950 text-white">
        {/* Carousel Background Slide Image with Dark Cinematic Gradient */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
          style={{
            backgroundImage: `url(${heroSlides[currentHeroSlide].bgImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-purple-950/60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
        </div>

        {/* Left Floating Social Pill (Matching Screenshot) */}
        <div className="hidden sm:flex fixed left-3 top-1/2 -translate-y-1/2 z-40 flex-col gap-1.5 p-1 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700/80 shadow-xl">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 rounded-full bg-[#1877F2]/90 hover:bg-[#1877F2] text-white flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 shadow-xs"
            title="Facebook"
          >
            f
          </a>
          <a
            href="https://wa.me/919823011999"
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 rounded-full bg-[#25D366]/90 hover:bg-[#25D366] text-white flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 shadow-xs"
            title="WhatsApp Admissions"
          >
            wa
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 rounded-full bg-[#1DA1F2]/90 hover:bg-[#1DA1F2] text-white flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 shadow-xs"
            title="Twitter / X"
          >
            𝕏
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 rounded-full bg-[#0A66C2]/90 hover:bg-[#0A66C2] text-white flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 shadow-xs"
            title="LinkedIn"
          >
            in
          </a>
        </div>

        {/* Carousel Navigation Arrow - Left */}
        <button
          type="button"
          onClick={handlePrevSlide}
          className="absolute left-4 sm:left-10 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-orange-600 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs hover:scale-110"
          title="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Carousel Navigation Arrow - Right */}
        <button
          type="button"
          onClick={handleNextSlide}
          className="absolute right-4 sm:right-10 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-orange-600 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs hover:scale-110"
          title="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Content Overlay */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 sm:px-12 text-center pt-8 pb-24 sm:pb-32">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/60 border border-purple-400/40 text-purple-200 text-[11px] font-extrabold uppercase tracking-widest mb-4 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{heroSlides[currentHeroSlide].tagline}</span>
          </div>

          {/* Big Bold Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-tight max-w-4xl mx-auto drop-shadow-md">
            {heroSlides[currentHeroSlide].headline}
          </h1>

          {/* Institutional Subtitle */}
          <p className="text-sm sm:text-lg font-bold text-orange-400 mt-3 tracking-wide drop-shadow-xs">
            {heroSlides[currentHeroSlide].subHeadline}
          </p>

          {/* Descriptive Body */}
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
            {heroSlides[currentHeroSlide].description}
          </p>

          {/* Two Call to Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
            <button
              type="button"
              onClick={() => scrollToSection('popular-courses')}
              className="bg-transparent hover:bg-white/10 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl border border-white/40 hover:border-white transition-all cursor-pointer uppercase tracking-wider"
            >
              EXPLORE COURSES
            </button>

            {onGoToInquiry ? (
              <button
                type="button"
                onClick={onGoToInquiry}
                className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-xs px-7 py-3.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider flex items-center gap-2"
              >
                <span>{heroSlides[currentHeroSlide].primaryActionText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => scrollToSection('admissions-inquiry-box')}
                className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-xs px-7 py-3.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider flex items-center gap-2"
              >
                <span>{heroSlides[currentHeroSlide].primaryActionText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Slide Progress Indicators */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentHeroSlide(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentHeroSlide === i ? 'w-8 bg-orange-500' : 'w-2 bg-white/40'
                }`}
                title={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. 3 FLOATING HIGHLIGHT CARDS (Overlapping Hero Banner)    */}
      {/* ========================================================= */}
      <section className="relative z-30 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Schooling */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-900/10 border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-100 to-orange-100 text-purple-700 flex items-center justify-center mb-4 shadow-sm border border-purple-200 group-hover:scale-110 transition-transform">
              <Award className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
              Best Industry Leaders
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Exemplary CBSE K-12 schooling, STEM robotics, experiential physics-chemistry labs, and smart classrooms at Bhose Campus.
            </p>
            <button
              type="button"
              onClick={() => scrollToSection('campuses')}
              className="mt-5 px-6 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-sm cursor-pointer transition-all"
            >
              View More
            </button>
          </div>

          {/* Card 2: Hotel Management */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-900/10 border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-100 to-orange-100 text-purple-700 flex items-center justify-center mb-4 shadow-sm border border-purple-200 group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
              Learn Courses Online & Labs
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              B.Sc in Hotel Management & Bakery diplomas with commercial culinary suites and guaranteed 5-star luxury hotel placements.
            </p>
            <button
              type="button"
              onClick={() => scrollToSection('campuses')}
              className="mt-5 px-6 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-sm cursor-pointer transition-all"
            >
              View More
            </button>
          </div>

          {/* Card 3: Smart Campus & Fleet */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-900/10 border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-100 to-orange-100 text-purple-700 flex items-center justify-center mb-4 shadow-sm border border-purple-200 group-hover:scale-110 transition-transform">
              <BookOpen className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
              Book Library & More
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Rich physical & digital library, executive student hostels, live parent GPS bus fleet, and modern ERP tracking portal.
            </p>
            <button
              type="button"
              onClick={() => scrollToSection('campuses')}
              className="mt-5 px-6 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-sm cursor-pointer transition-all"
            >
              View More
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2B. CAMPUSES SHOWCASE SECTION (OUR INSTITUTES)           */}
      {/* ========================================================= */}
      <section id="campuses" className="py-20 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[10px] font-extrabold text-orange-700 uppercase tracking-widest bg-orange-100 border border-orange-200 px-3 py-1 rounded-full">
              Two Premier Campuses
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">
              Our Educational Centers
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Tailored academic pathways from kindergarten to luxury 5-star hospitality careers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* School Campus Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                  <School className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                    School & Junior College
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    Modern Public School And Junior College Bhose
                  </h3>
                </div>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Affiliated with CBSE and Maharashtra State Board. Features smart digital classrooms, robotics lab, extensive sports grounds, and live GPS bus tracking for parents.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  STEM science labs, robotics, and coding
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Live GPS parent bus tracker mobile app
                </li>
              </ul>
              {onGoToInquiry ? (
                <button
                  type="button"
                  onClick={onGoToInquiry}
                  className="mt-6 w-full py-3 rounded-xl font-bold text-xs bg-orange-600 hover:bg-orange-700 text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Apply for School Admission (Online Form)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => scrollToSection('admissions-inquiry-box')}
                  className="mt-6 w-full py-3 rounded-xl font-bold text-xs bg-orange-600 hover:bg-orange-700 text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Apply for School Admission</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* College Campus Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    Hospitality & Culinary Technology
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    Modern College Of Hotel Management Solapur
                  </h3>
                </div>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Accredited university degree and diplomas. Features commercial training kitchens, bakery suites, mock cocktail lounge, and 100% 5-star luxury hotel placements.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Commercial training kitchens & bakery suites
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Placements at Taj, Marriott, Oberoi & Hyatt
                </li>
              </ul>
              {onGoToInquiry ? (
                <button
                  type="button"
                  onClick={onGoToInquiry}
                  className="mt-6 w-full py-3 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Apply for College Admission (Online Form)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => scrollToSection('admissions-inquiry-box')}
                  className="mt-6 w-full py-3 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Apply for College Admission</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. POPULAR COURSES / ACADEMIC PROGRAMS (4 Cards Grid)     */}
      {/* ========================================================= */}
      <section id="popular-courses" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Orange Accent Bar & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-7 bg-orange-600 rounded-full shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Popular <span className="text-orange-600">Courses</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 pl-4">
              Explore premier accredited educational programs offered across our School & College campuses
            </p>
          </div>

          {/* Category Filter Pills & Carousel Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center p-1 bg-slate-100 rounded-xl">
              {(['ALL', 'SCHOOL', 'COLLEGE'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCourseFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    courseFilter === cat
                      ? 'bg-white text-orange-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'ALL' ? 'All Programs' : cat === 'SCHOOL' ? 'School & JC' : 'Hotel Mgmt'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCourseSlideIndex((prev) => Math.max(0, prev - 1))}
                className="w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                title="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCourseSlideIndex((prev) => prev + 1)}
                className="w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4-Column Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col group"
            >
              {/* Course Thumbnail Image */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-xs">
                  {course.category === 'COLLEGE' ? 'Hotel Mgmt' : 'K-12 School'}
                </span>
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-xs font-black bg-orange-600 text-white shadow-md">
                  {course.feeEstimate}
                </span>
              </div>

              {/* Course Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-orange-600 mb-1">
                    {course.campus}
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 ml-1">
                      {course.rating}
                    </span>
                  </div>

                  {/* Apply / View Button */}
                  {onGoToInquiry ? (
                    <button
                      type="button"
                      onClick={onGoToInquiry}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-xs transition-colors cursor-pointer"
                    >
                      Apply Now
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => scrollToSection('admissions-inquiry-box')}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-xs transition-colors cursor-pointer"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. ONLINE COURSES TO LEARN / SEARCH BANNER (Purple/Navy)   */}
      {/* ========================================================= */}
      <section
        id="search-programs"
        className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#2a0845] via-[#3b0764] to-[#1e1b4b] text-white overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
            Online Courses To Learn
          </h2>
          <p className="text-purple-200 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            Open Your Future Learning New Skills Across Schooling & 5-Star Hospitality
          </p>

          {/* Interactive Search Bar (Matching Reference) */}
          <div className="mt-8 max-w-2xl mx-auto flex items-center bg-white rounded-2xl p-1.5 shadow-2xl">
            <div className="flex-1 flex items-center pl-4 text-slate-800">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="What do you want to learn today? (e.g. CBSE 10th, B.Sc Hotel Mgmt, Bakery...)"
                value={searchProgramQuery}
                onChange={(e) => setSearchProgramQuery(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none bg-transparent placeholder:text-slate-400"
              />
            </div>
            <button
              type="button"
              onClick={() => scrollToSection('popular-courses')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs transition-colors cursor-pointer uppercase tracking-wider shrink-0"
            >
              Search
            </button>
          </div>

          {/* 3 Prominent Stat Counters (Matching Reference Purple Boxes) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 flex flex-col items-center">
              <div className="flex items-center gap-2 text-3xl font-black text-white">
                <Users className="w-6 h-6 text-orange-400" />
                <span>1,200+</span>
              </div>
              <div className="text-xs text-purple-200 font-bold uppercase tracking-wider mt-1.5">
                Active Enrolled Students
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 flex flex-col items-center">
              <div className="flex items-center gap-2 text-3xl font-black text-white">
                <BookOpen className="w-6 h-6 text-amber-400" />
                <span>45+</span>
              </div>
              <div className="text-xs text-purple-200 font-bold uppercase tracking-wider mt-1.5">
                Faculty & Master Chefs
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 flex flex-col items-center">
              <div className="flex items-center gap-2 text-3xl font-black text-white">
                <Award className="w-6 h-6 text-emerald-400" />
                <span>100%</span>
              </div>
              <div className="text-xs text-purple-200 font-bold uppercase tracking-wider mt-1.5">
                5-Star Hotel Placements
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. UPCOMING EVENTS SECTION                                */}
      {/* ========================================================= */}
      <section id="upcoming-events" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Upcoming <span className="text-orange-600">Events</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2">
            Stay updated with academic seminars, culinary expos, science fairs & sports championships
          </p>
        </div>

        {/* 3-Card Events Layout (Featuring Center Highlight Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {events.map((evt) => (
            <div
              key={evt.id}
              className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col ${
                evt.isFeatured
                  ? 'border-purple-300 shadow-xl shadow-purple-900/10 lg:-translate-y-2'
                  : 'border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover"
                />
                {/* Date Badge */}
                <div className="absolute top-3 left-3 bg-purple-900 text-white rounded-2xl p-2.5 text-center min-w-[56px] shadow-lg border border-purple-400/30">
                  <div className="text-xl font-black leading-none">{evt.day}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-purple-200 mt-0.5">
                    {evt.month}
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-orange-600 flex items-center gap-1.5 mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{evt.time}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-semibold truncate max-w-[180px]">
                    📍 {evt.campus}
                  </span>
                  <button
                    type="button"
                    onClick={() => scrollToSection('admissions-inquiry-box')}
                    className="text-orange-600 hover:text-orange-700 font-bold text-xs"
                  >
                    RSVP &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            type="button"
            onClick={() => scrollToSection('admissions-inquiry-box')}
            className="px-8 py-3 rounded-full text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md transition-all cursor-pointer uppercase tracking-wider"
          >
            View All Events
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. WHAT PEOPLE SAY (Testimonials in Deep Purple)           */}
      {/* ========================================================= */}
      <section
        id="testimonials"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#24083c] via-[#2f0854] to-[#1c0836] text-white relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-12 pb-4 border-b border-purple-800/60">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-7 bg-orange-500 rounded-full shrink-0" />
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                  WHAT PEOPLE <span className="text-orange-400">SAY</span>
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-purple-200 mt-1 pl-4">
                Hear from our proud parents, alumni executive chefs, and 5-star hotel recruiters
              </p>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setTestimonialIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
                }
                className="w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                title="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setTestimonialIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
                }
                className="w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2 White Testimonial Cards Side-by-Side (Matching Reference) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.slice(0, 2).map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 text-slate-800 shadow-xl relative flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-13 h-13 rounded-full object-cover border-2 border-orange-500 shadow-xs"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{item.name}</h4>
                      <p className="text-[11px] text-slate-500">{item.role}</p>
                    </div>
                  </div>
                  <div className="text-slate-300 font-serif text-5xl leading-none select-none">
                    ”
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{item.quote}"
                </p>

                <div className="flex items-center gap-1 mt-4 pt-3 border-t border-slate-100 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                  <span className="text-[10px] text-slate-400 font-bold ml-1.5">
                    Verified Feedback
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. RECENT NEWS SECTION                                    */}
      {/* ========================================================= */}
      <section id="recent-news" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-7 bg-orange-600 rounded-full shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Recent <span className="text-orange-600">News</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 pl-4">
              Latest institutional achievements, student accolades, and campus stories
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsList.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="h-44 overflow-hidden bg-slate-100">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold mb-2">
                    <span>📅 {news.date}</span>
                    <span>👤 {news.author}</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {news.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <span className="text-orange-600">Read More &rarr;</span>
                  <span className="text-[10px] text-slate-400 font-mono">03 Min Read</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. EMBEDDED INQUIRY FORM SECTION                          */}
      {/* ========================================================= */}
      <section
        id="admissions-inquiry-box"
        className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-orange-200 shadow-xl shadow-orange-600/5">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Direct Application
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Apply For Admission 2026-27
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Submit your inquiry below. Our admissions counselor will contact you within 24 hours.
            </p>
            {onGoToInquiry && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={onGoToInquiry}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3.5 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Looking for the full comprehensive admission application? Open Dedicated Inquiry Page &rarr;</span>
                </button>
              </div>
            )}
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
                      ? 'e.g. Class 7 or Nursery or STD 11 Science'
                      : 'e.g. B.Sc in Hotel Management / Diploma in Bakery'
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
                className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold py-3.5 rounded-xl text-xs transition-all shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <Send className="w-4 h-4" />
                <span>Submit Admission Enquiry</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 10. COMPREHENSIVE UNIVERSITY FOOTER (Matching Dark Theme) */}
      {/* ========================================================= */}
      <footer id="contact-footer" className="bg-[#0b101b] text-slate-400 text-xs border-t border-slate-800">
        {/* Top Branding Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <TrustLogo variant="horizontal" size="md" theme="white" />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-300 font-bold">Connect With Us:</span>
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-orange-600 text-white flex items-center justify-center transition-colors font-bold"
              >
                f
              </a>
              <a
                href="https://wa.me/919823011999"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors font-bold"
              >
                wa
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-orange-600 text-white flex items-center justify-center transition-colors font-bold"
              >
                𝕏
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-orange-600 text-white flex items-center justify-center transition-colors font-bold"
              >
                in
              </a>
            </div>

            {onGoToInquiry && (
              <button
                type="button"
                onClick={onGoToInquiry}
                className="ml-4 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs transition-colors cursor-pointer uppercase tracking-wider"
              >
                Apply Online
              </button>
            )}
          </div>
        </div>

        {/* 5-Column Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Newsletter */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Subscribe to get latest updates on admission dates, culinary events & board results.
            </p>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-1">
              <input
                type="email"
                placeholder="Your Email Address..."
                className="w-full px-3 py-1.5 text-xs text-white bg-transparent focus:outline-none placeholder:text-slate-500"
              />
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shrink-0 cursor-pointer"
              >
                &gt;
              </button>
            </div>
          </div>

          {/* Col 2: Trust Campuses */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
              Institutions
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('campuses')}
                  className="hover:text-orange-400 transition-colors"
                >
                  Modern Public School Bhose
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('campuses')}
                  className="hover:text-orange-400 transition-colors"
                >
                  Modern Junior College Bhose
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('campuses')}
                  className="hover:text-orange-400 transition-colors"
                >
                  Modern College Of Hotel Mgmt
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('campuses')}
                  className="hover:text-orange-400 transition-colors"
                >
                  Board of Trustees
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Programs */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
              Academics
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('popular-courses')}
                  className="hover:text-orange-400 transition-colors"
                >
                  B.Sc in Hotel Management
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('popular-courses')}
                  className="hover:text-orange-400 transition-colors"
                >
                  Bakery & Confectionery Diploma
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('popular-courses')}
                  className="hover:text-orange-400 transition-colors"
                >
                  CBSE Secondary High School
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('popular-courses')}
                  className="hover:text-orange-400 transition-colors"
                >
                  Junior College Science/Commerce
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Services & Campus Life */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
              Campus Life
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onGoToPortal('TRUST')}
                  className="hover:text-orange-400 transition-colors"
                >
                  Parent & Student Portal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('campuses')}
                  className="hover:text-orange-400 transition-colors"
                >
                  Live GPS Bus Fleet
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('campuses')}
                  className="hover:text-orange-400 transition-colors"
                >
                  Boys & Girls Hostels
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('campuses')}
                  className="hover:text-orange-400 transition-colors"
                >
                  Digital Library Archives
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Our Gallery (6 Images Thumbnail Grid Matching Reference) */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
              Our Gallery
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80"
                alt="Kitchen Lab"
                className="w-full h-14 object-cover rounded-lg border border-slate-800 hover:scale-105 transition-transform"
              />
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=150&q=80"
                alt="Classroom"
                className="w-full h-14 object-cover rounded-lg border border-slate-800 hover:scale-105 transition-transform"
              />
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=150&q=80"
                alt="Bakery"
                className="w-full h-14 object-cover rounded-lg border border-slate-800 hover:scale-105 transition-transform"
              />
              <img
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=150&q=80"
                alt="Science Lab"
                className="w-full h-14 object-cover rounded-lg border border-slate-800 hover:scale-105 transition-transform"
              />
              <img
                src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=150&q=80"
                alt="Sports"
                className="w-full h-14 object-cover rounded-lg border border-slate-800 hover:scale-105 transition-transform"
              />
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=150&q=80"
                alt="Graduation"
                className="w-full h-14 object-cover rounded-lg border border-slate-800 hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} <strong>Zep Foundation Bhose</strong>. All Rights Reserved. Reg. No: MH/EDU/TR-18452/SOLAPUR.
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onGoToPortal('TRUST')}
              className="hover:text-orange-400 font-bold flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
              <span>Trustee & Staff ERP Login</span>
            </button>
            <span>•</span>
            <span className="text-slate-400">
              Developed by <strong className="text-orange-400 font-bold">Vishnu Software Solutions</strong>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};