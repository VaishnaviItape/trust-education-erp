import React, { useState } from 'react';
import {
  UtensilsCrossed,
  ChefHat,
  Award,
  Building,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Star,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Student, KitchenPracticalBatch, HotelInternship, ChefKitInventory } from '../types';
import { useTableSort, SortableTh } from './TableSort';
import { TablePagination, usePagination } from './TablePagination';

interface HotelMgmtModuleProps {
  students: Student[];
  kitchenLabs: KitchenPracticalBatch[];
  internships: HotelInternship[];
  chefKitInventory: ChefKitInventory[];
  initialTab?: 'LABS' | 'INTERNSHIPS' | 'STUDENTS' | 'INVENTORY';
  academicYear?: string;
  onOpenProgression?: () => void;
}

export const HotelMgmtModule: React.FC<HotelMgmtModuleProps> = ({
  students,
  kitchenLabs,
  internships,
  chefKitInventory,
  initialTab,
  academicYear = '2026-2027',
  onOpenProgression,
}) => {
  const [activeTab, setActiveTab] = useState<'LABS' | 'INTERNSHIPS' | 'STUDENTS' | 'INVENTORY'>(
    initialTab || 'LABS'
  );
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const collegeStudents = students.filter(
    (s) =>
      s.branchId === 'branch-hm-01' &&
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.hotelSpecialization && s.hotelSpecialization.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const {
    sortedData: sortedCollegeStudents,
    sortKey,
    sortDirection,
    handleSort,
  } = useTableSort<Student>(collegeStudents, {
    defaultKey: null,
    defaultDirection: 'asc',
  });

  const {
    currentPage: collegePage,
    setCurrentPage: setCollegePage,
    pageSize: collegePageSize,
    setPageSize: setCollegePageSize,
    paginatedItems: paginatedCollegeStudents,
  } = usePagination(sortedCollegeStudents, 10);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Sub-Tabs Navigation */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full mb-1">
            <ChefHat className="w-3.5 h-3.5" />
            Branch: Modern College Of Hotel Management And Technology Solapur
          </div>
          <h2 className="text-xl font-bold text-slate-900">Hospitality & Culinary Management</h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
          <button
            onClick={() => setActiveTab('LABS')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'LABS' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            Kitchen Labs
          </button>
          <button
            onClick={() => setActiveTab('INTERNSHIPS')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'INTERNSHIPS' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            5-Star Internships
          </button>
          <button
            onClick={() => setActiveTab('STUDENTS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'STUDENTS' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            Students ({collegeStudents.length})
          </button>
          <button
            onClick={() => setActiveTab('INVENTORY')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'INVENTORY' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Chef Kits
          </button>
        </div>
      </div>

      {/* TAB 1: KITCHEN PRACTICAL LAB ROSTERS */}
      {activeTab === 'LABS' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-center justify-between">
            <span>
              💡 <strong>Unique Feature:</strong> Manage commercial training kitchens, recipe topics, and practical batches tailored specifically for Hotel Management.
            </span>
            <span className="font-bold text-amber-800 bg-amber-200/60 px-2.5 py-1 rounded-full">
              {kitchenLabs.length} Active Kitchen Stations
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {kitchenLabs.map((lab) => (
              <div
                key={lab.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-orange-300 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">
                      {lab.labName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        lab.status === 'IN_PROGRESS'
                          ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {lab.status === 'IN_PROGRESS' ? 'Cooking in Progress' : 'Scheduled'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{lab.batchName}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 mb-4">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    {lab.timing}
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-xs mb-4">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Practical Menu Topic:
                    </div>
                    <div className="font-semibold text-slate-800 leading-relaxed">
                      {lab.menuTopic}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-medium text-[11px]">{lab.instructor}</span>
                  <span className="font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                    {lab.studentCount} Chefs
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: 5-STAR HOTEL INDUSTRIAL INTERNSHIPS (IT) */}
      {activeTab === 'INTERNSHIPS' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Luxury 5-Star Hotel Industrial Training (IT) Placements
                </h3>
                <p className="text-xs text-slate-500">
                  Mandatory 22-week practical internship tracking with hotel mentor feedback ratings.
                </p>
              </div>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                100% Placed
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {internships.map((it) => (
                <div key={it.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{it.studentName}</span>
                      <span className="text-xs text-slate-400 font-mono">({it.rollNo})</span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          it.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {it.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1">
                      <span className="font-extrabold text-orange-700 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        {it.hotelBrand}
                      </span>
                      <span>&bull;</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                        {it.department}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1">
                      Hotel Mentor: <strong>{it.mentorName}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:text-right">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-amber-900">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                      <span className="font-extrabold text-xs">{it.mentorRating} / 10</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COLLEGE STUDENTS */}
      {activeTab === 'STUDENTS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search hotel management student or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
              />
            </div>
            {onOpenProgression && (
              <button
                onClick={onOpenProgression}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <TrendingUp className="w-4 h-4" />
                Annual Progression & Carry Forward
              </button>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="erp-table-scroll">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px] shadow-2xs">
                  <tr>
                    <SortableTh label="Sr. No." sortKey="rollNo" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} align="center" className="w-12 text-center" />
                    <SortableTh label="Student & Roll No" sortKey="name" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3.5 px-4" />
                    <SortableTh label="Semester" sortKey="gradeOrSemester" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3.5 px-4" />
                    <SortableTh label="Specialization" sortKey="hotelSpecialization" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3.5 px-4" />
                    <SortableTh label="Fee Status" sortKey="feePending" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3.5 px-4" />
                    <SortableTh label="Attendance" sortKey="attendancePercent" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3.5 px-4" />
                    <SortableTh label="KYC" sortKey="kycStatus" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="py-3.5 px-4" />
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {paginatedCollegeStudents.map((stu, index) => {
                    const globalIndex = (collegePage - 1) * collegePageSize + index + 1;
                    return (
                      <tr key={stu.id} className="hover:bg-amber-50/20 transition-colors">
                        <td className="py-3.5 px-4 text-center font-bold text-slate-500 font-mono text-xs">{globalIndex}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{stu.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {stu.admissionNo} &bull; {stu.rollNo}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-800">
                            {stu.gradeOrSemester}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-orange-700">
                            {stu.hotelSpecialization || 'General Hospitality'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">
                            ₹ {stu.feePaid.toLocaleString()} / ₹ {stu.feeTotal.toLocaleString()}
                          </div>
                          {stu.feePending > 0 ? (
                            <div className="text-[11px] text-rose-600 font-semibold">
                              Due: ₹ {stu.feePending.toLocaleString()}
                            </div>
                          ) : (
                            <div className="text-[11px] text-emerald-600 font-semibold">
                              Fully Cleared
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {stu.attendancePercent}%
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            {stu.kycStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {onOpenProgression && (
                            <button
                              onClick={onOpenProgression}
                              title="Advance to next semester with pending fee carry forward"
                              className="bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-700 font-bold px-2.5 py-1.5 rounded-lg border border-amber-200 transition-all text-[11px] inline-flex items-center gap-1"
                            >
                              <TrendingUp className="w-3 h-3" />
                              Carry Fwd
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* College Students Table Pagination Controls */}
            <TablePagination
              currentPage={collegePage}
              totalItems={sortedCollegeStudents.length}
              pageSize={collegePageSize}
              pageSizeOptions={[5, 10, 25, 50]}
              onPageChange={setCollegePage}
              onPageSizeChange={setCollegePageSize}
              itemName="college students"
            />
          </div>
        </div>
      )}

      {/* TAB 4: CHEF TOOLKIT & UNIFORM INVENTORY */}
      {activeTab === 'INVENTORY' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            {chefKitInventory.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                  <Package className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{item.itemName}</h4>
                <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {item.kitType}
                </span>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Procured:</span>
                    <span className="font-bold text-slate-800">{item.totalStock} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Issued to Students:</span>
                    <span className="font-bold text-emerald-600">{item.issuedCount} units</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-2">
                    <span className="text-slate-500">Remaining in Store:</span>
                    <span className="font-extrabold text-orange-600">
                      {item.remainingStock} units
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
