(() => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-menu');
  const year = document.querySelector('#current-year');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (year) year.textContent = String(new Date().getFullYear());

  if (toggle && menu) {
    const setMenuOpen = (open, { restoreFocus = false } = {}) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      menu.hidden = !open;
      document.body.classList.toggle('menu-open', open);
      if (restoreFocus) toggle.focus();
      else if (open) menu.querySelector('a')?.focus();
    };

    toggle.addEventListener('click', () => {
      setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false, { restoreFocus: true });
      }
    });
    document.addEventListener('pointerdown', (event) => {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (!menu.contains(event.target) && !toggle.contains(event.target)) setMenuOpen(false);
    });
    const closeOnDesktop = window.matchMedia('(min-width: 901px)');
    closeOnDesktop.addEventListener?.('change', (event) => {
      if (event.matches) setMenuOpen(false);
    });
  }

  // Progressive reveal: content stays visible when JS/IntersectionObserver is unavailable.
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    const revealSelectors = [
      '.hero-copy', '.hero-visual', '.context-layout', '.signal',
      '.section-heading', '.capability-item', '.section-heading-process',
      '.process-step', '.engineering-copy', '.architecture-visual',
      '.evolution-heading', '.evolution-step', '.responsibility-heading',
      '.responsibility-column', '.faq-heading', '.faq-item', '.final-cta-inner'
    ];
    const revealTargets = [...new Set(revealSelectors.flatMap((selector) => [...document.querySelectorAll(selector)]))];
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    revealTargets.forEach((element, index) => {
      element.classList.add('reveal');
      element.style.setProperty('--reveal-delay', String((index % 4) * 65) + 'ms');
      revealObserver.observe(element);
    });
  }

  // One purposeful Three.js scene in the architecture diagram; CSS remains the fallback.
  const canvas = document.querySelector('#architecture-canvas');
  const visual = canvas?.closest('.architecture-visual');
  if (!canvas || !visual) return;

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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
    camera.position.set(0, 0, 5.25);

    scene.add(new THREE.HemisphereLight(0xFFFFFF, 0x1E443A, 2.0));
    const keyLight = new THREE.PointLight(0xB2D6C9, 30, 12);
    keyLight.position.set(-2.2, 2.4, 3.2);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x348C6F, 34, 10);
    rimLight.position.set(2.3, -1.5, -1.5);
    scene.add(rimLight);

    const objectGroup = new THREE.Group();
    scene.add(objectGroup);

    const crystalGeometry = new THREE.IcosahedronGeometry(0.96, 2);
    const crystal = new THREE.Mesh(
      crystalGeometry,
      new THREE.MeshPhysicalMaterial({
        color: 0x9BC7B8,
        metalness: 0.42,
        roughness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        emissive: 0x1E443A,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.78
      })
    );
    objectGroup.add(crystal);

    const edgeLines = new THREE.LineSegments(
      new THREE.EdgesGeometry(crystalGeometry),
      new THREE.LineBasicMaterial({ color: 0xB2D6C9, transparent: true, opacity: 0.52 })
    );
    objectGroup.add(edgeLines);

    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x6D9E8F, transparent: true, opacity: 0.54 });
    const ringOne = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.012, 8, 112), ringMaterial);
    ringOne.rotation.set(0.9, 0.2, 0.2);
    objectGroup.add(ringOne);
    const ringTwo = new THREE.Mesh(
      new THREE.TorusGeometry(1.22, 0.008, 8, 112),
      new THREE.MeshBasicMaterial({ color: 0xB2D6C9, transparent: true, opacity: 0.42 })
    );
    ringTwo.rotation.set(0.12, 1.12, 0.72);
    objectGroup.add(ringTwo);

    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0xB2D6C9,
      emissive: 0x348C6F,
      emissiveIntensity: 0.55,
      roughness: 0.3,
      metalness: 0.2
    });
    const nodePositions = [
      [0, 1.72, 0], [1.52, 0.76, 0.18], [1.42, -0.96, -0.12],
      [0, -1.72, 0], [-1.5, -0.78, 0.12], [-1.48, 0.82, -0.16]
    ];
    nodePositions.forEach((position) => {
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), nodeMaterial);
      node.position.set(position[0], position[1], position[2]);
      objectGroup.add(node);
      const points = [new THREE.Vector3(0, 0, 0), node.position.clone()];
      const connector = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: 0x9BC7B8, transparent: true, opacity: 0.34 })
      );
      objectGroup.add(connector);
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
      renderer.setSize(width, height, false);
      renderer.render(scene, camera);
    };

    renderer.setClearColor(0x000000, 0);
    resize();
    visual.classList.add('is-webgl');

    let frame = 0;
    let active = false;
    let pageVisible = !document.hidden;

    const draw = (time) => {
      if (!active || !pageVisible || reducedMotion.matches) {
        frame = 0;
        renderer.render(scene, camera);
        return;
      }
      const seconds = time * 0.00018;
      objectGroup.rotation.y = seconds;
      objectGroup.rotation.x = Math.sin(seconds * 0.7) * 0.11;
      ringOne.rotation.z = 0.9 + seconds * 0.23;
      ringTwo.rotation.x = 0.12 + seconds * 0.17;
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(draw);
    };

    const start = () => {
      if (reducedMotion.matches) {
        renderer.render(scene, camera);
        return;
      }
      if (!frame && active && pageVisible) frame = window.requestAnimationFrame(draw);
    };
    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const sceneObserver = new IntersectionObserver((observations) => {
      active = Boolean(observations[0]?.isIntersecting);
      if (active) start();
      else stop();
    }, { threshold: 0.08 });
    sceneObserver.observe(visual);

    document.addEventListener('visibilitychange', () => {
      pageVisible = !document.hidden;
      if (pageVisible) start();
      else stop();
    });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(visual);

    window.addEventListener('pagehide', () => {
      stop();
      sceneObserver.disconnect();
      resizeObserver.disconnect();
      renderer.dispose();
      crystalGeometry.dispose();
      crystal.material.dispose();
      edgeLines.geometry.dispose();
      edgeLines.material.dispose();
      ringOne.geometry.dispose();
      ringTwo.geometry.dispose();
      ringMaterial.dispose();
      ringTwo.material.dispose();
      nodeMaterial.dispose();
    }, { once: true });
  }).catch(() => {
    canvas.hidden = true;
  });
})();