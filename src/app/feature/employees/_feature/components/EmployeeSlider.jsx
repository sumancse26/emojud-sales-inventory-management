'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { saveEmployeeAction } from '../action';
import SelectInput from '@/components/ui/SelectInput';

const GENDERS = [
    { value: 1, label: 'Male' },
    { value: 2, label: 'Female' },
    { value: 3, label: 'Other' },
];

const BLOOD_GROUPS = [
    { value: 1, label: 'A+' }, { value: 2, label: 'A-' },
    { value: 3, label: 'B+' }, { value: 4, label: 'B-' },
    { value: 5, label: 'AB+' }, { value: 6, label: 'AB-' },
    { value: 7, label: 'O+' }, { value: 8, label: 'O-' },
];

const EMPTY_FORM = {
    id: null,
    employee_code: '',
    full_name: '',
    phone: '',
    email: '',
    address: '',
    join_date: '',
    department_id: '',
    designation_id: '',
    gender: '',
    blood_group: '',
    nid: '',
    passport_no: '',
    shop_id: '',
    basic_salary: '',
    is_active: 1,
    status: 1,
    is_user: 0,
    username: '',
    password: '',
    role_id: '',
    emp_photo: null,
    nid_photo: null,
    company_id: '',
    created_by: '',
};

const INPUT_CLS =
    'w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all';

const LABEL_CLS =
    'block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5';

function SectionTitle({ children }) {
    return (
        <div className="flex items-center gap-2 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {children}
            </span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700/50" />
        </div>
    );
}

