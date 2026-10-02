import React, { useState } from 'react';
import { UserCheck, Save, Sparkles, Check, Sliders, Volume2, Eye } from 'lucide-react';
import { CandidateProfile } from '../types/index.ts';

interface CandidateProfileEditorProps {
  profile: CandidateProfile;
  onSaveProfile: (updated: Partial<CandidateProfile>) => Promise<void>;
  onAnnounce: (msg: string) => void;
}

export const CandidateProfileEditor: React.FC<CandidateProfileEditorProps> = ({
  profile,
  onSaveProfile,
  onAnnounce
}) => {
  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    headline: profile.headline,
    primarySkills: profile.primarySkills.join(', '),
    resumeText: profile.resumeText,
    portfolioUrl: profile.portfolioUrl || '',
    accommodations: profile.accessibilityAccommodations.join('\n'),
    speechRate: profile.assistivePreferences.speechRate,
    autoRead: profile.assistivePreferences.autoReadSummaryOnSelect
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveProfile({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        headline: formData.headline,
        primarySkills: formData.primarySkills.split(',').map(s => s.trim()).filter(Boolean),
        resumeText: formData.resumeText,
        portfolioUrl: formData.portfolioUrl,
        accessibilityAccommodations: formData.accommodations.split('\n').map(s => s.trim()).filter(Boolean),
        assistivePreferences: {
          ...profile.assistivePreferences,
          speechRate: formData.speechRate,
          autoReadSummaryOnSelect: formData.autoRead
        }
      });
      setSaveSuccess(true);
      onAnnounce('Candidate profile details saved successfully.');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      onAnnounce('Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-100">Applicant Profile</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Check className="w-3 h-3" /> Auto-Fill Ready
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pre-loads your credentials into Module 3 1-Click DOM Form Auto-Fill Engine (Alt+V)
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30">
            <Check className="w-4 h-4" /> Profile Updated
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="p-name" className="block text-xs font-semibold text-slate-300 mb-1">
              Full Name
            </label>
            <input
              id="p-name"
              type="text"
              required
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div>
            <label htmlFor="p-email" className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <input
              id="p-email"
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="p-phone" className="block text-xs font-semibold text-slate-300 mb-1">
              Phone Number
            </label>
            <input
              id="p-phone"
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div>
            <label htmlFor="p-location" className="block text-xs font-semibold text-slate-300 mb-1">
              Preferred Location
            </label>
            <input
              id="p-location"
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>

        <div>
          <label htmlFor="p-skills" className="block text-xs font-semibold text-slate-300 mb-1">
            Primary Skills (Comma separated)
          </label>
          <input
            id="p-skills"
            type="text"
            value={formData.primarySkills}
            onChange={e => setFormData({ ...formData, primarySkills: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>

        <div>
          <label htmlFor="p-resume" className="block text-xs font-semibold text-slate-300 mb-1">
            Resume Text Summary
          </label>
          <textarea
            id="p-resume"
            rows={3}
            value={formData.resumeText}
            onChange={e => setFormData({ ...formData, resumeText: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>

        <div>
          <label htmlFor="p-accommodations" className="block text-xs font-semibold text-slate-300 mb-1">
            Accessibility Accommodations Needed (One per line)
          </label>
          <textarea
            id="p-accommodations"
            rows={3}
            value={formData.accommodations}
            onChange={e => setFormData({ ...formData, accommodations: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Assistive Preferences */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Sliders className="w-4 h-4" />
            <span>Assistive Engine Preferences</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label htmlFor="speechRate" className="block text-slate-300 mb-1">
                Text-to-Speech Speed Rate ({formData.speechRate}x)
              </label>
              <input
                id="speechRate"
                type="range"
                min="0.7"
                max="1.4"
                step="0.1"
                value={formData.speechRate}
                onChange={e => setFormData({ ...formData, speechRate: parseFloat(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input
                id="autoRead"
                type="checkbox"
                checked={formData.autoRead}
                onChange={e => setFormData({ ...formData, autoRead: e.target.checked })}
                className="w-4 h-4 rounded accent-amber-400"
              />
              <label htmlFor="autoRead" className="text-slate-300 cursor-pointer">
                Automatically read cognitive summary aloud when job is selected
              </label>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-bold flex items-center gap-2 shadow-lg shadow-amber-400/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Profile...' : 'Save Profile Details'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
