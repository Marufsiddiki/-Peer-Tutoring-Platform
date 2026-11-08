import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  HelpPost,
  TutoringSession,
  ChatThread,
  ChatMessage,
  AppNotification,
  DisputeReport,
  PointTransaction,
  PackageRateOption,
  PaymentOffer,
  ActiveRole,
  UserReview,
  BatchRelation,
  DeliveryMode,
  SessionDuration,
  RateType,
  PaymentPreference,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_HELP_POSTS,
  INITIAL_SESSIONS,
  INITIAL_CHAT_THREADS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS,
  INITIAL_POINT_TRANSACTIONS,
  INITIAL_PACKAGE_OFFERS,
} from '../data/mockData';
import { generateStudentIdForBatch, getDefaultLevelTermForBatch } from '../utils/studentIdUtils';

interface BookingResult {
  success: boolean;
  error?: string;
  session?: TutoringSession;
}

interface PriceCalculationResult {
  totalPrice: number;
  perStudentPrice: number;
  discountAppliedPercent: number;
}

interface AppContextType {
  currentUser: UserProfile;
  users: UserProfile[];
  helpPosts: HelpPost[];
  sessions: TutoringSession[];
  chatThreads: ChatThread[];
  notifications: AppNotification[];
  disputeReports: DisputeReport[];
  pointTransactions: PointTransaction[]; // #33

  // Navigation & Modals
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedTutor: UserProfile | null;
  setSelectedTutor: (tutor: UserProfile | null) => void;
  activeChatId: string | null;
  setActiveChatId: (chatId: string | null) => void;

  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'register' | 'forgot' | 'reset';
  setAuthMode: (mode: 'login' | 'register' | 'forgot' | 'reset') => void;

  helpPostModalOpen: boolean;
  setHelpPostModalOpen: (open: boolean) => void;

  bookingModalOpen: boolean;
  setBookingModalOpen: (open: boolean) => void;
  bookingPreset: Partial<TutoringSession> | null;
  setBookingPreset: (preset: Partial<TutoringSession> | null) => void;

  reviewModalOpen: boolean;
  setReviewModalOpen: (open: boolean) => void;
  reviewSession: TutoringSession | null;
  setReviewSession: (session: TutoringSession | null) => void;

  reportModalOpen: boolean;
  setReportModalOpen: (open: boolean) => void;
  reportTarget: { userId: string; userName: string; sessionId?: string } | null;
  setReportTarget: (target: { userId: string; userName: string; sessionId?: string } | null) => void;

  scheduleMatchModalOpen: boolean;
  setScheduleMatchModalOpen: (open: boolean) => void;
  scheduleMatchTutor: UserProfile | null;
  setScheduleMatchTutor: (tutor: UserProfile | null) => void;

  videoPlayerModalOpen: boolean;
  setVideoPlayerModalOpen: (open: boolean) => void;
  videoToPlay: { title: string; url: string; topic: string } | null;
  setVideoToPlay: (video: { title: string; url: string; topic: string } | null) => void;

  pointHistoryModalOpen: boolean; // #33
  setPointHistoryModalOpen: (open: boolean) => void;

  // Actions
  toggleActiveRole: () => void;
  switchUser: (userId: string) => void;
  tryDemo: (role?: ActiveRole) => void;
  loginUser: (email: string) => boolean;
  registerUser: (formData: {
    name: string;
    email: string;
    department: string;
    batch: string;
    levelTerm: string;
    studentId: string;
    bio: string;
  }) => void;
  logoutUser: () => void;

  // Profile & Verification
  updateProfile: (data: Partial<UserProfile>) => void;
  verifyInstitutionalEmail: () => void;
  submitStudentIdCard: (fakeFilename: string) => void;
  updateTutorSettings: (data: Partial<UserProfile>) => void;
  changePassword: (newPass: string) => boolean;

  // Help Posts & Tutors
  createHelpPost: (post: Omit<HelpPost, 'id' | 'learnerId' | 'learnerName' | 'learnerAvatar' | 'learnerDepartment' | 'learnerBatch' | 'learnerBatchNumber' | 'createdAt' | 'status' | 'offersCount'>) => void;
  getBatchRelation: (tutor: UserProfile) => BatchRelation;
  getScheduleOverlap: (tutor: UserProfile) => { day: string; overlappingSlots: string[] }[];
  getRecommendedTutors: () => UserProfile[];

  // Chat & Negotiation (#30, #31, #32)
  startChatWithTutor: (tutorId: string, courseCode?: string, initialMessage?: string) => void;
  sendMessage: (threadId: string, text: string, isProposal?: boolean, proposalDetails?: any) => void;
  negotiateOffer: (threadId: string, offer: Partial<PaymentOffer>) => void;

  // Pricing Helpers (#31, #32)
  calculatePrice: (params: {
    hourlyRate: number;
    duration: SessionDuration;
    rateType: RateType;
    isGroup: boolean;
    studentCount?: number;
    groupDiscountPercent?: number;
    packagePrice?: number;
  }) => PriceCalculationResult;

  // Booking & Sessions (#26, #27, #38)
  bookSession: (sessionData: Omit<TutoringSession, 'id' | 'status' | 'hasReview'>) => BookingResult; // #26 with conflict check
  requestBooking: (sessionData: Omit<TutoringSession, 'id' | 'status' | 'hasReview'>) => BookingResult;
  confirmBooking: (sessionId: string) => void; // #26 & Sequence Diagram Step 9-10
  declineBooking: (sessionId: string, reason?: string) => void;
  confirmAvailabilityAndPrice: (threadId: string, messageId: string) => void; // Sequence Diagram Step 6
  requestBookingFromChat: (threadId: string, messageId: string, details: any) => BookingResult; // Sequence Diagram Step 7
  cancelSession: (sessionId: string, reason?: string) => void; // #38 updates reminders
  rescheduleSession: (sessionId: string, newScheduledTime: string) => BookingResult; // #38 updates reminders
  markSessionCompleted: (sessionId: string) => void; // awards points without duplication (#33)
  markSessionNoShow: (sessionId: string, markedBy: 'learner' | 'tutor') => boolean; // #27
  submitReview: (sessionId: string, rating: number, comment: string) => void; // #34

