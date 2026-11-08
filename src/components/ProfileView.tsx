import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Star,
  Video,
  Upload,
  BookOpen,
  Lock,
  User,
  Award,
  Calendar,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  FileCheck,
} from 'lucide-react';
import { isBatch22, getDefaultLevelTermForBatch } from '../utils/studentIdUtils';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateProfile,
    verifyInstitutionalEmail,
    submitStudentIdCard,
    updateTutorSettings,
    changePassword,
    setVideoToPlay,
    setVideoPlayerModalOpen,
    sessions,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'portfolio' | 'edit' | 'verification' | 'tutor-settings' | 'security'>('portfolio');

  // Edit profile form
  const [name, setName] = useState(currentUser.name);
  const [department, setDepartment] = useState(currentUser.department);
  const [batch, setBatch] = useState(currentUser.batch);
  const [levelTerm, setLevelTerm] = useState(currentUser.levelTerm);
  const [studentId, setStudentId] = useState(currentUser.studentId);
  const [bio, setBio] = useState(currentUser.bio);
  const [profileUpdated, setProfileUpdated] = useState(false);

  // Tutor settings form
  const [hourlyRate, setHourlyRate] = useState(currentUser.hourlyRate || 300);
  const [rateType, setRateType] = useState(currentUser.rateType || 'hourly');
  const [paymentPreference, setPaymentPreference] = useState(currentUser.paymentPreference || 'paid');
  const [deliveryMode, setDeliveryMode] = useState(currentUser.deliveryMode || 'hybrid');
  const [groupDiscountPercent, setGroupDiscountPercent] = useState(currentUser.groupDiscountPercent || 25);
  const [demoVideoTitle, setDemoVideoTitle] = useState(currentUser.demoVideo?.title || '');
  const [demoVideoUrl, setDemoVideoUrl] = useState(currentUser.demoVideo?.url || '');
  const [demoVideoTopic, setDemoVideoTopic] = useState(currentUser.demoVideo?.topic || '');
  const [demoVideoDuration, setDemoVideoDuration] = useState(currentUser.demoVideo?.duration || '10 min');
  const [tutorUpdated, setTutorUpdated] = useState(false);

  // Security form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  // ID Upload
  const [uploadFileName, setUploadFileName] = useState('');

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      department,
      batch,
      levelTerm,
      studentId: studentId.trim() || currentUser.studentId,
      bio,
    });
    setProfileUpdated(true);
    setTimeout(() => setProfileUpdated(false), 3000);
  };

  const handleTutorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTutorSettings({
      hourlyRate,
      rateType,
      paymentPreference,
      deliveryMode,
      groupDiscountPercent,
      demoVideo: demoVideoTitle.trim()
        ? {
            title: demoVideoTitle,
            url: demoVideoUrl || 'https://www.youtube.com/watch?v=demo',
            topic: demoVideoTopic || 'General Peer Tutoring Demo',
            duration: demoVideoDuration || '10 min',
          }
        : currentUser.demoVideo,
    });
    setTutorUpdated(true);
    setTimeout(() => setTutorUpdated(false), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('New passwords do not match.');
      return;
    }
    changePassword(newPassword);
    setPasswordMsg('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMsg(''), 4000);
  };

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFileName(file.name);
      submitStudentIdCard(file.name);
    }
  };

  // Completed sessions involving current user
  const userCompletedSessions = sessions.filter(
    (s) =>
      s.status === 'completed' &&
      (s.tutorId === currentUser.id || s.learnerId === currentUser.id)
  );

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-2xs"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900">{currentUser.name}</h1>
                {currentUser.institutionalEmailVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Institutional Email Verified
                  </span>
                )}
                {currentUser.studentIdVerification === 'verified' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <FileCheck className="w-3.5 h-3.5" /> Student ID Verified
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    ID Card: {currentUser.studentIdVerification}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-1">
                {currentUser.department} • <strong className="text-slate-700">{currentUser.batch}</strong> • {currentUser.levelTerm} • Student ID: <span className="font-mono text-slate-800">{currentUser.studentId}</span>
              </p>

              <div className="flex items-center gap-3 mt-3 flex-wrap text-xs text-slate-600">
                <span className="font-semibold text-amber-600 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {currentUser.rating} ({currentUser.ratingCount} reviews)
                </span>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  {currentUser.teachingHours} Teaching Hours
                </span>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                  {currentUser.points} Reward Points
                </span>
              </div>
            </div>
          </div>

          {/* Quick strike safety indicator */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs self-start sm:self-auto">
            <div className="text-[11px] font-semibold text-slate-500 mb-1">Safety & Trust Standing</div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${currentUser.strikes === 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="font-bold text-slate-800">
                {currentUser.strikes === 0 ? 'Zero Strikes (Good Standing)' : `${currentUser.strikes}/3 Strikes`}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-200 mt-5 pt-3 text-xs">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-3 py-2 font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'portfolio'
                ? 'bg-teal-50 text-teal-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Digital Teaching Portfolio
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-2 font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'edit'
                ? 'bg-teal-50 text-teal-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-3 py-2 font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'verification'
                ? 'bg-teal-50 text-teal-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            ID & Email Verification
          </button>
          <button
            onClick={() => setActiveTab('tutor-settings')}
            className={`px-3 py-2 font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'tutor-settings'
                ? 'bg-teal-50 text-teal-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Tutor Settings & Demo Video
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-2 font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-teal-50 text-teal-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Security & Password
          </button>
        </div>
      </div>

      {/* Tab 1: Verified Digital Teaching Portfolio */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-600" />
                  Verified Digital Teaching Portfolio
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your public university credentials, verified teaching hours, demo video, and student reviews.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                Campus Verified
              </span>
            </div>

            {/* Teaching Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <Clock className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-slate-900">{currentUser.teachingHours} Hours</div>
                <div className="text-[11px] text-slate-500 font-medium">Teaching Badge</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <BookOpen className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-slate-900">{currentUser.completedSessionsCount}</div>
                <div className="text-[11px] text-slate-500 font-medium">Completed Sessions</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-slate-900">{currentUser.rating} / 5.0</div>
                <div className="text-[11px] text-slate-500 font-medium">Student Rating</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <Sparkles className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-teal-700">{currentUser.points} Pts</div>
                <div className="text-[11px] text-slate-500 font-medium">Peer Reward Points</div>
              </div>
            </div>

            {/* Demo Video Section */}
            {currentUser.demoVideo ? (
              <div className="mb-6 p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-rose-600" />
                    Featured Teaching Demo Video
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">
                    Duration: {currentUser.demoVideo.duration}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{currentUser.demoVideo.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Topic: {currentUser.demoVideo.topic}</p>
                    <span className="text-[10px] text-teal-700 font-mono mt-1 block">
                      URL: {currentUser.demoVideo.url}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setVideoToPlay(currentUser.demoVideo!);
                      setVideoPlayerModalOpen(true);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition shrink-0"
                  >
                    Play Demo Class
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                No demo class video uploaded yet. Add a 5-10 min topic explanation in the "Tutor Settings" tab to boost booking inquiries!
              </div>
            )}

            {/* Courses & Rate Structure */}
            <div className="mb-6">
              <h3 className="font-bold text-xs text-slate-900 mb-2">Curriculum & Courses Taught</h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.coursesTaught.length > 0 ? (
                  currentUser.coursesTaught.map((c, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-lg border border-slate-200"
                    >
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No courses listed yet.</span>
                )}
              </div>
            </div>

            {/* Star Rating & Written Reviews */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-xs text-slate-900">
                  Student Reviews & Feedback ({currentUser.reviews.length})
                </h3>
              </div>

              {currentUser.reviews.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500">
                  No written reviews yet. Reviews are automatically posted here after peer sessions are marked completed.
                </div>
              ) : (
                <div className="space-y-3">
                  {currentUser.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.reviewerAvatar}
                            alt={rev.reviewerName}
                            className="w-6 h-6 rounded-md object-cover border border-slate-200"
                          />
                          <span className="font-bold text-slate-900">{rev.reviewerName}</span>
                          <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded font-medium">
                            {rev.courseCode}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{rev.rating}.0</span>
                          <span className="text-[10px] text-slate-400 font-normal ml-1">{rev.date}</span>
                        </div>
                      </div>
                      <p className="text-slate-700 leading-relaxed pl-8">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Edit Profile & Academic Info */}
      {activeTab === 'edit' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-2xl">
          <h2 className="font-bold text-base text-slate-900 mb-1">Edit Academic Profile</h2>
          <p className="text-xs text-slate-500 mb-4">
            Update your department, batch, term, and bio visible across directory and help-posts.
          </p>

          {profileUpdated && (
            <div className="mb-4 p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium">
              Profile details updated successfully!
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Batch</label>
                <input
                  type="text"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  placeholder="e.g. Batch 21"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700">Level / Term</label>
                  {levelTerm !== getDefaultLevelTermForBatch(batch) && (
                    <button
                      type="button"
                      onClick={() => setLevelTerm(getDefaultLevelTermForBatch(batch))}
                      className="text-[10px] text-teal-700 hover:text-teal-900 font-semibold underline underline-offset-1"
                    >
                      Use Standard ({getDefaultLevelTermForBatch(batch)})
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={levelTerm}
                  onChange={(e) => setLevelTerm(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  placeholder={`e.g. ${getDefaultLevelTermForBatch(batch)}`}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700">
                    Student ID Number (e.g. BAUST 16-digit ID)
                  </label>
                  {isBatch22(batch) && !studentId.startsWith('080262010') && (
                    <button
                      type="button"
                      onClick={() => {
                        const suffix = studentId.replace(/^\D+/, '').slice(-7) || '5101089';
                        setStudentId(`080262010${suffix.padStart(7, '0')}`);
                      }}
                      className="text-[10px] text-teal-700 hover:text-teal-900 font-semibold underline underline-offset-1"
                    >
                      Use 22 Batch Format (080262010...)
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-slate-800 text-xs"
                  placeholder={isBatch22(batch) ? "e.g. 0802620105101089" : "e.g. 0802420205101034"}
                />
                {isBatch22(batch) ? (
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-teal-800 bg-teal-50 px-2 py-1 rounded border border-teal-200 font-medium">
                    <span>✓</span>
                    <span>22 Batch ID starts with <strong className="font-mono">080262010.......</strong> (16 digits)</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    BAUST ID Format: 16 digits (e.g. 0802420205101034) or short roll (2104041)
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bio & Teaching Philosophy</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                placeholder="Share your strengths, lab experience, or teaching style..."
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Institutional & Student ID Verification */}
      {activeTab === 'verification' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-2xl space-y-6">
          <div>
            <h2 className="font-bold text-base text-slate-900 mb-1">Campus Trust & Verification</h2>
            <p className="text-xs text-slate-500">
              Complete university verifications to earn the Verified Peer badge and build trust among students.
            </p>
          </div>

          {/* 1. Institutional Email (.edu) */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs text-slate-900">Institutional Email Verification</h3>
                  {currentUser.institutionalEmailVerified ? (
                    <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Unverified
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Email: <strong className="text-slate-700">{currentUser.email}</strong>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Institutional accounts ending in <code className="text-slate-700">.edu</code> guarantee you are a verified university student.
                </p>
              </div>

              {!currentUser.institutionalEmailVerified ? (
                <button
                  onClick={verifyInstitutionalEmail}
                  className="px-3 py-1.5 text-xs font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 shrink-0"
                >
                  Verify Email
                </button>
              ) : (
                <div className="flex items-center gap-1 text-teal-700 text-xs font-semibold shrink-0">
                  <CheckCircle2 className="w-4 h-4" /> Confirmed
                </div>
              )}
            </div>
          </div>

          {/* 2. Student ID Card Document */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs text-slate-900">Student ID Card Verification</h3>
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                      currentUser.studentIdVerification === 'verified'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : currentUser.studentIdVerification === 'pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {currentUser.studentIdVerification}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Upload a clear photo or scan of your university student ID card with photo and batch visible.
                </p>
              </div>
            </div>

            {currentUser.studentIdCardImage && (
              <div className="mb-3 p-2 bg-white rounded-lg border border-slate-200 flex items-center gap-3">
                <img
                  src={currentUser.studentIdCardImage}
                  alt="Student ID card preview"
                  className="w-16 h-10 object-cover rounded border border-slate-200"
                />
                <div className="text-xs">
                  <div className="font-semibold text-slate-800">
                    {uploadFileName || 'University_Student_ID.jpg'}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">Verified by Campus Registrar System</div>
                </div>
              </div>
            )}

            <div>
              <label className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New Student ID Document</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIdUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[10px] text-slate-400 block mt-1">
                Accepted: JPG, PNG, PDF (Max 5MB)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Tutor Settings & Demo Video */}
      {activeTab === 'tutor-settings' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-2xl">
          <h2 className="font-bold text-base text-slate-900 mb-1">Tutor Settings & Demo Video Upload</h2>
          <p className="text-xs text-slate-500 mb-4">
            Configure hourly rates, package rates, group discounts, and your teaching demonstration video.
          </p>

          {tutorUpdated && (
            <div className="mb-4 p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium">
              Tutor preferences and demo video saved!
            </div>
          )}

          <form onSubmit={handleTutorSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hourly Rate (BDT)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pricing Model</label>
                <select
                  value={paymentPreference}
                  onChange={(e) => setPaymentPreference(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="paid">Standard Paid</option>
                  <option value="free">Free (Community Points Volunteer)</option>
                  <option value="negotiable">Negotiable in Chat</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rate Type</label>
                <select
                  value={rateType}
                  onChange={(e) => setRateType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="hourly">Hourly Rate</option>
                  <option value="fixed">Fixed Per Session</option>
                  <option value="package">Package / Multi-Session Bundle</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Delivery Mode</label>
                <select
                  value={deliveryMode}
                  onChange={(e) => setDeliveryMode(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="hybrid">Hybrid (Both Online & Offline)</option>
                  <option value="online">Online Only (Google Meet)</option>
                  <option value="offline">Offline Only (Campus)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Group Session Discount (%)
              </label>
              <input
                type="number"
                value={groupDiscountPercent}
                onChange={(e) => setGroupDiscountPercent(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                placeholder="e.g. 25"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Discount applied per student when 2 or more learners join together.
              </span>
            </div>

            {/* Demo Class / Video Upload Section */}
            <div className="pt-3 border-t border-slate-200">
              <h3 className="font-bold text-xs text-slate-900 mb-2 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-rose-600" /> Demo Class / Teaching Video
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Video Title</label>
                  <input
                    type="text"
                    value={demoVideoTitle}
                    onChange={(e) => setDemoVideoTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    placeholder="e.g. Pointers & Dynamic Memory in C"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Video URL or Drive Link</label>
                    <input
                      type="url"
                      value={demoVideoUrl}
                      onChange={(e) => setDemoVideoUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      placeholder="https://youtube.com/... or Google Drive"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={demoVideoDuration}
                      onChange={(e) => setDemoVideoDuration(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      placeholder="e.g. 8 min 45 sec"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Key Topics Covered</label>
                  <input
                    type="text"
                    value={demoVideoTopic}
                    onChange={(e) => setDemoVideoTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    placeholder="e.g. Memory allocation, stack vs heap, pointer dereferencing"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition"
            >
              Update Tutor Settings
            </button>
          </form>
        </div>
      )}

      {/* Tab 5: Account Security & Change Password */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-md">
          <h2 className="font-bold text-base text-slate-900 mb-1 flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-700" /> Change Account Password
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Keep your peer tutoring account secure. Enter your current and new password.
          </p>

          {passwordMsg && (
            <div
              className={`mb-4 p-3 rounded-lg text-xs font-medium ${
                passwordMsg.includes('successfully')
                  ? 'bg-teal-50 border border-teal-200 text-teal-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {passwordMsg}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition"
            >
              Update Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
