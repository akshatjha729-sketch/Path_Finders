import { CandidateProfile, DualLayerSummaryResult, JobApplication, JobPosting, SystemAnalytics, UserRole, UserSession, VoiceCommandParseResult } from '../types/index.ts';

let currentRole: UserRole = 'job_seeker';

export function setApiRole(role: UserRole) {
  currentRole = role;
}

export function getApiRole(): UserRole {
  return currentRole;
}

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-user-role': currentRole
});

export const api = {
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  async login(role: UserRole, email?: string, name?: string): Promise<UserSession> {
    setApiRole(role);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ role, email, name })
    });
    return res.json();
  },

  async getJobs(query?: string, type?: string, remote?: boolean, country?: string): Promise<JobPosting[]> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (type) params.append('type', type);
    if (remote) params.append('remote', 'true');
    if (country) params.append('country', country);
    const res = await fetch(`/api/jobs?${params.toString()}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async getJobById(id: string): Promise<JobPosting> {
    const res = await fetch(`/api/jobs/${id}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async createJob(jobData: Partial<JobPosting>): Promise<JobPosting> {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(jobData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create job');
    }
    return res.json();
  },

  async updateJob(id: string, updates: Partial<JobPosting>): Promise<JobPosting> {
    const res = await fetch(`/api/jobs/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteJob(id: string): Promise<{ message: string }> {
    const res = await fetch(`/api/jobs/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  async getProfile(): Promise<CandidateProfile> {
    const res = await fetch('/api/profile', {
      headers: getHeaders()
    });
    return res.json();
  },

  async updateProfile(profile: Partial<CandidateProfile>): Promise<CandidateProfile> {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profile)
    });
    return res.json();
  },

  async getApplications(jobId?: string): Promise<JobApplication[]> {
    const url = jobId ? `/api/applications?jobId=${jobId}` : '/api/applications';
    const res = await fetch(url, {
      headers: getHeaders()
    });
    return res.json();
  },

  async createApplication(appData: any): Promise<JobApplication> {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(appData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Application failed');
    }
    return res.json();
  },

  async updateApplicationStatus(id: string, status: JobApplication['status'], recruiterNotes?: string): Promise<JobApplication> {
    const res = await fetch(`/api/applications/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, recruiterNotes })
    });
    return res.json();
  },

  async summarizeJob(jobTitle: string, description: string, salary?: string, location?: string, requirements?: string[], forceLocalFallback: boolean = false): Promise<DualLayerSummaryResult> {
    const res = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ jobTitle, description, salary, location, requirements, forceLocalFallback })
    });
    return res.json();
  },

  async parseVoiceCommand(transcript: string, forceLocalFallback: boolean = false): Promise<VoiceCommandParseResult> {
    const res = await fetch('/api/ai/parse-voice', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ transcript, forceLocalFallback })
    });
    return res.json();
  },

  async getAnalytics(): Promise<SystemAnalytics> {
    const res = await fetch('/api/analytics', {
      headers: getHeaders()
    });
    return res.json();
  },

  async triggerBackup(): Promise<any> {
    const res = await fetch('/api/backup/trigger', {
      method: 'POST',
      headers: getHeaders()
    });
    return res.json();
  },

  async restoreBackup(snapshot: any): Promise<any> {
    const res = await fetch('/api/backup/restore', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ snapshot })
    });
    return res.json();
  },

  async runTests(): Promise<any> {
    const res = await fetch('/api/test-runner/run', {
      headers: getHeaders()
    });
    return res.json();
  }
};
