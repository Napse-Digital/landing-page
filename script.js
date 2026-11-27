(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const year = document.querySelector('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Accessible mobile navigation: predictable focus and dismissal.
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-menu');
  if (toggle && menu) {
    const firstLink = menu.querySelector('a');
    const setMenu = (open, restoreFocus = false) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      menu.hidden = !open;
      document.body.classList.toggle('menu-open', open);
      if (open) firstLink?.focus();
      if (!open && restoreFocus) toggle.focus();
    };
    toggle.addEventListener('click', () => {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });
    document.addEventListener('keydown', (event) => {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (event.key === 'Escape') {
        setMenu(false, true);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...menu.querySelectorAll('a[href], button:not([disabled])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !menu.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    document.addEventListener('pointerdown', (event) => {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (!menu.contains(event.target) && !toggle.contains(event.target)) setMenu(false);
    });
    window.matchMedia('(min-width: 901px)').addEventListener?.('change', (event) => {
      if (event.matches) setMenu(false);
    });
  }

  // Reveal content progressively. Without JS or IntersectionObserver, everything stays visible.
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    const targets = [...document.querySelectorAll('[data-reveal]')];
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
    targets.forEach((element, index) => {
      element.classList.add('reveal');
      element.style.setProperty('--reveal-delay', String((index % 3) * 45) + 'ms');
      observer.observe(element);
    });
  }

  // Architecture orbit is rendered with semantic HTML and SVG; no WebGL dependency.
// One conceptual 3D flow illustration. The SVG remains the fallback.
  const canvas = document.querySelector('#architecture-canvas');
  const visual = document.querySelector('[data-architecture-visual]');
  if (!canvas || !visual || !('WebGLRenderingContext' in window)) return;

  const threeUrl = 'https://cdn.jsdelivr.net/npm/three@0.187.0/build/three.module.js';
  import(threeUrl).then((THREE) => {
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'low-power'
      });
    } catch {
      canvas.hidden = true;
      return;
    }

    renderer.setClearColor(0xFFFFFF, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.1 : 1.35));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 30);
    camera.position.set(0, 1.35, 7.3);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0xFFFFFF, 0x305B4F, 2.0));
    const key = new THREE.PointLight(0xB2D6C9, 26, 12);
    key.position.set(-2.2, 3.4, 4);
    scene.add(key);
    const fill = new THREE.PointLight(0x348C6F, 18, 10);
    fill.position.set(2.8, -2, 1.4);
    scene.add(fill);

    const flow = new THREE.Group();
    scene.add(flow);
    const disposableGeometries = [];
    const disposableMaterials = [];
    const trackGeometry = (geometry) => { disposableGeometries.push(geometry); return geometry; };
    const trackMaterial = (material) => { disposableMaterials.push(material); return material; };

    const coreGeometry = trackGeometry(new THREE.IcosahedronGeometry(0.62, 2));
    const core = new THREE.Mesh(
      coreGeometry,
      trackMaterial(new THREE.MeshPhysicalMaterial({
        color: 0x305B4F,
        metalness: 0.42,
        roughness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.94
      }))
    );
    flow.add(core);

    const coreEdges = new THREE.LineSegments(
      trackGeometry(new THREE.EdgesGeometry(coreGeometry)),
      trackMaterial(new THREE.LineBasicMaterial({ color: 0x6D9E8F, transparent: true, opacity: 0.62 }))
    );
    flow.add(coreEdges);

    const ring = new THREE.Mesh(
      trackGeometry(new THREE.TorusGeometry(0.94, 0.012, 8, 100)),
      trackMaterial(new THREE.MeshBasicMaterial({ color: 0x6D9E8F, transparent: true, opacity: 0.55 }))
    );
    ring.rotation.set(0.88, 0.2, 0.25);
    flow.add(ring);

    const systemMaterial = trackMaterial(new THREE.MeshPhysicalMaterial({
      color: 0x9BC7B8,
      metalness: 0.24,
      roughness: 0.23,
      clearcoat: 1,
      transparent: true,
      opacity: 0.72
    }));
    const toolMaterial = trackMaterial(new THREE.MeshPhysicalMaterial({
      color: 0x556A65,
      metalness: 0.35,
      roughness: 0.28,
      clearcoat: 0.7,
      transparent: true,
      opacity: 0.85
    }));

    const inputPositions = [
      new THREE.Vector3(-2.25, 0.78, 0.1),
      new THREE.Vector3(-2.25, -0.78, -0.1)
    ];
    const outputPositions = [
      new THREE.Vector3(2.25, 0.78, -0.1),
      new THREE.Vector3(2.25, -0.78, 0.1)
    ];

    function addNode(position, material, size, shape) {
      const geometry = trackGeometry(shape === 'box'
        ? new THREE.BoxGeometry(size, size, size)
        : new THREE.OctahedronGeometry(size * 0.68, 1));
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      mesh.rotation.set(0.22, 0.38, 0.12);
      flow.add(mesh);
      const edges = new THREE.LineSegments(
        trackGeometry(new THREE.EdgesGeometry(geometry)),
        trackMaterial(new THREE.LineBasicMaterial({ color: 0x348C6F, transparent: true, opacity: 0.52 }))
      );
      edges.position.copy(position);
      edges.rotation.copy(mesh.rotation);
      flow.add(edges);
    }

    inputPositions.forEach((position) => addNode(position, systemMaterial, 0.42, 'box'));
    outputPositions.forEach((position) => addNode(position, toolMaterial, 0.42, 'octa'));

    function makeCurve(start, end, height) {
      return new THREE.CatmullRomCurve3([
        start,
        new THREE.Vector3(start.x * 0.48, height, 0.15),
        new THREE.Vector3(end.x * 0.48, height * 0.82, 0.15),
        end
      ]);
    }

    const curves = [
      makeCurve(inputPositions[0], new THREE.Vector3(-0.3, 0.17, 0.05), 1.2),
      makeCurve(inputPositions[1], new THREE.Vector3(-0.3, -0.17, 0.05), -1.2),
      makeCurve(new THREE.Vector3(0.3, 0.17, 0.05), outputPositions[0], 1.12),
      makeCurve(new THREE.Vector3(0.3, -0.17, 0.05), outputPositions[1], -1.12)
    ];

    curves.forEach((curve) => {
      const tube = new THREE.Mesh(
        trackGeometry(new THREE.TubeGeometry(curve, 56, 0.012, 7, false)),
        trackMaterial(new THREE.MeshBasicMaterial({ color: 0x6D9E8F, transparent: true, opacity: 0.52 }))
      );
      flow.add(tube);
    });

    const particleMaterial = trackMaterial(new THREE.MeshBasicMaterial({ color: 0x348C6F }));
    const particles = curves.map((curve, index) => {
      const geometry = trackGeometry(new THREE.SphereGeometry(0.045, 12, 12));
      const mesh = new THREE.Mesh(geometry, particleMaterial);
      flow.add(mesh);
      return { mesh, curve, offset: index * 0.24 };
    });

    const resize = () => {
      const rect = visual.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.render(scene, camera);
    };

    resize();
    visual.classList.add('is-live');

    let frame = 0;
    let active = false;
    let visible = !document.hidden;
    let time = 0;
    const renderStatic = () => renderer.render(scene, camera);

    const draw = () => {
      if (!active || !visible || reducedMotion.matches) {
        frame = 0;
        renderStatic();
        return;
      }
      time += 0.0038;
      flow.rotation.y = Math.sin(time * 0.6) * 0.075;
      core.rotation.y = time * 0.16;
      ring.rotation.z = 0.25 + time * 0.08;
      particles.forEach(({ mesh, curve, offset }) => {
        const progress = (time * 0.16 + offset) % 1;
        mesh.position.copy(curve.getPointAt(progress));
      });
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(draw);
    };

    const start = () => {
      if (reducedMotion.matches) {
        renderStatic();
        return;
      }
      if (active && visible && !frame) frame = window.requestAnimationFrame(draw);
    };
    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const observer = new IntersectionObserver((entries) => {
      active = Boolean(entries[0]?.isIntersecting);
      if (active) start();
      else stop();
    }, { threshold: 0.08 });
    observer.observe(visual);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(visual);

    document.addEventListener('visibilitychange', () => {
      visible = !document.hidden;
      if (visible) start();
      else stop();
    });

    reducedMotion.addEventListener?.('change', (event) => {
      if (event.matches) {
        stop();
        renderStatic();
      } else {
        start();
      }
    });

    window.addEventListener('pagehide', () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      renderer.dispose();
      disposableGeometries.forEach((geometry) => geometry.dispose());
      disposableMaterials.forEach((material) => material.dispose());
    }, { once: true });
  }).catch(() => {
    // The semantic SVG stays available when the module/CDN or WebGL is unavailable.
    canvas.hidden = true;
  });
})();
