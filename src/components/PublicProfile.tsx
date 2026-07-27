import React, { useState, useEffect } from 'react';
import { ExternalLink, Share2, Star } from 'lucide-react';
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

export const PublicProfile = ({ uid }: { uid: string }) => {
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [isRating, setIsRating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Mocking public profile fetch for now
        setLoading(false);
      } catch (error) {
        console.error('Error fetching public profile:', error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [uid]);

  const handleRate = async (rating: number) => {
    if (!currentUser) {
      console.error('Please login to rate this profile.');
      return;
    }
    if (currentUser.uid === uid) {
      console.error('You cannot rate your own profile.');
      return;
    }
    if (isRating) return;

    setIsRating(true);
    try {
      setUserRating(rating);
    } catch (error) {
      console.error('Error rating profile:', error);
    } finally {
      setIsRating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
      <p className="text-gray-500">The profile you are looking for does not exist.</p>
    </div>
  );

  const themeColors: Record<string, string> = {
    blue: 'from-blue-600 to-blue-400',
    purple: 'from-purple-600 to-purple-400',
    emerald: 'from-emerald-600 to-emerald-400',
    orange: 'from-orange-600 to-orange-400',
    rose: 'from-rose-600 to-rose-400',
  };

  const selectedColor = themeColors[profile.theme] || themeColors.blue;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-12">
      {/* Banner */}
      <div className={`w-full h-48 bg-gradient-to-br ${selectedColor} relative`}>
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
            <img 
              src={profile.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName)}&background=random`} 
              alt={profile.displayName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-20 px-6 w-full max-w-md text-center space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{profile.displayName}</h1>
          <p className="text-blue-600 font-medium mt-1">{profile.websiteTitle}</p>
          
          {/* Rating Display */}
          <div className="flex flex-col items-center mt-4 gap-1">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(profile.averageRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 font-bold">
              {profile.averageRating?.toFixed(1)} ({profile.totalRatings} ratings)
            </p>
          </div>
        </div>

        {profile.bio && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {profile.bio}
          </p>
        )}

        {/* Rating Action */}
        {currentUser?.uid !== uid && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-3">
            <p className="text-sm font-bold text-gray-700">Rate this profile</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  disabled={isRating}
                  onClick={() => handleRate(star)}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= userRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 hover:text-yellow-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="space-y-3 pt-4">
          {profile.links.map((link, i) => (
            <motion.a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all group"
            >
              <span className="font-bold text-gray-800">{link.label}</span>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
            </motion.a>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-12 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
            <div className="h-[1px] w-8 bg-gray-200"></div>
            Apna Mandla Profile
            <div className="h-[1px] w-8 bg-gray-200"></div>
          </div>
          <button 
            onClick={() => {
              navigator.share({
                title: profile.displayName,
                text: profile.bio,
                url: window.location.href
              }).catch(() => {
                navigator.clipboard.writeText(window.location.href);
              });
            }}
            className="p-3 bg-gray-100 rounded-full text-gray-600"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
