// Browser (and Node) implementation of the live model: logistic regression with history features.
// Must give the same numbers as src/mastery.py LogRegMastery.one(); checked by tests/parity_test.js.
(function (root) {
  function log1p(x) { return Math.log(1 + x); }
  function mastery(M, skills, correct) {
    const K = M.n_topics, p0 = M.p0;
    const succ = new Array(K + 1).fill(0), fail = new Array(K + 1).fill(0), recent = Array.from({ length: K + 1 }, () => []);
    let sumc = 0;
    for (let i = 0; i < skills.length; i++) {
      const k = skills[i], c = correct[i] ? 1 : 0;
      succ[k] += c; fail[k] += 1 - c; recent[k].push(c); sumc += c;
    }
    const n = skills.length, rate = (sumc + 2 * p0) / (n + 2);
    const out = [], contrib = [];
    for (let k = 1; k <= K; k++) {
      const r = recent[k].slice(-3);
      const last3 = r.length ? r.reduce((a, b) => a + b, 0) / r.length : p0;
      const x = [log1p(succ[k]), log1p(fail[k]), rate, log1p(n), last3, succ[k] + fail[k] === 0 ? 1 : 0, M.topic_logit[k], M.topic_logit[k]];
      let z = M.intercept + M.coef_topic[k];
      const parts = [];
      for (let j = 0; j < x.length; j++) {
        const c = M.coef_features[j] * (x[j] - M.scaler_mean[j]) / M.scaler_scale[j];
        z += c; parts.push(c);
      }
      out.push(1 / (1 + Math.exp(-z)));
      contrib.push({ topicTerm: M.coef_topic[k] + M.intercept, features: parts, counts: { correct: succ[k], wrong: fail[k] } });
    }
    return { mastery: out, contrib: contrib };   // index 0 = topic 1
  }
  const api = { mastery };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.KTModel = api;
})(this);
