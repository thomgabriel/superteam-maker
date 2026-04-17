export type MacroRole = 'engineering' | 'design' | 'business_gtm';
export type Seniority = 'beginner' | 'junior' | 'mid' | 'senior';
export type PoolStatus = 'waiting' | 'assigned';
export type TeamStatus =
  | 'forming'
  | 'pending_confirmation'
  | 'pending_activation'
  | 'active'
  | 'inactive';
export type MemberStatus = 'active' | 'inactive' | 'replaced';
export type MatchmakingRunStatus = 'running' | 'completed' | 'failed';

export type AnalyticsEvent =
  | 'landing_view'
  | 'signup_started'
  | 'signup_completed'
  | 'profile_completed'
  | 'entered_pool'
  | 'matched_to_team'
  | 'team_reveal_viewed'
  | 'leader_claimed'
  | 'team_activated'
  | 'whatsapp_clicked'
  | 'user_replaced';

export interface Campaign {
  id: string;
  creator_name: string;
  slug: string | null;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  phone: string | null;
  campaign_id: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  phone_number: string;
  linkedin_url: string | null;
  github_url: string | null;
  x_url: string | null;
  primary_role: string;
  macro_role: MacroRole;
  years_experience: number;
  seniority: Seniority;
  bio: string | null;
  language: string;
  created_at: string;
}

export interface ProfileRole {
  id: string;
  profile_id: string;
  role: string;
}

export interface ProfileInterest {
  id: string;
  profile_id: string;
  interest: string;
}

export interface MatchmakingPoolEntry {
  id: string;
  user_id: string;
  profile_id: string;
  status: PoolStatus;
  round_number: number | null;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  leader_id: string | null;
  status: TeamStatus;
  round_number: number | null;
  leader_claimed_at: string | null;
  activation_deadline_at: string | null;
  confirmation_deadline_at: string | null;
  dissolution_reason: string | null;
  idea_title: string | null;
  idea_description: string | null;
  project_category: string | null;
  whatsapp_group_url: string | null;
  understaffed_at: string | null;
  leader_dormant_at: string | null;
  hackathon_id: string | null;
  submission_url: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  specific_role: string;
  macro_role: MacroRole;
  is_leader: boolean;
  joined_at: string;
  last_active_at: string;
  status: MemberStatus;
  is_ready: boolean;
  replaced_at: string | null;
}

export interface AnalyticsEventRecord {
  id: string;
  event_name: AnalyticsEvent;
  user_id: string | null;
  anonymous_id: string | null;
  route: string | null;
  metadata: Record<string, string | number | boolean | null> | null;
  created_at: string;
}

export interface MatchmakingRun {
  id: string;
  trigger_source: string;
  status: MatchmakingRunStatus;
  pool_size: number;
  teams_formed: number;
  users_matched: number;
  replacements_performed: number;
  notes: string | null;
  error_message: string | null;
  started_at: string;
  finished_at: string | null;
}

export interface EnrichedPoolUser {
  user_id: string;
  profile_id: string;
  name: string;
  primary_role: string;
  macro_role: MacroRole;
  seniority: Seniority;
  interests: string[];
  waiting_since: string;
  flex_macro_roles: MacroRole[];
}
