import React from 'react';
import { LayoutDashboard, Sparkles, User, PanelLeftOpen, PanelLeftClose } from 'lucide-react';

const Sidebar = ({ isExpanded, setIsExpanded, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'recommendation', label: 'Recommendation', icon: Sparkles },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div 
      className={`fixed left-0 top-0 h-full z-[300] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] border-r border-slate-200/10 dark:border-white/5 flex flex-col pt-32 pb-8 ${isExpanded ? 'w-[260px] bg-white/80 dark:bg-[#020203]/80 backdrop-blur-3xl shadow-[20px_0_50px_rgba(0,0,0,0.1)]' : 'w-[88px] bg-white/40 dark:bg-black/40 backdrop-blur-xl'}`}
    >
      {/* Toggle Button — Matches Image 2 */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-8 left-1/2 -translate-x-1/2 p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:scale-110 active:scale-95 transition-all shadow-lg"
        title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isExpanded ? <PanelLeftClose size={24} /> : <PanelLeftOpen size={24} />}
      </button>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 space-y-6 mt-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group flex items-center rounded-2xl p-4 transition-all duration-300 relative ${isActive ? 'bg-indigo-600 text-white shadow-[0_10px_30px_rgba(79,70,229,0.4)]' : 'text-slate-400 dark:text-gray-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <div className={`flex items-center justify-center min-w-[32px] ${isExpanded ? 'mr-5' : 'mx-auto'}`}>
                <Icon size={24} className={isActive ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
              </div>
              
              <span className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap overflow-hidden transition-all duration-500 ${isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>
                {item.label}
              </span>

              {/* Tooltip for collapsed mode */}
              {!isExpanded && (
                <div className="absolute left-24 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-xl opacity-0 group-hover:opacity-100 translate-x-[-15px] group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-[400] shadow-2xl">
                  {item.label}
                  <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-white rotate-45" />
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Profile/Status Indicator at bottom */}
      <div className="px-5 pt-6 border-t border-slate-200/10 dark:border-white/5">
        <div className={`flex items-center transition-all ${isExpanded ? 'gap-4 px-2' : 'justify-center'}`}>
           <div className="relative">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white dark:border-slate-800 shadow-lg" />
             <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm" />
           </div>
           {isExpanded && (
             <div className="overflow-hidden">
               <p className="text-xs font-black text-slate-800 dark:text-white truncate">Explorer</p>
               <p className="text-[9px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-tighter">Level 24</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
