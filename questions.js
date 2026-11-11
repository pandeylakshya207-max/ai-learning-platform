// Original practice questions and study notes, written for this project (not from ASSISTments, not teacher-reviewed).
// Every question is generated with random numbers and its answer is COMPUTED by the same code, so answers are exact.
// Topic numbers (idx) match the model's topics. Tested by tests/questions_test.js.
(function (root) {
  const mkR = (rand = Math.random) => {
    const R = {
      int: (a, b) => a + Math.floor(rand() * (b - a + 1)),
      pick: arr => arr[Math.floor(rand() * arr.length)],
      nz: (a, b) => { let x = 0; while (x === 0) x = R.int(a, b); return x; },
      shuffle: arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
    };
    return R;
  };
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
  const F = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
  const fs = ([n, d]) => d === 1 ? `${n}` : `${n}/${d}`;
  const r2 = x => Math.round(x * 100) / 100, r1 = x => Math.round(x * 10) / 10;
  const sgn = (b) => b < 0 ? `− ${-b}` : `+ ${b}`;
  const neg = x => x < 0 ? `(${x})` : `${x}`;
  const num = (answer, q, sol, tol = 1e-9) => ({ q, type: "number", answer, tol, answerText: `${answer}`, sol });
  const frac = (fr, q, sol) => ({ q, type: "fraction", answer: fr, answerText: fs(fr), sol });
  const choice = (answer, options, q, sol) => ({ q, type: "choice", answer: `${answer}`, choices: options.map(String), answerText: `${answer}`, sol });
  const distinct = (R, n, gen, key = x => x) => { const out = [], seen = new Set(); let guard = 0; while (out.length < n && guard++ < 1000) { const v = gen(); const k = key(v); if (!seen.has(k)) { seen.add(k); out.push(v); } } return out; };
  const PI = "Use π = 3.14 and round to 1 decimal place.";

  const T = {};
  const add = (idx, note, gen) => { T[idx] = { note, gen }; };

  add(67, "To solve ax + b = c, undo the operations in reverse order: subtract b from both sides, then divide by a. Example: 3x + 4 = 19 → 3x = 15 → x = 5.", R => {
    const x = R.int(-12, 12), a = R.nz(-9, 9), b = R.nz(-20, 20), c = a * x + b;
    return num(x, `Solve for x: ${a}x ${sgn(b)} = ${c}`, `Subtract ${b} from both sides: ${a}x = ${c - b}. Divide by ${a}: x = ${x}.`);
  });
  add(103, "Fraction → decimal: divide top by bottom. Decimal → percent: multiply by 100. Percent → decimal: divide by 100. Example: 3/4 = 0.75 = 75%.", R => {
    const d = R.pick([2, 4, 5, 8, 10, 20, 25]), n = R.int(1, d - 1), fr = F(n, d), dec = n / d, pct = r2(dec * 100);
    const t = R.int(0, 2);
    if (t === 0) return num(pct, `Write ${fs(fr)} as a percent (just the number, e.g. 40).`, `${fs(fr)} = ${dec} = ${pct}%.`);
    if (t === 1) return num(dec, `Write ${pct}% as a decimal.`, `${pct} ÷ 100 = ${dec}.`);
    const q = frac(fr, `Write ${dec} as a fraction in simplest form.`, `${dec} = ${Math.round(dec * 1000)}/1000 = ${fs(fr)}.`); q.requireFraction = true; return q;
  });
  add(41, "Adding a negative is the same as subtracting; subtracting a negative is the same as adding. Example: −7 − (−3) = −7 + 3 = −4.", R => {
    const a = R.int(-20, 20), b = R.int(-20, 20), plus = R.int(0, 1) === 1, ans = plus ? a + b : a - b;
    return num(ans, `Calculate: ${a} ${plus ? "+" : "−"} ${neg(b)}`, plus ? `${a} + ${neg(b)} = ${ans}.` : `${a} − ${neg(b)} = ${a} + ${neg(-b)} = ${ans}.`);
  });
  add(45, "Rewrite both fractions with a common denominator (the least common multiple), then add or subtract the numerators. Example: 1/3 + 1/4 = 4/12 + 3/12 = 7/12.", R => {
    const d1 = R.int(2, 12), d2 = R.int(2, 12), n1 = R.int(1, d1 - 1), n2 = R.int(1, d2 - 1), plus = R.int(0, 1) === 1, L = lcm(d1, d2);
    const a = n1 * L / d1, b = n2 * L / d2, ans = F(plus ? a + b : a - b, L);
    return frac(ans, `Calculate ${n1}/${d1} ${plus ? "+" : "−"} ${n2}/${d2}. Give a fraction in simplest form.`, `Common denominator ${L}: ${a}/${L} ${plus ? "+" : "−"} ${b}/${L} = ${plus ? a + b : a - b}/${L} = ${fs(ans)}.`);
  });
  add(68, "Simplify each side first (expand brackets, collect x terms on one side), then solve like a two-step equation. Example: 2(x + 3) = 14 → 2x + 6 = 14 → x = 4.", R => {
    const x = R.int(-10, 10);
    if (R.int(0, 1)) { const a = R.int(2, 6), b = R.nz(-9, 9), c = a * (x + b); return num(x, `Solve for x: ${a}(x ${sgn(b)}) = ${c}`, `Expand: ${a}x ${sgn(a * b)} = ${c}. So ${a}x = ${c - a * b}, x = ${x}.`); }
    let a = R.int(2, 9), c = R.int(1, 8); if (a === c) a++; const b = R.int(-15, 15), d = (a - c) * x + b;
    return num(x, `Solve for x: ${a}x ${sgn(b)} = ${c}x ${sgn(d)}`, `Move x terms left and numbers right: ${a - c}x = ${d - b}, so x = ${x}.`);
  });
  add(129, "In a proportion a/b = c/d, cross-multiply: a × d = b × c, then solve. Example: 3/4 = x/20 → 4x = 60 → x = 15.", R => {
    if (R.int(0, 1)) { const a = R.int(1, 9), b = R.int(2, 12), k = R.int(2, 9), d = b * k; return num(a * k, `Solve for x: ${a}/${b} = x/${d}`, `Cross-multiply: ${b}x = ${a} × ${d} = ${a * d}, so x = ${a * k}.`); }
    const p = R.int(25, 200), n1 = R.int(2, 6), n2 = R.int(7, 15), c1 = (n1 * p / 100).toFixed(2), ans = r2(n2 * p / 100);
    return num(ans, `If ${n1} pens cost $${c1}, how many dollars do ${n2} pens cost?`, `One pen costs $${c1} ÷ ${n1} = $${(p / 100).toFixed(2)}; ${n2} pens cost $${ans.toFixed(2)}.`, 0.005);
  });
  add(43, "Multiplying or dividing two numbers with the same sign gives a positive answer; different signs give a negative answer. Example: −6 × 4 = −24, −20 ÷ −5 = 4.", R => {
    const a = R.nz(-12, 12), b = R.nz(-12, 12);
    if (R.int(0, 1)) return num(a * b, `Calculate: ${a} × ${neg(b)}`, `${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(a * b)}; signs ${a * b > 0 ? "same → positive" : "different → negative"}: ${a * b}.`);
    return num(a, `Calculate: ${a * b} ÷ ${neg(b)}`, `${Math.abs(a * b)} ÷ ${Math.abs(b)} = ${Math.abs(a)}; signs ${a > 0 ? "same → positive" : "different → negative"}: ${a}.`);
  });
  add(26, "Probability = (number of ways the event can happen) ÷ (total number of equally likely outcomes). Example: 3 red marbles out of 10 → P(red) = 3/10.", R => {
    const r = R.int(1, 9), b = R.int(1, 9), g = R.int(1, 9), col = R.pick(["red", "blue", "green"]), k = { red: r, blue: b, green: g }[col], ans = F(k, r + b + g);
    return frac(ans, `A bag has ${r} red, ${b} blue and ${g} green marbles. One is picked at random. What is the probability it is ${col}? Give a fraction.`, `${k} ${col} out of ${r + b + g} marbles: ${k}/${r + b + g} = ${fs(ans)}.`);
  });
  add(39, "In a right triangle with legs a, b and hypotenuse c: a² + b² = c². Example: legs 3 and 4 → c = √(9 + 16) = 5.", R => {
    const [a0, b0, c0] = R.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]), k = R.int(1, 3), a = a0 * k, b = b0 * k, c = c0 * k;
    if (R.int(0, 1)) return num(c, `A right triangle has legs ${a} and ${b}. How long is the hypotenuse?`, `c = √(${a}² + ${b}²) = √${a * a + b * b} = ${c}.`);
    return num(b, `A right triangle has hypotenuse ${c} and one leg ${a}. How long is the other leg?`, `b = √(${c}² − ${a}²) = √${c * c - a * a} = ${b}.`);
  });
  add(110, "To compare fractions, rewrite them with a common denominator or convert each to a decimal. Example: 3/5 = 0.6 and 5/8 = 0.625, so 5/8 is larger.", R => {
    const fr = distinct(R, 4, () => { const d = R.int(2, 12); return F(R.int(1, d - 1), d); }, f => f[0] / f[1]);
    const big = fr.reduce((m, f) => f[0] / f[1] > m[0] / m[1] ? f : m);
    return choice(fs(big), R.shuffle(fr.map(fs)), "Which fraction is the largest?", `As decimals: ${fr.map(f => `${fs(f)} ≈ ${(f[0] / f[1]).toFixed(3)}`).join(", ")}. Largest: ${fs(big)}.`);
  });
  add(128, "Percent = (part ÷ whole) × 100. Example: 15 out of 60 → 15 ÷ 60 = 0.25 → 25%.", R => {
    let A, p, B, g = 0; do { p = R.pick([5, 10, 12.5, 20, 25, 30, 40, 50, 60, 75, 80, 120, 150]); A = R.int(4, 80) * 5; B = A * p / 100; } while (!Number.isInteger(B) && g++ < 100);
    return num(p, `What percent of ${A} is ${B}? (just the number)`, `${B} ÷ ${A} = ${B / A}; × 100 = ${p}%.`);
  });
  add(122, "Multiply the numerators and multiply the denominators, then simplify. Example: 2/3 × 3/4 = 6/12 = 1/2.", R => {
    const d1 = R.int(2, 10), d2 = R.int(2, 10), n1 = R.int(1, d1 - 1), n2 = R.int(1, d2 - 1), ans = F(n1 * n2, d1 * d2);
    return frac(ans, `Calculate ${n1}/${d1} × ${n2}/${d2}. Give a fraction in simplest form.`, `${n1 * n2}/${d1 * d2} = ${fs(ans)}.`);
  });
  add(108, "Compare decimals place by place from the left (tenths, then hundredths, then thousandths). Writing them with the same number of decimal places helps: 0.4 = 0.400 > 0.38.", R => {
    const vals = distinct(R, 4, () => R.int(1, 999) / R.pick([1000, 1000, 100]));
    const small = Math.min(...vals);
    return choice(small, R.shuffle(vals), "Which number is the smallest?", `Line up the decimals: ${vals.map(v => v.toFixed(3)).join(", ")}. Smallest: ${small}.`);
  });
  add(66, "Order of operations: brackets, then exponents, then multiplication and division (left to right), then addition and subtraction (left to right). Example: 2 + 3 × 4 = 2 + 12 = 14.", R => {
    const a = R.int(2, 12), b = R.int(2, 9), c = R.int(2, 9), t = R.int(0, 3);
    if (t === 0) return num(a + b * c, `Calculate: ${a} + ${b} × ${c}`, `Multiply first: ${b} × ${c} = ${b * c}; then ${a} + ${b * c} = ${a + b * c}.`);
    if (t === 1) return num((a + b) * c, `Calculate: (${a} + ${b}) × ${c}`, `Brackets first: ${a + b}; then × ${c} = ${(a + b) * c}.`);
    if (t === 2) return num(a * b - c * c, `Calculate: ${a} × ${b} − ${c}²`, `${c}² = ${c * c}; ${a} × ${b} = ${a * b}; ${a * b} − ${c * c} = ${a * b - c * c}.`);
    return num(a + b * c - c, `Calculate: ${a} + ${b * c * c} ÷ ${c} − ${c}`, `Divide first: ${b * c * c} ÷ ${c} = ${b * c}; then ${a} + ${b * c} − ${c} = ${a + b * c - c}.`);
  });
  add(101, "Similar figures have equal angles and proportional sides. Find the scale factor from one pair of matching sides, then multiply. Example: sides 4 and 10 match → factor 2.5.", R => {
    const k = R.pick([2, 3, 4, 1.5]), a = R.int(2, 9) * 2, b = R.int(2, 9) * 2;
    return num(b * k, `Two triangles are similar. A side of length ${a} in the small triangle matches a side of length ${a * k} in the large one. Another side of the small triangle is ${b}. How long is the matching side in the large triangle?`, `Scale factor = ${a * k} ÷ ${a} = ${k}; ${b} × ${k} = ${b * k}.`);
  });
  add(123, "To find p% of a number, write p% as a decimal and multiply. Example: 15% of 80 = 0.15 × 80 = 12.", R => {
    const p = R.pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 120]), n = R.int(2, 40) * 10, ans = r2(p * n / 100);
    return num(ans, `What is ${p}% of ${n}?`, `${p / 100} × ${n} = ${ans}.`, 1e-6);
  });
  add(42, "Line up the decimal points (add zeros if needed), then add or subtract as with whole numbers. Example: 3.5 + 1.27 = 3.50 + 1.27 = 4.77.", R => {
    const a = R.int(10, 9999), b = R.int(10, 9999), plus = R.int(0, 1) === 1, A = Math.max(a, b) / 100, B = Math.min(a, b) / 100, ans = r2(plus ? A + B : A - B);
    return num(ans, `Calculate: ${A} ${plus ? "+" : "−"} ${B}`, `Line up the decimals: ${A.toFixed(2)} ${plus ? "+" : "−"} ${B.toFixed(2)} = ${ans.toFixed(2)}.`, 1e-6);
  });
  add(118, "To divide by a fraction, multiply by its reciprocal (flip it). Example: 2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6.", R => {
    const d1 = R.int(2, 10), d2 = R.int(2, 10), n1 = R.int(1, d1 - 1), n2 = R.int(1, d2 - 1), ans = F(n1 * d2, d1 * n2);
    return frac(ans, `Calculate ${n1}/${d1} ÷ ${n2}/${d2}. Give a fraction in simplest form.`, `${n1}/${d1} × ${d2}/${n2} = ${n1 * d2}/${d1 * n2} = ${fs(ans)}.`);
  });
  add(24, "For two independent events, P(A and B) = P(A) × P(B). Example: P(heads and a 6) = 1/2 × 1/6 = 1/12.", R => {
    const [txt, k] = R.pick([["a 6", 1], ["an even number", 3], ["a number greater than 4", 2], ["a number less than 3", 2], ["a 1 or a 2 or a 3", 3]]), side = R.pick(["heads", "tails"]), ans = F(k, 12);
    return frac(ans, `You flip a fair coin and roll a fair six-sided die. What is the probability of getting ${side} AND ${txt}? Give a fraction.`, `P(${side}) = 1/2, P(${txt}) = ${fs(F(k, 6))}; 1/2 × ${fs(F(k, 6))} = ${fs(ans)}.`);
  });
  add(121, "The least common multiple (LCM) is the smallest number both numbers divide into. List multiples, or use LCM(a, b) = a × b ÷ GCF(a, b). Example: LCM(4, 6) = 12.", R => {
    const a = R.int(2, 15), b = R.int(2, 15);
    return num(lcm(a, b), `What is the least common multiple of ${a} and ${b}?`, `GCF(${a}, ${b}) = ${gcd(a, b)}; LCM = ${a} × ${b} ÷ ${gcd(a, b)} = ${lcm(a, b)}.`);
  });
  add(132, "A unit rate is an amount per one unit: divide the total by the number of units. Example: 150 miles in 3 hours → 150 ÷ 3 = 50 miles per hour.", R => {
    if (R.int(0, 1)) { const rate = R.int(30, 70), h = R.int(2, 6); return num(rate, `A car travels ${rate * h} miles in ${h} hours at a steady speed. What is its speed in miles per hour?`, `${rate * h} ÷ ${h} = ${rate} miles per hour.`); }
    const c = R.int(15, 120), n = R.int(2, 8), tot = (c * n / 100).toFixed(2);
    return num(c / 100, `${n} notebooks cost $${tot}. What is the price of one notebook in dollars?`, `$${tot} ÷ ${n} = $${(c / 100).toFixed(2)}.`, 0.005);
  });
  add(136, "The absolute value |x| is the distance of x from 0, so it is never negative. Example: |−7| = 7, |3 − 10| = |−7| = 7.", R => {
    const a = R.int(-30, 30), b = R.int(-20, 20), t = R.int(0, 2);
    if (t === 0) return num(Math.abs(a), `What is |${a}|?`, `${a} is ${Math.abs(a)} units from 0, so |${a}| = ${Math.abs(a)}.`);
    if (t === 1) return num(Math.abs(a - b), `Calculate |${a} − ${neg(b)}|`, `${a} − ${neg(b)} = ${a - b}; |${a - b}| = ${Math.abs(a - b)}.`);
    return num(-Math.abs(a), `Calculate −|${a}|`, `|${a}| = ${Math.abs(a)}, so −|${a}| = ${-Math.abs(a)}.`);
  });
  add(53, "Area of a trapezoid = (base₁ + base₂) ÷ 2 × height. Example: bases 6 and 10, height 4 → (6 + 10) ÷ 2 × 4 = 32.", R => {
    const b1 = R.int(2, 15), b2 = R.int(2, 15), h = R.int(2, 12), ans = (b1 + b2) * h / 2;
    return num(ans, `A trapezoid has parallel sides ${b1} cm and ${b2} cm and height ${h} cm. What is its area in cm²?`, `(${b1} + ${b2}) ÷ 2 × ${h} = ${ans} cm².`);
  });
  add(134, "Divisible by 3: digit sum divisible by 3. By 4: last two digits divisible by 4. By 6: divisible by 2 and 3. By 9: digit sum divisible by 9.", R => {
    const k = R.pick([3, 4, 6, 9]); const yes = R.int(12, 111) * k;
    const nos = distinct(R, 3, () => { let v; do { v = R.int(100, 999); } while (v % k === 0 || v === yes); return v; });
    return choice(yes, R.shuffle([yes, ...nos]), `Which number is divisible by ${k}?`, `${yes} ÷ ${k} = ${yes / k}, a whole number. The others leave a remainder.`);
  });
  add(137, "aⁿ means a multiplied by itself n times. A negative base with an odd exponent stays negative. Example: 2⁴ = 2 × 2 × 2 × 2 = 16, (−3)³ = −27.", R => {
    const a = R.pick([2, 3, 4, 5, 6, 10, -2, -3]), n = R.int(2, a === 10 ? 6 : 4), ans = a ** n;
    return num(ans, `Calculate: ${neg(a)}^${n}`, `${Array(n).fill(neg(a)).join(" × ")} = ${ans}.`);
  });
  add(126, "The square root of n is the number that multiplied by itself gives n. Example: √81 = 9 because 9 × 9 = 81.", R => {
    const k = R.int(2, 20); return num(k, `What is √${k * k}?`, `${k} × ${k} = ${k * k}, so √${k * k} = ${k}.`);
  });
  add(111, "On a number line, numbers further left are smaller. Every negative number is smaller than 0 and than every positive number; −9 < −2.", R => {
    const v = distinct(R, 4, () => R.int(-25, 25)); const big = R.int(0, 1) === 1, ans = big ? Math.max(...v) : Math.min(...v);
    return choice(ans, R.shuffle(v), `Which number is the ${big ? "largest" : "smallest"}?`, `In order: ${v.slice().sort((x, y) => x - y).join(" < ")}.`);
  });
  add(40, "Multiply as whole numbers, then put as many decimal places in the answer as the two factors have together. To divide by a whole number, divide and keep the decimal point in place. Example: 1.2 × 0.3 = 0.36.", R => {
    if (R.int(0, 1)) { const a = R.int(11, 99), b = R.int(2, 9), ans = r2(a * b / 10); return num(ans, `Calculate: ${a / 10} × ${b}`, `${a} × ${b} = ${a * b}; one decimal place → ${ans}.`, 1e-6); }
    const q = R.int(11, 99), b = R.int(2, 9); return num(q / 10, `Calculate: ${r1(q * b / 10)} ÷ ${b}`, `${r1(q * b / 10)} ÷ ${b} = ${q / 10}.`, 1e-6);
  });
  add(114, "Add column by column from the right, carrying 1 to the next column when a column adds up to 10 or more.", R => {
    const a = R.int(100, 9999), b = R.int(100, 9999); return num(a + b, `Calculate: ${a} + ${b}`, `${a} + ${b} = ${a + b}.`);
  });
  add(133, "Scientific notation writes a number as m × 10ⁿ with 1 ≤ m < 10. Count how many places the decimal point moves: left → n positive, right → n negative. Example: 34,000 = 3.4 × 10⁴; 0.0052 = 5.2 × 10⁻³.", R => {
    let mi; do { mi = R.int(11, 99); } while (mi % 10 === 0); const m = mi / 10, n = R.pick([3, 4, 5, 6, 7, -2, -3, -4, -5]);
    const shown = n > 0 ? Math.round(m * 10 ** n).toLocaleString("en-US") : (mi / 10 ** (1 - n)).toFixed(1 - n);
    return num(n, `${shown} = ${m} × 10ⁿ. What is n?`, `The decimal point moves ${Math.abs(n)} places ${n > 0 ? "left" : "right"} to make ${m}, so n = ${n}.`);
  });
  add(98, "Circumference of a circle = 2 × π × radius = π × diameter. Example: radius 5 → 2 × 3.14 × 5 = 31.4.", R => {
    const rr = R.int(1, 15), dia = R.int(0, 1) === 1, ans = r1(2 * 3.14 * rr);
    return num(ans, `A circle has ${dia ? "diameter " + 2 * rr : "radius " + rr}. What is its circumference? ${PI}`, `C = 2 × 3.14 × ${rr} = ${(2 * 3.14 * rr).toFixed(2)} ≈ ${ans}.`, 0.051);
  });
  add(37, "Complementary angles add up to 90°; supplementary angles add up to 180°. Example: the supplement of 70° is 110°.", R => {
    const a = R.int(5, 85), sup = R.int(0, 1) === 1, b = sup ? R.int(5, 175) : a;
    return sup ? num(180 - b, `What is the supplement of a ${b}° angle (in degrees)?`, `180 − ${b} = ${180 - b}°.`) : num(90 - a, `What is the complement of a ${a}° angle (in degrees)?`, `90 − ${a} = ${90 - a}°.`);
  });
  add(64, "Volume of a sphere = 4/3 × π × r³. Example: r = 3 → 4/3 × 3.14 × 27 = 113.04.", R => {
    const rr = R.int(1, 6), v = 4 / 3 * 3.14 * rr ** 3, ans = r1(v);
    return num(ans, `A sphere has radius ${rr}. What is its volume? ${PI}`, `4/3 × 3.14 × ${rr}³ = ${v.toFixed(2)} ≈ ${ans}.`, 0.051);
  });
  add(61, "Surface area of a rectangular prism = 2 × (lw + lh + wh): add the areas of the six faces. Example: 2 × 3 × 4 → 2 × (6 + 8 + 12) = 52.", R => {
    const l = R.int(2, 12), w = R.int(2, 12), h = R.int(2, 12), ans = 2 * (l * w + l * h + w * h);
    return num(ans, `A box is ${l} cm long, ${w} cm wide and ${h} cm high. What is its total surface area in cm²?`, `2 × (${l}×${w} + ${l}×${h} + ${w}×${h}) = 2 × ${l * w + l * h + w * h} = ${ans}.`);
  });
  add(17, "The median is the middle value after sorting. With an even number of values it is the average of the two middle values. Example: 2, 5, 7, 9 → (5 + 7) ÷ 2 = 6.", R => {
    const n = R.int(5, 8), v = Array.from({ length: n }, () => R.int(1, 50)), s = v.slice().sort((a, b) => a - b);
    const ans = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
    return num(ans, `Find the median of: ${v.join(", ")}`, `Sorted: ${s.join(", ")}. ${n % 2 ? `Middle value: ${ans}.` : `Middle two: ${s[n / 2 - 1]} and ${s[n / 2]} → ${ans}.`}`);
  });
  add(62, "Volume of a cylinder = π × r² × height. Example: r = 2, h = 5 → 3.14 × 4 × 5 = 62.8.", R => {
    const rr = R.int(1, 8), h = R.int(1, 12), v = 3.14 * rr * rr * h, ans = r1(v);
    return num(ans, `A cylinder has radius ${rr} and height ${h}. What is its volume? ${PI}`, `3.14 × ${rr}² × ${h} = ${v.toFixed(2)} ≈ ${ans}.`, 0.051);
  });
  add(96, "Area of a circle = π × r². If you are given the diameter, halve it first. Example: r = 3 → 3.14 × 9 = 28.26.", R => {
    const rr = R.int(1, 12), dia = R.int(0, 1) === 1, v = 3.14 * rr * rr, ans = r1(v);
    return num(ans, `A circle has ${dia ? "diameter " + 2 * rr : "radius " + rr}. What is its area? ${PI}`, `${dia ? `Radius = ${rr}. ` : ""}3.14 × ${rr}² = ${v.toFixed(2)} ≈ ${ans}.`, 0.051);
  });
  add(63, "Volume of a rectangular prism = length × width × height. Example: 2 × 3 × 4 = 24.", R => {
    const l = R.int(2, 12), w = R.int(2, 12), h = R.int(2, 12); return num(l * w * h, `What is the volume of a box ${l} × ${w} × ${h} cm (in cm³)?`, `${l} × ${w} × ${h} = ${l * w * h} cm³.`);
  });
  add(113, "Look at the digit to the right of the place you are rounding to: 5 or more → round up; less than 5 → round down. Example: 3,462 to the nearest hundred = 3,500.", R => {
    if (R.int(0, 1)) { const N = R.int(1000, 99999), p = R.pick([10, 100, 1000]); const ans = Math.round(N / p) * p; return num(ans, `Round ${N} to the nearest ${p}.`, `Look at the digit right of the ${p}s place: ${N} → ${ans}.`); }
    let k; do { k = R.int(1001, 99999); } while (k % 10 === 0); const x = k / 1000, tenth = R.int(0, 1) === 1, ans = tenth ? Math.round(k / 100) / 10 : Math.round(k / 10) / 100;
    return num(ans, `Round ${x.toFixed(3)} to the nearest ${tenth ? "tenth" : "hundredth"}.`, `${x.toFixed(3)} → ${ans}.`, 1e-9);
  });
  add(19, "Counting principle: if one choice has m options and another has n options, there are m × n combinations. Example: 3 shirts and 4 pants → 12 outfits.", R => {
    const a = R.int(2, 8), b = R.int(2, 8), c = R.int(2, 5); return num(a * b * c, `You have ${a} shirts, ${b} pairs of trousers and ${c} pairs of shoes. How many different outfits (one of each) can you make?`, `${a} × ${b} × ${c} = ${a * b * c}.`);
  });
  add(99, "The perimeter is the total length around a shape: add all the sides. Rectangle: 2 × (length + width). Regular polygon: number of sides × side length.", R => {
    if (R.int(0, 1)) { const l = R.int(2, 30), w = R.int(2, 30); return num(2 * (l + w), `What is the perimeter of a rectangle ${l} m long and ${w} m wide (in m)?`, `2 × (${l} + ${w}) = ${2 * (l + w)} m.`); }
    const [n, name] = R.pick([[5, "pentagon"], [6, "hexagon"], [8, "octagon"], [3, "equilateral triangle"]]), s = R.int(2, 20);
    return num(n * s, `A regular ${name} has sides of ${s} cm. What is its perimeter in cm?`, `${n} sides × ${s} = ${n * s} cm.`);
  });
  add(16, "The mean (average) = sum of the values ÷ number of values. Example: 4, 6, 11 → 21 ÷ 3 = 7.", R => {
    const n = R.int(4, 6), v = Array.from({ length: n }, () => R.int(1, 40)); const s = v.reduce((a, b) => a + b, 0); v[n - 1] += (n - s % n) % n;
    const S = v.reduce((a, b) => a + b, 0); return num(S / n, `Find the mean of: ${v.join(", ")}`, `Sum = ${S}; ${S} ÷ ${n} = ${S / n}.`);
  });
  add(18, "The range = largest value − smallest value. Example: 3, 9, 4, 12 → 12 − 3 = 9.", R => {
    const v = Array.from({ length: R.int(5, 8) }, () => R.int(-10, 60)); const ans = Math.max(...v) - Math.min(...v);
    return num(ans, `Find the range of: ${v.join(", ")}`, `${Math.max(...v)} − ${neg(Math.min(...v))} = ${ans}.`);
  });
  add(135, "A prime number has exactly two factors: 1 and itself. To test n, try dividing by primes up to √n. Example: 91 = 7 × 13 is not prime; 97 is prime.", R => {
    const p = R.pick([11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]);
    const comp = R.shuffle([21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93, 95, 99]).slice(0, 3);
    return choice(p, R.shuffle([p, ...comp]), "Which of these numbers is prime?", `${p} has no factors other than 1 and itself. ${comp.map(c => { for (let d = 3; d < c; d += 2) if (c % d === 0) return `${c} = ${d} × ${c / d}`; return ""; }).join("; ")}.`);
  });
  add(52, "Area of a rectangle = length × width. Example: 7 × 4 = 28 square units.", R => {
    const l = R.int(2, 25), w = R.int(2, 25); return num(l * w, `What is the area of a rectangle ${l} cm by ${w} cm (in cm²)?`, `${l} × ${w} = ${l * w} cm².`);
  });
  add(54, "Area of a triangle = base × height ÷ 2. Example: base 10, height 6 → 30.", R => {
    const b = R.int(2, 25), h = R.int(2, 25); return num(b * h / 2, `A triangle has base ${b} cm and height ${h} cm. What is its area in cm²?`, `${b} × ${h} ÷ 2 = ${b * h / 2} cm².`);
  });
  add(70, "The greatest common factor (GCF) is the largest number that divides both numbers. Example: GCF(12, 18) = 6.", R => {
    const g = R.int(2, 12), a = g * R.int(1, 9), b = g * R.int(1, 9); return num(gcd(a, b), `What is the greatest common factor of ${a} and ${b}?`, `The largest number dividing both ${a} and ${b} is ${gcd(a, b)}.`);
  });
  add(34, "The three interior angles of any triangle add up to 180°. Example: 50° and 60° → the third angle is 70°.", R => {
    const a = R.int(20, 100), b = R.int(10, 160 - a - 10); return num(180 - a - b, `Two angles of a triangle are ${a}° and ${b}°. What is the third angle (in degrees)?`, `180 − ${a} − ${b} = ${180 - a - b}°.`);
  });
  add(31, "The interior angles of a polygon with n sides add up to (n − 2) × 180°. In a regular polygon each angle is that sum ÷ n. Example: hexagon → 4 × 180 = 720°, each 120°.", R => {
    const [n, name] = R.pick([[4, "quadrilateral"], [5, "pentagon"], [6, "hexagon"], [8, "octagon"], [10, "decagon"], [12, "dodecagon"]]);
    if (R.int(0, 1)) return num((n - 2) * 180, `What is the sum of the interior angles of a ${name} (in degrees)?`, `(${n} − 2) × 180 = ${(n - 2) * 180}°.`);
    return num((n - 2) * 180 / n, `What is each interior angle of a regular ${name} (in degrees)?`, `(${n} − 2) × 180 ÷ ${n} = ${(n - 2) * 180 / n}°.`);
  });

  // ---------- answer checking ----------
  function parseValue(s) {
    s = String(s).trim().replace(/[,$%\s]+$/g, "").replace(/^\$/, "").replace(/,/g, "").replace(/−/g, "-");
    let m = s.match(/^(-?)(\d+)\s+(\d+)\/(\d+)$/);             // mixed number "1 1/2"
    if (m) { const v = +m[2] + +m[3] / +m[4]; return { value: m[1] ? -v : v, isFraction: true }; }
    m = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
    if (m) return +m[2] === 0 ? null : { value: +m[1] / +m[2], isFraction: true, n: +m[1], d: +m[2] };
    if (/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return { value: +s, isFraction: false };
    return null;
  }
  function check(q, input) {
    if (q.type === "choice") return String(input) === q.answer;
    const p = parseValue(input); if (!p) return null;                // null = could not read the answer
    if (q.type === "fraction") {
      if (q.requireFraction && !p.isFraction) return null;
      return Math.abs(p.value - q.answer[0] / q.answer[1]) < 1e-9;
    }
    return Math.abs(p.value - q.answer) <= q.tol;
  }
  function generate(idx, rand) { return Object.assign({ topic: idx }, T[idx].gen(mkR(rand))); }
  const api = { topics: T, quizTopics: Object.keys(T).map(Number), generate, check, parseValue };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.Quiz = api;
})(this);
