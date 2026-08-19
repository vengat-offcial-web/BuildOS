import React, { useState } from 'react';
import { Card, ProgressBar } from '../components/ui';
import { FiBarChart2, FiDownload, FiCalendar, FiTrendingUp, FiShield, FiDollarSign, FiClock } from 'react-icons/fi';

const monthOptions = ['August 2026', 'July 2026', 'June 2026', 'Q2 2026 Summary'];

function Reports() {
  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#03020A] tracking-tight flex items-center gap-2">
            <FiBarChart2 className="text-[#7C3AED]" />
            Executive Site Analytics & Reports
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Monthly operational reports, financial expenditures, and site productivity metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              type="button"
              onClick={() => setShowMonthDropdown(!showMonthDropdown)}
              className="bg-white/80 hover:bg-white text-[#03020A] border border-purple-100 text-xs font-bold px-4 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <FiCalendar className="text-[#7C3AED]" />
              <span>{selectedMonth}</span>
            </button>

            {showMonthDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-purple-100 rounded-2xl shadow-xl z-20 overflow-hidden py-1">
                {monthOptions.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setSelectedMonth(m);
                      setShowMonthDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                      selectedMonth === m ? 'bg-purple-100 text-[#7C3AED]' : 'text-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button type="button" className="dark-nav-pill px-5 py-2.5 rounded-full text-xs font-extrabold flex items-center gap-2 shadow-lg hover:bg-black transition-all cursor-pointer">
            <FiDownload className="text-[#BEF264]" />
            <span>Export Executive PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-hero-purple p-6 rounded-[28px] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#6B21A8]">
            <span>Monthly Budget Variance</span>
            <FiDollarSign className="text-lg" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#03020A]">$2.45M / $2.60M</h3>
          <p className="text-xs font-bold text-[#3F6212] bg-[#F0FDC2] px-2.5 py-0.5 rounded-full inline-block">
            5.7% Under Budget
          </p>
        </div>

        <div className="glass-hero-lime p-6 rounded-[28px] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#3F6212]">
            <span>Safety Audit Score</span>
            <FiShield className="text-lg" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#03020A]">99.4% Index</h3>
          <p className="text-xs font-bold text-[#15803D] bg-white/80 px-2.5 py-0.5 rounded-full inline-block">
            Zero Incidents
          </p>
        </div>

        <div className="glass-card p-6 rounded-[28px] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Project Schedule Velocity</span>
            <FiTrendingUp className="text-lg text-purple-600" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#03020A]">+14.2% Faster</h3>
          <p className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full inline-block">
            On Track for Q3 Finish
          </p>
        </div>

        <div className="glass-card p-6 rounded-[28px] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Labor Attendance Index</span>
            <FiClock className="text-lg text-purple-600" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#03020A]">96.8% Average</h3>
          <p className="text-xs font-bold text-[#3F6212] bg-[#F0FDC2] px-2.5 py-0.5 rounded-full inline-block">
            +3.4% vs Prev Month
          </p>
        </div>
      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card hover={false} className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-100">
            <h3 className="text-base font-extrabold text-[#03020A]">Project Expenditure Breakdown ($K)</h3>
            <span className="text-xs font-bold text-purple-700">{selectedMonth}</span>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { site: "Marina Tower", spent: 850, max: 1000, pct: 85 },
              { site: "Metro Line Extension", spent: 1200, max: 1250, pct: 96 },
              { site: "SkyView Apartments", spent: 420, max: 600, pct: 70 },
              { site: "Apex Tech Park Phase 2", spent: 680, max: 700, pct: 97 }
            ].map((bar, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#03020A]">
                  <span>{bar.site}</span>
                  <span className="text-purple-700">${bar.spent}K / ${bar.max}K</span>
                </div>
                <ProgressBar progress={bar.pct} variant={bar.pct > 95 ? "lime" : "purple"} size="sm" />
              </div>
            ))}
          </div>
        </Card>

        <Card hover={false} className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-100">
            <h3 className="text-base font-extrabold text-[#03020A]">Fleet & Material Utilization</h3>
            <span className="text-xs font-bold text-[#3F6212] bg-[#F0FDC2] px-2.5 py-0.5 rounded-full">Optimal</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: "Tower Crane Operation Hours", val: "168 hrs / 180 max", pct: 93 },
              { label: "Concrete Mixer Fleet Dispatch Rate", val: "94% Operational", pct: 94 },
              { label: "Excavator Fuel Efficiency Index", val: "4.2 L/hr (Optimal)", pct: 88 },
              { label: "Safety Gear (PPE) Compliance", val: "100% Verified", pct: 100 }
            ].map((item, i) => (
              <div key={i} className="bg-white/80 p-3.5 rounded-2xl border border-white flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#03020A]">{item.label}</p>
                  <p className="text-[11px] text-slate-500 font-semibold">{item.val}</p>
                </div>
                <div className="w-24">
                  <ProgressBar progress={item.pct} variant={item.pct === 100 ? "lime" : "purple"} size="sm" showLabel={false} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Monthly Report Downloads Table */}
      <Card hover={false}>
        <h3 className="text-lg font-extrabold text-[#03020A] mb-4 pb-3 border-b border-purple-100">
          Generated Site Reports Archive
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-purple-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Report Name</th>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Generated By</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100/60 font-medium text-slate-700">
              {[
                { name: "Monthly Site Audit & Budget Summary", period: "July 2026", author: "Vengadesh (Director)", size: "4.2 MB PDF" },
                { name: "Safety Compliance & Incident Zero Log", period: "Q2 2026", author: "Srinivasan M. (Safety)", size: "2.8 MB PDF" },
                { name: "Logistics & Site Resource Supply Audit", period: "July 2026", author: "Site Supervisor", size: "1.5 MB CSV" }
              ].map((rep, index) => (
                <tr key={index} className="hover:bg-purple-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#03020A]">{rep.name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{rep.period}</td>
                  <td className="py-3.5 px-4 text-purple-700 font-semibold">{rep.author}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-extrabold bg-[#E9D5FF] text-[#6B21A8] px-2.5 py-0.5 rounded-full">
                      {rep.size}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button type="button" className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 ml-auto cursor-pointer">
                      <FiDownload /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Reports;