import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui';
import {
  FiArrowLeft,
  FiFolder,
  FiMapPin,
  FiUserCheck,
  FiCalendar,
  FiUsers,
  FiFlag,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiSearch,
  FiPlus,
  FiMinus,
  FiCheck
} from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa6';
import { useData } from '../context/useData';

const engineersDatabase = [
  { id: 1, name: "Rajesh Kumar", role: "Lead Structural Engineer", phone: "+91 98765 43210", avatarBg: "from-[#E9D5FF] to-[#C4B5FD]" },
  { id: 2, name: "Priya Sundaram", role: "Transit Infrastructure Lead", phone: "+91 98765 43220", avatarBg: "from-[#F0FDC2] to-[#D9F99D]" },
  { id: 3, name: "Anand Verma", role: "Commercial Complex Specialist", phone: "+91 98765 43230", avatarBg: "from-[#D8B4FE] to-[#A78BFA]" },
  { id: 4, name: "Kavitha R.", role: "High-Rise Site Director", phone: "+91 98765 43240", avatarBg: "from-[#FEF9C3] to-[#FEF08A]" },
  { id: 5, name: "Suresh Babu", role: "Residential Township Engineer", phone: "+91 98765 43250", avatarBg: "from-[#E9D5FF] to-[#F0FDC2]" },
  { id: 6, name: "Vikram Sethu", role: "Industrial Logistics Consultant", phone: "+91 98765 43260", avatarBg: "from-[#C4B5FD] to-[#8B5CF6]" }
];

const cityTags = ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Hosur"];
const tradeCategories = ["Masonry", "Steel Rebar", "Heavy Equipment", "Electrical", "Scaffolding"];

