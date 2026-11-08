export type UserRole = 'learner' | 'tutor' | 'both' | 'admin';
export type ActiveRole = 'learner' | 'tutor';

export type DeliveryMode = 'online' | 'offline' | 'hybrid';
export type RateType = 'hourly' | 'fixed' | 'package';
export type PaymentPreference = 'paid' | 'free' | 'negotiable';
export type SessionDuration = '30 min' | '1 hr' | '1.5 hr' | '2+ hr' | 'flexible';
export type BatchRelation = 'batchmate' | 'senior' | 'junior';

export interface UserReview {
  id: string;
  reviewId?: string; // Class diagram alias
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  reviewerRole: 'learner' | 'tutor';
  rating: number; // 1 to 5
  stars?: number; // Class diagram alias for star rating (#18, #34)
  comment: string;
  writtenText?: string; // Class diagram alias (#18)
  courseCode: string;
  date: string;
  createdAt?: string; // Class diagram alias
  sessionId: string;
}

export interface DemoVideo {
  title: string;
  url: string;
  duration: string;
  topic: string;
  thumbnail?: string;
}

export interface AvailabilitySlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  timeSlots: string[]; // e.g. ["10:00 AM - 12:00 PM", "02:00 PM - 04:00 PM"]
}

// Feature #31: Package Rate Options model from Class Diagram
export interface PackageRateOption {
  packageId?: string;
  title?: string;
  packageTitle?: string; // Class diagram & UI alias
  sessionCount: number; // e.g. 3, 5, 8
  discountPercent?: number;
  savingsPercent?: number; // Class diagram & UI alias
  totalPrice: number; // e.g. 900 BDT
  description: string;
}

// Feature #30, #31, #32: PaymentOffer model from Class Diagram
export interface PaymentOffer {
  id: string;
  tutorId: string;
  hourlyRate: number;
  rateType: RateType;
  paymentType: PaymentPreference;
  groupDiscount: number; // e.g. 20%
  packageRate?: PackageRateOption[];
  calculatePrice?: (baseRate: number, sessionCount: number, studentCount: number, groupDiscount: number) => number;
}

// Feature #33: Point Transaction model from Class Diagram
export interface PointTransaction {
  id: string;
  userId: string;
  points?: number; // Class diagram attribute
  amount?: number; // UI ledger alias
  type:
    | 'session_completed'
    | 'rating_received'
    | 'first_session_bonus'
    | 'badge_earned'
    | 'penalty'
    | 'welcome_bonus'
    | 'free_session_reward'
    | 'review_reward'
    | 'leaderboard_bonus'
    | string;
  description: string;
  sessionId?: string; // For idempotency and duplicate point prevention (#33)
  createdAt?: string; // Class diagram attribute
  timestamp?: string; // UI alias
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  activeRole: ActiveRole;
  department: string;
  batch: string; // e.g. "Batch 20", "Batch 21"
  batchNumber: number; // e.g. 21 (lower number = senior, higher = junior)
  levelTerm: string; // e.g. "Level 3 / Term I", "Level 2 / Term II", "Level 2 / Term I", "Level 1 / Term II"
  studentId: string; // e.g. BAUST 16-digit ID: "0802620105101089" (22 Batch prefix: 080262010.......)
  bio: string;
  isAdmin?: boolean;
  isDemo?: boolean; // True only for preset evaluation demo personas, false for user-registered accounts

  // Verification & Trust (#19, #20, #27, #36)
  institutionalEmailVerified: boolean;
  studentIdVerification: 'verified' | 'pending' | 'unverified';
  studentIdCardImage?: string;
  strikes: number; // 3 strikes triggers flag/suspension (#27)
  accountStatus: 'active' | 'flagged' | 'suspended'; // (#36)

