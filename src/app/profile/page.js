'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useStore } from '@/store/useStore';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const { userProfile, initializeListeners } = useStore();

  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState([]);
  
  // New state for avatar upload
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const goals = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Data Scientist',
    'Machine Learning Engineer',
    'DevOps Engineer',
    'Mobile Developer'
  ];

  useEffect(() => {
    let unsubscribe;
    if (user && !userProfile) {
      unsubscribe = initializeListeners(user.uid);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, userProfile, initializeListeners]);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setGoal(userProfile.goal || 'Full Stack Developer');
      setSkills(userProfile.skills || []);
      setInterests(userProfile.interests || []);
    }
  }, [userProfile]);

  // Effect for avatar preview cleanup
  useEffect(() => {
    if (avatarFile) {
      const objectUrl = URL.createObjectURL(avatarFile);
      setAvatarPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setAvatarPreview(null);
    }
  }, [avatarFile]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleAddInterest = (e) => {
    e.preventDefault();
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (interest) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setError(''); // Clear any previous error
    } else {
      setAvatarFile(null);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      setError('Please select an image to upload.');
      return;
    }

    setUploadingAvatar(true);
    setError('');
    setSuccess('');

    try {
      const storage = getStorage();
      const avatarRef = ref(storage, `avatars/${user.uid}/${avatarFile.name}`);
      await uploadBytes(avatarRef, avatarFile);
      const downloadURL = await getDownloadURL(avatarRef);

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { photoURL: downloadURL }, { merge: true });

      setSuccess('Avatar uploaded successfully!');
      setAvatarFile(null); // Clear file input
      setAvatarPreview(null); // Clear preview
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset file input visually
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to upload avatar: ' + err.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (skills.length === 0) {
      setError('Please add at least one skill');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const goalToRoadmapId = {
        'Full Stack Developer': 'full_stack',
        'Frontend Developer': 'frontend',
        'Backend Developer': 'backend',
        'Data Scientist': 'data_science',
        'Machine Learning Engineer': 'ml_engineer',
        'DevOps Engineer': 'devops',
        'Mobile Developer': 'mobile'
      };

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        name,
        goal,
        skills,
        interests,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      const progressRef = doc(db, 'progress', user.uid);
      await setDoc(progressRef, {
        roadmapId: goalToRoadmapId[goal] || 'full_stack',
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (!userProfile && user)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f7ff]">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      </div>
    );
  }

  if (!user) return null; // AuthProvider avoids flash

  return (
    <div className="min-h-screen bg-[#f4f7ff] relative overflow-hidden">
      {/* Background blobs for aesthetics */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none -translate-y-12 z-0"></div>
      
      <div className="relative z-10 w-full">
         <Navbar />
      </div>
      
      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white w-full"
        >
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">Edit Your Profile</h2>
          <p className="text-slate-500 text-sm mb-8">Update your goals and skills anytime to customize your learning path.</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 text-sm mb-6 flex items-start gap-2">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-emerald-50 text-emerald-600 p-3 rounded-xl border border-emerald-100 text-sm mb-6 flex items-start gap-2"
            >
              <span>{success}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center gap-3 mb-2">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-100 bg-indigo-50 flex items-center justify-center shadow-md">
                {(avatarPreview || userProfile?.photoURL) ? (
                  <img
                    src={avatarPreview || userProfile.photoURL}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-indigo-400">
                    {(userProfile?.name || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <label className="block text-sm font-semibold text-slate-600">Profile Photo</label>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={handleAvatarUpload}
                  disabled={!avatarFile || uploadingAvatar}
                  className="w-full sm:w-auto bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {uploadingAvatar ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Upload'
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1.5 ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1.5 ml-1">Career Goal</label>
                <select 
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                >
                  {goals.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1.5 ml-1">Current Skills</label>
              <div className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(e);
                    }
                  }}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-400"
                  placeholder="e.g. React, Python"
                />
                <button 
                  type="button" 
                  onClick={handleAddSkill}
                  className="bg-indigo-100 text-indigo-700 px-5 py-3 rounded-xl text-sm font-bold hover:bg-indigo-200 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map(skill => (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={skill} 
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100 flex items-center gap-1.5"
                  >
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-indigo-400 hover:text-indigo-600">&times;</button>
                  </motion.span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1.5 ml-1">Interests & Domains</label>
              <div className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddInterest(e);
                    }
                  }}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-medium placeholder:text-slate-400"
                  placeholder="e.g. AI, Web3, FinTech"
                />
                <button 
                  type="button" 
                  onClick={handleAddInterest}
                  className="bg-teal-50 text-teal-700 px-5 py-3 rounded-xl text-sm font-bold hover:bg-teal-100 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {interests.map(interest => (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={interest} 
                    className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium border border-teal-100 flex items-center gap-1.5"
                  >
                    {interest}
                    <button type="button" onClick={() => handleRemoveInterest(interest)} className="text-teal-400 hover:text-teal-600">&times;</button>
                  </motion.span>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-xl mt-4 hover:bg-indigo-700 transition-all disabled:opacity-70 flex items-center justify-center text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
