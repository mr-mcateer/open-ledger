/* ============================================
   POWER NETWORKS — Interactive Application
   Navigation, network visualization, animations
   ============================================ */

(function () {
  'use strict';

  // --- NAVIGATION ---
  const nav = document.getElementById('main-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const allNavAnchors = document.querySelectorAll('.nav-links a');

  // Sticky nav scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 50);
    lastScroll = scrollY;
  }, { passive: true });

  // Mobile toggle
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Close mobile nav on link click
  allNavAnchors.forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Active nav highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = { rootMargin: '-20% 0px -70% 0px' };

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        allNavAnchors.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, observerOptions);

  sections.forEach(function (s) { sectionObserver.observe(s); });

  // --- SCROLL ANIMATIONS ---
  const fadeElements = document.querySelectorAll(
    '.family-block, .person-card, .evidence-card, .system-card, .insight-box, .data-table-wrapper, .quote-box, .timeline-box, .pipeline-step'
  );

  fadeElements.forEach(function (el) { el.classList.add('fade-in'); });

  const fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  fadeElements.forEach(function (el) { fadeObserver.observe(el); });

  // --- NETWORK VISUALIZATION (SVG) ---
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;

  const nodes = [
    // Families (gold)
    { id: 'rockefeller', label: 'Rockefeller', type: 'family', x: 0.18, y: 0.2 },
    { id: 'rothschild', label: 'Rothschild', type: 'family', x: 0.82, y: 0.2 },
    { id: 'saud', label: 'House of Saud', type: 'family', x: 0.15, y: 0.75 },
    { id: 'koch', label: 'Koch', type: 'family', x: 0.85, y: 0.75 },
    { id: 'walton', label: 'Walton', type: 'family', x: 0.88, y: 0.52 },

    // Institutions (blue)
    { id: 'cfr', label: 'CFR', type: 'institution', x: 0.28, y: 0.12 },
    { id: 'trilateral', label: 'Trilateral Commission', type: 'institution', x: 0.32, y: 0.28 },
    { id: 'fedsoc', label: 'Federalist Society', type: 'institution', x: 0.78, y: 0.62 },
    { id: 'sc', label: 'Sullivan & Cromwell', type: 'institution', x: 0.35, y: 0.55 },
    { id: 'sec', label: 'SEC', type: 'institution', x: 0.55, y: 0.65 },
    { id: 'sdny', label: 'SDNY', type: 'institution', x: 0.6, y: 0.78 },

    // Banks (green)
    { id: 'apollo', label: 'Apollo Global', type: 'bank', x: 0.5, y: 0.35 },
    { id: 'drexel', label: 'Drexel Burnham', type: 'bank', x: 0.65, y: 0.25 },
    { id: 'creditlyonnais', label: 'Crédit Lyonnais', type: 'bank', x: 0.55, y: 0.15 },
    { id: 'bcci', label: 'BCCI', type: 'bank', x: 0.25, y: 0.65 },
    { id: 'deutsche', label: 'Deutsche Bank', type: 'bank', x: 0.7, y: 0.42 },

    // Operatives (red)
    { id: 'epstein', label: 'Epstein', type: 'operative', x: 0.42, y: 0.45 },
    { id: 'black', label: 'Leon Black', type: 'operative', x: 0.58, y: 0.45 },
    { id: 'clayton', label: 'Jay Clayton', type: 'operative', x: 0.48, y: 0.7 },
    { id: 'krongard', label: 'Buzzy Krongard', type: 'operative', x: 0.62, y: 0.55 },
    { id: 'bannon', label: 'Bannon', type: 'operative', x: 0.35, y: 0.82 },
    { id: 'dulles', label: 'Dulles Brothers', type: 'operative', x: 0.22, y: 0.45 },
    { id: 'maxwell', label: 'R. Maxwell', type: 'operative', x: 0.68, y: 0.12 },
    { id: 'boesky', label: 'Boesky', type: 'operative', x: 0.75, y: 0.32 },
    { id: 'leo', label: 'Leonard Leo', type: 'operative', x: 0.82, y: 0.88 },
  ];

  const edges = [
    // Rockefeller connections
    { from: 'rockefeller', to: 'cfr', label: 'founded' },
    { from: 'rockefeller', to: 'trilateral', label: 'founded' },
    { from: 'rockefeller', to: 'epstein', label: 'recruited' },

    // Rothschild connections
    { from: 'rothschild', to: 'boesky', label: 'L.F. Rothschild' },

    // Epstein connections
    { from: 'epstein', to: 'black', label: '$170M' },
    { from: 'epstein', to: 'apollo', label: 'power of attorney' },
    { from: 'epstein', to: 'trilateral', label: 'member' },
    { from: 'epstein', to: 'saud', label: 'in files' },
    { from: 'epstein', to: 'bannon', label: 'texting 2018' },
    { from: 'epstein', to: 'deutsche', label: 'banked' },

    // Apollo connections
    { from: 'black', to: 'apollo', label: 'co-founded' },
    { from: 'apollo', to: 'drexel', label: 'grew from' },
    { from: 'apollo', to: 'krongard', label: 'board' },
    { from: 'apollo', to: 'clayton', label: 'chairman' },
    { from: 'creditlyonnais', to: 'apollo', label: 'founding capital' },

    // Drexel/Boesky chain
    { from: 'boesky', to: 'drexel', label: 'daily calls' },
    { from: 'drexel', to: 'bcci', label: 'money mixed' },

    // Maxwell / Credit Lyonnais
    { from: 'maxwell', to: 'creditlyonnais', label: '600 shells' },

    // Dulles / S&C
    { from: 'dulles', to: 'sc', label: 'partners' },
    { from: 'sc', to: 'clayton', label: 'employed' },
    { from: 'dulles', to: 'rockefeller', label: 'represented' },

    // Clayton path
    { from: 'clayton', to: 'sec', label: 'ran SEC' },
    { from: 'clayton', to: 'sdny', label: 'appointed 2025' },
    { from: 'clayton', to: 'deutsche', label: 'represented' },

    // Krongard
    { from: 'krongard', to: 'deutsche', label: 'Alex Brown→DB' },

    // BCCI
    { from: 'bcci', to: 'saud', label: 'Al Nahyan origins' },

    // Koch
    { from: 'koch', to: 'fedsoc', label: '$20M+' },
    { from: 'leo', to: 'fedsoc', label: 'runs' },
    { from: 'koch', to: 'leo', label: 'funds' },

    // Bannon
    { from: 'bannon', to: 'creditlyonnais', label: 'received money' },
  ];

  function buildNetwork() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const padX = 60;
    const padY = 40;

    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.style.display = 'block';

    // Defs for glow
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'glow');
    const feGaussian = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussian.setAttribute('stdDeviation', '3');
    feGaussian.setAttribute('result', 'glow');
    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'glow');
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feGaussian);
    filter.appendChild(feMerge);
    defs.appendChild(filter);
    svg.appendChild(defs);

    // Position nodes
    const nodePositions = {};
    nodes.forEach(function (n) {
      nodePositions[n.id] = {
        x: padX + n.x * (w - padX * 2),
        y: padY + n.y * (h - padY * 2)
      };
    });

    // Draw edges
    const edgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    edgeGroup.setAttribute('class', 'edges');
    edges.forEach(function (e) {
      var from = nodePositions[e.from];
      var to = nodePositions[e.to];
      if (!from || !to) return;

      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', from.x);
      line.setAttribute('y1', from.y);
      line.setAttribute('x2', to.x);
      line.setAttribute('y2', to.y);
      line.setAttribute('stroke', 'rgba(148,163,184,0.12)');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('data-from', e.from);
      line.setAttribute('data-to', e.to);
      edgeGroup.appendChild(line);

      // Edge label (midpoint)
      if (e.label) {
        var midX = (from.x + to.x) / 2;
        var midY = (from.y + to.y) / 2;
        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', midX);
        text.setAttribute('y', midY - 4);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'rgba(148,163,184,0.3)');
        text.setAttribute('font-size', '9');
        text.setAttribute('font-family', 'Inter, sans-serif');
        text.setAttribute('data-from', e.from);
        text.setAttribute('data-to', e.to);
        text.textContent = e.label;
        edgeGroup.appendChild(text);
      }
    });
    svg.appendChild(edgeGroup);

    // Draw nodes
    var colors = {
      family: '#f59e0b',
      institution: '#3b82f6',
      operative: '#ef4444',
      bank: '#22c55e'
    };

    var sizes = {
      family: 18,
      institution: 12,
      operative: 10,
      bank: 14
    };

    var nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodeGroup.setAttribute('class', 'nodes');

    nodes.forEach(function (n) {
      var pos = nodePositions[n.id];
      var color = colors[n.type];
      var r = sizes[n.type];

      // Outer glow
      var outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      outerCircle.setAttribute('cx', pos.x);
      outerCircle.setAttribute('cy', pos.y);
      outerCircle.setAttribute('r', r + 4);
      outerCircle.setAttribute('fill', color);
      outerCircle.setAttribute('opacity', '0.1');
      outerCircle.setAttribute('data-node', n.id);
      nodeGroup.appendChild(outerCircle);

      // Main circle
      var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', pos.x);
      circle.setAttribute('cy', pos.y);
      circle.setAttribute('r', r);
      circle.setAttribute('fill', color);
      circle.setAttribute('opacity', '0.85');
      circle.setAttribute('cursor', 'pointer');
      circle.setAttribute('data-node', n.id);
      circle.setAttribute('filter', 'url(#glow)');
      nodeGroup.appendChild(circle);

      // Label
      var label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', pos.x);
      label.setAttribute('y', pos.y + r + 14);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('fill', '#e2e8f0');
      label.setAttribute('font-size', '11');
      label.setAttribute('font-family', 'Inter, sans-serif');
      label.setAttribute('font-weight', '600');
      label.setAttribute('cursor', 'pointer');
      label.setAttribute('data-node', n.id);
      label.textContent = n.label;
      nodeGroup.appendChild(label);
    });
    svg.appendChild(nodeGroup);

    canvas.innerHTML = '';
    canvas.appendChild(svg);

    // --- INTERACTIVITY ---
    var activeNode = null;

    function highlightNode(nodeId) {
      if (activeNode === nodeId) {
        resetHighlight();
        activeNode = null;
        return;
      }
      activeNode = nodeId;

      // Find connected edges
      var connectedNodes = new Set();
      connectedNodes.add(nodeId);

      var allLines = svg.querySelectorAll('.edges line');
      var allEdgeLabels = svg.querySelectorAll('.edges text');
      var allCircles = svg.querySelectorAll('.nodes circle');
      var allLabels = svg.querySelectorAll('.nodes text');

      allLines.forEach(function (line) {
        var from = line.getAttribute('data-from');
        var to = line.getAttribute('data-to');
        if (from === nodeId || to === nodeId) {
          line.setAttribute('stroke', 'rgba(245,158,11,0.6)');
          line.setAttribute('stroke-width', '2');
          connectedNodes.add(from);
          connectedNodes.add(to);
        } else {
          line.setAttribute('stroke', 'rgba(148,163,184,0.04)');
          line.setAttribute('stroke-width', '1');
        }
      });

      allEdgeLabels.forEach(function (t) {
        var from = t.getAttribute('data-from');
        var to = t.getAttribute('data-to');
        if (from === nodeId || to === nodeId) {
          t.setAttribute('fill', 'rgba(245,158,11,0.8)');
          t.setAttribute('font-size', '10');
        } else {
          t.setAttribute('fill', 'rgba(148,163,184,0.1)');
        }
      });

      allCircles.forEach(function (c) {
        var nid = c.getAttribute('data-node');
        if (connectedNodes.has(nid)) {
          c.setAttribute('opacity', '1');
        } else {
          c.setAttribute('opacity', '0.15');
        }
      });

      allLabels.forEach(function (l) {
        var nid = l.getAttribute('data-node');
        if (connectedNodes.has(nid)) {
          l.setAttribute('fill', '#f1f5f9');
          l.setAttribute('font-weight', '700');
        } else {
          l.setAttribute('fill', 'rgba(148,163,184,0.2)');
          l.setAttribute('font-weight', '400');
        }
      });
    }

    function resetHighlight() {
      var allLines = svg.querySelectorAll('.edges line');
      var allEdgeLabels = svg.querySelectorAll('.edges text');
      var allCircles = svg.querySelectorAll('.nodes circle');
      var allLabels = svg.querySelectorAll('.nodes text');

      allLines.forEach(function (line) {
        line.setAttribute('stroke', 'rgba(148,163,184,0.12)');
        line.setAttribute('stroke-width', '1');
      });

      allEdgeLabels.forEach(function (t) {
        t.setAttribute('fill', 'rgba(148,163,184,0.3)');
        t.setAttribute('font-size', '9');
      });

      allCircles.forEach(function (c) {
        c.setAttribute('opacity', c.getAttribute('r') > 6 ? '0.85' : '0.1');
      });

      allLabels.forEach(function (l) {
        l.setAttribute('fill', '#e2e8f0');
        l.setAttribute('font-weight', '600');
      });
    }

    svg.addEventListener('click', function (evt) {
      var target = evt.target;
      var nodeId = target.getAttribute('data-node');
      if (nodeId) {
        highlightNode(nodeId);
      } else if (target.tagName === 'svg' || target.tagName === 'g') {
        resetHighlight();
        activeNode = null;
      }
    });

    // Hover effects
    svg.addEventListener('mouseover', function (evt) {
      var nodeId = evt.target.getAttribute('data-node');
      if (nodeId && !activeNode) {
        evt.target.style.transition = 'opacity 0.15s';
      }
    });
  }

  // Build on load and resize
  buildNetwork();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildNetwork, 200);
  });

  // --- SMOOTH SCROLL for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = nav.offsetHeight + 20;
        var y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

})();
