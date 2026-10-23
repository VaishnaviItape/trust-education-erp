import React, { useState } from 'react';
import {
  BookOpen,
  Home,
  Bus,
  Package,
  UserCheck,
  Plus,
  Printer,
  Search,
  CheckCircle2,
  Barcode,
  Camera,
  Calendar,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { useTableSort, SortableTh } from './TableSort';

export const CampusAuxiliaryModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'LIBRARY' | 'HOSTEL' | 'TRANSPORT' | 'INVENTORY' | 'VISITOR'>('VISITOR');
  const [showGatePassModal, setShowGatePassModal] = useState(false);
  const [printedPass, setPrintedPass] = useState<any | null>(null);
  const [editingVisitor, setEditingVisitor] = useState<any | null>(null);
  const [deletingVisitor, setDeletingVisitor] = useState<any | null>(null);
  const [editingBook, setEditingBook] = useState<any | null>(null);
  const [deletingBook, setDeletingBook] = useState<any | null>(null);
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<any | null>(null);
  const [editingAsset, setEditingAsset] = useState<any | null>(null);
  const [deletingAsset, setDeletingAsset] = useState<any | null>(null);

  // Visitor Gate Passes
  const [visitorPasses, setVisitorPasses] = useState([
    {
      id: 'gp-01',
      passNo: 'GP-2026-0042',
      visitorName: 'Mahesh Sharma',
      phone: '+91 98229 44112',
      purpose: 'Standard 8 Admission & Campus Tour',
      whomToMeet: 'Principal Sunita Kulkarni',
      inTime: '10:15 AM',
      outTime: 'Still Inside',
      status: 'INSIDE_CAMPUS',
    },
    {
      id: 'gp-02',
      passNo: 'GP-2026-0043',
      visitorName: 'Chef Rahul Kapoor (Taj Vivanta)',
      phone: '+91 98229 88991',
      purpose: 'Guest Lecture & Kitchen Inspection',
      whomToMeet: 'Director Chef Sanjeev Menon',
      inTime: '11:00 AM',
      outTime: '01:30 PM',
      status: 'EXITED',
    },
  ]);

  // Form State for Visitor Pass
  const [newVisitor, setNewVisitor] = useState({
    name: '',
    phone: '',
    purpose: '',
    whomToMeet: 'Principal Sunita Kulkarni',
  });

  // Library Books
  const [libraryBooks, setLibraryBooks] = useState([
    {
      id: 'bk-01',
      isbn: '978-0131103627',
      barcode: 'LIB-BK-1001',
      title: 'The C Programming Language',
      author: 'Kernighan & Ritchie',
      available: 7,
      total: 10,
      rack: 'Shelf B-3',
    },
    {
      id: 'bk-02',
      isbn: '978-0471292777',
      barcode: 'LIB-BK-2002',
      title: 'Professional Cooking & Master Culinary Techniques',
      author: 'Wayne Gisslen',
      available: 12,
      total: 15,
      rack: 'Culinary Section C-1',
    },
  ]);

  // Hostel Rooms
  const [hostelRooms, setHostelRooms] = useState([
    { block: 'Tagore Boys Block', roomNo: 'Room 101', beds: '2/2 Full', occupants: 'Rohan Deshmukh, Aditya More' },
    { block: 'Tagore Boys Block', roomNo: 'Room 102', beds: '1/2 Available', occupants: 'Kabir Verma, [Vacant Bed B]' },
    { block: 'Sarojini Girls Block', roomNo: 'Room 201', beds: '2/2 Full', occupants: 'Ananya Patel, Pooja Kulkarni' },
  ]);

  // Inventory Items & GRN
  const [inventoryItems, setInventoryItems] = useState([
    { code: 'KIT-KNIFE-01', name: 'Master Chef 8-inch French Chef Knife', stock: 45, unit: 'PCS', category: 'Kitchen Equipment' },
    { code: 'STAT-A4-02', name: 'A4 Printing Paper Cartons (75 GSM)', stock: 120, unit: 'REAMS', category: 'Stationery' },
    { code: 'LAB-REAG-03', name: 'Sodium Hydroxide Analytical Grade', stock: 18, unit: 'BOTTLES', category: 'Science Lab' },
  ]);

  const {
    sortedData: sortedLibraryBooks,
    sortKey: librarySortKey,
    sortDirection: librarySortDir,
    handleSort: handleLibrarySort,
  } = useTableSort(libraryBooks);

  const {
    sortedData: sortedInventoryItems,
    sortKey: inventorySortKey,
    sortDirection: inventorySortDir,
    handleSort: handleInventorySort,
  } = useTableSort(inventoryItems);

  const handleIssueGatePass = (e: React.FormEvent) => {
    e.preventDefault();
    const passItem = {
      id: `gp-${Date.now()}`,
      passNo: `GP-2026-${String(visitorPasses.length + 101).padStart(4, '0')}`,
      visitorName: newVisitor.name,
      phone: newVisitor.phone,
      purpose: newVisitor.purpose,
      whomToMeet: newVisitor.whomToMeet,
      inTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      outTime: 'Still Inside',
      status: 'INSIDE_CAMPUS',
    };

    setVisitorPasses([passItem, ...visitorPasses]);
    setShowGatePassModal(false);
    setPrintedPass(passItem);
    setNewVisitor({ name: '', phone: '', purpose: '', whomToMeet: 'Principal Sunita Kulkarni' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-600/20">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Campus Auxiliary Operations
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                Front Desk • LMS • Hostel • Assets
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Visitor gate passes with photo capture, barcode library circulation, hostel beds & asset GRN inwards
            </p>
          </div>
        </div>

        {activeSubTab === 'VISITOR' && (
          <button
            onClick={() => setShowGatePassModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Issue Visitor Gate Pass
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'VISITOR', label: 'Front Desk & Gate Passes', icon: <UserCheck className="w-4 h-4" /> },
          { id: 'LIBRARY', label: 'Library Barcode Circulation', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'HOSTEL', label: 'Hostel Rooms & Bed Allocations', icon: <Home className="w-4 h-4" /> },
          { id: 'INVENTORY', label: 'Inventory Assets & GRN', icon: <Package className="w-4 h-4" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveSubTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === t.id
                ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: VISITOR GATE PASSES */}
      {activeSubTab === 'VISITOR' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visitorPasses.map((p) => (
              <div key={p.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-orange-600">{p.passNo}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.status === 'INSIDE_CAMPUS'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{p.visitorName}</h4>
                  <div className="text-xs text-slate-500 font-mono">{p.phone}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 text-slate-700">
                  <div><strong>Purpose: </strong> {p.purpose}</div>
                  <div><strong>Meeting: </strong> {p.whomToMeet}</div>
                  <div className="text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                    In: {p.inTime} • Out: {p.outTime}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingVisitor({ ...p })}
                      className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                      title="Edit Pass"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingVisitor(p)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                      title="Delete Pass"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => setPrintedPass(p)}
                    className="flex items-center gap-1 text-orange-600 hover:text-orange-700 text-xs font-bold cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-orange-600" /> Print Badge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LIBRARY CIRCULATION */}
      {activeSubTab === 'LIBRARY' && (
        <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="erp-table-scroll">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
              <tr>
                <SortableTh label="Sr. No." sortKey="id" currentKey={librarySortKey} direction={librarySortDir} onSort={handleLibrarySort} align="center" className="w-12" />
                <SortableTh label="Book Title & Author" sortKey="title" currentKey={librarySortKey} direction={librarySortDir} onSort={handleLibrarySort} />
                <SortableTh label="Barcode / ISBN" sortKey="barcode" currentKey={librarySortKey} direction={librarySortDir} onSort={handleLibrarySort} />
                <SortableTh label="Shelf Location" sortKey="rack" currentKey={librarySortKey} direction={librarySortDir} onSort={handleLibrarySort} />
                <SortableTh label="Available / Total" sortKey="available" currentKey={librarySortKey} direction={librarySortDir} onSort={handleLibrarySort} align="center" />
                <th className="p-3.5 text-center">Circulation Action</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedLibraryBooks.map((b, index) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{b.title}</div>
                    <div className="text-[10px] text-slate-500">{b.author}</div>
                  </td>
                  <td className="p-3.5 font-mono text-orange-700">
                    <div>{b.barcode}</div>
                    <div className="text-[10px] text-slate-500">{b.isbn}</div>
                  </td>
                  <td className="p-3.5 text-slate-700">{b.rack}</td>
                  <td className="p-3.5 text-center font-bold font-mono text-emerald-700">
                    {b.available} / {b.total}
                  </td>
                  <td className="p-3.5 text-center">
                    <button className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] border border-slate-200 cursor-pointer">
                      Issue / Return Barcode
                    </button>
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingBook({ ...b })}
                        className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                        title="Edit Book"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingBook(b)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                        title="Delete Book"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* TAB 3: HOSTEL BED ALLOCATION */}
      {activeSubTab === 'HOSTEL' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hostelRooms.map((r, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs">
              <span className="text-[10px] font-bold text-orange-600 uppercase">{r.block}</span>
              <h4 className="text-sm font-bold text-slate-900">{r.roomNo}</h4>
              <div className="text-xs font-mono text-emerald-700 font-bold">{r.beds}</div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-600">Occupants: {r.occupants}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingRoom({ ...r, index: idx })}
                    className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                    title="Edit Room"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingRoom({ ...r, index: idx })}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                    title="Delete Room"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: INVENTORY ASSETS */}
      {activeSubTab === 'INVENTORY' && (
        <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="erp-table-scroll">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
              <tr>
                <SortableTh label="Sr. No." sortKey="code" currentKey={inventorySortKey} direction={inventorySortDir} onSort={handleInventorySort} align="center" className="w-12" />
                <SortableTh label="Item Code" sortKey="code" currentKey={inventorySortKey} direction={inventorySortDir} onSort={handleInventorySort} />
                <SortableTh label="Asset / Equipment Name" sortKey="name" currentKey={inventorySortKey} direction={inventorySortDir} onSort={handleInventorySort} />
                <SortableTh label="Category" sortKey="category" currentKey={inventorySortKey} direction={inventorySortDir} onSort={handleInventorySort} />
                <SortableTh label="In-Stock Quantity" sortKey="stock" currentKey={inventorySortKey} direction={inventorySortDir} onSort={handleInventorySort} align="right" />
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedInventoryItems.map((item, index) => (
                <tr key={item.code} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 text-center font-bold text-slate-500 font-mono text-xs">{index + 1}</td>
                  <td className="p-3.5 font-mono text-orange-600 font-bold">{item.code}</td>
                  <td className="p-3.5 font-bold text-slate-900">{item.name}</td>
                  <td className="p-3.5 text-slate-500">{item.category}</td>
                  <td className="p-3.5 text-right font-mono font-black text-emerald-700">
                    {item.stock} {item.unit}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingAsset({ ...item })}
                        className="p-1 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
                        title="Edit Asset"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingAsset(item)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* GATE PASS CREATION MODAL */}
      {showGatePassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl p-6 text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-orange-600" /> Issue Visitor Gate Pass
              </h3>
              <button onClick={() => setShowGatePassModal(false)} className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueGatePass} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Visitor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Deshmukh"
                  value={newVisitor.name}
                  onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Contact Phone *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98220 11999"
                  value={newVisitor.phone}
                  onChange={(e) => setNewVisitor({ ...newVisitor, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Purpose of Visit *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Admission Enquiry / Document Submission"
                  value={newVisitor.purpose}
                  onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Whom to Meet *</label>
                <select
                  value={newVisitor.whomToMeet}
                  onChange={(e) => setNewVisitor({ ...newVisitor, whomToMeet: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Principal Sunita Kulkarni">Principal Sunita Kulkarni (School)</option>
                  <option value="Director Chef Sanjeev Menon">Director Chef Sanjeev Menon (Hotel Mgmt)</option>
                  <option value="Accountant Priya Joshi">Accountant Priya Joshi (Fees & Accounts)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowGatePassModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold cursor-pointer"
                >
                  Issue Pass & Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT VISITOR BADGE MODAL */}
      {/* Modal: Edit Visitor Pass */}
      {editingVisitor && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Edit Visitor Gate Pass</h3>
                  <p className="text-[11px] font-mono text-slate-500">{editingVisitor.passNo}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingVisitor(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setVisitorPasses((prev) => prev.map((vp) => (vp.id === editingVisitor.id ? editingVisitor : vp)));
                setEditingVisitor(null);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Visitor Name</label>
                <input
                  type="text"
                  required
                  value={editingVisitor.visitorName}
                  onChange={(e) => setEditingVisitor({ ...editingVisitor, visitorName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={editingVisitor.phone}
                  onChange={(e) => setEditingVisitor({ ...editingVisitor, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  required
                  value={editingVisitor.purpose}
                  onChange={(e) => setEditingVisitor({ ...editingVisitor, purpose: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Whom to Meet</label>
                <input
                  type="text"
                  required
                  value={editingVisitor.whomToMeet}
                  onChange={(e) => setEditingVisitor({ ...editingVisitor, whomToMeet: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingVisitor(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-orange-600 hover:bg-orange-700 font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Pass</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Visitor Pass */}
      {deletingVisitor && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-rose-200 p-6 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Delete Visitor Pass</h3>
                <p className="text-xs text-slate-500">Remove security gate entry log</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">{deletingVisitor.visitorName}</div>
              <div className="text-slate-600">Pass: <strong>{deletingVisitor.passNo}</strong> ({deletingVisitor.phone})</div>
              <div className="text-slate-600">Meeting: {deletingVisitor.whomToMeet}</div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingVisitor(null)}
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setVisitorPasses((prev) => prev.filter((vp) => vp.id !== deletingVisitor.id));
                  setDeletingVisitor(null);
                }}
                className="px-5 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-bold text-xs shadow-xs cursor-pointer"
              >
                Confirm & Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Book */}
      {editingBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Edit Library Title</h3>
                  <p className="text-[11px] font-mono text-slate-500">{editingBook.barcode}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingBook(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setLibraryBooks((prev) => prev.map((b) => (b.id === editingBook.id ? editingBook : b)));
                setEditingBook(null);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Author</label>
                <input
                  type="text"
                  required
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Shelf Location Rack</label>
                <input
                  type="text"
                  required
                  value={editingBook.rack}
                  onChange={(e) => setEditingBook({ ...editingBook, rack: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Available Copies</label>
                  <input
                    type="number"
                    required
                    value={editingBook.available}
                    onChange={(e) => setEditingBook({ ...editingBook, available: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-emerald-700 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Total Copies</label>
                  <input
                    type="number"
                    required
                    value={editingBook.total}
                    onChange={(e) => setEditingBook({ ...editingBook, total: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-orange-600 hover:bg-orange-700 font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Book</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Book */}
      {deletingBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-rose-200 p-6 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Delete Book Title</h3>
                <p className="text-xs text-slate-500">Remove book from library catalog</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">{deletingBook.title}</div>
              <div className="text-slate-600">Author: <strong>{deletingBook.author}</strong></div>
              <div className="text-slate-600 font-mono">Barcode: {deletingBook.barcode} &bull; Rack: {deletingBook.rack}</div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingBook(null)}
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setLibraryBooks((prev) => prev.filter((b) => b.id !== deletingBook.id));
                  setDeletingBook(null);
                }}
                className="px-5 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-bold text-xs shadow-xs cursor-pointer"
              >
                Confirm & Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Hostel Room */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Edit Hostel Room</h3>
                  <p className="text-[11px] text-slate-500">{editingRoom.block} &bull; {editingRoom.roomNo}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingRoom(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setHostelRooms((prev) =>
                  prev.map((r, i) => (i === editingRoom.index ? { block: editingRoom.block, roomNo: editingRoom.roomNo, beds: editingRoom.beds, occupants: editingRoom.occupants } : r))
                );
                setEditingRoom(null);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Block / Wing</label>
                <input
                  type="text"
                  required
                  value={editingRoom.block}
                  onChange={(e) => setEditingRoom({ ...editingRoom, block: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Room Number</label>
                <input
                  type="text"
                  required
                  value={editingRoom.roomNo}
                  onChange={(e) => setEditingRoom({ ...editingRoom, roomNo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Bed Configuration</label>
                <input
                  type="text"
                  required
                  value={editingRoom.beds}
                  onChange={(e) => setEditingRoom({ ...editingRoom, beds: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Occupants List</label>
                <input
                  type="text"
                  required
                  value={editingRoom.occupants}
                  onChange={(e) => setEditingRoom({ ...editingRoom, occupants: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-orange-600 hover:bg-orange-700 font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Room</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Hostel Room */}
      {deletingRoom && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-rose-200 p-6 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Delete Hostel Room</h3>
                <p className="text-xs text-slate-500">Remove hostel room allocation</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">{deletingRoom.block} &bull; {deletingRoom.roomNo}</div>
              <div className="text-slate-600">{deletingRoom.beds}</div>
              <div className="text-slate-600">Occupants: {deletingRoom.occupants}</div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingRoom(null)}
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setHostelRooms((prev) => prev.filter((_, i) => i !== deletingRoom.index));
                  setDeletingRoom(null);
                }}
                className="px-5 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-bold text-xs shadow-xs cursor-pointer"
              >
                Confirm & Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Asset */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Edit Inventory Asset</h3>
                  <p className="text-[11px] font-mono text-slate-500">{editingAsset.code}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingAsset(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setInventoryItems((prev) => prev.map((item) => (item.code === editingAsset.code ? editingAsset : item)));
                setEditingAsset(null);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  value={editingAsset.name}
                  onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={editingAsset.category}
                  onChange={(e) => setEditingAsset({ ...editingAsset, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={editingAsset.stock}
                    onChange={(e) => setEditingAsset({ ...editingAsset, stock: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-emerald-700 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={editingAsset.unit}
                    onChange={(e) => setEditingAsset({ ...editingAsset, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-orange-600 hover:bg-orange-700 font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Asset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Asset */}
      {deletingAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-rose-200 p-6 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Delete Inventory Asset</h3>
                <p className="text-xs text-slate-500">Remove asset item from campus inventory</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">{deletingAsset.name}</div>
              <div className="text-slate-600">Category: <strong>{deletingAsset.category}</strong></div>
              <div className="text-slate-600 font-mono">Code: {deletingAsset.code} &bull; Stock: {deletingAsset.stock} {deletingAsset.unit}</div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingAsset(null)}
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setInventoryItems((prev) => prev.filter((item) => item.code !== deletingAsset.code));
                  setDeletingAsset(null);
                }}
                className="px-5 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-700 font-bold text-xs shadow-xs cursor-pointer"
              >
                Confirm & Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {printedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 text-slate-900 space-y-4">
            <div className="text-center border-b border-slate-100 pb-3">
              <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">VISITOR BADGE</div>
              <h3 className="text-sm font-black text-slate-900 mt-1">Zep Foundation Bhose</h3>
              <div className="font-mono text-xs font-bold text-orange-700 mt-1">{printedPass.passNo}</div>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div>Visitor: <strong>{printedPass.visitorName}</strong></div>
              <div>Phone: {printedPass.phone}</div>
              <div>Meeting: <strong>{printedPass.whomToMeet}</strong></div>
              <div>In Time: <strong>{printedPass.inTime}</strong></div>
            </div>

            <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[9px] text-slate-500">
              PLEASE RETURN THIS BADGE AT SECURITY UPON EXIT
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setPrintedPass(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print Badge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
