import React from 'react';
import { FiCheckSquare, FiCheckCircle, FiSend } from 'react-icons/fi';

export function WorkerDailyChecklistCard({
  displayTasks,
  completedCount,
  onToggleTask,
  checklistSubmitted,
  onSubmitChecklist
}) {
  return (
    <div className="glass-card p-6 rounded-[28px] border border-white lg:col-span-2 space-y-4">
      <div className="flex items-center justify-between border-b border-purple-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-sm shrink-0 font-bold">
            <FiCheckSquare />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#03020A] tracking-tight">My Daily Shift Checklist</h3>
            <p className="text-[11px] text-slate-500 font-medium">Tap task to mark completed or pending</p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#3F6212] bg-[#F0FDC2] border border-[#BEF264] px-3 py-1 rounded-full">
          {completedCount} of {displayTasks.length} Done
        </span>
      </div>

      <div className="space-y-3">
        {displayTasks.map((task) => (
          <div 
            key={task.id}
            onClick={() => onToggleTask(task.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
              task.status === "Completed"
                ? "bg-[#F0FDC2]/40 border-[#BEF264] text-slate-500"
                : "bg-white/80 hover:bg-white border-white text-[#03020A] shadow-sm hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                task.status === "Completed" 
                  ? "bg-[#7C3AED] border-[#7C3AED] text-white" 
                  : "border-purple-200 bg-white"
              }`}>
                {task.status === "Completed" && <FiCheckCircle className="text-sm" />}
              </div>
              <span className={`text-xs font-bold ${task.status === "Completed" ? "line-through text-slate-400 font-medium" : "text-[#03020A]"}`}>
                {task.text}
              </span>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              {task.category && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                  {task.category}
                </span>
              )}
              {task.urgent && task.status !== "Completed" && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]">
                  URGENT
                </span>
              )}
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                task.status === "Completed" 
                  ? "bg-[#F0FDC2] text-[#3F6212] border border-[#BEF264]" 
                  : "bg-[#FEF9C3] text-[#854D0E] border border-[#FEF08A]"
              }`}>
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Daily Shift Checklist Action Footer */}
      <div className="pt-3 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
          <FiCheckCircle className={checklistSubmitted ? "text-[#3F6212]" : "text-purple-500"} />
          <span>{checklistSubmitted ? "Report Dispatched to Admin Workers Page" : "Submit once shift tasks are ready for supervisor review"}</span>
        </div>

        <button
          type="button"
          onClick={onSubmitChecklist}
          className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0 ${
            checklistSubmitted
              ? "bg-[#F0FDC2] text-[#3F6212] border border-[#BEF264]"
              : "dark-nav-pill text-white hover:bg-black"
          }`}
        >
          <FiSend className={checklistSubmitted ? "text-[#3F6212]" : "text-[#BEF264]"} />
          <span>{checklistSubmitted ? "Report Submitted ✓" : "Submit Shift Checklist"}</span>
        </button>
      </div>
    </div>
  );
}

export default WorkerDailyChecklistCard;
