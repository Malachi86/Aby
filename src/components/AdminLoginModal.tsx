import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { KeyRound, Lock, ShieldCheck, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { loginAdmin, adminPin } = useBlog();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(pin);
    if (success) {
      setError(false);
      setPin('');
      onSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0C0420] border border-[#BA6E8F]/50 shadow-2xl shadow-[#BA6E8F]/20 text-stone-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#F8A5C2] via-[#BA6E8F] to-[#5D3C64] p-0.5 shadow-lg shadow-[#BA6E8F]/30">
            <div className="w-full h-full bg-[#0C0420] rounded-[14px] flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#F8A5C2]" />
            </div>
          </div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
            Author & Admin Login
          </h2>
          <p className="text-xs text-[#F8A5C2] mt-1 font-sans font-medium">
            Exclusive workspace for Ruby Aumentado Orozco (aby)
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#F8A5C2] mb-1.5">
              Passcode or Admin PIN
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#F8A5C2] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Enter admin passcode..."
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                autoFocus
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#1b0a24] border border-[#BA6E8F]/60 rounded-xl text-white placeholder-stone-400 focus:outline-none focus:border-[#F8A5C2] focus:ring-2 focus:ring-[#F8A5C2]/40 transition-all"
              />
            </div>
            {error && (
              <p className="text-xs text-rose-300 mt-2 font-medium">
                Incorrect passcode. Please try again. (Hint: {adminPin})
              </p>
            )}
          </div>

          {/* Quick Helper Hint */}
          <div className="p-3.5 rounded-xl bg-[#2d1338]/60 border border-[#BA6E8F]/40 text-xs text-stone-300">
            <span className="font-bold text-[#F8A5C2] block mb-1">
              Author Access Note:
            </span>
            Default passcode is <span className="font-mono text-slate-900 font-bold bg-[#F8A5C2] px-2 py-0.5 rounded shadow-xs">{adminPin}</span>. You can change this anytime inside the Admin Dashboard.
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#F8A5C2] via-[#BA6E8F] to-[#F8A5C2] hover:opacity-95 active:scale-[0.98] rounded-xl shadow-lg shadow-[#BA6E8F]/25 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>Sign In to Admin Dashboard</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
