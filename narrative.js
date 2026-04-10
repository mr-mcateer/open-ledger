/* ============================================
   POWER NETWORKS — Scrollytelling Engine
   Progressive network map + step-based narrative
   ============================================ */

(function () {
  'use strict';

  // ── NODE & EDGE DEFINITIONS ──
  // These build progressively as the reader scrolls through Jay Clayton's career

  var NODES = {
    sc:       { label: 'Sullivan &\nCromwell', type: 'institution', x: 0.15, y: 0.35 },
    deutsche: { label: 'Deutsche\nBank',       type: 'bank',        x: 0.35, y: 0.18 },
    goldman:  { label: 'Goldman\nSachs',       type: 'bank',        x: 0.12, y: 0.12 },
    barclays: { label: 'Barclays',             type: 'bank',        x: 0.28, y: 0.08 },
    sec:      { label: 'SEC',                  type: 'institution', x: 0.45, y: 0.42 },
    apollo:   { label: 'Apollo\nGlobal',       type: 'bank',        x: 0.62, y: 0.30 },
    epstein:  { label: 'Epstein',              type: 'operative',   x: 0.55, y: 0.55 },
    sdny:     { label: 'SDNY',                 type: 'institution', x: 0.38, y: 0.72 },
    berman:   { label: 'Berman',               type: 'operative',   x: 0.22, y: 0.78 },
    barr:     { label: 'AG Barr',              type: 'operative',   x: 0.18, y: 0.60 },
    krongard: { label: 'Buzzy\nKrongard',      type: 'operative',   x: 0.78, y: 0.18 },
    black:    { label: 'Leon\nBlack',          type: 'operative',   x: 0.80, y: 0.48 },
    // Full network (step 8) additions
    rockefeller: { label: 'Rockefeller',       type: 'family',      x: 0.50, y: 0.08 },
    trilateral:  { label: 'Trilateral\nComm.', type: 'institution', x: 0.65, y: 0.08 },
    drexel:      { label: 'Drexel\nBurnham',   type: 'bank',        x: 0.88, y: 0.12 },
    creditlyon:  { label: 'Crédit\nLyonnais',  type: 'bank',        x: 0.90, y: 0.32 },
    maxwell:     { label: 'Robert\nMaxwell',    type: 'operative',   x: 0.92, y: 0.52 },
    bcci:        { label: 'BCCI',              type: 'bank',        x: 0.08, y: 0.90 },
    saud:        { label: 'House of\nSaud',    type: 'family',      x: 0.25, y: 0.92 },
    koch:        { label: 'Koch',              type: 'family',      x: 0.75, y: 0.85 },
    fedsoc:      { label: 'Federalist\nSociety', type: 'institution', x: 0.88, y: 0.75 },
    rothschild:  { label: 'Rothschild',        type: 'family',      x: 0.92, y: 0.65 },
    boesky:      { label: 'Boesky',            type: 'operative',   x: 0.85, y: 0.42 },
    cia:         { label: 'CIA',               type: 'institution', x: 0.55, y: 0.85 },
    clayton:     { label: 'Jay\nClayton',      type: 'operative',   x: 0.35, y: 0.50 },
  };

  var EDGES = {
    'sc-deutsche':     { from: 'sc', to: 'deutsche', label: 'represented' },
    'sc-goldman':      { from: 'sc', to: 'goldman', label: 'represented' },
    'sc-barclays':     { from: 'sc', to: 'barclays', label: 'represented' },
    'sc-sec':          { from: 'sc', to: 'sec', label: 'Clayton appointed' },
    'apollo-epstein':  { from: 'apollo', to: 'epstein', label: '$170M' },
    'deutsche-epstein':{ from: 'deutsche', to: 'epstein', label: 'banked' },
    'sdny-epstein':    { from: 'sdny', to: 'epstein', label: 'arrested' },
    'barr-sdny':       { from: 'barr', to: 'sdny', label: 'tried to control' },
    'sc-apollo':       { from: 'sc', to: 'apollo', label: 'Clayton → board' },
    'apollo-krongard': { from: 'apollo', to: 'krongard', label: 'board member' },
    'krongard-deutsche':{ from: 'krongard', to: 'deutsche', label: 'Alex Brown→DB' },
    'black-apollo':    { from: 'black', to: 'apollo', label: 'co-founded' },
    'black-epstein':   { from: 'black', to: 'epstein', label: 'paid $170M' },
    'sdny-clayton':    { from: 'sdny', to: 'clayton', label: 'appointed 2025' },
    // Full network edges
    'rock-trilateral': { from: 'rockefeller', to: 'trilateral', label: 'founded' },
    'rock-epstein':    { from: 'rockefeller', to: 'epstein', label: 'recruited' },
    'epstein-trilateral': { from: 'epstein', to: 'trilateral', label: 'member' },
    'drexel-apollo':   { from: 'drexel', to: 'apollo', label: 'grew from' },
    'creditlyon-apollo': { from: 'creditlyon', to: 'apollo', label: 'founding $' },
    'maxwell-creditlyon': { from: 'maxwell', to: 'creditlyon', label: '600 shells' },
    'bcci-saud':       { from: 'bcci', to: 'saud', label: 'Al Nahyan' },
    'bcci-drexel':     { from: 'bcci', to: 'drexel', label: 'money mixed' },
    'koch-fedsoc':     { from: 'koch', to: 'fedsoc', label: '$20M+' },
    'rothschild-boesky': { from: 'rothschild', to: 'boesky', label: 'L.F. Rothschild' },
    'boesky-drexel':   { from: 'boesky', to: 'drexel', label: 'daily calls' },
    'krongard-cia':    { from: 'krongard', to: 'cia', label: 'Exec Director' },
    'epstein-saud':    { from: 'epstein', to: 'saud', label: 'in files' },
    'clayton-sc':      { from: 'clayton', to: 'sc', label: 'partner' },
    'clayton-sec2':    { from: 'clayton', to: 'sec', label: 'chairman' },
    'clayton-apollo2': { from: 'clayton', to: 'apollo', label: 'board chair' },
  };

  var COLORS = {
    family: '#f0a500',
    institution: '#58a6ff',
    operative: '#f85149',
    bank: '#3fb950'
  };

  var SIZES = {
    family: 16,
    institution: 11,
    operative: 9,
    bank: 12
  };

  // ── SVG SETUP ──

  var svg = document.getElementById('story-network');
  var edgeGroup, nodeGroup, labelGroup, edgeLabelGroup;
  var svgW, svgH;
  var nodeElements = {};
  var edgeElements = {};

  function initSVG() {
    svgW = svg.clientWidth;
    svgH = svg.clientHeight;
    svg.setAttribute('viewBox', '0 0 ' + svgW + ' ' + svgH);
    svg.innerHTML = '';

    // Defs
    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    var filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'nglow');
    filter.innerHTML = '<feGaussianBlur stdDeviation="4" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>';
    defs.appendChild(filter);
    svg.appendChild(defs);

    edgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    edgeLabelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    labelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(edgeGroup);
    svg.appendChild(edgeLabelGroup);
    svg.appendChild(nodeGroup);
    svg.appendChild(labelGroup);

    var padX = 80, padY = 60;

    // Create all nodes (hidden initially)
    Object.keys(NODES).forEach(function (id) {
      var n = NODES[id];
      var cx = padX + n.x * (svgW - padX * 2);
      var cy = padY + n.y * (svgH - padY * 2);
      n._cx = cx;
      n._cy = cy;

      var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'net-node hidden');
      g.setAttribute('data-id', id);

      // Outer glow
      var outerC = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      outerC.setAttribute('cx', cx);
      outerC.setAttribute('cy', cy);
      outerC.setAttribute('r', SIZES[n.type] + 5);
      outerC.setAttribute('fill', COLORS[n.type]);
      outerC.setAttribute('opacity', '0');
      g.appendChild(outerC);

      // Main circle
      var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', cx);
      c.setAttribute('cy', cy);
      c.setAttribute('r', SIZES[n.type]);
      c.setAttribute('fill', COLORS[n.type]);
      c.setAttribute('filter', 'url(#nglow)');
      g.appendChild(c);

      nodeGroup.appendChild(g);
      nodeElements[id] = g;

      // Label (multiline support)
      var lines = n.label.split('\n');
      lines.forEach(function (line, i) {
        var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute('x', cx);
        t.setAttribute('y', cy + SIZES[n.type] + 14 + i * 13);
        t.setAttribute('text-anchor', 'middle');
        t.setAttribute('class', 'net-label');
        t.setAttribute('data-id', id);
        t.textContent = line;
        labelGroup.appendChild(t);
      });
    });

    // Create all edges (hidden initially)
    Object.keys(EDGES).forEach(function (eid) {
      var e = EDGES[eid];
      var fromN = NODES[e.from];
      var toN = NODES[e.to];
      if (!fromN || !toN) return;

      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', fromN._cx);
      line.setAttribute('y1', fromN._cy);
      line.setAttribute('x2', toN._cx);
      line.setAttribute('y2', toN._cy);
      line.setAttribute('class', 'net-edge');
      line.setAttribute('data-id', eid);
      edgeGroup.appendChild(line);

      // Edge label
      if (e.label) {
        var mx = (fromN._cx + toN._cx) / 2;
        var my = (fromN._cy + toN._cy) / 2;
        var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute('x', mx);
        t.setAttribute('y', my - 5);
        t.setAttribute('text-anchor', 'middle');
        t.setAttribute('class', 'net-edge-label');
        t.setAttribute('data-id', eid);
        t.textContent = e.label;
        edgeLabelGroup.appendChild(t);
      }

      edgeElements[eid] = line;
    });
  }

  // ── STEP STATE MANAGEMENT ──

  var currentStep = -1;

  function updateNetworkForStep(stepIndex) {
    if (stepIndex === currentStep) return;
    currentStep = stepIndex;

    var stepEl = document.querySelector('.step[data-step="' + stepIndex + '"]');
    if (!stepEl) return;

    var visibleNodesStr = stepEl.getAttribute('data-nodes') || '';
    var visibleEdgesStr = stepEl.getAttribute('data-edges') || '';

    var showAll = visibleNodesStr === 'all';
    var visibleNodes = showAll ? Object.keys(NODES) : visibleNodesStr.split(',').filter(Boolean);
    var visibleEdges = showAll ? Object.keys(EDGES) : visibleEdgesStr.split(',').filter(Boolean);

    // Always add 'clayton' node when we have the SDNY step
    if (stepIndex >= 7) {
      if (visibleNodes.indexOf('clayton') === -1) visibleNodes.push('clayton');
    }

    // Update nodes
    Object.keys(NODES).forEach(function (id) {
      var el = nodeElements[id];
      var labels = labelGroup.querySelectorAll('[data-id="' + id + '"]');
      if (visibleNodes.indexOf(id) !== -1) {
        el.setAttribute('class', 'net-node visible');
        labels.forEach(function (l) { l.setAttribute('class', 'net-label visible'); });
      } else {
        el.setAttribute('class', 'net-node hidden');
        labels.forEach(function (l) { l.setAttribute('class', 'net-label'); });
      }
    });

    // Update edges
    Object.keys(EDGES).forEach(function (eid) {
      var line = edgeElements[eid];
      var label = edgeLabelGroup.querySelector('[data-id="' + eid + '"]');
      if (!line) return;
      if (visibleEdges.indexOf(eid) !== -1) {
        line.setAttribute('class', 'net-edge visible');
        if (label) label.setAttribute('class', 'net-edge-label visible');
      } else {
        line.setAttribute('class', 'net-edge');
        if (label) label.setAttribute('class', 'net-edge-label');
      }
    });
  }

  // ── SCROLL OBSERVER FOR STEPS ──

  function setupScrollObserver() {
    var steps = document.querySelectorAll('.step');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Activate this step
          steps.forEach(function (s) { s.classList.remove('active'); });
          entry.target.classList.add('active');

          var stepIndex = parseInt(entry.target.getAttribute('data-step'), 10);
          updateNetworkForStep(stepIndex);
        }
      });
    }, {
      rootMargin: '-35% 0px -35% 0px',
      threshold: 0.1
    });

    steps.forEach(function (s) { observer.observe(s); });
  }

  // ── PROGRESS BAR ──

  function setupProgressBar() {
    var bar = document.getElementById('progress-bar');
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = (scrollTop / docHeight) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  // ── NAV SCROLL STATE ──

  function setupNav() {
    var nav = document.getElementById('nav');
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ── SMOOTH SCROLL ──

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          var offset = 60;
          var y = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });
  }

  // ── INIT ──

  function init() {
    initSVG();
    setupScrollObserver();
    setupProgressBar();
    setupNav();
    setupSmoothScroll();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Rebuild SVG on resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      initSVG();
      currentStep = -1;
      // Re-trigger current step
      var activeStep = document.querySelector('.step.active');
      if (activeStep) {
        updateNetworkForStep(parseInt(activeStep.getAttribute('data-step'), 10));
      }
    }, 250);
  });

})();
