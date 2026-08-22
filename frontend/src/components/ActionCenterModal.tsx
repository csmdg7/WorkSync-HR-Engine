import React, { useState } from 'react';
import { PendingLeave, MissingCheckout, PayrollReview } from '../types';

interface ActionCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'leaves' | 'checkouts' | 'payroll';
  pendingLeaves: PendingLeave[];
  missingCheckouts: MissingCheckout[];
  payrollReviews: PayrollReview[];
  onApproveLeave: (id: string) => void;
  onRejectLeave: (id: string) => void;
  onResolveCheckout: (id: string, time: string) => void;
  onVerifyPayrollReview: (id: string) => void;
}

export const ActionCenterModal: React.FC<ActionCenterModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'leaves',
  pendingLeaves,
  missingCheckouts,
  payrollReviews,
  onApproveLeave,
  onRejectLeave,
  onResolveCheckout,
  onVerifyPayrollReview
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'leaves' | 'checkouts' | 'payroll'>(initialTab);
  const [selectedTime, setSelectedTime] = useState<string>('05:30 PM');

  if (!isOpen) return null;

  const pendingLeavesList = pendingLeaves.filter((l) => l.status === 'pending');
  const pendingCheckoutsList = missingCheckouts.filter((c) => c.status === 'pending');
  const pendingPayrollList = payrollReviews.filter((p) => p.status === 'pending');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-[#E4E2E4] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#E4E2E4] bg-[#F6F3F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-black text-white rounded-lg">
              <span className="material-symbols-outlined text-[20px]">campaign</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1B1B1D]">Action Center & Approvals</h2>
              <p className="text-xs text-[#76777D]">Resolve pending items requiring administrator action</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#76777D] hover:text-black p-1.5 rounded-lg hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#E4E2E4] px-5 bg-white">
          <button
            onClick={() => setActiveSubTab('leaves')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeSubTab === 'leaves'
                ? 'border-[#0058BE] text-[#0058BE]'
                : 'border-transparent text-[#45464D] hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">beach_access</span>
            <span>Leaves ({pendingLeavesList.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('checkouts')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeSubTab === 'checkouts'
                ? 'border-[#0058BE] text-[#0058BE]'
                : 'border-transparent text-[#45464D] hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>Missing Checkouts ({pendingCheckoutsList.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('payroll')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeSubTab === 'payroll'
                ? 'border-[#0058BE] text-[#0058BE]'
                : 'border-transparent text-[#45464D] hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            <span>Payroll Reviews ({pendingPayrollList.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3 bg-[#FCF8FA]">
          {/* Leaves Tab */}
          {activeSubTab === 'leaves' && (
            <>
              {pendingLeavesList.length === 0 ? (
                <div className="py-12 text-center text-[#76777D]">
                  <span className="material-symbols-outlined text-4xl text-emerald-500 mb-2">check_circle</span>
                  <p className="font-semibold text-sm text-[#1B1B1D]">All leave requests have been reviewed!</p>
                  <p className="text-xs text-[#76777D] mt-1">No pending leave requests at this time.</p>
                </div>
              ) : (
                pendingLeavesList.map((leave) => (
                  <div
                    key={leave.id}
                    className="bg-white border border-[#E4E2E4] rounded-lg p-4 shadow-xs flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center">
                          {leave.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#1B1B1D]">{leave.employeeName}</div>
                          <div className="text-xs text-[#76777D]">
                            {leave.department} • <span className="font-semibold text-rose-600">{leave.leaveType}</span>
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-semibold rounded-full">
                        {leave.days} {leave.days === 1 ? 'day' : 'days'}
                      </span>
                    </div>

                    <div className="bg-[#F6F3F5] rounded-md p-2.5 text-xs text-[#45464D]">
                      <div className="font-medium text-[#1B1B1D] mb-1">
                        📅 {leave.startDate} to {leave.endDate}
                      </div>
                      <p className="italic">"{leave.reason}"</p>
                    </div>

                    <div className="flex justify-end gap-2 pt-1 border-t border-[#F0EDEF]">
                      <button
                        onClick={() => onRejectLeave(leave.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                      >
                        Reject Request
                      </button>
                      <button
                        onClick={() => onApproveLeave(leave.id)}
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        <span>Approve Leave</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* Missing Checkouts Tab */}
          {activeSubTab === 'checkouts' && (
            <>
              {pendingCheckoutsList.length === 0 ? (
                <div className="py-12 text-center text-[#76777D]">
                  <span className="material-symbols-outlined text-4xl text-emerald-500 mb-2">check_circle</span>
                  <p className="font-semibold text-sm text-[#1B1B1D]">All checkout records have been resolved!</p>
                </div>
              ) : (
                pendingCheckoutsList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-[#E4E2E4] rounded-lg p-4 shadow-xs flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                          {item.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#1B1B1D]">{item.employeeName}</div>
                          <div className="text-xs text-[#76777D]">{item.department} • {item.shift}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold rounded-full">
                        {item.date}
                      </span>
                    </div>

                    <div className="bg-[#F6F3F5] rounded-md p-2.5 text-xs text-[#45464D] flex justify-between items-center">
                      <div>
                        <span className="text-[#76777D]">Checked in: </span>
                        <strong className="text-emerald-700 font-mono-numbers">{item.checkInTime}</strong>
                      </div>
                      <div>
                        <span className="text-[#76777D]">Expected exit: </span>
                        <strong className="text-[#1B1B1D] font-mono-numbers">{item.expectedCheckOutTime}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#F0EDEF]">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#76777D]">Set Exit Time:</span>
                        <input
                          type="text"
                          defaultValue={item.expectedCheckOutTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="px-2 py-1 border border-[#C6C6CD] rounded text-xs w-24 font-mono-numbers bg-white"
                        />
                      </div>
                      <button
                        onClick={() => onResolveCheckout(item.id, selectedTime || item.expectedCheckOutTime)}
                        className="px-3 py-1.5 text-xs font-semibold bg-black text-white hover:bg-[#3F465C] rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[14px]">done_all</span>
                        <span>Auto-Resolve Exit</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* Payroll Reviews Tab */}
          {activeSubTab === 'payroll' && (
            <>
              {pendingPayrollList.length === 0 ? (
                <div className="py-12 text-center text-[#76777D]">
                  <span className="material-symbols-outlined text-4xl text-emerald-500 mb-2">check_circle</span>
                  <p className="font-semibold text-sm text-[#1B1B1D]">All payroll reviews have been verified!</p>
                </div>
              ) : (
                pendingPayrollList.map((pr) => (
                  <div
                    key={pr.id}
                    className="bg-white border border-[#E4E2E4] rounded-lg p-4 shadow-xs flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-[#0058BE] font-bold text-xs flex items-center justify-center">
                          {pr.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#1B1B1D]">{pr.employeeName}</div>
                          <div className="text-xs text-[#76777D]">{pr.department}</div>
                        </div>
                      </div>
                      <div className="text-right font-mono-numbers">
                        <span className="text-xs text-[#76777D]">Net: </span>
                        <strong className="text-sm text-black font-bold">${pr.netSalary.toLocaleString()}.00</strong>
                      </div>
                    </div>

                    <div className="bg-[#F6F3F5] rounded-md p-3 text-xs space-y-1.5">
                      <div className="font-semibold text-rose-700 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">error</span>
                        <span>{pr.issue}</span>
                      </div>
                      <p className="text-[#45464D] pl-5">{pr.discrepancyNote}</p>
                    </div>

                    <div className="flex justify-end pt-1 border-t border-[#F0EDEF]">
                      <button
                        onClick={() => onVerifyPayrollReview(pr.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold bg-[#0058BE] text-white hover:bg-[#004395] rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[14px]">price_check</span>
                        <span>Approve & Verify Calculation</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E4E2E4] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#F0EDEF] text-[#1B1B1D] hover:bg-[#EAE7E9] rounded-lg font-semibold text-xs transition-colors"
          >
            Close Action Center
          </button>
        </div>
      </div>
    </div>
  );
};