  // Tutor Specific attributes (#21, #22, #34)
  isTutorActive: boolean;
  coursesTaught: string[];
  hourlyRate: number; // e.g. 350
  rateType: RateType;
  paymentPreference: PaymentPreference;
  deliveryMode: DeliveryMode;
  groupDiscountPercent: number; // e.g. 25% discount per student (#32)
  availability: AvailabilitySlot[];
  demoVideo?: DemoVideo; // #17
  rating: number; // e.g. 4.9 (#18, #34)
  ratingCount: number;
  teachingHours: number; // #21, #34
  totalHoursTaught?: number; // Class diagram alias (#21, #34)
  completedSessionsCount: number; // #21, #34
  successfulSessions?: number; // Class diagram alias (#21, #34)
  points: number; // reward points, e.g. 1450 (#33)
  packageOffers?: PackageRateOption[]; // (#31)
  reviews: UserReview[];
}

export interface HelpPost {
  id: string;
  learnerId: string;
  learnerName: string;
  learnerAvatar: string;
  learnerDepartment: string;
  learnerBatch: string;
  learnerBatchNumber: number;
  courseCode: string;
  courseTitle: string;
  topic: string;
  description: string;
  preferredMode: DeliveryMode;
  preferredDuration: SessionDuration;
  budgetType: PaymentPreference;
  budgetAmount?: number;
  preferredSchedule: string;
  createdAt: string;
  status: 'open' | 'negotiating' | 'resolved' | 'closed';
  offersCount: number;
}

export type SessionStatus = 'pending_confirmation' | 'upcoming' | 'completed' | 'cancelled' | 'no_show';

// Feature #26, #27, #38: TutoringSession model from Class Diagram
export interface TutoringSession {
  id: string;
  sessionId?: string; // Class diagram alias
  learnerId: string;
  learnerName: string;
  learnerAvatar: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  courseCode: string;
  courseTitle: string;
  topic: string;
  mode: DeliveryMode;
  meetingDetails: string; // e.g. "Google Meet: meet.google.com/xyz-abc" or "Campus Library Room 402"
  duration: SessionDuration;
  durationPreset?: SessionDuration; // Class diagram & preset alias (#9, #26)
  scheduledTime: string; // ISO date-time string
  dateAndTime?: string; // Class diagram alias (#38)
  startTime?: string;
  rateType: RateType;
  price: number;
  paymentType: PaymentPreference; // #30
  isGroup: boolean; // #32
  groupStudentCount?: number; // #32
  groupPricePerStudent?: number; // #32
  status: SessionStatus;
  noShowCount?: number; // Class diagram attribute (#27)
  noShowMarkedBy?: 'learner' | 'tutor';
  hasReview: boolean;
  pointsAwarded?: number; // #33
  reminderSent?: boolean; // #38
  reminderScheduledFor?: string; // ISO string (#38)
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  text: string;
  isOfferProposal?: boolean;
  proposalDetails?: {
    proposalId?: string;
    courseCode: string;
    duration: SessionDuration;
    mode: DeliveryMode;
    rateType: RateType;
    price: number;
    paymentType: PaymentPreference;
    isGroup: boolean;
    groupPricePerStudent?: number;
    scheduledTime: string;
    meetingLocation: string;
    status?: 'negotiating' | 'availability_confirmed' | 'booking_requested' | 'confirmed' | 'declined';
    confirmedByTutor?: boolean;
    sessionId?: string;
  };
}

export interface ChatThread {
  id: string;
  learnerId: string;
  learnerName: string;
  learnerAvatar: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  courseCode: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
  linkedHelpPostId?: string;
}

// Feature #37: In-app Notification System & #38 Session Reminders
export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'reminder' | 'chat' | 'review' | 'strike' | 'reward' | 'cancellation';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  sessionId?: string;
}

// Feature #35 & #36: Report System & Admin Moderation
export interface DisputeReport {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reporterId: string;
  reporterName: string;
  sessionId?: string;
  reason: 'no_show' | 'unprepared' | 'unprofessional' | 'payment_dispute' | 'academic_misconduct' | 'other';
  details: string;
  evidenceNotes?: string;
  createdAt: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  actionTaken?: string;
}
