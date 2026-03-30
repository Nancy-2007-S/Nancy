import React, { useState, useEffect } from 'react';
import './App.css';
import OnboardingForm from './components/OnboardingForm';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';

function App() {
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
    fetch("http://localhost:8000/api/warmup").catch(() => {});
  }, []);
  
  const fetchAndPatchLiveOffers = (goal) => {
    fetch(`http://localhost:8000/api/dynamic_offers?goal=${encodeURIComponent(goal)}`)
      .then(res => res.json())
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
  
  const handleOnboardingComplete = (data, response) => {
    setUserData(data);
    
    if (!response) {
      // Create a SKELETAL optimistic response to allow INSTANT transition
      const optimisticRoadmap = ["Analyzing Skills...", "Building Nodes...", "Mapping Dependencies..."];
      const skeleton = {
        roadmap: optimisticRoadmap,
        next_step: "Analyzing...",
        readiness_score: 0,
        progress: 0,
        missing_skills: optimisticRoadmap,
        isOptimistic: true // Flag to show loading state in UI
      };
      setEngineData(skeleton);
      return;
    }

    setEngineData(response);
    fetchAndPatchLiveOffers(data.career_goal);
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
      
      return {
        ...prev,
        missing_skills: newMissing,
        next_step: newNextStep,
        progress: Math.min(100, Math.round((completedCount / total) * 100)),
      };
    });

    // --- Silent background sync to backend (no await, no blocking) ---
    fetch("http://localhost:8000/api/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUserData)
    })
      .then(res => res.json())
      .then(data => {
        setEngineData(prev => ({
          ...data,
          advanced_offers: prev?.advanced_offers || data.advanced_offers
        }));
      })
      .catch(console.error);
  };
  
  const handleWhatIf = async (newGoal) => {
    try {
      const res = await fetch("http://localhost:8000/api/whatif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_data: userData, new_goal: newGoal })
      });
      const generated = await res.json();
      setEngineData(generated);
      setUserData({ ...userData, career_goal: newGoal });
      fetchAndPatchLiveOffers(newGoal);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleConcise = async () => {
    const newConcise = !userData.concise;
    const newUserData = { ...userData, concise: newConcise };
    setUserData(newUserData);
    
    try {
      const res = await fetch("http://localhost:8000/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserData)
      });
      const data = await res.json();
      setEngineData(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden transition-colors duration-500 bg-slate-50 dark:bg-[#020203] relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-sky-50 opacity-100 dark:opacity-0 transition-opacity duration-500 z-0"></div>
      <div className="relative z-10 flex flex-col flex-1 h-full">
        {!engineData ? (
          <div className="w-full max-w-xl mx-auto py-20">
             <div className="text-center mb-12">
                <h1 className="text-6xl font-black text-indigo-500 dark:text-white tracking-tighter italic drop-shadow-[0_2px_4px_rgba(99,102,241,0.2)] dark:drop-shadow-none">AI MENTOR</h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-xs mt-2">Quest Genesis</p>
             </div>
             <OnboardingForm onComplete={handleOnboardingComplete} theme={theme} onToggleTheme={toggleTheme} />
          </div>
        ) : (
          <Dashboard 
            data={engineData} 
            userInfo={userData} 
            coins={coins}
            theme={theme}
            onToggleTheme={toggleTheme}
            onNodeClick={handleNodeClick}
            onMarkComplete={handleMarkComplete}
            selectedSkill={selectedSkill}
            setSelectedSkill={setSelectedSkill}
            onSimulate={handleWhatIf} 
            onToggleConcise={handleToggleConcise}
            activeMilestone={activeMilestone}
            setActiveMilestone={setActiveMilestone}
            reachedMilestones={reachedMilestones}
            setReachedMilestones={setReachedMilestones}
          />
        )}
      
      {engineData && userData && (
        <Chatbot userData={userData} engineData={engineData} />
      )}
      </div>
    </div>
  );
}

export default App;
