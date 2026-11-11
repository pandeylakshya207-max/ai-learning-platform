// A* study-path planner for the browser. Same algorithm and numbers as src/astar_plan.py
// (checked by tests/astar_parity_test.js). See that file for the full explanation.
// Classifier label: topic is MASTERED when P(next answer correct) >= theta, else NOT YET.
// A* finds the fewest practice questions after which every weak practised topic is MASTERED.
(function (root) {
  const MAX_TARGETS = 4, MAX_TOTAL = 30;

  function Planner(M, theta) { this.M = M; this.theta = theta === undefined ? 0.70 : theta; }

  Planner.prototype.prob = function (k, succ, fail, recent, n, sumc) {
    const M = this.M;
    const rate = (sumc + 2 * M.p0) / (n + 2);
    const r = recent.slice(-3);
    const last3 = r.length ? r.reduce((a, b) => a + b, 0) / r.length : M.p0;
    const first = succ + fail === 0 ? 1 : 0;
    const tl = M.topic_logit[k];
    const x = [Math.log1p(succ), Math.log1p(fail), rate, Math.log1p(n), last3, first, tl, tl];
    let z = M.intercept + M.coef_topic[k];
    for (let j = 0; j < 8; j++) z += M.coef_features[j] * (x[j] - M.scaler_mean[j]) / M.scaler_scale[j];
    return 1 / (1 + Math.exp(-z));
  };

  Planner.prototype.summarise = function (skills, correct) {
    const H = { succ: {}, fail: {}, recent: {}, n: skills.length, sumc: 0 };
    for (let i = 0; i < skills.length; i++) {
      const k = skills[i], c = correct[i] ? 1 : 0;
      H.succ[k] = (H.succ[k] || 0) + c; H.fail[k] = (H.fail[k] || 0) + 1 - c;
      (H.recent[k] = H.recent[k] || []).push(c); H.sumc += c;
    }
    return H;
  };

  Planner.prototype.probAfter = function (H, k, own, total) {
    const rec = (H.recent[k] || []).concat(new Array(own).fill(1));
    return this.prob(k, (H.succ[k] || 0) + own, H.fail[k] || 0, rec, H.n + total, H.sumc + total);
  };

  Planner.prototype.need = function (H, k, own, total) {
    for (let m = 0; m <= MAX_TOTAL - total; m++) if (this.probAfter(H, k, own + m, total + m) >= this.theta) return m;
    return Infinity;
  };

  Planner.prototype.targets = function (skills, correct) {
    const H = this.summarise(skills, correct), ps = {};
    for (const k of Object.keys(H.succ)) ps[k] = this.probAfter(H, +k, 0, 0);
    const weak = Object.keys(ps).map(Number).filter(k => ps[k] < this.theta).sort((a, b) => ps[a] - ps[b]);
    return { H, T: weak.slice(0, MAX_TARGETS), ps };
  };

  Planner.prototype.heuristic = function (H, T, s) {
    const tot = s.reduce((a, b) => a + b, 0);
    let h = 0;
    for (let i = 0; i < T.length; i++) h = Math.max(h, this.need(H, T[i], s[i], tot));
    return h;
  };

  Planner.prototype.isGoal = function (H, T, s) {
    const tot = s.reduce((a, b) => a + b, 0);
    for (let i = 0; i < T.length; i++) if (this.probAfter(H, T[i], s[i], tot) < this.theta) return false;
    return true;
  };

  // Tiny binary heap ordered by (f, g, state) like Python's heapq on tuples.
  function less(a, b) {
    if (a[0] !== b[0]) return a[0] < b[0];
    if (a[1] !== b[1]) return a[1] < b[1];
    for (let i = 0; i < a[2].length; i++) if (a[2][i] !== b[2][i]) return a[2][i] < b[2][i];
    return false;
  }
  function push(h, x) { h.push(x); let i = h.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (!less(h[i], h[p])) break; [h[i], h[p]] = [h[p], h[i]]; i = p; } }
  function pop(h) {
    const top = h[0], last = h.pop();
    if (h.length) { h[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i;
      if (l < h.length && less(h[l], h[m])) m = l; if (r < h.length && less(h[r], h[m])) m = r;
      if (m === i) break; [h[i], h[m]] = [h[m], h[i]]; i = m; } }
    return top;
  }

  // Plan as [[topic, questions]] in target order (weakest first); with all planned answers assumed
  // correct, only the number of questions per topic matters, not the order.
  function path(parent, s, key, T) {
    const steps = [];
    let cur = key(s);
    while (parent.get(cur)) { const [prev, k] = parent.get(cur); steps.push(k); cur = prev; }
    return T.map(k => [k, steps.filter(x => x === k).length]).filter(x => x[1] > 0);
  }

  Planner.prototype.astar = function (skills, correct, useHeuristic) {
    if (useHeuristic === undefined) useHeuristic = true;
    const { H, T, ps } = this.targets(skills, correct);
    const key = s => s.join(",");
    const res = { targets: T, startProb: T.map(k => ps[k]), expanded: 0, generated: 1 };
    if (!T.length) return Object.assign(res, { status: "nothing to plan", plan: [], cost: 0 });
    const start = T.map(() => 0);
    const h0 = useHeuristic ? this.heuristic(H, T, start) : 0;
    if (h0 === Infinity) return Object.assign(res, { status: "not reachable", plan: null, cost: null });
    const heap = [[h0, 0, start]], bestG = new Map([[key(start), 0]]), parent = new Map([[key(start), null]]), closed = new Set();
    while (heap.length) {
      const [, g, s] = pop(heap);
      const ks = key(s);
      if (closed.has(ks)) continue;
      if (this.isGoal(H, T, s)) {
        const tot = s.reduce((a, b) => a + b, 0);
        return Object.assign(res, { status: "ok", cost: g, plan: path(parent, s, key, T), endProb: T.map((k, i) => this.probAfter(H, k, s[i], tot)) });
      }
      closed.add(ks); res.expanded++;
      for (let i = 0; i < T.length; i++) {
        if (g + 1 > MAX_TOTAL) continue;
        const t = s.slice(); t[i]++;
        const kt = key(t);
        if (closed.has(kt) || (bestG.has(kt) && bestG.get(kt) <= g + 1)) continue;
        const h = useHeuristic ? this.heuristic(H, T, t) : 0;
        if (h === Infinity) continue;
        bestG.set(kt, g + 1); parent.set(kt, [ks, T[i]]); res.generated++;
        push(heap, [g + 1 + h, g + 1, t]);
      }
    }
    return Object.assign(res, { status: "not reachable", plan: null, cost: null });
  };

  Planner.prototype.bfs = function (skills, correct) {
    const { H, T } = this.targets(skills, correct);
    const key = s => s.join(",");
    const res = { targets: T, expanded: 0, generated: 1 };
    if (!T.length) return Object.assign(res, { status: "nothing to plan", plan: [], cost: 0 });
    const start = T.map(() => 0), q = [start], seen = new Set([key(start)]), parent = new Map([[key(start), null]]);
    let qi = 0;
    while (qi < q.length) {
      const s = q[qi++];
      if (this.isGoal(H, T, s)) return Object.assign(res, { status: "ok", cost: s.reduce((a, b) => a + b, 0), plan: path(parent, s, key, T) });
      res.expanded++;
      for (let i = 0; i < T.length; i++) {
        if (s.reduce((a, b) => a + b, 0) + 1 > MAX_TOTAL) continue;
        const t = s.slice(); t[i]++; const kt = key(t);
        if (!seen.has(kt)) { seen.add(kt); parent.set(kt, [key(s), T[i]]); q.push(t); res.generated++; }
      }
    }
    return Object.assign(res, { status: "not reachable", plan: null, cost: null });
  };

  const api = { Planner, MAX_TARGETS, MAX_TOTAL };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.AStarPlanner = api;
})(this);