export default function EmployeeSlider({ isOpen, onClose, userInfo, shops = [], onSaved, editData, departmentList = [], designationList = [], genderList = [], bloodGroupList = [], roleList = [] }) {
    const isEdit = Boolean(editData?.id);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);

    useEffect(() => {
        if (!isOpen) return;
        const t = setTimeout(() => {
            if (editData?.id) {
                setForm({
                    id: editData.id,
                    employee_code: editData.employee_code ?? '',
                    full_name: editData.full_name ?? '',
                    phone: editData.phone ?? '',
                    email: editData.email ?? '',
                    address: editData.address ?? '',
                    join_date: editData.join_date?.slice(0, 10) ?? '',
                    department_id: editData.department_id ?? '',
                    designation_id: editData.designation_id ?? '',
                    gender: editData.gender ?? '',
                    blood_group: editData.blood_group ?? '',
                    nid: editData.nid ?? '',
                    passport_no: editData.passport_no ?? '',
                    shop_id: editData.shop_id ?? '',
                    basic_salary: editData.basic_salary ?? '',
                    is_active: editData.is_active ?? 1,
                    status: editData.status ?? 1,
                    is_user: editData.is_user ?? 0,
                    username: editData.username ?? '',
                    password: '',
                    role_id: editData.role_id ?? '',
                    emp_photo: null,
                    nid_photo: null,
                    company_id: editData.company_id ?? userInfo?.company_id ?? '',
                    created_by: userInfo?.id ?? '',
                    photo_url: editData.photo_url || ''
                });
                setPhotoPreview(editData.photo_url);
            } else {
                setForm({
                    ...EMPTY_FORM,
                    company_id: userInfo?.company_id ?? '',
                    created_by: userInfo?.id ?? '',
                    shop_id: userInfo?.shop_id ?? '',
                });
            }
        }, 0);
        return () => clearTimeout(t);
    }, [isOpen, editData, userInfo]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
        }));
    };

    const handlePhotoChange = async (e) => {
        try {
            const formData = new FormData();
            const file = e.target.files?.[0];

            if (!file) return;

            setPhotoPreview(URL.createObjectURL(file));
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.url) {
                setPhotoPreview(data.url);

                setForm((prev) => ({
                    ...prev,
                    photo_url: data.url,
                }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.full_name.trim()) { toast.error('Full name is required.'); return; }
        if (!form.phone.trim()) { toast.error('Phone is required.'); return; }
        if (!form.shop_id) { toast.error('Please select a shop.'); return; }

        setSaving(true);
        try {

            const payload = {
                employee: {
                    id: isEdit ? Number(form.id) : 0,
                    employee_code: form.employee_code.trim(),
                    full_name: form.full_name.trim(),
                    phone: form.phone.trim(),
                    email: form.email.trim() || null,
                    address: form.address.trim() || null,
                    join_date: form.join_date || null,
                    department_id: form.department_id ? Number(form.department_id) : null,
                    designation_id: form.designation_id ? Number(form.designation_id) : null,
                    gender: form.gender ? Number(form.gender) : null,
                    blood_group: form.blood_group ? Number(form.blood_group) : null,
                    nid: form.nid.trim() || null,
                    passport_no: form.passport_no.trim() || null,
                    emp_photo: null,
                    nid_photo: null,
                    shop_id: Number(form.shop_id),
                    basic_salary: form.basic_salary ? Number(form.basic_salary) : null,
                    is_active: Number(form.is_active),
                    status: Number(form.status),
                    created_by: Number(form.created_by),
                    is_user: Number(form.is_user),
                    username: form.is_user ? form.username.trim() || null : null,
                    password: form.is_user && form.password ? form.password : null,
                    role_id: form.is_user && form.role_id ? Number(form.role_id) : null,
                    company_id: Number(form.company_id),
                    photo_url: form.photo_url || ''
                },
            };

            const res = await saveEmployeeAction(payload);

            if (res?.response_code === 200 || res?.success) {
                toast.success(isEdit ? 'Employee updated successfully!' : 'Employee created successfully!');
                onSaved?.();
                onClose();
            } else {
                toast.error(res?.message || 'Failed to save employee.');
            }
        } catch {
            toast.error('An error occurred. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const accentBtn = 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25 hover:shadow-emerald-500/30';
    const accentIcon = 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-white dark:bg-[#0d1729] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60 dark:border-slate-800/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${accentIcon}`}>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </span>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {isEdit ? 'Edit Employee' : 'New Employee'}
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {isEdit ? `Editing: ${editData?.full_name}` : 'Fill in the details below'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

                    <SectionTitle>Basic Information</SectionTitle>

                    <div className="mb-5">
                        <label className={LABEL_CLS}>Employee Photo</label>

                        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">

                            {/* Preview */}
                            <div className="relative">
                                <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt="Employee"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <svg
                                                className="w-10 h-10"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.8"
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 20a8 8 0 1116 0"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2">

                                <label
                                    className="
                                        group
                                        cursor-pointer
                                        flex items-center gap-2
                                        px-4 py-2.5
                                        rounded-xl
                                        bg-primary
                                        text-sm
                                        font-medium
                                        shadow-sm
                                        hover:shadow-md
                                        transition-all
                                    "
                                >
                                    <svg
                                        className="w-4 h-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16"
                                        />
                                    </svg>

                                    <span>Upload Photo</span>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handlePhotoChange}
                                    />
                                </label>

                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    JPG, PNG up to 2MB
                                </span>

                                {photoPreview && (
                                    <button
                                        type="button"
                                        onClick={() => setPhotoPreview(null)}
                                        className="
                                            flex items-center justify-center gap-2
                                            px-4 py-2.5
                                            rounded-xl
                                            border border-red-200
                                            bg-red-50
                                            text-red-600
                                            text-sm
                                            font-medium
                                            hover:bg-red-100
                                            transition-all
                                        "
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M18 6L6 18M6 6l12 12"
                                            />
                                        </svg>

                                        Remove Photo
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Code + Name */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={LABEL_CLS} htmlFor="employee_code">
                                Emp Code <span className="text-red-500 normal-case font-normal">*</span>
                            </label>
                            <input disabled id="employee_code" name="employee_code" type="text" value={form.employee_code}
                                onChange={handleChange} placeholder="EMP-001" className={INPUT_CLS} autoComplete="off" />
                        </div>
                        <div>
                            <label className={LABEL_CLS} htmlFor="full_name">
                                Full Name <span className="text-red-500 normal-case font-normal">*</span>
                            </label>
                            <input id="full_name" name="full_name" type="text" value={form.full_name}
                                onChange={handleChange} placeholder="Full name" className={INPUT_CLS} autoComplete="off" />
                        </div>
                    </div>

                    {/* Phone + Email */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={LABEL_CLS} htmlFor="phone">
                                Phone <span className="text-red-500 normal-case font-normal">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .96h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.92a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                                    </svg>
                                </span>
                                <input id="phone" name="phone" type="tel" value={form.phone}
                                    onChange={handleChange} placeholder="01700000000"
                                    className={`${INPUT_CLS} pl-9`} autoComplete="off" />
                            </div>
                        </div>
                        <div>
                            <label className={LABEL_CLS} htmlFor="email">Email</label>
                            <input id="email" name="email" type="email" value={form.email}
                                onChange={handleChange} placeholder="email@example.com" className={INPUT_CLS} autoComplete="off" />
                        </div>
                    </div>

                    {/* Join Date + Shop */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={LABEL_CLS} htmlFor="join_date">Join Date</label>
                            <input id="join_date" name="join_date" type="date" value={form.join_date}
                                onChange={handleChange} className={INPUT_CLS} />
                        </div>
                        <div>
                            <label className={LABEL_CLS} htmlFor="emp_shop_id">
                                Shop <span className="text-red-500 normal-case font-normal">*</span>
                            </label>
                            <SelectInput
                                id="emp_shop_id"
                                options={shops.map(s => ({ value: String(s.id), label: s.shop_name }))}
                                value={String(form.shop_id)}
                                onChange={v => setForm(prev => ({ ...prev, shop_id: v }))}
                                placeholder="Select shop…"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className={LABEL_CLS} htmlFor="address">Address</label>
                        <input id="address" name="address" type="text" value={form.address}
                            onChange={handleChange} placeholder="Residential address" className={INPUT_CLS} autoComplete="off" />
                    </div>

                    <SectionTitle>Employment</SectionTitle>

                    {/* Dept + Designation */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={LABEL_CLS} htmlFor="department_id">Department</label>


                            <SelectInput
                                id="department_id"
                                options={departmentList.map(d => ({ value: String(d.id), label: d.department_name }))}
                                value={String(form.department_id)}
                                onChange={v => setForm(prev => ({ ...prev, department_id: v }))}
                                placeholder="Select department…"
                            />
                        </div>
                        <div>
                            <label className={LABEL_CLS} htmlFor="designation_id">Designation</label>
                            <SelectInput
                                id="designation_id"
                                options={designationList.map(d => ({ value: String(d.id), label: d.designation_name }))}
                                value={String(form.designation_id)}
                                onChange={v => setForm(prev => ({ ...prev, designation_id: v }))}
                                placeholder="Select designation…"
                            />
                        </div>
                    </div>

                    {/* Salary */}
                    <div>
                        <label className={LABEL_CLS} htmlFor="basic_salary">Basic Salary (৳)</label>
                        <input id="basic_salary" name="basic_salary" type="number" min="0" value={form.basic_salary}
                            onChange={handleChange} placeholder="e.g. 25000" className={INPUT_CLS} />
                    </div>

                    <SectionTitle>Personal Details</SectionTitle>

                    {/* Gender + Blood Group */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={LABEL_CLS} htmlFor="emp_gender">Gender</label>
                            <SelectInput
                                id="emp_gender"
                                options={genderList.map(g => ({ value: String(g.id), label: g.lookup_value }))}
                                value={String(form.gender)}
                                onChange={v => setForm(prev => ({ ...prev, gender: v }))}
                                placeholder="Select…"
                            />
                        </div>
                        <div>
                            <label className={LABEL_CLS} htmlFor="emp_blood_group">Blood Group</label>
                            <SelectInput
                                id="emp_blood_group"
                                options={bloodGroupList.map(b => ({ value: String(b.id), label: b.lookup_value }))}
                                value={String(form.blood_group)}
                                onChange={v => setForm(prev => ({ ...prev, blood_group: v }))}
                                placeholder="Select…"
                            />
                        </div>
                    </div>

                    {/* NID + Passport */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={LABEL_CLS} htmlFor="nid">NID</label>
                            <input id="nid" name="nid" type="text" value={form.nid}
                                onChange={handleChange} placeholder="NID number" className={INPUT_CLS} autoComplete="off" />
                        </div>
                        <div>
                            <label className={LABEL_CLS} htmlFor="passport_no">Passport No</label>
                            <input id="passport_no" name="passport_no" type="text" value={form.passport_no}
                                onChange={handleChange} placeholder="Passport number" className={INPUT_CLS} autoComplete="off" />
                        </div>
                    </div>

                    <SectionTitle>User Access</SectionTitle>

                    {/* Is User toggle */}
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 rounded-xl px-4 py-3 border border-slate-200/60 dark:border-slate-700/30">
                        <div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">System User</p>
                            <p className="text-xs text-slate-400 mt-0.5">Grant login access to this employee</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="is_user" checked={form.is_user === 1}
                                onChange={handleChange} className="sr-only peer" />
                            <div className="w-10 h-5.5 bg-slate-300 dark:bg-slate-600 peer-checked:bg-emerald-500 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:after:translate-x-4.5" />
                        </label>
                    </div>

                    {form.is_user === 1 && (
                        <div className="space-y-3 bg-slate-50/60 dark:bg-slate-800/20 rounded-xl border border-slate-200/60 dark:border-slate-700/30 p-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={LABEL_CLS} htmlFor="username">Username</label>
                                    <input id="username" name="username" type="text" value={form.username}
                                        onChange={handleChange} placeholder="username" className={INPUT_CLS} autoComplete="off" />
                                </div>
                                <div>
                                    <label className={LABEL_CLS} htmlFor="role_id">Role</label>
                                    <SelectInput
                                        id="role_id"
                                        options={roleList.map(role => ({ value: role.id, label: role.role_name }))}
                                        value={String(form.role_id)}
                                        onChange={v => setForm(prev => ({ ...prev, role_id: Number(v) }))}
                                        placeholder="Select role…"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={LABEL_CLS} htmlFor="password">
                                    Password {isEdit && <span className="normal-case font-normal text-slate-400">(leave blank to keep)</span>}
                                </label>
                                <input id="password" name="password" type="password" value={form.password}
                                    onChange={handleChange} placeholder="••••••" className={INPUT_CLS} autoComplete="new-password" />
                            </div>
                        </div>
                    )}

                    <SectionTitle>Status</SectionTitle>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={LABEL_CLS} htmlFor="emp_is_active">Active Status</label>
                            <SelectInput
                                id="emp_is_active"
                                options={[{ value: '1', label: 'Active' }, { value: '0', label: 'Inactive' }]}
                                value={String(form.is_active)}
                                onChange={v => setForm(prev => ({ ...prev, is_active: Number(v) }))}
                                placeholder="Select…"
                            />
                        </div>
                        <div>
                            <label className={LABEL_CLS} htmlFor="emp_status">Status</label>
                            <SelectInput
                                id="emp_status"
                                options={[{ value: '1', label: 'Active' }, { value: '0', label: 'Inactive' }]}
                                value={String(form.status)}
                                onChange={v => setForm(prev => ({ ...prev, status: Number(v) }))}
                                placeholder="Select…"
                            />
                        </div>
                    </div>

                </form>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-slate-200/60 dark:border-slate-800/50 flex gap-3 shrink-0">
                    <button type="button" onClick={onClose} disabled={saving}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50">
                        Cancel
                    </button>
                    <button type="button" onClick={handleSubmit} disabled={saving}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2 ${accentBtn}`}>
                        {saving ? (
                            <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                {isEdit ? 'Updating…' : 'Saving…'}
                            </>
                        ) : (isEdit ? 'Update Employee' : 'Create Employee')}
                    </button>
                </div>
            </div>
        </>
    );
}
