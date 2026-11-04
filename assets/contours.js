/* Terrain contours for a page background.
   A seeded height field (warped gradient noise plus a few hills) traced with marching squares:
   closed rings, every fifth line heavier, faint, masked to the top-right and bottom-left corners.

   Usage (HTML tags are written with [ ] here, so this comment is safe to inline inside a script element):
     [canvas class="tu-contours" id="contours" aria-hidden="true"][/canvas]
     load this file, then call: TerrainContours.mount(document.getElementById('contours'), { seed: 1017 });

   Options: seed (number), lines (count, default 22), opacity (0..1, default .09),
            corners (true = two corner patches, false = whole canvas), colorVar (CSS variable for the line color). */
(function (global) {
  function makeNoise(seed) {
    var s = seed >>> 0, P = new Uint8Array(512), p = [], i;
    function rnd() { s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
    for (i = 0; i < 256; i++) p[i] = i;
    for (i = 255; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), x = p[i]; p[i] = p[j]; p[j] = x; }
    for (i = 0; i < 512; i++) P[i] = p[i & 255];
    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function grad(h, x, y) { var g = h & 7, u = g < 4 ? x : y, v = g < 4 ? y : x; return ((g & 1) ? -u : u) + ((g & 2) ? -2 * v : 2 * v); }
    function noise(x, y) {
      var X = Math.floor(x) & 255, Y = Math.floor(y) & 255; x -= Math.floor(x); y -= Math.floor(y);
      var u = fade(x), v = fade(y), a = P[X] + Y, b = P[X + 1] + Y;
      var l1 = grad(P[a], x, y) + u * (grad(P[b], x - 1, y) - grad(P[a], x, y));
      var l2 = grad(P[a + 1], x, y - 1) + u * (grad(P[b + 1], x - 1, y - 1) - grad(P[a + 1], x, y - 1));
      return (l1 + v * (l2 - l1)) * .5;
    }
    function fbm(x, y, o) { var a = .5, f = 1, t = 0; for (var k = 0; k < o; k++) { t += a * noise(x * f + k * 7.3, y * f); f *= 2.02; a *= .5; } return t; }
    var hills = []; for (i = 0; i < 4; i++) hills.push({ x: rnd(), y: rnd(), r: .1 + rnd() * .18, h: .4 + rnd() * .5 });
    return function height(u, v, asp) {
      var x = u * 2.6 * asp, y = v * 2.6, qx = fbm(x + 5.2, y + 1.3, 3), qy = fbm(x + 1.7, y + 9.2, 3);
      var h = fbm(x + .9 * qx, y + .9 * qy, 5);
      for (var k = 0; k < hills.length; k++) { var m = hills[k], dx = (u - m.x) * asp, dy = v - m.y; h += m.h * Math.exp(-(dx * dx + dy * dy) / (m.r * m.r)); }
      return h;
    };
  }

  function draw(cv, opts) {
    opts = opts || {};
    var ctx = cv.getContext('2d'); if (!ctx) return;
    var height = makeNoise(opts.seed == null ? 1017 : opts.seed);
    var n = opts.lines || 22, alpha = opts.opacity == null ? .09 : opts.opacity;
    var r = cv.getBoundingClientRect(), W = Math.max(1, Math.round(r.width)), H = Math.max(1, Math.round(r.height));
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);

    var C = W < 600 ? 5 : 6, gw = Math.ceil(W / C) + 1, gh = Math.ceil(H / C) + 1, F = new Float32Array(gw * gh), mn = 1e9, mx = -1e9, asp = W / H, i, j;
    for (j = 0; j < gh; j++) for (i = 0; i < gw; i++) { var h = height(i * C / W, j * C / H, asp); F[j * gw + i] = h; if (h < mn) mn = h; if (h > mx) mx = h; }
    var step = (mx - mn) / (n + 1);

    function trace(lv) {
      for (var j = 0; j < gh - 1; j++) for (var i = 0; i < gw - 1; i++) {
        var k = j * gw + i, a = F[k], b = F[k + 1], c = F[k + gw + 1], d = F[k + gw];
        var code = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (d > lv ? 1 : 0);
        if (!code || code === 15) continue;
        var x0 = i * C, y0 = j * C;
        var T = [x0 + C * (lv - a) / (b - a), y0], R = [x0 + C, y0 + C * (lv - b) / (c - b)];
        var B = [x0 + C * (lv - d) / (c - d), y0 + C], L = [x0, y0 + C * (lv - a) / (d - a)];
        var seg = { 1: [L, B], 14: [L, B], 2: [B, R], 13: [B, R], 3: [L, R], 12: [L, R], 4: [T, R], 11: [T, R], 6: [T, B], 9: [T, B], 7: [T, L], 8: [T, L] }[code];
        if (seg) { ctx.moveTo(seg[0][0], seg[0][1]); ctx.lineTo(seg[1][0], seg[1][1]); continue; }
        var hi = (a + b + c + d) / 4 > lv; // saddle: decide by the cell center
        if ((code === 5) === hi) { ctx.moveTo(L[0], L[1]); ctx.lineTo(T[0], T[1]); ctx.moveTo(B[0], B[1]); ctx.lineTo(R[0], R[1]); }
        else { ctx.moveTo(T[0], T[1]); ctx.lineTo(R[0], R[1]); ctx.moveTo(L[0], L[1]); ctx.lineTo(B[0], B[1]); }
      }
    }

    var color = getComputedStyle(document.documentElement).getPropertyValue(opts.colorVar || '--tu-ink').trim() || '#161616';
    ctx.strokeStyle = color; ctx.globalAlpha = alpha;
    ctx.lineWidth = .8; ctx.beginPath(); for (var q = 1; q <= n; q++) if (q % 5) trace(mn + q * step); ctx.stroke();
    ctx.lineWidth = 1.5; ctx.beginPath(); for (q = 5; q <= n; q += 5) trace(mn + q * step); ctx.stroke();
    ctx.globalAlpha = 1;

    if (opts.corners !== false) {
      var m = document.createElement('canvas'); m.width = W; m.height = H; var mc = m.getContext('2d');
      var R1 = Math.max(W, H) * .42, g1 = mc.createRadialGradient(W * .96, 0, R1 * .2, W * .96, 0, R1);
      g1.addColorStop(0, '#000'); g1.addColorStop(1, 'rgba(0,0,0,0)');
      var R2 = Math.max(W, H) * .34, g2 = mc.createRadialGradient(0, H, R2 * .2, 0, H, R2);
      g2.addColorStop(0, '#000'); g2.addColorStop(1, 'rgba(0,0,0,0)');
      mc.fillStyle = g1; mc.fillRect(0, 0, W, H); mc.fillStyle = g2; mc.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'destination-in'; ctx.drawImage(m, 0, 0, W, H); ctx.globalCompositeOperation = 'source-over';
    }
  }

  function mount(cv, opts) {
    var t = 0, redraw = function () { draw(cv, opts); };
    global.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(redraw, 120); });
    global.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', redraw);
    new MutationObserver(redraw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    redraw();
  }

  global.TerrainContours = { draw: draw, mount: mount };
})(window);
