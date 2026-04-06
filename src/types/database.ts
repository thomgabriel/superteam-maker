export type MacroRole = 'engineering' | 'design' | 'business_gtm';
export type Seniority = 'beginner' | 'junior' | 'mid' | 'senior';
export type PoolStatus = 'waiting' | 'assigned';
export type TeamStatus = 'forming' | 'pending_activation' | 'active' | 'inactive';
export type MemberStatus = 'active' | 'inactive' | 'replaced';

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
  idea_title: string | null;
  idea_description: string | null;
  project_category: string | null;
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
  replaced_at: string | null;
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
}