function AssignProject() {
  const navigate = useNavigate();
  const { addProject } = useData();

  // Form State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [engineerSearch, setEngineerSearch] = useState('');
  // const [formData, setFormData] = useState({
  //   name: "",
  //   location: "",
  //   description: "",
  //   engineerSearch: "",
  // })

  // const handleChange = e => {
  //   const { name, value } = e.target;
  //   setFormData(prevValue => ({
  //     ...prevValue,
  //     [name]: value
  //   }))
  // }

  const [startDate, setStartDate] = useState('2026-08-15');
  const [deadline, setDeadline] = useState('2027-02-15');

  const [workforceRequired, setWorkforceRequired] = useState(25);
  const [selectedTrades, setSelectedTrades] = useState(['Masonry', 'Steel Rebar']);

  const [priority, setPriority] = useState('Medium');

  // UI State
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Filtered Engineers
  const filteredEngineers = useMemo(() => {
    return engineersDatabase.filter(e =>
      e.name.toLowerCase().includes(engineerSearch.toLowerCase()) ||
      e.role.toLowerCase().includes(engineerSearch.toLowerCase())
    );
  }, [engineerSearch]);

  // Duration Calculator
  const durationText = useMemo(() => {
    if (!startDate || !deadline) return null;
    const start = new Date(startDate);
    const end = new Date(deadline);
    const diffTime = end - start;
    if (diffTime < 0) return { days: 0, text: "Invalid date sequence" };
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = (diffDays / 30.4).toFixed(1);
    return { days: diffDays, text: `${diffDays} Days (~${months} Months)` };
  }, [startDate, deadline]);

  const toggleTrade = (trade) => {
    if (selectedTrades.includes(trade)) {
      setSelectedTrades(selectedTrades.filter(t => t !== trade));
    } else {
      setSelectedTrades([...selectedTrades, trade]);
    }
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Project name is required";
    if (!location.trim()) errs.location = "Site location is required";
    if (!selectedEngineer) errs.engineer = "Please assign a site engineer";
    if (!deadline) errs.deadline = "Target deadline is required";

    if (startDate && deadline && new Date(deadline) < new Date(startDate)) {
      errs.dateSequence = "Target deadline cannot be before the start date";
    }

    if (!workforceRequired || workforceRequired < 1) {
      errs.workers = "Workforce requirement must be at least 1 worker";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const projectPayload = {
      name: name.trim(),
      location: location.trim(),
      description: description.trim(),
      manager: selectedEngineer ? selectedEngineer.name : 'Rajesh Kumar',
      startDate,
      deadline,
      workforceRequired,
      priority,
      status: 'Planning'
    };

    setTimeout(() => {
      addProject(projectPayload);
      setSubmitting(false);
      setSuccessToast(true);

      setTimeout(() => {
        navigate('/projects');
      }, 1400);
    }, 400);
  };

  return (
    <div className="space-y-8 pb-16 relative">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#7C3AED] hover:text-[#581C87] bg-white/80 hover:bg-white px-3.5 py-1.5 rounded-full border border-purple-100 mb-3 shadow-sm transition-all cursor-pointer"
          >
            <FiArrowLeft className="text-sm" />
            <span>Back to Projects Roster</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#03020A] tracking-tight flex items-center gap-2">
            <FaBuilding className="text-[#7C3AED]" />
            Assign New Construction Project
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Dispatch a new job site development by entering project specs, engineer allocation, timeline, and workforce parameters.
          </p>
        </div>

        <span className="self-start sm:self-center text-xs font-extrabold bg-[#E9D5FF] text-[#6B21A8] px-3.5 py-1.5 rounded-full border border-[#D8B4FE]">
          Status: Planning
        </span>
      </div>

      {/* Success Experience Notification Toast */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#F0FDC2] text-[#3F6212] border-2 border-[#BEF264] px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-8 h-8 rounded-full bg-[#3F6212] text-white flex items-center justify-center font-bold">
            <FiCheck className="text-lg" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold">Project Successfully Assigned!</h4>
            <p className="text-xs font-semibold opacity-90">Added to Projects Roster with initial status set to Planning.</p>
          </div>
        </div>
      )}

      {/* Main 2-Column Responsive Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT COLUMN */}
        <div className="space-y-6">
          <Card hover={false} className="space-y-5">
            <div className="pb-3 border-b border-purple-100 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#03020A] flex items-center gap-2">
                <FiFolder className="text-[#7C3AED]" />
                1. Project Information
              </h3>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                Required
              </span>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#03020A] mb-1.5">
                Project Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                  <FiFolder className="text-sm" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  placeholder="e.g. Marina Commercial Tower Phase 2"
                  className={`w-full bg-white border text-xs font-semibold rounded-2xl py-3 pl-10 pr-4 text-[#03020A] placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${errors.name ? 'border-rose-400 focus:ring-rose-300' : 'border-purple-100 focus:ring-[#A78BFA]'
                    }`}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                  <FiAlertCircle /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#03020A] mb-1.5">
                Project Location <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                  <FiMapPin className="text-sm" />
                </span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (errors.location) setErrors({ ...errors, location: null });
                  }}
                  placeholder="e.g. Chennai Central"
                  className={`w-full bg-white border text-xs font-semibold rounded-2xl py-3 pl-10 pr-4 text-[#03020A] placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${errors.location ? 'border-rose-400 focus:ring-rose-300' : 'border-purple-100 focus:ring-[#A78BFA]'
                    }`}
                />
              </div>
              {errors.location && (
                <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                  <FiAlertCircle /> {errors.location}
                </p>
              )}

              <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 mr-1">Quick Select:</span>
                {cityTags.map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setLocation(city);
                      if (errors.location) setErrors({ ...errors, location: null });
                    }}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${location === city
                        ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                        : 'bg-white/80 text-slate-600 border-purple-100 hover:bg-purple-50'
                      }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#03020A] mb-1.5">
                Project Scope & Description <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe project specifications, floor height, specialized structures..."
                className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl p-3.5 text-[#03020A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all resize-none"
              />
            </div>
          </Card>

          <Card hover={false} className="space-y-4">
            <div className="pb-3 border-b border-purple-100 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#03020A] flex items-center gap-2">
                <FiUserCheck className="text-[#7C3AED]" />
                2. Designated Site Engineer
              </h3>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                Required
              </span>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#03020A] mb-1.5">
                Select Site Engineer <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                  <FiSearch className="text-sm" />
                </span>
                <input
                  type="text"
                  value={engineerSearch}
                  onChange={(e) => setEngineerSearch(e.target.value)}
                  placeholder="Search engineer by name or specialty..."
                  className={`w-full bg-white border text-xs font-semibold rounded-2xl py-3 pl-10 pr-4 text-[#03020A] placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${errors.engineer ? 'border-rose-400 focus:ring-rose-300' : 'border-purple-100 focus:ring-[#A78BFA]'
                    }`}
                />
              </div>

              {errors.engineer && (
                <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                  <FiAlertCircle /> {errors.engineer}
                </p>
              )}
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {filteredEngineers.length > 0 ? (
                filteredEngineers.map(eng => {
                  const isSelected = selectedEngineer?.id === eng.id;
                  return (
                    <div
                      key={eng.id}
                      onClick={() => {
                        setSelectedEngineer(eng);
                        if (errors.engineer) setErrors({ ...errors, engineer: null });
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${isSelected
                          ? 'bg-[#F0FDC2]/60 border-[#BEF264] shadow-md scale-[1.01]'
                          : 'bg-white/80 border-purple-100 hover:bg-purple-50/60'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${eng.avatarBg} text-[#6B21A8] flex items-center justify-center font-extrabold text-xs border border-white shadow-sm shrink-0`}>
                          {eng.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-[#03020A] flex items-center gap-1.5">
                            {eng.name}
                            {isSelected && <FiCheckCircle className="text-[#3F6212]" />}
                          </h4>
                          <p className="text-[11px] font-bold text-purple-700">{eng.role}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{eng.phone}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full transition-all ${isSelected ? 'bg-[#3F6212] text-white shadow-sm' : 'bg-purple-100 text-[#7C3AED]'
                          }`}>
                          {isSelected ? '✓ Assigned' : 'Select'}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-xs font-semibold text-slate-400 text-center bg-white/60 rounded-2xl border border-purple-100">
                  No matching site engineers found for "{engineerSearch}"
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <Card hover={false} className="space-y-4">
            <div className="pb-3 border-b border-purple-100 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#03020A] flex items-center gap-2">
                <FiCalendar className="text-[#7C3AED]" />
                3. Project Timeline & Schedule
              </h3>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                Required
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-[#03020A] mb-1.5">
                  Target Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white border border-purple-100 text-xs font-semibold rounded-2xl py-3 px-4 text-[#03020A] focus:ring-2 focus:ring-[#A78BFA] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#03020A] mb-1.5">
                  Target Deadline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => {
                    setDeadline(e.target.value);
                    if (errors.deadline || errors.dateSequence) {
                      setErrors({ ...errors, deadline: null, dateSequence: null });
                    }
                  }}
                  className={`w-full bg-white border text-xs font-semibold rounded-2xl py-3 px-4 text-[#03020A] focus:ring-2 outline-none ${errors.deadline || errors.dateSequence ? 'border-rose-400 focus:ring-rose-300' : 'border-purple-100 focus:ring-[#A78BFA]'
                    }`}
                />
              </div>
            </div>

            {(errors.deadline || errors.dateSequence) && (
              <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                <FiAlertCircle /> {errors.deadline || errors.dateSequence}
              </p>
            )}

            {durationText && (
              <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100 flex items-center justify-between text-xs">
                <span className="font-bold text-[#03020A] flex items-center gap-1.5">
                  <FiClock className="text-[#7C3AED]" /> Estimated Duration:
                </span>
                <span className="font-extrabold text-[#7C3AED] bg-white px-3 py-1 rounded-full border border-purple-100 shadow-sm">
                  {durationText.text}
                </span>
              </div>
            )}
          </Card>

          <Card hover={false} className="space-y-4">
            <div className="pb-3 border-b border-purple-100 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#03020A] flex items-center gap-2">
                <FiUsers className="text-[#7C3AED]" />
                4. Workforce Requirement
              </h3>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                Required
              </span>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#03020A] mb-1.5">
                Number of Workers Required <span className="text-rose-500">*</span>
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (workforceRequired > 1) {
                      setWorkforceRequired(workforceRequired - 1);
                      if (errors.workers) setErrors({ ...errors, workers: null });
                    }
                  }}
                  className="w-10 h-10 rounded-2xl bg-white border border-purple-100 text-[#03020A] hover:bg-purple-50 font-bold flex items-center justify-center shadow-sm cursor-pointer"
                >
                  <FiMinus />
                </button>

                <div className="flex-1 bg-white border border-purple-100 rounded-2xl py-2.5 px-4 text-center">
                  <span className="text-base font-extrabold text-[#03020A]">{workforceRequired}</span>
                  <span className="text-xs font-bold text-purple-700 ml-1.5">Workers</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setWorkforceRequired(workforceRequired + 1);
                    if (errors.workers) setErrors({ ...errors, workers: null });
                  }}
                  className="w-10 h-10 rounded-2xl bg-white border border-purple-100 text-[#03020A] hover:bg-purple-50 font-bold flex items-center justify-center shadow-sm cursor-pointer"
                >
                  <FiPlus />
                </button>
              </div>

              {errors.workers && (
                <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                  <FiAlertCircle /> {errors.workers}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Worker Trades Required <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {tradeCategories.map(trade => {
                  const active = selectedTrades.includes(trade);
                  return (
                    <button
                      key={trade}
                      type="button"
                      onClick={() => toggleTrade(trade)}
                      className={`text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${active
                          ? 'bg-[#03020A] text-white border-[#03020A] shadow-sm'
                          : 'bg-white text-slate-600 border-purple-100 hover:bg-purple-50'
                        }`}
                    >
                      {active ? `✓ ${trade}` : trade}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card hover={false} className="space-y-4">
            <div className="pb-3 border-b border-purple-100 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#03020A] flex items-center gap-2">
                <FiFlag className="text-[#7C3AED]" />
                5. Project Priority Level
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { level: 'Low', color: 'bg-slate-100 text-slate-700 border-slate-200', activeColor: 'bg-slate-800 text-white' },
                { level: 'Medium', color: 'bg-purple-50 text-purple-700 border-purple-100', activeColor: 'bg-[#7C3AED] text-white' },
                { level: 'High', color: 'bg-amber-50 text-amber-800 border-amber-200', activeColor: 'bg-amber-500 text-white' },
                { level: 'Critical', color: 'bg-rose-50 text-rose-800 border-rose-200', activeColor: 'bg-rose-600 text-white' }
              ].map(p => (
                <button
                  key={p.level}
                  type="button"
                  onClick={() => setPriority(p.level)}
                  className={`py-3 px-3 rounded-2xl text-xs font-extrabold border transition-all text-center cursor-pointer shadow-sm ${priority === p.level ? `${p.activeColor} border-transparent scale-[1.02]` : p.color
                    }`}
                >
                  {p.level}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="lg:col-span-2 glass-card p-6 rounded-[32px] border border-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="text-xs font-semibold text-slate-500">
            Click <strong className="text-[#03020A]">Create & Assign Project</strong> to dispatch site parameters.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-full text-xs font-bold bg-white/80 hover:bg-white text-slate-700 border border-purple-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 sm:flex-none dark-nav-pill hover:bg-black text-white px-8 py-3.5 rounded-full text-xs font-extrabold shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <FiCheck className="text-base text-[#BEF264]" />
                  <span>Create & Assign Project</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AssignProject;
