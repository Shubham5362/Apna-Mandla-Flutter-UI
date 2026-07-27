import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Save, Plus, Trash2, Share2, ExternalLink, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

interface Link {
  label: string;
  url: string;
}

interface ProfileData {
  displayName: string;
  bio: string;
  websiteTitle: string;
  photoURL: string;
  links: Link[];
  theme: string;
  averageRating?: number;
  totalRatings?: number;
}

export const ProfileEditor = ({ onBack }: { onBack: () => void }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({
    displayName: user?.displayName || '',
    bio: '',
    websiteTitle: 'Welcome to my profile',
    photoURL: user?.photoURL || '',
    links: [],
    theme: 'blue',
    averageRating: 0,
    totalRatings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const publicUrl = `${window.location.origin}${window.location.pathname}?profile=${user?.uid}`;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        // Mocking profile fetch for now
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Profile save action
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => {
    setProfile({ ...profile, links: [...profile.links, { label: '', url: '' }] });
  };

  const removeLink = (index: number) => {
    const newLinks = profile.links.filter((_, i) => i !== index);
    setProfile({ ...profile, links: newLinks });
  };

  const updateLink = (index: number, field: keyof Link, value: string) => {
    const newLinks = [...profile.links];
    newLinks[index][field] = value;
    setProfile({ ...profile, links: newLinks });
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto pb-24 no-scrollbar">
      <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">My Profile</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </header>

      <div className="p-6 space-y-8">
        {/* Rating Display */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-2">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Rating</h2>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-8 h-8 ${
                  star <= Math.round(profile.averageRating || 0) ? 'text-yellow-400' : 'text-gray-200'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-sm font-bold text-gray-900">
            {profile.averageRating?.toFixed(1)} <span className="text-gray-400 font-normal">({profile.totalRatings} ratings)</span>
          </p>
          <p className="text-[10px] text-gray-400 text-center">Ratings are given by other users and cannot be edited by you.</p>
        </section>

        {/* QR Code Section */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-4">
          <h2 className="text-lg font-bold">Your Profile QR Code</h2>
          <div className="p-4 bg-white border-4 border-blue-50 rounded-2xl">
            <QRCodeSVG value={publicUrl} size={150} />
          </div>
          <p className="text-xs text-gray-500 text-center">Scan this to view your public profile</p>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(publicUrl);
            }}
            className="flex items-center gap-2 text-blue-600 font-bold text-sm"
          >
            <Share2 className="w-4 h-4" />
            Copy Profile Link
          </button>
        </section>

        {/* Basic Info */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold">Profile Details</h2>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Display Name</label>
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Profile Headline</label>
            <input
              type="text"
              value={profile.websiteTitle}
              onChange={(e) => setProfile({ ...profile, websiteTitle: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Welcome to my profile"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="Tell people about yourself..."
            />
          </div>
        </section>

        {/* Links Section */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">My Links</h2>
            <button
              onClick={addLink}
              className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            {profile.links.map((link, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 relative">
                <button
                  onClick={() => removeLink(index)}
                  className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLink(index, 'label', e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-gray-100 text-sm font-bold"
                  placeholder="Link Label (e.g. My Instagram)"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateLink(index, 'url', e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-gray-100 text-sm"
                  placeholder="URL (https://...)"
                />
              </div>
            ))}
            {profile.links.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No links added yet.</p>
            )}
          </div>
        </section>

        {/* Theme Selection */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold">Choose Theme</h2>
          <div className="flex gap-4">
            {['blue', 'purple', 'emerald', 'orange', 'rose'].map((t) => (
              <button
                key={t}
                onClick={() => setProfile({ ...profile, theme: t })}
                className={`w-10 h-10 rounded-full border-4 ${
                  profile.theme === t ? 'border-gray-900' : 'border-transparent'
                } bg-${t}-500`}
                style={{ backgroundColor: t === 'emerald' ? '#10b981' : t === 'rose' ? '#f43f5e' : t }}
              />
            ))}
          </div>
        </section>

        {/* Preview Link */}
        <a 
          href={publicUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-gray-900 text-white p-4 rounded-3xl font-bold"
        >
          <ExternalLink className="w-5 h-5" />
          Preview Mini Website
        </a>
      </div>
    </div>
  );
};
