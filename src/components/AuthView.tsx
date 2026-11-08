import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  LogIn,
  UserPlus,
  BookOpen,
  Award,
  Users,
  AlertCircle,
} from 'lucide-react';
import {
  isBatch22,
  generateStudentIdForBatch,
  getDefaultLevelTermForBatch,
  getEduEmailForStudentId,
} from '../utils/studentIdUtils';

export const AuthView: React.FC = () => {
  const {
    tryDemo,
    loginUser,
    registerUser,
    users,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('0802420205101034@baust.edu.bd');
  const [loginPass, setLoginPass] = useState('password123');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regDept, setRegDept] = useState('Computer Science & Engineering');
  const [regBatch, setRegBatch] = useState('Batch 22');
  const [regLevelTerm, setRegLevelTerm] = useState(getDefaultLevelTermForBatch('Batch 22'));
  const [regStudentId, setRegStudentId] = useState(generateStudentIdForBatch('Batch 22'));
  const [regEmail, setRegEmail] = useState(getEduEmailForStudentId(generateStudentIdForBatch('Batch 22')));
  const [regPass, setRegPass] = useState('');
  const [regBio, setRegBio] = useState('');

  // Handle batch change to automatically synchronize level/term and sample student ID
  const handleBatchChange = (newBatch: string) => {
    setRegBatch(newBatch);
    setRegLevelTerm(getDefaultLevelTermForBatch(newBatch));
    const generatedId = generateStudentIdForBatch(newBatch);
    setRegStudentId(generatedId);
    setRegEmail(getEduEmailForStudentId(generatedId));
  };

  const handleStudentIdChange = (newId: string) => {
    setRegStudentId(newId);
    if (!regEmail || regEmail.endsWith('@baust.edu.bd')) {
      setRegEmail(getEduEmailForStudentId(newId));
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = loginUser(loginEmail);
    if (!success) {
      setLoginError('Invalid institutional email or Student ID. Please check and try again.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    registerUser({
      name: regName.trim(),
      email: regEmail.trim(),
      department: regDept,
      batch: regBatch.trim() || 'Batch 22',
      levelTerm: regLevelTerm.trim() || getDefaultLevelTermForBatch(regBatch),
      studentId: regStudentId.trim() || generateStudentIdForBatch(regBatch),
      bio: regBio.trim(),
    });
  };

  // Only preset demo accounts
  const demoUsers = users.filter((u) => u.isDemo);

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Branding & Highlights */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
              <GraduationCap className="w-4 h-4 text-teal-600" />
              <span>BAUST University Peer Network</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Peer Tutoring for Campus Excellence
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Connect with senior tutors and peers for course guidance, exam preparation, and verified academic mentorship.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="p-2 bg-teal-50 text-teal-700 rounded-lg shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-slate-800 block">Course & Batch Matching</span>
                <span className="text-slate-500">Auto-aligns syllabus between Level 3/1 senior tutors and junior batches.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-slate-800 block">Verified Student Identity</span>
                <span className="text-slate-500">Secure institutional authentication via <code className="text-slate-700 font-mono">id@baust.edu.bd</code>.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="p-2 bg-amber-50 text-amber-700 rounded-lg shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-slate-800 block">Strict Peer Safeguards</span>
                <span className="text-slate-500">Tutors confirm sessions; only students review completed sessions.</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Personas Selector for Evaluation */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Sparkles className="w-4 h-4" />
                <span>Instant Demo Access</span>
              </div>
              <span className="text-[10px] text-slate-400">1-Click Evaluation</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Explore the system instantly using preconfigured university personas:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => tryDemo('learner')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-teal-700 transition text-left text-xs border border-slate-700"
              >
                <div className="font-semibold text-white truncate">Maruf Siddiki</div>
                <div className="text-[10px] text-slate-400 truncate">19 Batch • Learner</div>
              </button>
              <button
                onClick={() => {
                  const ayesha = demoUsers.find((u) => u.name.includes('Ayesha'));
                  if (ayesha) loginUser(ayesha.email);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-700 transition text-left text-xs border border-slate-700"
              >
                <div className="font-semibold text-white truncate">Ayesha Rahman</div>
                <div className="text-[10px] text-slate-400 truncate">20 Batch • Tutor</div>
              </button>
              <button
                onClick={() => {
                  const fahim = demoUsers.find((u) => u.name.includes('Fahim'));
                  if (fahim) loginUser(fahim.email);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-700 transition text-left text-xs border border-slate-700"
              >
                <div className="font-semibold text-white truncate">Fahim Hasan</div>
                <div className="text-[10px] text-slate-400 truncate">22 Batch (08026...)</div>
              </button>
              <button
                onClick={() => {
                  const admin = demoUsers.find((u) => u.isAdmin);
                  if (admin) loginUser(admin.email);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-purple-700 transition text-left text-xs border border-slate-700"
              >
                <div className="font-semibold text-white truncate">Dr. Shakil Hasan</div>
                <div className="text-[10px] text-slate-400 truncate">Staff Moderator</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Container */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Form Tabs */}
          <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setLoginError('');
              }}
              className={`py-4 text-center flex items-center justify-center gap-2 transition ${
                mode === 'login'
                  ? 'bg-white text-teal-700 border-b-2 border-teal-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setLoginError('');
              }}
              className={`py-4 text-center flex items-center justify-center gap-2 transition ${
                mode === 'register'
                  ? 'bg-white text-teal-700 border-b-2 border-teal-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Student</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {loginError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    BAUST Institutional Email / Student ID
                  </label>
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition text-xs font-mono text-slate-800"
                    placeholder="0802420205101034@baust.edu.bd"
                    required
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Use full email format: <code className="text-slate-600 font-mono">id@baust.edu.bd</code>
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">Password</label>
                    <span className="text-[11px] text-teal-600 hover:underline cursor-pointer">
                      Forgot Password?
                    </span>
                  </div>
                  <input
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition text-xs text-slate-800"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition shadow-sm text-xs flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In to Platform</span>
                </button>

                <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                  New to CampusTutor?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-teal-700 font-bold hover:underline"
                  >
                    Create student account
                  </button>
                </div>
              </form>
            )}

            {/* REGISTER FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Student Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Shakil Mahmud"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 text-xs text-slate-800"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                    <select
                      value={regDept}
                      onChange={(e) => setRegDept(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800"
                    >
                      <option value="Computer Science & Engineering">CSE</option>
                      <option value="Electrical & Electronic Engineering">EEE</option>
                      <option value="Business Administration">BBA</option>
                      <option value="Civil Engineering">CE</option>
                      <option value="Mechanical Engineering">ME</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Batch</label>
                    <select
                      value={regBatch}
                      onChange={(e) => handleBatchChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800 font-semibold"
                    >
                      <option value="Batch 22">Batch 22 (Level 1 / Term II)</option>
                      <option value="Batch 21">Batch 21 (Level 2 / Term I)</option>
                      <option value="Batch 20">Batch 20 (Level 2 / Term II)</option>
                      <option value="Batch 19">Batch 19 (Level 3 / Term I)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Level / Term</label>
                    <input
                      type="text"
                      value={regLevelTerm}
                      onChange={(e) => setRegLevelTerm(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-800 text-xs font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student ID Number
                    </label>
                    <input
                      type="text"
                      value={regStudentId}
                      onChange={(e) => handleStudentIdChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-mono text-slate-800"
                      placeholder={isBatch22(regBatch) ? "0802620105101089" : "0802420205101034"}
                      required
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {isBatch22(regBatch) ? 'Batch 22 format: 080262010.......' : '16-digit university ID'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Institutional Email (<code className="font-mono">id@baust.edu.bd</code>)
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-mono text-slate-800"
                      placeholder="0802620105101089@baust.edu.bd"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="Min 6 characters"
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Short Bio</label>
                  <textarea
                    rows={2}
                    value={regBio}
                    onChange={(e) => setRegBio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800"
                    placeholder="Courses you need help with or subjects you excel in..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition shadow-sm text-xs flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register & Open Platform</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
