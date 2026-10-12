export type UserRole = "STUDENT" | "RESPONDER" | "SUPERADMIN";

export type ConversationCategory = "COUPLE" | "FRIENDSHIP" | "FAMILY" | "SELF_ESTEEM" | "OTHER";

export type ConversationStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "UNDER_REVIEW"
  | "ANSWERED"
  | "WAITING_STUDENT"
  | "CLOSED"
  | "REJECTED";

export type PriorityLevel = "NORMAL" | "HIGH" | "CRITICAL";

export interface ClubPass {
  id: string;
  codeHash: string;
  seasonLabel: string;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface User {
  id: string;
  pseudonym: string;
  passwordHash: string;
  recoveryEmailEncrypted?: string;
  recoveryEmailIv?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfile {
  id: string;
  userId: string;
  displayName: string;
  internalEmail: string;
  totpSecretBase32?: string;
  backupCodesHashed?: string[];
  charterAcceptedAt?: string;
  isOnDuty: boolean;
}

export interface Conversation {
  id: string;
  studentId: string;
  category: ConversationCategory;
  status: ConversationStatus;
  priority: PriorityLevel;
  isSensitive: boolean;
  sensitivityTrigger?: string;
  titleEncrypted?: string;
  titleIv?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  autoPurgeAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderType: "STUDENT" | "DR_IPLOVE";
  senderAdminIdInternal?: string; // Jamais exposé à l'étudiant
  contentEncrypted: string;
  iv: string;
  authTag: string;
  createdAt: string;
  readAt?: string;
}

export interface InternalNote {
  id: string;
  conversationId: string;
  authorAdminId: string;
  authorName: string;
  noteEncrypted: string;
  iv: string;
  authTag: string;
  createdAt: string;
}

export interface MessageLock {
  conversationId: string;
  lockedByAdminId: string;
  lockedByName: string;
  lockedAt: string;
  expiresAt: string;
}

export interface ReviewRequest {
  id: string;
  conversationId: string;
  requestedByAdminId: string;
  requestedByName: string;
  reviewerAdminId?: string;
  reviewerName?: string;
  draftContentEncrypted: string;
  iv: string;
  authTag: string;
  reviewStatus: "PENDING" | "APPROVED" | "CHANGES_REQUESTED";
  feedbackNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface Chronicle {
  id: string;
  originalConversationId?: string;
  title: string;
  category: ConversationCategory;
  anonymizedQuestion: string;
  anonymizedResponse: string;
  studentConsentGranted: boolean;
  approvedBySuperadminId?: string;
  publishedAt: string;
}

export interface ResponseTemplate {
  id: string;
  title: string;
  category: ConversationCategory | "GENERAL";
  content: string;
  isActive: boolean;
  updatedAt: string;
}

export interface AdminInvitation {
  id: string;
  token: string;
  role: "RESPONDER" | "SUPERADMIN";
  createdByAdminId: string;
  createdAt: string;
  expiresAt: string;
  isUsed: boolean;
  usedAt?: string;
  usedByUserId?: string;
}

export interface SetupState {
  completed: boolean;
  completedAt?: string;
  token?: string;
  tokenExpiresAt?: string;
}

export interface LoginAttempt {
  id: string;
  pseudonym: string;
  ipSubnet: string;
  timestamp: number;
}

export interface AuditLog {
  id: string;
  createdAt: string;
  adminId: string;
  adminName: string;
  actionType:
    | "VIEW_CONVERSATION"
    | "ACQUIRE_LOCK"
    | "RELEASE_LOCK"
    | "SEND_RESPONSE"
    | "SUBMIT_REVIEW"
    | "APPROVE_REVIEW"
    | "TRANSFER_CONVERSATION"
    | "CLOSE_CONVERSATION"
    | "EXPORT_DATA"
    | "INITIAL_SETUP"
    | "INVITE_ADMIN"
    | "REVOKE_INVITATION"
    | "ACCEPT_INVITATION"
    | "DEACTIVATE_ADMIN"
    | "REACTIVATE_ADMIN"
    | "DELETE_ADMIN";
  targetResourceType: "CONVERSATION" | "TEMPLATE" | "USER" | "CHRONICLE" | "INVITATION" | "SYSTEM";
  targetResourceId: string;
  metadataSanitized?: Record<string, unknown>;
  ipSubnetHash: string;
}

// Client View Types (Decrypted and sanitized for UI)
export interface DecryptedMessage {
  id: string;
  conversationId: string;
  senderType: "STUDENT" | "DR_IPLOVE";
  content: string;
  createdAt: string;
  readAt?: string;
}

export interface DecryptedConversation {
  id: string;
  studentPseudonym?: string; // Visuel
  category: ConversationCategory;
  status: ConversationStatus;
  priority: PriorityLevel;
  isSensitive: boolean;
  title?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  autoPurgeAt?: string;
  lock?: {
    lockedByAdminId: string;
    lockedByName: string;
    expiresAt: string;
    isLockedByMe: boolean;
  };
  messages: DecryptedMessage[];
}
