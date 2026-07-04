'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import EmployeeTable from './components/EmployeeTable';
import EmployeeSlider from './components/EmployeeSlider';


export default function EmployeesFeature({ initialEmployees = [], shops = [], userInfo, departmentList = [], designationList = [], genderList = [], bloodGroupList = [], roleList = [] }) {
    const router = useRouter();
    const [sliderOpen, setSliderOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('');


    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        return initialEmployees.filter(e => {
            const matchDept = !deptFilter || String(e.department_id) === deptFilter;
            if (!matchDept) return false;
            if (!q) return true;
            return (
                e.full_name?.toLowerCase().includes(q) ||
                e.employee_code?.toLowerCase().includes(q) ||
                e.phone?.toLowerCase().includes(q) ||
                e.email?.toLowerCase().includes(q) ||
                e.department_name?.toLowerCase().includes(q) ||
                e.designation_name?.toLowerCase().includes(q)
            );
        });
    }, [initialEmployees, search, deptFilter]);

    const openCreate = () => { setEditData(null); setSliderOpen(true); };
    const openEdit = (emp) => { setEditData(emp); setSliderOpen(true); };
    const handleClose = () => setSliderOpen(false);
    const handleSaved = () => { setSliderOpen(false); router.refresh(); };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Employees</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">HR &amp; staff management</p>
                </div>
                <button onClick={openCreate}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-emerald-600/25 hover:shadow-emerald-500/30 self-start sm:self-auto">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add Employee
                </button>
            </div>



            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                    </span>
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, code, phone…"
                        className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-[#0d1729] border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all" />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <EmployeeTable employees={filtered} onEdit={openEdit} />

            {/* Slider */}
            <EmployeeSlider
                isOpen={sliderOpen}
                onClose={handleClose}
                onSaved={handleSaved}
                userInfo={userInfo}
                shops={shops}
                editData={editData}
                departmentList={departmentList}
                designationList={designationList}
                genderList={genderList}
                bloodGroupList={bloodGroupList}
                roleList={roleList}
            />
        </div>
    );
}


