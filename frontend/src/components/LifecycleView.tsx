import React, { useState } from 'react';
import { LifecycleMilestone, Employee } from '../types';

interface LifecycleViewProps {
  milestones: LifecycleMilestone[];
  employees: Employee[];
  onAddMilestone: (milestone: LifecycleMilestone) => void;
}

export const LifecycleView: React.FC<LifecycleViewProps> = ({
  milestones,
  employees,
  onAddMilestone
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('Promotion');
  const [subtitle, setSubtitle] = useState('Promoted to Senior Principal');
  const [selectedEmp, setSelectedEmp] = useState(employees[0]?.name || 'Sarah Jenkins');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newM: LifecycleMilestone = {
      id: `LM-${Date.now()}`,
      type: title === 'Joined' ? 'joined' : title === 'Promotion' ? 'promotion' : 'profile_completed',
      title,
      subtitle,
      timeLabel: 'JUST NOW',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      employeeName: selectedEmp,
      icon: title === 'Joined' ? 'how_to_reg' : title === 'Promotion' ? 'military_tech' : 'account_box',
      iconBg: title === 'Joined' ? 'bg-emerald-100' : title === 'Promotion' ? 'bg-amber-100' : 'bg-blue-100',
      iconColor: title === 'Joined' ? 'text-emerald-700' : title === 'Promotion' ? 'text-amber-700' : 'text-blue-700'
    };

    onAddMilestone(newM);
    setShowAddModal(false);
  };

  return (
    <div className="max-w-[1440px] mx-auto w-full pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[28px] md:text-[36px] font-bold text-[#1B1B1D] tracking-tight leading-tight">
            Employee Lifecycle & Career Progression
          </h2>
          <p className="text-[16px] text-[#45464D] mt-1">
            Track key employee onboarding events, certifications, promotions, and milestone moments.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#3F465C] transition-all flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Log New Milestone</span>
        </button>
      </div>

      {/* Onboarding Pipeline Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-[#E4E2E4] rounded-xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-[#76777D] block mb-1">Stage 1: Pre-boarding</span>
          <div className="text-xl font-bold font-mono-numbers text-black">4 New Offers</div>
          <p className="text-[11px] text-[#45464D] mt-1">Background checks clearing</p>
        </div>
        <div className="bg-white border border-[#E4E2E4] rounded-xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-[#76777D] block mb-1">Stage 2: Active Onboarding</span>
          <div className="text-xl font-bold font-mono-numbers text-emerald-600">6 In Progress</div>
          <p className="text-[11px] text-emerald-700 mt-1">IT provisioning & equipment</p>
        </div>
        <div className="bg-white border border-[#E4E2E4] rounded-xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-[#76777D] block mb-1">Stage 3: 90-Day Reviews</span>
          <div className="text-xl font-bold font-mono-numbers text-[#0058BE]">3 Scheduled</div>
          <p className="text-[11px] text-[#0058BE] mt-1">Performance milestone checks</p>
        </div>
        <div className="bg-white border border-[#E4E2E4] rounded-xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-[#76777D] block mb-1">Annual Promotions</span>
          <div className="text-xl font-bold font-mono-numbers text-amber-600">8 Granted</div>
          <p className="text-[11px] text-amber-700 mt-1">Q3/Q4 career progression</p>
        </div>
      </div>

      {/* Main Milestones Timeline Card */}
      <div className="bg-white border border-[#E4E2E4] rounded-xl shadow-xs p-6">
        <h3 className="text-lg font-bold text-[#1B1B1D] mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-black">timeline</span>
          <span>Chronological Workforce Events</span>
        </h3>

        <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E4E2E4]">
          {milestones.map((m) => (
            <div key={m.id} className="relative flex items-start gap-4">
              <div
                className={`absolute -left-6 w-7 h-7 rounded-full ${m.iconBg} border-2 border-white shadow-xs flex items-center justify-center ${m.iconColor}`}
              >
                <span className="material-symbols-outlined text-[15px]">{m.icon}</span>
              </div>
              <div className="bg-[#FCF8FA] border border-[#E4E2E4] rounded-xl p-4 flex-1 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#1B1B1D]">{m.title}</span>
                  <span className="text-[11px] font-bold text-[#76777D] bg-white px-2 py-0.5 rounded border border-[#E4E2E4]">
                    {m.timeLabel} • {m.date}
                  </span>
                </div>
                <p className="text-xs text-[#45464D] mt-1 font-medium">{m.subtitle}</p>
                <div className="text-xs text-[#0058BE] font-semibold mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">person</span>
                  <span>{m.employeeName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-[#E4E2E4]">
            <h3 className="text-base font-bold text-[#1B1B1D] mb-4">Log Workforce Milestone</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#45464D] mb-1">Milestone Type</label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-[#C6C6CD] rounded-lg bg-white"
                >
                  <option value="Promotion">Promotion</option>
                  <option value="Joined">New Hire Joined</option>
                  <option value="Profile Completed">Profile & Documents Completed</option>
                  <option value="Certification Earned">Certification Earned</option>
                  <option value="Leave Approved">Extended Leave Approved</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#45464D] mb-1">Employee</label>
                <select
                  value={selectedEmp}
                  onChange={(e) => setSelectedEmp(e.target.value)}
                  className="w-full p-2 border border-[#C6C6CD] rounded-lg bg-white"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.name}>
                      {e.name} ({e.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#45464D] mb-1">Description / Notes</label>
                <input
                  type="text"
                  required
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-2 border border-[#C6C6CD] rounded-lg"
                  placeholder="e.g. Promoted to Senior Engineering Lead"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E4E2E4]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-[#45464D] hover:bg-[#F0EDEF] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-black text-white rounded-lg font-semibold hover:bg-[#3F465C]"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
