import { create } from 'zustand';
import { db } from '@/lib/firebase';
import {
  doc, onSnapshot, getDoc, setDoc, arrayUnion, serverTimestamp
} from 'firebase/firestore';
import { detectIntent, extractEntities, buildBotResponse, GOAL_TO_ROADMAP_ID } from '@/lib/chatEngine';
import { addNode, removeNode, computeAdaptation } from '@/lib/dagUtils';

export const useStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────
  userProfile:    null,
  progress:       null,
  roadmap:        null,
  chatHistory:    [],    // { id, sender: 'user'|'bot', text, timestamp }
  feedbackActions: [],   // list of actions applied to roadmap (for banner)
  isChatOpen:     false,

  // ── Listeners ──────────────────────────────────────────
  initializeListeners: (uid) => {
    // 1. User profile
    const unsubUser = onSnapshot(doc(db, 'users', uid), (snap) => {
      if (snap.exists()) set({ userProfile: snap.data() });
    });``

    // 2. Progress — triggers road map adaptation on change
    const unsubProgress = onSnapshot(doc(db, 'progress', uid), async (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      set({ progress: data });

      let rId = data.roadmapId === 'default' ? 'full_stack' : (data.roadmapId || 'full_stack');
      const currentRoadmap = get().roadmap;

      // Fetch roadmap if not loaded or roadmapId changed
      if (!currentRoadmap || currentRoadmap.roadmapId !== rId) {
        await get().fetchRoadmap(rId);
      }

      // Run adaptive feedback loop
      get().adaptRoadmap(uid);
    });

    // 3. Chat history from Firestore
    const unsubFeedback = onSnapshot(doc(db, 'feedback', uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        // Only sync if external (avoids overwriting in-memory optimistic updates)
        if (data.interactions && data.interactions.length > get().chatHistory.filter(m => m.sender === 'user').length) {
          // Leave local chatHistory as source of truth for UX responsiveness
        }
      }
    });

    return () => {
      unsubUser();
      unsubProgress();
      unsubFeedback();
    };
  },

  // ── Fetch Roadmap ───────────────────────────────────────
  fetchRoadmap: async (roadmapId) => {
    try {
      const snap = await getDoc(doc(db, 'roadmaps', roadmapId));
      if (snap.exists()) {
        set({ roadmap: { ...snap.data(), roadmapId } });
      } else {
        console.warn('Roadmap not found in Firestore:', roadmapId);
      }
    } catch (err) {
      console.error('Error fetching roadmap:', err);
    }
  },

  // ── Complete Step ───────────────────────────────────────
  completeStep: async (stepId, uid) => {
    const { progress } = get();
    if (!progress) return;
    const newCompleted = [...new Set([...(progress.completedNodes || []), stepId])];
    try {
      await setDoc(doc(db, 'progress', uid), {
        completedNodes: newCompleted,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error('Failed to complete step:', err);
    }
  },

  // ── Adaptive Feedback Loop ──────────────────────────────
  // Called every time progress changes. Inspects pace and mutates roadmap if needed.
  adaptRoadmap: (uid) => {
    const { roadmap, progress, feedbackActions } = get();
    if (!roadmap || !progress) return;
    const { completedNodes = [] } = progress;
    const { isFast, isStruggling } = computeAdaptation(completedNodes, roadmap.nodes || [], roadmap.edges || []);

    // Guard: already auto-adapted this session?
    const alreadyAdapted = feedbackActions.some(a => a.type === 'AUTO_ADAPT');

    if (isStruggling && !alreadyAdapted) {
      const challengeNode = {
        id: `auto-extra-beginner-${Date.now()}`,
        title: '🆘 Extra Practice: Fundamentals Review',
        level: 'beginner',
        description: 'An auto-generated revision node. Review core concepts before moving ahead.',
        resources: [{ type: 'article', title: 'Fundamentals Refresher', link: 'https://www.freecodecamp.org' }],
        isNew: true,
      };
      const beginners = roadmap.nodes.filter(n => n.level === 'beginner');
      const afterId = beginners.length > 0 ? beginners[beginners.length - 1].id : null;
      const newRoadmap = addNode(roadmap, challengeNode, afterId);
      set({ roadmap: newRoadmap, feedbackActions: [...feedbackActions, { type: 'AUTO_ADAPT', label: 'Added extra practice node for your pace' }] });
      get().saveRoadmapToFirestore(progress.roadmapId || 'full_stack', newRoadmap, uid);
    }

    if (isFast && !alreadyAdapted) {
      const challengeNode = {
        id: `auto-challenge-${Date.now()}`,
        title: '🚀 Challenge Project: Apply Your Skills',
        level: 'intermediate',
        description: 'You\'re progressing fast! Take on this real-world challenge project to solidify your skills.',
        resources: [],
        isNew: true,
      };
      const newRoadmap = addNode(roadmap, challengeNode, null);
      set({ roadmap: newRoadmap, feedbackActions: [...feedbackActions, { type: 'AUTO_ADAPT', label: 'Added challenge project node — you\'re progressing fast!' }] });
      get().saveRoadmapToFirestore(progress.roadmapId || 'full_stack', newRoadmap, uid);
    }
  },

  // ── Save Mutated Roadmap to Firestore ───────────────────
  saveRoadmapToFirestore: async (roadmapId, roadmap, uid) => {
    try {
      // Write current version as a snapshot
      const versionId = `v_${Date.now()}`;
      await setDoc(doc(db, 'roadmaps', roadmapId, 'versions', versionId), {
        ...roadmap,
        mutatedBy: uid,
        createdAt: new Date().toISOString(),
      });
      // Also update the main roadmap doc so all users of this roadmap benefit (in a real app, 
      // you'd use a user-specific overlay; for MVP, we store per-user overrides in progress)
      await setDoc(doc(db, 'progress', uid), {
        roadmapOverride: { nodes: roadmap.nodes, edges: roadmap.edges },
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.error('Error saving roadmap override:', err);
    }
  },

  // ── Chat: Toggle Open ───────────────────────────────────
  toggleChat: () => set(s => ({ isChatOpen: !s.isChatOpen })),

  // ── Chat: Send Message ──────────────────────────────────
  sendMessage: async (text, uid) => {
    if (!text.trim()) return;
    const { chatHistory, roadmap, userProfile, feedbackActions } = get();

    const userMsg = { id: `u-${Date.now()}`, sender: 'user', text, timestamp: new Date().toISOString() };
    set({ chatHistory: [...chatHistory, userMsg] });

    // Detect intent + entities
    const intent = detectIntent(text);
    const entities = extractEntities(text);
    const { reply, action } = buildBotResponse(intent, entities, userProfile, roadmap);

    // Apply action
    let actionLabel = 'none';
    let updatedRoadmap = roadmap;

    if (action.type === 'ADD_NODE' && roadmap) {
      updatedRoadmap = addNode(roadmap, action.payload.node, action.payload.afterNodeId);
      actionLabel = `Added node: ${action.payload.node.title}`;
      get().saveRoadmapToFirestore(get().progress?.roadmapId || 'full_stack', updatedRoadmap, uid);
      set({
        roadmap: updatedRoadmap,
        feedbackActions: [...feedbackActions, { type: 'CHAT', label: actionLabel }],
      });
    }

    if (action.type === 'ADD_NODES_BATCH' && roadmap && action.payload.nodes) {
      updatedRoadmap = action.payload.nodes.reduce((rm, node) => addNode(rm, node, null), roadmap);
      actionLabel = `Added ${action.payload.nodes.length} project nodes`;
      get().saveRoadmapToFirestore(get().progress?.roadmapId || 'full_stack', updatedRoadmap, uid);
      set({
        roadmap: updatedRoadmap,
        feedbackActions: [...feedbackActions, { type: 'CHAT', label: actionLabel }],
      });
    }

    if (action.type === 'SWITCH_ROADMAP' && uid) {
      const { goal, roadmapId } = action.payload;
      actionLabel = `Switched roadmap to ${goal}`;
      try {
        await setDoc(doc(db, 'users', uid), { goal, updatedAt: new Date().toISOString() }, { merge: true });
        await setDoc(doc(db, 'progress', uid), {
          roadmapId,
          completedNodes: [],
          roadmapOverride: null,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        // Fetch new roadmap immediately
        await get().fetchRoadmap(roadmapId);
        set({ feedbackActions: [...feedbackActions, { type: 'CHAT', label: actionLabel }] });
      } catch (err) {
        console.error('Error switching roadmap:', err);
      }
    }

    // Persist interaction to Firestore
    if (uid) {
      try {
        await setDoc(doc(db, 'feedback', uid), {
          interactions: arrayUnion({
            message: text,
            intent,
            actionTaken: actionLabel,
            timestamp: new Date().toISOString(),
          })
        }, { merge: true });
      } catch (err) {
        console.error('Error saving feedback:', err);
      }
    }

    // Append bot reply
    const botMsg = { id: `b-${Date.now()}`, sender: 'bot', text: reply, timestamp: new Date().toISOString() };
    set(s => ({ chatHistory: [...s.chatHistory, botMsg] }));
  },

  // ── Clear Feedback Banner ────────────────────────────────
  clearFeedbackActions: () => set({ feedbackActions: [] }),
}));
