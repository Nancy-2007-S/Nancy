import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import OnboardingForm from './components/OnboardingForm';
import Dashboard from './components/Dashboard';
import Roadmap from './components/Roadmap';
import Recommendations from './components/Recommendations';
import Chatbot from './components/Chatbot';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ProfilePage from './components/ProfilePage';
import { apiCall } from './api';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [engineData, setEngineData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [coins, setCoins] = useState(100);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [activeMilestone, setActiveMilestone] = useState(null);
  const [reachedMilestones, setReachedMilestones] = useState([]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Pre-warm the backend the moment the app loads so the first API call is instant
  useEffect(() => {
    apiCall("/api/warmup").catch(() => {});
  }, []);
  
  const fetchAndPatchLiveOffers = (goal, missingSkills = []) => {
    const missingStr = missingSkills.join(',');
    apiCall(`/api/dynamic_offers?goal=${encodeURIComponent(goal)}&missing=${encodeURIComponent(missingStr)}`)
      .then(json => {
         if (json.offers && json.offers.length > 0) {
            setEngineData(prev => {
                if (!prev) return prev;
                return { ...prev, advanced_offers: json.offers };
            });
         }
      })
      .catch(console.error);
  };
  
  const handleAuthSuccess = async (user) => {
    // Store the Firebase user name and UID initially
    const initialUserData = { ...(userData || {}), uid: user.uid, name: user.name, email: user.email };
    setUserData(initialUserData);
    
    try {
      // Check if user has an existing roadmap/profile in Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // User exists, restore their state
        const data = docSnap.data();
        setUserData(data.userData);
        setEngineData(data.engineData);
        // Pre-fetch live offers based on existing goal
        if (data.userData?.career_goal) {
          fetchAndPatchLiveOffers(data.userData.career_goal, data.engineData?.missing_skills || []);
        }
        setCurrentView('dashboard');
      } else {
        // New user, push to onboarding
        setCurrentView('onboarding');
      }
    } catch (err) {
      console.error("Error fetching user data from Firestore:", err);
      setCurrentView('onboarding');
    }
  };

  const handleOnboardingComplete = async (data, response) => {
    const finalUserData = { ...userData, ...data }; // ensure uid is kept if already present in userData
    setUserData(finalUserData);
    setEngineData(response);
    fetchAndPatchLiveOffers(finalUserData.career_goal, response.missing_skills || []);
    setCurrentView('roadmap');

    // Persist to Firestore
    if (finalUserData.uid) {
      try {
        await setDoc(doc(db, "users", finalUserData.uid), {
          userData: finalUserData,
          engineData: response
        });
      } catch (err) {
        console.error("Error saving new user to Firestore:", err);
      }
    }
  };
  
  const handleNodeClick = (skill) => {
    setSelectedSkill(skill);
  };

  const handleMarkComplete = (skill) => {
    const newSkills = [...new Set([...(userData.skills || []), skill])];
    const newUserData = { ...userData, skills: newSkills };

    // --- INSTANT optimistic UI update ---
    setUserData(newUserData);
    setCoins(prev => prev + 50);
    
    // update progress and missing_skills locally for instant feedback
    setEngineData(prev => {
      if (!prev) return prev;
      const total = prev.roadmap.length || 1;
      const newMissing = (prev.missing_skills || []).filter(s => s !== skill);
      const completedCount = prev.roadmap.length - newMissing.length;
      
      const newNextStep = prev.roadmap.find(s => newMissing.includes(s)) || null;
      
      const newEngineData = {
        ...prev,
        missing_skills: newMissing,
        next_step: newNextStep,
        progress: Math.min(100, Math.round((completedCount / total) * 100)),
      };

      // We do a quick optimist sync for speed
      if (newUserData.uid) {
        updateDoc(doc(db, "users", newUserData.uid), {
          userData: newUserData,
          engineData: newEngineData
        }).catch(console.error);
      }

      return newEngineData;
    });

    // --- Silent background sync to backend (no await, no blocking) ---
    apiCall("/api/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUserData)
    })
      .then(data => {
        setEngineData(prev => {
          const finalEngineData = {
            ...data,
            advanced_offers: prev?.advanced_offers || data.advanced_offers
          };
          if (newUserData.uid) {
             updateDoc(doc(db, "users", newUserData.uid), {
               engineData: finalEngineData
             }).catch(console.error);
          }
          return finalEngineData;
        });
      })
      .catch(console.error);
  };
  
  const handleWhatIf = async (newGoal) => {
    try {
      const generated = await apiCall("/api/whatif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_data: userData, new_goal: newGoal })
      });
      setEngineData(generated);
      const newUserData = { ...userData, career_goal: newGoal };
      setUserData(newUserData);
      fetchAndPatchLiveOffers(newGoal, generated.missing_skills || []);

      if (newUserData.uid) {
        await updateDoc(doc(db, "users", newUserData.uid), {
          userData: newUserData,
          engineData: generated
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSkipSkill = async (skillToSkip) => {
    try {
      const generated = await apiCall("/api/skip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_data: userData, skipped_skill: skillToSkip })
      });
      setEngineData(generated);
      
      if (userData.uid) {
        await updateDoc(doc(db, "users", userData.uid), {
          engineData: generated
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleConcise = async () => {
    const newConcise = !userData.concise;
    const newUserData = { ...userData, concise: newConcise };
    setUserData(newUserData);
    
    try {
      const data = await apiCall("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserData)
      });
      setEngineData(data);

      if (newUserData.uid) {
        await updateDoc(doc(db, "users", newUserData.uid), {
          userData: newUserData,
          engineData: data
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProfile = async (updatedUserInfo) => {
    setUserData(updatedUserInfo);
    try {
      const newEngineData = await apiCall("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUserInfo)
      });
      setEngineData(newEngineData);

      if (updatedUserInfo.uid) {
        await updateDoc(doc(db, "users", updatedUserInfo.uid), {
          userData: updatedUserInfo,
          engineData: newEngineData
        });
      }
      fetchAndPatchLiveOffers(updatedUserInfo.career_goal, newEngineData.missing_skills || []);
      return { success: true };
    } catch (err) {
      console.error("Error updating profile:", err);
      return { success: false, error: err.message };
    }
  };

  const handleAddStreakDate = async (dateStr) => {
    const currentStreaks = userData?.streak_dates || [];
    if (currentStreaks.includes(dateStr)) return;
    
    const newStreaks = [...currentStreaks, dateStr];
    const newUserData = { ...userData, streak_dates: newStreaks };
    setUserData(newUserData);
    
    if (newUserData.uid) {
      try {
        await updateDoc(doc(db, "users", newUserData.uid), {
          userData: newUserData
        });
      } catch (err) {
        console.error("Error saving streak:", err);
      }
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPage 
            onNavigateLogin={() => setCurrentView('login')} 
            onNavigateOnboarding={() => setCurrentView('onboarding')} 
          />
        );
      case 'login':
        return (
          <LoginPage 
            onLoginSuccess={handleAuthSuccess}
            onNavigateBack={() => setCurrentView('landing')}
            onNavigateSignUp={() => setCurrentView('signup')}
          />
        );
      case 'signup':
        return (
          <SignUpPage
            onSignUpSuccess={handleAuthSuccess}
            onNavigateLogin={() => setCurrentView('login')}
          />
        );
      case 'onboarding':
        return (
          <OnboardingForm
            onComplete={handleOnboardingComplete}
            userInfo={userData}
          />
        );

      case 'roadmap':
        return (
          <Roadmap 
            data={engineData}
            userInfo={userData}
            theme={theme}
            onToggleTheme={toggleTheme}
            onSimulate={handleWhatIf}
            onToggleConcise={handleToggleConcise}
            onMarkComplete={handleMarkComplete}
            selectedSkill={selectedSkill}
            setSelectedSkill={setSelectedSkill}
            activeMilestone={activeMilestone}
            setActiveMilestone={setActiveMilestone}
            reachedMilestones={reachedMilestones}
            setReachedMilestones={setReachedMilestones}
            onNavigateDashboard={() => setCurrentView('dashboard')}
            onNavigateRecommendations={() => setCurrentView('recommendation')}
            onNavigateProfile={() => setCurrentView('profile')}
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
             data={engineData}
             userInfo={userData}
             onNavigateRoadmap={() => setCurrentView('roadmap')}
             onNavigateRecommendations={() => setCurrentView('recommendation')}
             onNavigateProfile={() => setCurrentView('profile')}
             onMarkComplete={handleMarkComplete}
             onAddStreakDate={handleAddStreakDate}
          />
        );
      case 'recommendation':
        return (
          <Recommendations 
             data={engineData}
             userInfo={userData}
             onNavigateRoadmap={() => setCurrentView('roadmap')}
             onNavigateDashboard={() => setCurrentView('dashboard')}
             onNavigateProfile={() => setCurrentView('profile')}
          />
        );
      case 'profile':
        return (
          <ProfilePage
             userInfo={userData}
             data={engineData}
             onUpdateProfile={handleUpdateProfile}
             onNavigateDashboard={() => setCurrentView('dashboard')}
             onNavigateRecommendations={() => setCurrentView('recommendation')}
             onNavigateRoadmap={() => setCurrentView('roadmap')}
          />
        );
      default:
        return null;
    }
  };

  const showChatbot = userData && engineData && !['landing', 'login', 'signup', 'onboarding'].includes(currentView);

  return (
    <>
      {renderCurrentView()}
      {showChatbot && (
        <Chatbot 
           userData={userData} 
           engineData={engineData} 
           onSimulate={handleWhatIf}
           onSkipSkill={handleSkipSkill}
        />
      )}
    </>
  );
}

export default App;
