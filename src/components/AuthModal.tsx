import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, GraduationCap, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { isBatch22, generateStudentIdForBatch, getDefaultLevelTermForBatch } from '../utils/studentIdUtils';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authMode,
    setAuthMode,
    tryDemo,
    loginUser,
    registerUser,
  } = useApp();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('maruf.siddiki@cse.univ.edu');
  const [loginPass, setLoginPass] = useState('password123');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regDept, setRegDept] = useState('Computer Science & Engineering');
  const [regBatch, setRegBatch] = useState('Batch 22');
  const [regLevelTerm, setRegLevelTerm] = useState('Level 1 / Term II');
  const [regStudentId, setRegStudentId] = useState('');
  const [regBio, setRegBio] = useState('');

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [newResetPassword, setNewResetPassword] = useState('');

  if (!authModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(loginEmail);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    registerUser({
      name: regName.trim(),
      email: regEmail.trim(),
      department: regDept,
      batch: regBatch,
      levelTerm: regLevelTerm,
      studentId: regStudentId.trim() || generateStudentIdForBatch(regBatch),
      bio: regBio.trim(),
    });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 relative bg-gradient-to-r from-teal-50/50 to-white">
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {authMode === 'login' && 'Log In to CampusTutor'}
                {authMode === 'register' && 'Create University Student Account'}
                {authMode === 'forgot' && 'Reset University Account Password'}
                {authMode === 'reset' && 'Set New Password'}
              </h2>
              <p className="text-xs text-slate-500">University Peer Tutoring Platform</p>
            </div>
          </div>

          {/* Prominent Instant Demo Access Button */}
          <div className="mt-3 p-3 bg-teal-600 text-white rounded-xl shadow-xs flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Instant Demo Experience
              </div>
              <div className="text-[11px] text-teal-100 mt-0.5">
                Explore as pre-filled demo student (Maruf Siddiki, CSE '19)
              </div>
            </div>
            <button
              onClick={() => tryDemo('learner')}
              className="px-3 py-1.5 bg-white text-teal-800 hover:bg-teal-50 text-xs font-bold rounded-lg shadow-2xs transition shrink-0 flex items-center gap-1"
            >
              <span>Try Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => {
              setAuthMode('login');
              setForgotSubmitted(false);
            }}
            className={`flex-1 py-2.5 text-center transition ${
              authMode === 'login'
                ? 'bg-white text-teal-700 border-b-2 border-teal-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode('register');
              setForgotSubmitted(false);
            }}
            className={`flex-1 py-2.5 text-center transition ${
              authMode === 'register'
                ? 'bg-white text-teal-700 border-b-2 border-teal-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register Student
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 text-xs">
          {/* LOGIN VIEW */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Institutional Email (.edu)
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  placeholder="name@cse.univ.edu"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-teal-600 hover:text-teal-800 text-[11px]"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition shadow-2xs"
              >
                Log In
              </button>

              <div className="pt-2 text-center text-slate-400 text-[11px]">
                Demo accounts: <code>maruf.siddiki@cse.univ.edu</code>, <code>ayesha.rahman@cse.univ.edu</code>, <code>shakil.hasan@univ.edu</code> (Admin)
              </div>
            </form>
          )}

          {/* REGISTER VIEW */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Student Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rifat Karim"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Institutional Email (.edu)
                  </label>
                  <input
                    type="email"
                    placeholder="student@univ.edu"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Electrical & Electronic Engineering">EEE</option>
                    <option value="Business Administration">BBA</option>
                    <option value="Civil Engineering">CE</option>
                    <option value="Mechanical Engineering">ME</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batch</label>
                  <input
                    type="text"
                    value={regBatch}
                    onChange={(e) => {
                      const newBatch = e.target.value;
                      setRegBatch(newBatch);
                      setRegLevelTerm(getDefaultLevelTermForBatch(newBatch));
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    placeholder="e.g. Batch 22"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-700">Level / Term</label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {getDefaultLevelTermForBatch(regBatch)}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={regLevelTerm}
                    onChange={(e) => setRegLevelTerm(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    placeholder={getDefaultLevelTermForBatch(regBatch)}
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-700">Student ID Card Number</label>
                    {isBatch22(regBatch) && (
                      <button
                        type="button"
                        onClick={() => setRegStudentId('0802620105101089')}
                        className="text-[10px] text-teal-700 hover:text-teal-900 font-semibold underline underline-offset-1"
                      >
                        Auto-fill 22 Batch ID
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={regStudentId}
                    onChange={(e) => setRegStudentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs"
                    placeholder={isBatch22(regBatch) ? "e.g. 0802620105101089" : "e.g. 0802420205101034"}
                    required
                  />
                  {isBatch22(regBatch) ? (
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-teal-800 bg-teal-50 px-2 py-1 rounded border border-teal-200 font-medium">
                      <span>✓</span>
                      <span>22 Batch ID starts with <strong className="font-mono">080262010.......</strong></span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      University 16-digit ID number
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Bio</label>
                <textarea
                  rows={2}
                  value={regBio}
                  onChange={(e) => setRegBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  placeholder="What topics do you love learning or helping peers with?"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition shadow-2xs mt-2"
              >
                Complete Registration
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {authMode === 'forgot' && (
            <div className="space-y-4">
              {!forgotSubmitted ? (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">
                    Enter your university email address. We will simulate sending a secure password reset link and verification code.
                  </p>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Institutional Email</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@univ.edu"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition shadow-2xs"
                  >
                    Send Reset Link
                  </button>
                </form>
              ) : (
                <div className="space-y-4 bg-teal-50/60 p-4 rounded-xl border border-teal-200">
                  <div className="flex items-center gap-2 text-teal-800 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    <span>Reset Email Simulation Sent!</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    A temporary security token has been generated for <strong>{forgotEmail || 'your email'}</strong>. Enter your new password below to complete the reset.
                  </p>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      value={newResetPassword}
                      onChange={(e) => setNewResetPassword(e.target.value)}
                      placeholder="New password (min 6 chars)"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setForgotSubmitted(false);
                    }}
                    className="w-full py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition"
                  >
                    Confirm New Password & Log In
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
