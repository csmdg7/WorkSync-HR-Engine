import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col border border-[#E4E2E4] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-[#E4E2E4] bg-[#F6F3F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-black text-white rounded-lg">
              <span className="material-symbols-outlined text-[20px]">help</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1B1B1D]">Command Center Guide</h2>
              <p className="text-xs text-[#76777D]">Quick navigation and administration instructions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#76777D] hover:text-black p-1.5 rounded-lg hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs text-[#45464D]">
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg">
            <h3 className="font-bold text-sm text-[#0058BE] mb-1">⚡ Quick Admin Actions</h3>
            <p>
              Use the <strong>Action Center</strong> cards or notification bell to approve pending leave requests, resolve missing shift checkouts, or review payroll discrepancies in real-time.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#1B1B1D] uppercase tracking-wider mb-1.5">Interactive Calendar</h4>
            <p className="mb-1">Click on any date in the <strong>Smart Attendance Calendar</strong> to inspect staff attendance ratios and review daily logs.</p>
          </div>

          <div>
            <h4 className="font-bold text-[#1B1B1D] uppercase tracking-wider mb-1.5">Instant Payroll Verification</h4>
            <p className="mb-1">
              Click the blue <strong>Verify</strong> button on any pending payroll line in the table or from the Payroll view to mark compensation approved.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#1B1B1D] uppercase tracking-wider mb-1.5">Global Search</h4>
            <p>Search any employee by name, ID, role, or department from the top search bar for instant details.</p>
          </div>
        </div>

        <div className="p-4 border-t border-[#E4E2E4] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white hover:bg-[#3F465C] rounded-lg font-semibold text-xs transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
