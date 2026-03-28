/**
 * Career Mentor - Database Schema Definition
 * 
 * This file defines the structure for Firestore documents to ensure consistency
 * across the application and handle database migrations/updates.
 */

export const USER_SCHEMA = {
  uid: '',
  name: '',
  email: '',
  photoURL: '',
  goal: '', // The primary roadmap ID (e.g., 'full_stack')
  skills: [],
  interests: [],
  academic_background: '',
  projects: [],
  experience: [],
  onboarding_completed: false,
  created_at: null,
  updated_at: null,
};

export const PROGRESS_SCHEMA = {
  roadmapId: 'full_stack',
  completedNodes: [], // Array of node IDs
  roadmapOverride: null, // Custom roadmap modifications (nodes/edges)
  updatedAt: null,
};

/**
 * Validates and completes a user object with default schema values
 */
export function validateUserSchema(data) {
  const result = { ...USER_SCHEMA, ...data };
  
  // Ensure critical arrays exist
  if (!Array.isArray(result.skills)) result.skills = [];
  if (!Array.isArray(result.interests)) result.interests = [];
  if (!Array.isArray(result.projects)) result.projects = [];
  if (!Array.isArray(result.experience)) result.experience = [];
  
  // Logic to determine if onboarding is truly completed
  if (result.goal && result.skills.length > 0) {
    result.onboarding_completed = true;
  }

  return result;
}