  // Disputes & Admin Moderation (#35, #36)
  submitDisputeReport: (data: { reportedUserId: string; reportedUserName: string; reason: DisputeReport['reason']; details: string; sessionId?: string }) => void;
  updateReportStatus: (reportId: string, status: DisputeReport['status'], actionTaken?: string) => void; // #35
  resolveReport: (reportId: string, action: 'suspend' | 'warn' | 'dismiss') => void; // #36
  suspendUser: (userId: string) => void; // #36
  reactivateUser: (userId: string) => void; // #36
  toggleUserSuspension: (userId: string) => void; // #36

  // Notifications (#37, #38)
  simulateReminderNotification: (sessionId?: string) => void; // #38
  markNotificationRead: (id: string) => void; // #37
  markAllNotificationsRead: () => void; // #37
  clearAllNotifications: () => void; // #37
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence with localStorage fallback
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved =
      localStorage.getItem('campustutor_users_v8') ||
      localStorage.getItem('campustutor_users_v7') ||
      localStorage.getItem('campustutor_users_v6') ||
      localStorage.getItem('campustutor_users_v5');
    if (saved) {
      try {
        const parsed: UserProfile[] = JSON.parse(saved);
        // Ensure standard University batch to level/term mapping, 22 ID format, and id@baust.edu.bd email
        return parsed.map((u) => {
          if (u.id === 'user-admin') {
            return { ...u, email: 'shakil.hasan@baust.edu.bd' };
          }

          // 19 Batch -> Level 3 / Term I
          if (u.id === 'user-maruf' || u.batchNumber === 19 || u.batch?.includes('19')) {
            const sid = u.studentId || '0802420205101034';
            return { ...u, levelTerm: 'Level 3 / Term I', email: `${sid}@baust.edu.bd` };
          }
          // 20 Batch -> Level 2 / Term II
          if (u.id === 'user-tanvir' || u.batchNumber === 20 || u.batch?.includes('20')) {
            const sid = u.studentId || '0802520105201025';
            return { ...u, levelTerm: 'Level 2 / Term II', email: `${sid}@baust.edu.bd` };
          }
          // 21 Batch -> Level 2 / Term I
          if (u.id === 'user-sadia' || u.batchNumber === 21 || u.batch?.includes('21')) {
            const sid = u.studentId || '0802520205301045';
            return { ...u, levelTerm: 'Level 2 / Term I', email: `${sid}@baust.edu.bd` };
          }
          // 22 Batch -> Level 1 / Term II & 080262010....... ID
          if (u.id === 'user-fahim' || u.batchNumber === 22 || u.batch?.includes('22')) {
            const validStudentId = u.studentId?.startsWith('080262010') ? u.studentId : '0802620105101089';
            return { ...u, levelTerm: 'Level 1 / Term II', studentId: validStudentId, email: `${validStudentId}@baust.edu.bd` };
          }

          const fallbackSid = u.studentId?.trim() || '0802420205101034';
          return {
            ...u,
            email: u.email?.includes('@baust.edu.bd') ? u.email : `${fallbackSid}@baust.edu.bd`,
          };
        });
      } catch (err) {
        console.error('Failed to parse saved users', err);
      }
    }
    return INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('campustutor_current_user_id') || 'user-maruf';
  });

  const [helpPosts, setHelpPosts] = useState<HelpPost[]>(() => {
    const saved = localStorage.getItem('campustutor_posts_v5');
    return saved ? JSON.parse(saved) : INITIAL_HELP_POSTS;
  });

  const [sessions, setSessions] = useState<TutoringSession[]>(() => {
    const saved = localStorage.getItem('campustutor_sessions_v2');
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  const [chatThreads, setChatThreads] = useState<ChatThread[]>(() => {
    const saved = localStorage.getItem('campustutor_chats_v2');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_THREADS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('campustutor_notifications_v2');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [disputeReports, setDisputeReports] = useState<DisputeReport[]>(() => {
    const saved = localStorage.getItem('campustutor_reports_v2');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [pointTransactions, setPointTransactions] = useState<PointTransaction[]>(() => {
    const saved = localStorage.getItem('campustutor_point_txs');
    return saved ? JSON.parse(saved) : INITIAL_POINT_TRANSACTIONS;
  });

  // Navigation and UI state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedTutor, setSelectedTutor] = useState<UserProfile | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  const [helpPostModalOpen, setHelpPostModalOpen] = useState<boolean>(false);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [bookingPreset, setBookingPreset] = useState<Partial<TutoringSession> | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [reviewSession, setReviewSession] = useState<TutoringSession | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [reportTarget, setReportTarget] = useState<{ userId: string; userName: string; sessionId?: string } | null>(null);
  const [scheduleMatchModalOpen, setScheduleMatchModalOpen] = useState<boolean>(false);
  const [scheduleMatchTutor, setScheduleMatchTutor] = useState<UserProfile | null>(null);
  const [videoPlayerModalOpen, setVideoPlayerModalOpen] = useState<boolean>(false);
  const [videoToPlay, setVideoToPlay] = useState<{ title: string; url: string; topic: string } | null>(null);
  const [pointHistoryModalOpen, setPointHistoryModalOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('campustutor_users_v8', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('campustutor_current_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('campustutor_posts_v5', JSON.stringify(helpPosts));
  }, [helpPosts]);

  useEffect(() => {
    localStorage.setItem('campustutor_sessions_v2', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('campustutor_chats_v2', JSON.stringify(chatThreads));
  }, [chatThreads]);

  useEffect(() => {
    localStorage.setItem('campustutor_notifications_v2', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('campustutor_reports_v2', JSON.stringify(disputeReports));
  }, [disputeReports]);

  useEffect(() => {
    localStorage.setItem('campustutor_point_txs', JSON.stringify(pointTransactions));
  }, [pointTransactions]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  // Actions
  const toggleActiveRole = () => {
    const nextRole: ActiveRole = currentUser.activeRole === 'learner' ? 'tutor' : 'learner';
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, activeRole: nextRole } : u))
    );
    if (nextRole === 'tutor' && activeTab === 'tutors') {
      setActiveTab('help-posts');
    }
  };

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUserId(userId);
      if (found.isAdmin) {
        setActiveTab('admin');
      } else if (activeTab === 'admin') {
        setActiveTab('dashboard');
      }
    }
  };

  const tryDemo = (role: ActiveRole = 'learner') => {
    const demoUser = users.find((u) => u.id === 'user-maruf') || users[0];
    setCurrentUserId(demoUser.id);
    setUsers((prev) =>
      prev.map((u) => (u.id === demoUser.id ? { ...u, activeRole: role } : u))
    );
    setAuthModalOpen(false);
    setActiveTab('dashboard');
  };

  const loginUser = (input: string) => {
    const clean = input.trim().toLowerCase();
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === clean ||
        u.studentId.toLowerCase() === clean ||
        u.email.toLowerCase().startsWith(`${clean}@`) ||
        `${u.studentId}@baust.edu.bd`.toLowerCase() === clean
    );
    if (found) {
      setCurrentUserId(found.id);
      setAuthModalOpen(false);
      if (found.isAdmin) {
        setActiveTab('admin');
      } else if (activeTab === 'admin') {
        setActiveTab('dashboard');
      }
      return true;
    }
    tryDemo('learner');
    return true;
  };

  const registerUser = (formData: {
    name: string;
    email: string;
    department: string;
    batch: string;
    levelTerm: string;
    studentId: string;
    bio: string;
  }) => {
    const match = formData.batch.match(/\d+/);
    const batchNum = match ? parseInt(match[0], 10) : 22;
    const finalStudentId = formData.studentId?.trim() || generateStudentIdForBatch(formData.batch);
    const finalEmail = formData.email?.trim()
      ? formData.email.includes('@')
        ? formData.email.trim()
        : `${formData.email.trim()}@baust.edu.bd`
      : `${finalStudentId}@baust.edu.bd`;

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: formData.name,
      email: finalEmail,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      role: 'both',
      activeRole: 'learner',
      department: formData.department,
      batch: formData.batch,
      batchNumber: batchNum,
      levelTerm: formData.levelTerm?.trim() || getDefaultLevelTermForBatch(formData.batch),
      studentId: finalStudentId,
      bio: formData.bio || 'Eager university student seeking to learn and collaborate with fellow peers.',
      isAdmin: false,
      institutionalEmailVerified: finalEmail.endsWith('@baust.edu.bd') || finalEmail.endsWith('.edu') || finalEmail.includes('univ'),
      studentIdVerification: 'pending',
      strikes: 0,
      accountStatus: 'active',
      isTutorActive: true,
      coursesTaught: [],
      hourlyRate: 250,
      rateType: 'hourly',
      paymentPreference: 'negotiable',
      deliveryMode: 'hybrid',
      groupDiscountPercent: 20,
      packageOffers: [],
      availability: [
        { day: 'Monday', timeSlots: ['04:00 PM - 06:00 PM'] },
        { day: 'Wednesday', timeSlots: ['03:00 PM - 06:00 PM'] },
      ],
      rating: 5.0,
      ratingCount: 0,
      teachingHours: 0,
      totalHoursTaught: 0,
      completedSessionsCount: 0,
      successfulSessions: 0,
      points: 100, // Welcome bonus
      reviews: [],
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    setAuthModalOpen(false);

    // Initial welcome transaction (#33)
    const welcomeTx: PointTransaction = {
      id: `pt-${Date.now()}`,
      userId: newUser.id,
      amount: 100,
      type: 'welcome_bonus',
      description: 'Account activation welcome bonus (#33)',
      timestamp: new Date().toISOString(),
    };
    setPointTransactions((prev) => [welcomeTx, ...prev]);

    // Welcome notification (#37)
    const welcomeNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: newUser.id,
      title: 'Welcome to CampusTutor! (#37)',
      message: 'Your university profile has been established with 100 welcome reward points.',
      type: 'reward',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);
  };

  const logoutUser = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...data } : u))
    );
  };

  const verifyInstitutionalEmail = () => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id ? { ...u, institutionalEmailVerified: true } : u
      )
    );
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Institutional Email Verified!',
      message: 'Your institutional credentials have been authenticated. Verified badge awarded.',
      type: 'reward',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const submitStudentIdCard = (fakeFilename: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? {
              ...u,
              studentIdVerification: 'verified',
              studentIdCardImage: 'https://images.unsplash.com/photo-1589330694653-dad6ef0190b8?auto=format&fit=crop&w=400&q=80',
            }
          : u
      )
    );
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Student ID Card Approved',
      message: `Your document (${fakeFilename || 'Campus_ID_Card.jpg'}) has been validated by academic moderation.`,
      type: 'reward',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const updateTutorSettings = (data: Partial<UserProfile>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...data } : u))
    );
  };

  const changePassword = (_newPass: string) => {
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Password Updated Successfully',
      message: 'Your security password has been updated from profile settings.',
      type: 'reward',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    return true;
  };

  const createHelpPost = (
    post: Omit<
      HelpPost,
      | 'id'
      | 'learnerId'
      | 'learnerName'
      | 'learnerAvatar'
      | 'learnerDepartment'
      | 'learnerBatch'
      | 'learnerBatchNumber'
      | 'createdAt'
      | 'status'
      | 'offersCount'
    >
  ) => {
    const newPost: HelpPost = {
      ...post,
      id: `post-${Date.now()}`,
      learnerId: currentUser.id,
      learnerName: currentUser.name,
      learnerAvatar: currentUser.avatar,
      learnerDepartment: currentUser.department,
      learnerBatch: currentUser.batch,
      learnerBatchNumber: currentUser.batchNumber,
      createdAt: new Date().toISOString(),
      status: 'open',
      offersCount: 0,
    };
    setHelpPosts((prev) => [newPost, ...prev]);
    setHelpPostModalOpen(false);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Help-Post Published! (#30)',
      message: `Your request for ${post.courseCode} (${post.topic}) with ${post.budgetType} arrangement is now public.`,
      type: 'chat',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const getBatchRelation = (tutor: UserProfile): BatchRelation => {
    const learnerBatchNum = currentUser.batchNumber || 21;
    const tutorBatchNum = tutor.batchNumber || 21;
    if (tutorBatchNum === learnerBatchNum) return 'batchmate';
    if (tutorBatchNum < learnerBatchNum) return 'senior';
    return 'junior';
  };

  const getScheduleOverlap = (tutor: UserProfile) => {
    const learnerSlots = currentUser.availability || [];
    const tutorSlots = tutor.availability || [];
    const overlaps: { day: string; overlappingSlots: string[] }[] = [];

    learnerSlots.forEach((ls) => {
      const match = tutorSlots.find((ts) => ts.day === ls.day);
      if (match) {
        overlaps.push({
          day: ls.day,
          overlappingSlots: ls.timeSlots,
        });
      }
    });

    if (overlaps.length === 0 && tutorSlots.length > 0) {
      return tutorSlots.map((ts) => ({
        day: ts.day,
        overlappingSlots: ts.timeSlots,
      }));
    }

    return overlaps;
  };

  const getRecommendedTutors = () => {
    const userPostCourses = helpPosts
      .filter((p) => p.learnerId === currentUser.id)
      .map((p) => p.courseCode.toLowerCase());

    return users.filter((u) => {
      if (u.id === currentUser.id || !u.isTutorActive) return false;
      const teachesRelevant = u.coursesTaught.some(
        (c) =>
          userPostCourses.some((pc) => c.toLowerCase().includes(pc)) ||
          c.toLowerCase().includes(currentUser.department.toLowerCase().slice(0, 3))
      );
      return teachesRelevant || u.rating >= 4.9;
    });
  };

  // Pricing helper (#31, #32)
  const calculatePrice = (params: {
    hourlyRate: number;
    duration: SessionDuration;
    rateType: RateType;
    isGroup: boolean;
    studentCount?: number;
    groupDiscountPercent?: number;
    packagePrice?: number;
  }): PriceCalculationResult => {
    const { hourlyRate, duration, rateType, isGroup, studentCount = 2, groupDiscountPercent = 25, packagePrice } = params;

    if (rateType === 'package' && packagePrice) {
      return {
        totalPrice: packagePrice,
        perStudentPrice: packagePrice,
        discountAppliedPercent: 20,
      };
    }

    const durationMultiplier = duration.includes('1.5')
      ? 1.5
      : duration.includes('30')
      ? 0.5
      : duration.includes('2')
      ? 2
      : 1;

    let basePrice = rateType === 'fixed' ? hourlyRate : Math.round(hourlyRate * durationMultiplier);

    if (isGroup && studentCount >= 2) {
      const discount = groupDiscountPercent / 100;
      const perStudent = Math.round(basePrice * (1 - discount));
      return {
        totalPrice: perStudent * studentCount,
        perStudentPrice: perStudent,
        discountAppliedPercent: groupDiscountPercent,
      };
    }

    return {
      totalPrice: basePrice,
      perStudentPrice: basePrice,
      discountAppliedPercent: 0,
    };
  };

  const startChatWithTutor = (tutorId: string, courseCode?: string, initialMessage?: string) => {
    const tutor = users.find((u) => u.id === tutorId);
    if (!tutor) return;

    const existing = chatThreads.find(
      (ct) =>
        (ct.learnerId === currentUser.id && ct.tutorId === tutorId) ||
        (ct.learnerId === tutorId && ct.tutorId === currentUser.id)
    );

    if (existing) {
      setActiveChatId(existing.id);
      setActiveTab('messages');
      if (initialMessage) {
        sendMessage(existing.id, initialMessage);
      }
      return;
    }

    const newThreadId = `chat-${Date.now()}`;
    const newThread: ChatThread = {
      id: newThreadId,
      learnerId: currentUser.id,
      learnerName: currentUser.name,
      learnerAvatar: currentUser.avatar,
      tutorId: tutor.id,
      tutorName: tutor.name,
      tutorAvatar: tutor.avatar,
      courseCode: courseCode || tutor.coursesTaught[0]?.split(':')[0] || 'Peer Tutoring',
      lastMessage: initialMessage || 'Conversation started. Discuss schedule and negotiate session details.',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          timestamp: 'Just now',
          text:
            initialMessage ||
            `Hello ${tutor.name}! I would like to book a peer tutoring session for ${
              courseCode || 'your course'
            }. Can we negotiate the schedule and format?`,
        },
      ],
    };

    setChatThreads((prev) => [newThread, ...prev]);
    setActiveChatId(newThreadId);
    setActiveTab('messages');
  };

  const sendMessage = (
    threadId: string,
    text: string,
    isProposal: boolean = false,
    proposalDetails?: any
  ) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      timestamp: 'Just now',
      text,
      isOfferProposal: isProposal,
      proposalDetails,
    };

    setChatThreads((prev) =>
      prev.map((ct) => {
        if (ct.id === threadId) {
          return {
            ...ct,
            lastMessage: isProposal ? `Pre-booking proposal: ${proposalDetails?.courseCode || 'Tutoring'}` : text,
            lastMessageTime: 'Just now',
            messages: [...ct.messages, newMsg],
          };
        }
        return ct;
      })
    );
  };

  // #30 negotiate function
  const negotiateOffer = (threadId: string, offer: Partial<PaymentOffer>) => {
    const thread = chatThreads.find((c) => c.id === threadId);
    if (!thread) return;

    sendMessage(
      threadId,
      `Counter negotiation proposed: Type=${offer.paymentType || 'paid'}, Rate=${offer.hourlyRate || 300} BDT, Group Discount=${offer.groupDiscount || 25}%.`,
      true,
      {
        courseCode: thread.courseCode,
        duration: '1 hr',
        mode: 'hybrid',
        rateType: 'hourly',
        price: offer.hourlyRate || 300,
        paymentType: offer.paymentType || 'negotiable',
        isGroup: (offer.groupDiscount || 0) > 0,
        groupPricePerStudent: Math.round((offer.hourlyRate || 300) * (1 - (offer.groupDiscount || 20) / 100)),
        scheduledTime: new Date(Date.now() + 86400000).toISOString(),
        meetingLocation: 'Campus Library 402 / Meet',
      }
    );
  };

  // #26 bookSession with conflict check
  const bookSession = (sessionData: Omit<TutoringSession, 'id' | 'status' | 'hasReview'>): BookingResult => {
    const targetTime = new Date(sessionData.scheduledTime).getTime();

    // Prevent conflicting bookings (within 45 minutes window for either participant)
    const conflict = sessions.find((s) => {
      if (s.status !== 'upcoming') return false;
      const sTime = new Date(s.scheduledTime).getTime();
      const diffMinutes = Math.abs(sTime - targetTime) / (1000 * 60);

      // Conflict if same tutor or same learner has an overlapping slot
      const sameTutor = s.tutorId === sessionData.tutorId;
      const sameLearner = s.learnerId === sessionData.learnerId;

      return (sameTutor || sameLearner) && diffMinutes < 45;
    });

    if (conflict) {
      return {
        success: false,
        error: `Booking conflict: An existing upcoming session for ${conflict.courseCode} is already scheduled at ${new Date(conflict.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Please choose an alternate slot.`,
      };
    }

    const sessionId = `sess-${Date.now()}`;
    const newSession: TutoringSession = {
      ...sessionData,
      id: sessionId,
      sessionId: sessionId,
      status: 'upcoming',
      noShowCount: 0,
      hasReview: false,
      reminderSent: false,
      dateAndTime: sessionData.scheduledTime,
      startTime: new Date(sessionData.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationPreset: sessionData.duration,
      reminderScheduledFor: new Date(targetTime - 15 * 60000).toISOString(),
    };

    setSessions((prev) => [newSession, ...prev]);
    setBookingModalOpen(false);
    setActiveTab('sessions');

    // Notify learner & tutor (#37, #38)
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Session Booked & Confirmed! (#26)',
      message: `Your ${newSession.duration} session for ${newSession.courseCode} with ${newSession.tutorName} is confirmed for ${new Date(newSession.scheduledTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}.`,
      type: 'booking',
      timestamp: 'Just now',
      read: false,
      sessionId: newSession.id,
    };
    setNotifications((prev) => [notif, ...prev]);

    return { success: true, session: newSession };
  };

  // Sequence Diagram Step 7 & 8: Request Session Booking & Forward Request to Tutor
  const requestBooking = (sessionData: Omit<TutoringSession, 'id' | 'status' | 'hasReview'>): BookingResult => {
    const targetTime = new Date(sessionData.scheduledTime).getTime();

    // Prevent conflicting bookings (within 45 minutes window for either participant)
    const conflict = sessions.find((s) => {
      if (s.status !== 'upcoming' && s.status !== 'pending_confirmation') return false;
      const sTime = new Date(s.scheduledTime).getTime();
      const diffMinutes = Math.abs(sTime - targetTime) / (1000 * 60);

      const sameTutor = s.tutorId === sessionData.tutorId;
      const sameLearner = s.learnerId === sessionData.learnerId;

      return (sameTutor || sameLearner) && diffMinutes < 45;
    });

    if (conflict) {
      return {
        success: false,
        error: `Booking conflict: A session for ${conflict.courseCode} is already scheduled around ${new Date(conflict.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Please choose an alternate slot.`,
      };
    }

    const sessionId = `sess-${Date.now()}`;
    const newSession: TutoringSession = {
      ...sessionData,
      id: sessionId,
      sessionId: sessionId,
      status: 'pending_confirmation',
      noShowCount: 0,
      hasReview: false,
      reminderSent: false,
      dateAndTime: sessionData.scheduledTime,
      startTime: new Date(sessionData.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationPreset: sessionData.duration,
      reminderScheduledFor: new Date(targetTime - 15 * 60000).toISOString(),
    };

    setSessions((prev) => [newSession, ...prev]);
    setBookingModalOpen(false);

    // Sequence Diagram Step 8: Forward Request to Tutor
    const tutorNotif: AppNotification = {
      id: `notif-${Date.now()}-tutor`,
      userId: newSession.tutorId,
      title: 'New Session Booking Request (Forwarded)',
      message: `${newSession.learnerName} has requested a ${newSession.duration} session for ${newSession.courseCode} on ${new Date(newSession.scheduledTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}. Please confirm session.`,
      type: 'booking',
      timestamp: 'Just now',
      read: false,
      sessionId: newSession.id,
    };

    const studentNotif: AppNotification = {
      id: `notif-${Date.now()}-student`,
      userId: newSession.learnerId,
      title: 'Booking Request Forwarded to Tutor',
      message: `Your booking request for ${newSession.courseCode} has been forwarded to ${newSession.tutorName} for confirmation.`,
      type: 'booking',
      timestamp: 'Just now',
      read: false,
      sessionId: newSession.id,
    };

    setNotifications((prev) => [tutorNotif, studentNotif, ...prev]);

    return { success: true, session: newSession };
  };

  // Sequence Diagram Step 9 & 10: Tutor Confirms Session -> Confirmed + Reminder Sent
  const confirmBooking = (sessionId: string) => {
    const targetSession = sessions.find((s) => s.id === sessionId);
    if (!targetSession) return;

    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: 'upcoming', reminderSent: true } : s))
    );

    // Step 10: Confirmed + Reminder Sent
    const confirmedNotif: AppNotification = {
      id: `notif-${Date.now()}-confirmed`,
      userId: targetSession.learnerId,
      title: 'Confirmed + Reminder Sent (#Sequence Diagram)',
      message: `Session for ${targetSession.courseCode} with ${targetSession.tutorName} is officially CONFIRMED! Automated calendar & 15-minute alert reminder has been scheduled.`,
      type: 'reminder',
      timestamp: 'Just now',
      read: false,
      sessionId: targetSession.id,
    };

    const tutorConfirmedNotif: AppNotification = {
      id: `notif-${Date.now()}-tutor-conf`,
      userId: targetSession.tutorId,
      title: 'Session Confirmed in Calendar',
      message: `You confirmed the booking with ${targetSession.learnerName} for ${targetSession.courseCode}.`,
      type: 'booking',
      timestamp: 'Just now',
      read: false,
      sessionId: targetSession.id,
    };

    setNotifications((prev) => [confirmedNotif, tutorConfirmedNotif, ...prev]);

    // Update any linked chat message proposal cards to confirmed status
    setChatThreads((prev) =>
      prev.map((ct) => {
        if (
          (ct.learnerId === targetSession.learnerId && ct.tutorId === targetSession.tutorId) ||
          (ct.learnerId === targetSession.tutorId && ct.tutorId === targetSession.learnerId)
        ) {
          const sysMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: targetSession.tutorId,
            senderName: targetSession.tutorName,
            senderAvatar: targetSession.tutorAvatar,
            timestamp: 'Just now',
            text: `Confirmed + Reminder Sent: Session for ${targetSession.courseCode} on ${new Date(targetSession.scheduledTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })} has been confirmed by tutor. Automated reminder active.`,
          };

          return {
            ...ct,
            lastMessage: `Confirmed + Reminder Sent: ${targetSession.courseCode}`,
            lastMessageTime: 'Just now',
            messages: [
              ...ct.messages.map((m) =>
                m.proposalDetails && (m.proposalDetails.sessionId === sessionId || m.proposalDetails.courseCode === targetSession.courseCode)
                  ? {
                      ...m,
                      proposalDetails: {
                        ...m.proposalDetails,
                        status: 'confirmed' as const,
                        sessionId: targetSession.id,
                      },
                    }
                  : m
              ),
              sysMsg,
            ],
          };
        }
        return ct;
      })
    );
  };

  const declineBooking = (sessionId: string, reason?: string) => {
    const targetSession = sessions.find((s) => s.id === sessionId);
    if (!targetSession) return;

    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: 'cancelled' } : s))
    );

    const declineNotif: AppNotification = {
      id: `notif-${Date.now()}-declined`,
      userId: targetSession.learnerId,
      title: 'Booking Request Declined',
      message: `${targetSession.tutorName} was unable to accept the requested time for ${targetSession.courseCode}: ${reason || 'Schedule unavailable'}. Please negotiate an alternative slot in chat.`,
      type: 'cancellation',
      timestamp: 'Just now',
      read: false,
      sessionId: targetSession.id,
    };

    setNotifications((prev) => [declineNotif, ...prev]);

    // Update chat threads
    setChatThreads((prev) =>
      prev.map((ct) => {
        if (
          (ct.learnerId === targetSession.learnerId && ct.tutorId === targetSession.tutorId) ||
          (ct.learnerId === targetSession.tutorId && ct.tutorId === targetSession.learnerId)
        ) {
          return {
            ...ct,
            messages: ct.messages.map((m) =>
              m.proposalDetails && m.proposalDetails.sessionId === sessionId
                ? {
                    ...m,
                    proposalDetails: {
                      ...m.proposalDetails,
                      status: 'declined' as const,
                    },
                  }
                : m
            ),
          };
        }
        return ct;
      })
    );
  };

  // Sequence Diagram Step 6: Tutor Confirms Availability & Price
  const confirmAvailabilityAndPrice = (threadId: string, messageId: string) => {
    setChatThreads((prev) =>
      prev.map((ct) => {
        if (ct.id !== threadId) return ct;
        return {
          ...ct,
          messages: ct.messages.map((m) => {
            if (m.id !== messageId || !m.proposalDetails) return m;
            return {
              ...m,
              proposalDetails: {
                ...m.proposalDetails,
                status: 'availability_confirmed' as const,
                confirmedByTutor: true,
              },
            };
          }),
        };
      })
    );

    const thread = chatThreads.find((c) => c.id === threadId);
    if (thread) {
      const studentId = thread.learnerId;
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        userId: studentId,
        title: 'Availability & Price Confirmed (#Sequence Diagram Step 6)',
        message: `${thread.tutorName} confirmed availability and price for ${thread.courseCode}. You can now submit your session booking request!`,
        type: 'booking',
        timestamp: 'Just now',
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  // Sequence Diagram Step 7: Student Requests Booking from Chat
  const requestBookingFromChat = (threadId: string, messageId: string, details: any): BookingResult => {
    const thread = chatThreads.find((c) => c.id === threadId);
    if (!thread) return { success: false, error: 'Chat thread not found' };

    const isLearner = currentUser.id === thread.learnerId;
    const tutorId = isLearner ? thread.tutorId : currentUser.id;
    const tutorName = isLearner ? thread.tutorName : currentUser.name;
    const tutorAvatar = isLearner ? thread.tutorAvatar : currentUser.avatar;

    const learnerId = isLearner ? currentUser.id : thread.learnerId;
    const learnerName = isLearner ? currentUser.name : thread.learnerName;
    const learnerAvatar = isLearner ? currentUser.avatar : thread.learnerAvatar;

    const result = requestBooking({
      learnerId,
      learnerName,
      learnerAvatar,
      tutorId,
      tutorName,
      tutorAvatar,
      courseCode: details.courseCode,
      courseTitle: `${details.courseCode} Peer Mentorship`,
      topic: 'Pre-negotiated peer study session',
      mode: details.mode,
      meetingDetails: details.meetingLocation,
      duration: details.duration,
      scheduledTime: details.scheduledTime,
      rateType: details.rateType,
      price: details.price,
      paymentType: details.paymentType,
      isGroup: details.isGroup,
      groupPricePerStudent: details.groupPricePerStudent,
    });

    if (result.success && result.session) {
      const newSessionId = result.session.id;

      // Update message proposal details state to 'booking_requested'
      setChatThreads((prev) =>
        prev.map((ct) => {
          if (ct.id !== threadId) return ct;
          return {
            ...ct,
            lastMessage: `Booking requested for ${details.courseCode} (Forwarded to Tutor)`,
            lastMessageTime: 'Just now',
            messages: ct.messages.map((m) => {
              if (m.id !== messageId || !m.proposalDetails) return m;
              return {
                ...m,
                proposalDetails: {
                  ...m.proposalDetails,
                  status: 'booking_requested' as const,
                  sessionId: newSessionId,
                },
              };
            }),
          };
        })
      );
    }

    return result;
  };

  // #38 Cancel session & update reminders
  const cancelSession = (sessionId: string, reason?: string) => {
    const sess = sessions.find((s) => s.id === sessionId);
    if (!sess) return;

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, status: 'cancelled', reminderSent: false } : s
      )
    );

    // Update notifications and remove active reminders (#38)
    setNotifications((prev) =>
      prev.map((n) =>
        n.sessionId === sessionId && n.type === 'reminder'
          ? { ...n, message: `[Cancelled] Session for ${sess.courseCode} was cancelled: ${reason || 'Schedule changed'}.`, read: true }
          : n
      )
    );

    const cancelNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: `Session Cancelled (#38)`,
      message: `The session for ${sess.courseCode} has been cancelled. Automated reminders have been disarmed.`,
      type: 'cancellation',
      timestamp: 'Just now',
      read: false,
      sessionId,
    };
    setNotifications((prev) => [cancelNotif, ...prev]);
  };

  // #38 Reschedule session & update reminders
  const rescheduleSession = (sessionId: string, newScheduledTime: string): BookingResult => {
    const sess = sessions.find((s) => s.id === sessionId);
    if (!sess) return { success: false, error: 'Session not found' };

    const newTargetTime = new Date(newScheduledTime).getTime();

    // Check conflict
    const conflict = sessions.find((s) => {
      if (s.id === sessionId || s.status !== 'upcoming') return false;
      const sTime = new Date(s.scheduledTime).getTime();
      const diffMinutes = Math.abs(sTime - newTargetTime) / (1000 * 60);
      return (s.tutorId === sess.tutorId || s.learnerId === sess.learnerId) && diffMinutes < 45;
    });

    if (conflict) {
      return {
        success: false,
        error: `Reschedule conflict: An existing upcoming session for ${conflict.courseCode} is already scheduled around that time.`,
      };
    }

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              scheduledTime: newScheduledTime,
              dateAndTime: newScheduledTime,
              startTime: new Date(newScheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              reminderSent: false, // reset reminder for new time (#38)
              reminderScheduledFor: new Date(newTargetTime - 15 * 60000).toISOString(),
            }
          : s
      )
    );

    const rescheduleNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Session Rescheduled (#38)',
      message: `Your session for ${sess.courseCode} has been moved to ${new Date(newScheduledTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}. Reminders updated.`,
      type: 'reminder',
      timestamp: 'Just now',
      read: false,
      sessionId,
    };
    setNotifications((prev) => [rescheduleNotif, ...prev]);

    return { success: true };
  };

  // #33 Mark Session Completed without duplicate point awards
  const markSessionCompleted = (sessionId: string) => {
    const targetSession = sessions.find((s) => s.id === sessionId);
    if (!targetSession || targetSession.status === 'completed') return;

    // Check if points already awarded for this session (Duplicate Prevention #33)
    const existingTx = pointTransactions.find((tx) => tx.sessionId === sessionId);

    const pts = targetSession.paymentType === 'free' ? 50 : 25;

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, status: 'completed', pointsAwarded: pts }
          : s
      )
    );

    const durHours = targetSession.duration.includes('1.5')
      ? 1.5
      : targetSession.duration.includes('30')
      ? 0.5
      : targetSession.duration.includes('2')
      ? 2
      : 1;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === targetSession.tutorId) {
          const newSessions = u.completedSessionsCount + 1;
          const newHours = u.teachingHours + durHours;
          const newPoints = existingTx ? u.points : u.points + pts;
          return {
            ...u,
            completedSessionsCount: newSessions,
            successfulSessions: newSessions,
            teachingHours: newHours,
            totalHoursTaught: newHours,
            points: newPoints,
          };
        }
        return u;
      })
    );

    // Record point transaction if not already recorded (#33)
    if (!existingTx) {
      const newTx: PointTransaction = {
        id: `pt-${Date.now()}`,
        userId: targetSession.tutorId,
        amount: pts,
        type: targetSession.paymentType === 'free' ? 'free_session_reward' : 'welcome_bonus',
        description: `Awarded for completing session in ${targetSession.courseCode} (${targetSession.paymentType}) (#33)`,
        timestamp: new Date().toISOString(),
        sessionId,
      };
      setPointTransactions((prev) => [newTx, ...prev]);
    }

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Session Completed! (#33)',
      message: `Session for ${targetSession.courseCode} has ended. ${existingTx ? 'Points already awarded.' : `+${pts} points recorded to history.`}`,
      type: 'reward',
      timestamp: 'Just now',
      read: false,
      sessionId: targetSession.id,
    };
    setNotifications((prev) => [notif, ...prev]);

    setReviewSession(targetSession);
    setReviewModalOpen(true);
  };

  // #27 No-Show Strike System (exclude cancelled sessions, prevent duplicate strikes)
  const markSessionNoShow = (sessionId: string, markedBy: 'learner' | 'tutor'): boolean => {
    const targetSession = sessions.find((s) => s.id === sessionId);
    if (!targetSession) return false;

    // Rule: Exclude cancelled sessions
    if (targetSession.status === 'cancelled') {
      return false;
    }

    // Rule: Prevent duplicate strike records on already striked session
    if (targetSession.status === 'no_show') {
      return false;
    }

    const noShowUserId = markedBy === 'learner' ? targetSession.tutorId : targetSession.learnerId;
    const noShowUserName = markedBy === 'learner' ? targetSession.tutorName : targetSession.learnerName;

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              status: 'no_show',
              noShowMarkedBy: markedBy,
              noShowCount: (s.noShowCount || 0) + 1,
            }
          : s
      )
    );

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === noShowUserId) {
          const newStrikes = u.strikes + 1;
          const newStatus = newStrikes >= 3 ? 'flagged' : u.accountStatus;
          return { ...u, strikes: newStrikes, accountStatus: newStatus };
        }
        return u;
      })
    );

    // Auto-create report in dispute queue (#35)
    const newReport: DisputeReport = {
      id: `rep-${Date.now()}`,
      reportedUserId: noShowUserId,
      reportedUserName: noShowUserName,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      sessionId,
      reason: 'no_show',
      details: `${currentUser.name} logged an unannounced no-show for ${targetSession.courseCode} scheduled on ${new Date(targetSession.scheduledTime).toLocaleString()}. No-show strike recorded. (#27)`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setDisputeReports((prev) => [newReport, ...prev]);

    const strikeNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: `No-Show Strike Recorded (#27)`,
      message: `Strike logged for ${noShowUserName}. Accounts reaching 3 strikes are automatically flagged for suspension.`,
      type: 'strike',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [strikeNotif, ...prev]);

    return true;
  };

  // #34 Submit Review & recalculate rating
  const submitReview = (sessionId: string, rating: number, comment: string) => {
    const sess = sessions.find((s) => s.id === sessionId);
    if (!sess) return;

    const newReview: UserReview = {
      id: `rev-${Date.now()}`,
      reviewId: `rev-${Date.now()}`,
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      reviewerAvatar: currentUser.avatar,
      reviewerRole: currentUser.activeRole,
      rating,
      stars: rating,
      comment,
      writtenText: comment,
      courseCode: sess.courseCode,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      sessionId,
    };

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === sess.tutorId) {
          const allReviews = [...u.reviews, newReview];
          const avg =
            allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
          return {
            ...u,
            reviews: allReviews,
            rating: parseFloat(avg.toFixed(2)),
            ratingCount: allReviews.length,
            points: u.points + 25,
          };
        }
        return u;
      })
    );

    // Record point reward for review (#33)
    const reviewTx: PointTransaction = {
      id: `pt-${Date.now()}`,
      userId: sess.tutorId,
      amount: 25,
      type: 'review_reward',
      description: `Evaluation reward for ${rating}-star feedback in ${sess.courseCode} (#33)`,
      timestamp: new Date().toISOString(),
      sessionId: `${sessionId}-review`,
    };
    setPointTransactions((prev) => [reviewTx, ...prev]);

    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, hasReview: true } : s))
    );

    setReviewModalOpen(false);
    setReviewSession(null);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Review Published! (#34)',
      message: `Review submitted for ${sess.tutorName}. Ratings updated on Top-Tutor Leaderboard.`,
      type: 'review',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // #35 Report System
  const submitDisputeReport = (data: {
    reportedUserId: string;
    reportedUserName: string;
    reason: DisputeReport['reason'];
    details: string;
    sessionId?: string;
  }) => {
    const newReport: DisputeReport = {
      id: `rep-${Date.now()}`,
      reportedUserId: data.reportedUserId,
      reportedUserName: data.reportedUserName,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      sessionId: data.sessionId,
      reason: data.reason,
      details: data.details,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    setDisputeReports((prev) => [newReport, ...prev]);
    setReportModalOpen(false);
    setReportTarget(null);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Report Submitted (#35)',
      message: `Your report concerning ${data.reportedUserName} has been submitted to the admin moderation queue.`,
      type: 'strike',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // #35 Update Report Status
  const updateReportStatus = (reportId: string, status: DisputeReport['status'], actionTaken?: string) => {
    setDisputeReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status, actionTaken: actionTaken || r.actionTaken } : r
      )
    );
  };

  // #36 Admin Moderation & Suspension
  const suspendUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, accountStatus: 'suspended' } : u))
    );
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId,
      title: 'Account Suspended (#36)',
      message: 'Your account access has been restricted by platform administration due to policy infractions.',
      type: 'strike',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const reactivateUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, accountStatus: 'active', strikes: 0 } : u))
    );
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId,
      title: 'Account Reactivated (#36)',
      message: 'Your account has been reinstated in good standing by the administrator.',
      type: 'reward',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const toggleUserSuspension = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    if (user.accountStatus === 'suspended') {
      reactivateUser(userId);
    } else {
      suspendUser(userId);
    }
  };

  const resolveReport = (reportId: string, action: 'suspend' | 'warn' | 'dismiss') => {
    const rep = disputeReports.find((r) => r.id === reportId);
    if (!rep) return;

    if (action === 'suspend') {
      suspendUser(rep.reportedUserId);
      updateReportStatus(reportId, 'resolved', 'Account Suspended by Admin (#36)');
    } else if (action === 'warn') {
      setUsers((prev) =>
        prev.map((u) => (u.id === rep.reportedUserId ? { ...u, strikes: u.strikes + 1 } : u))
      );
      updateReportStatus(reportId, 'resolved', 'Official Warning & Strike Issued (#36)');
    } else {
      updateReportStatus(reportId, 'dismissed', 'Dismissed upon administrative review (#35)');
    }
  };

  // #38 Session Reminder Notification
  const simulateReminderNotification = (sessionId?: string) => {
    const sess = sessionId
      ? sessions.find((s) => s.id === sessionId)
      : sessions.find((s) => s.status === 'upcoming') || sessions[0];

    if (sess) {
      setSessions((prev) =>
        prev.map((s) => (s.id === sess.id ? { ...s, reminderSent: true } : s))
      );
    }

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: '🚨 Session Reminder (#38)',
      message: sess
        ? `Upcoming session for ${sess.courseCode} with ${
            currentUser.id === sess.learnerId ? sess.tutorName : sess.learnerName
          } starts soon! Location: ${sess.meetingDetails}`
        : 'Session reminder: Check your upcoming tutoring schedule in My Sessions.',
      type: 'reminder',
      timestamp: 'Just now',
      read: false,
      sessionId: sess?.id,
    };

    setNotifications((prev) => [newNotif, ...prev]);
  };

  // #37 In-app notification methods
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        helpPosts,
        sessions,
        chatThreads,
        notifications,
        disputeReports,
        pointTransactions,
        activeTab,
        setActiveTab,
        selectedTutor,
        setSelectedTutor,
        activeChatId,
        setActiveChatId,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        helpPostModalOpen,
        setHelpPostModalOpen,
        bookingModalOpen,
        setBookingModalOpen,
        bookingPreset,
        setBookingPreset,
        reviewModalOpen,
        setReviewModalOpen,
        reviewSession,
        setReviewSession,
        reportModalOpen,
        setReportModalOpen,
        reportTarget,
        setReportTarget,
        scheduleMatchModalOpen,
        setScheduleMatchModalOpen,
        scheduleMatchTutor,
        setScheduleMatchTutor,
        videoPlayerModalOpen,
        setVideoPlayerModalOpen,
        videoToPlay,
        setVideoToPlay,
        pointHistoryModalOpen,
        setPointHistoryModalOpen,
        toggleActiveRole,
        switchUser,
        tryDemo,
        loginUser,
        registerUser,
        logoutUser,
        updateProfile,
        verifyInstitutionalEmail,
        submitStudentIdCard,
        updateTutorSettings,
        changePassword,
        createHelpPost,
        getBatchRelation,
        getScheduleOverlap,
        getRecommendedTutors,
        calculatePrice,
        startChatWithTutor,
        sendMessage,
        negotiateOffer,
        bookSession,
        requestBooking,
        confirmBooking,
        declineBooking,
        confirmAvailabilityAndPrice,
        requestBookingFromChat,
        cancelSession,
        rescheduleSession,
        markSessionCompleted,
        markSessionNoShow,
        submitReview,
        submitDisputeReport,
        updateReportStatus,
        resolveReport,
        suspendUser,
        reactivateUser,
        toggleUserSuspension,
        simulateReminderNotification,
        markNotificationRead,
        markAllNotificationsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
