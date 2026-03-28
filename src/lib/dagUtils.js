// ── DAG Unlock Logic ─────────────────────────────────────
export const isStepUnlocked = (stepId, completedNodes, edges) => {
  if (!edges || edges.length === 0) return true;
  const dependencies = edges.filter(e => e.to === stepId).map(e => e.from);
  if (dependencies.length === 0) return true;
  return dependencies.every(dep => completedNodes.includes(dep));
};

// ── Cycle Detection ──────────────────────────────────────
export const hasCycle = (nodes, edges) => {
  const adj = {};
  nodes.forEach(n => (adj[n.id] = []));
  edges.forEach(e => {
    if (adj[e.from]) adj[e.from].push(e.to);
  });
  const visited = new Set();
  const stack = new Set();
  const dfs = (id) => {
    if (stack.has(id)) return true;
    if (visited.has(id)) return false;
    visited.add(id);
    stack.add(id);
    for (const neighbor of (adj[id] || [])) {
      if (dfs(neighbor)) return true;
    }
    stack.delete(id);
    return false;
  };
  return nodes.some(n => dfs(n.id));
};

// ── DAG Mutations ────────────────────────────────────────
export const addNode = (roadmap, node, afterNodeId = null) => {
  const nodes = [...roadmap.nodes, node];
  let edges = [...roadmap.edges];
  if (afterNodeId) {
    edges = [...edges, { from: afterNodeId, to: node.id }];
  }
  if (hasCycle(nodes, edges)) {
    console.warn('DAG: cycle detected, node not added');
    return roadmap;
  }
  return { ...roadmap, nodes, edges };
};

export const removeNode = (roadmap, nodeId) => {
  const nodes = roadmap.nodes.filter(n => n.id !== nodeId);
  const edges = roadmap.edges.filter(e => e.from !== nodeId && e.to !== nodeId);
  return { ...roadmap, nodes, edges };
};

export const addEdge = (roadmap, from, to) => {
  const edges = [...roadmap.edges, { from, to }];
  if (hasCycle(roadmap.nodes, edges)) {
    console.warn('DAG: cycle detected, edge not added');
    return roadmap;
  }
  return { ...roadmap, edges };
};

// ── Adaptive Pace Engine ─────────────────────────────────
// Returns hints about whether the user is fast/slow based on completed counts
export const computeAdaptation = (completedNodes, allNodes, edges) => {
  const beginners = allNodes.filter(n => n.level === 'beginner');
  const completedBeginners = beginners.filter(n => completedNodes.includes(n.id));
  const pct = beginners.length > 0 ? completedBeginners.length / beginners.length : 0;

  return {
    // User completed beginner nodes rapidly without struggling → consider skipping ahead
    isFast: pct >= 1.0 && completedNodes.length >= allNodes.length * 0.3,
    // User has only completed very few nodes → they may need extra help
    isStruggling: completedNodes.length === 1 && allNodes.length > 3,
    completedBeginnerPct: pct,
  };
};
