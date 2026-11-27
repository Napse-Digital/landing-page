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

  // Interactive orbital graph: small spheres orbit a central core, inspired by Obsidian's graph view.
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
      visual.removeAttribute('tabindex');
      visual.classList.remove('is-live');
      return;
    }

    renderer.setClearColor(0xFFFFFF, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.1 : 1.35));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
    camera.position.set(0, 0.22, 7.4);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0xFFFFFF, 0x305B4F, 1.8));
    const key = new THREE.PointLight(0xB2D6C9, 24, 12);
    key.position.set(-2.2, 3.4, 4);
    scene.add(key);
    const fill = new THREE.PointLight(0x348C6F, 17, 10);
    fill.position.set(2.8, -2, 1.4);
    scene.add(fill);

    const graph = new THREE.Group();
    scene.add(graph);

    const geometries = [];
    const materials = [];
    const trackGeometry = (geometry) => { geometries.push(geometry); return geometry; };
    const trackMaterial = (material) => { materials.push(material); return material; };

    const coreGeometry = trackGeometry(new THREE.IcosahedronGeometry(0.56, 2));
    const coreMaterial = trackMaterial(new THREE.MeshPhysicalMaterial({
      color: 0x305B4F,
      metalness: 0.34,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.12
    }));
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    graph.add(core);

    const coreEdges = new THREE.LineSegments(
      trackGeometry(new THREE.EdgesGeometry(coreGeometry)),
      trackMaterial(new THREE.LineBasicMaterial({ color: 0x9BC7B8, transparent: true, opacity: 0.27 }))
    );
    graph.add(coreEdges);

    const coreAura = new THREE.Mesh(
      trackGeometry(new THREE.SphereGeometry(0.76, 24, 24)),
      trackMaterial(new THREE.MeshBasicMaterial({ color: 0x6D9E8F, transparent: true, opacity: 0.075, depthWrite: false }))
    );
    graph.add(coreAura);

    const ringSpecs = [
      { radius: 1.45, x: 0.9, y: 0.18, z: -0.12 },
      { radius: 1.86, x: 0.28, y: 0.92, z: 0.22 },
      { radius: 2.12, x: 1.18, y: -0.38, z: 0.54 }
    ];
    const rings = ringSpecs.map((spec, index) => {
      const ring = new THREE.Mesh(
        trackGeometry(new THREE.TorusGeometry(spec.radius, 0.006, 6, 128)),
        trackMaterial(new THREE.MeshBasicMaterial({
          color: index === 1 ? 0x9BC7B8 : 0x6D9E8F,
          transparent: true,
          opacity: index === 1 ? 0.31 : 0.2,
          depthWrite: false
        }))
      );
      ring.rotation.set(spec.x, spec.y, spec.z);
      graph.add(ring);
      return ring;
    });

    const nodeGeometry = trackGeometry(new THREE.SphereGeometry(1, 20, 20));
    const nodeMaterials = [
      trackMaterial(new THREE.MeshPhysicalMaterial({
        color: 0xB2D6C9, metalness: 0.18, roughness: 0.22,
        clearcoat: 1, emissive: 0x1E443A, emissiveIntensity: 0.32
      })),
      trackMaterial(new THREE.MeshPhysicalMaterial({
        color: 0x6D9E8F, metalness: 0.22, roughness: 0.26,
        clearcoat: 0.85, emissive: 0x10201C, emissiveIntensity: 0.28
      }))
    ];
    const haloGeometry = trackGeometry(new THREE.SphereGeometry(1, 16, 16));
    const haloMaterial = trackMaterial(new THREE.MeshBasicMaterial({
      color: 0x9BC7B8, transparent: true, opacity: 0.09, depthWrite: false
    }));

    const nodeSpecs = [
      { radius: 1.43, phase: 0.1, speed: 0.22, tilt: [0.9, 0.18, 0.0], size: 0.105, material: 0 },
      { radius: 1.68, phase: 1.8, speed: -0.16, tilt: [0.25, 0.95, 0.25], size: 0.13, material: 1 },
      { radius: 1.9, phase: 3.05, speed: 0.13, tilt: [1.18, -0.32, 0.42], size: 0.095, material: 0 },
      { radius: 1.56, phase: 4.4, speed: -0.19, tilt: [0.6, -0.62, 0.8], size: 0.12, material: 1 },
      { radius: 2.08, phase: 5.35, speed: 0.1, tilt: [1.32, 0.42, -0.38], size: 0.1, material: 0 },
      { radius: 1.8, phase: 2.35, speed: -0.12, tilt: [0.42, 1.22, -0.25], size: 0.115, material: 1 }
    ];

    const nodes = nodeSpecs.map((spec) => {
      const sphere = new THREE.Mesh(nodeGeometry, nodeMaterials[spec.material]);
      sphere.scale.setScalar(spec.size);
      graph.add(sphere);

      const halo = new THREE.Mesh(haloGeometry, haloMaterial);
      halo.scale.setScalar(spec.size * 2.3);
      graph.add(halo);

      const linkPositions = new Float32Array(6);
      const linkGeometry = trackGeometry(new THREE.BufferGeometry());
      linkGeometry.setAttribute('position', new THREE.BufferAttribute(linkPositions, 3));
      const link = new THREE.Line(
        linkGeometry,
        trackMaterial(new THREE.LineBasicMaterial({
          color: 0x9BC7B8, transparent: true, opacity: 0.28, depthWrite: false
        }))
      );
      link.frustumCulled = false;
      graph.add(link);

      return {
        ...spec,
        plane: new THREE.Euler(spec.tilt[0], spec.tilt[1], spec.tilt[2]),
        sphere,
        halo,
        link,
        linkPositions
      };
    });

    const orbitPosition = (node, time) => {
      const angle = node.phase + time * node.speed;
      return new THREE.Vector3(
        Math.cos(angle) * node.radius,
        Math.sin(angle) * node.radius,
        Math.sin(angle * 0.72) * 0.12
      ).applyEuler(node.plane);
    };

    let width = 1;
    let height = 1;
    const resize = () => {
      const rect = visual.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      camera.aspect = width / height;
      camera.position.z = width < 520 ? 8.0 : 7.4;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderOnce();
    };

    let frame = 0;
    let active = false;
    let visible = !document.hidden;
    let dragging = false;
    let pointerId = null;
    let lastPointer = { x: 0, y: 0 };
    let targetRotation = { x: 0.08, y: 0 };
    let inertia = { x: 0, y: 0 };
    let elapsed = 0;

    const renderOnce = () => renderer.render(scene, camera);
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const onPointerDown = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      dragging = true;
      pointerId = event.pointerId;
      lastPointer = { x: event.clientX, y: event.clientY };
      visual.classList.add('is-dragging');
      visual.setPointerCapture?.(event.pointerId);
      stop();
    };

    const onPointerMove = (event) => {
      if (!dragging || event.pointerId !== pointerId) return;
      const dx = event.clientX - lastPointer.x;
      const dy = event.clientY - lastPointer.y;
      lastPointer = { x: event.clientX, y: event.clientY };
      targetRotation.y += dx * 0.006;
      targetRotation.x = clamp(targetRotation.x + dy * 0.004, -0.8, 0.8);
      inertia.y = dx * 0.0008;
      inertia.x = dy * 0.00055;
      graph.rotation.y = targetRotation.y;
      graph.rotation.x = targetRotation.x;
      renderOnce();
    };

    const endPointer = (event) => {
      if (!dragging || (event && event.pointerId !== pointerId)) return;
      dragging = false;
      pointerId = null;
      visual.classList.remove('is-dragging');
      if (event && visual.hasPointerCapture?.(event.pointerId)) {
        visual.releasePointerCapture(event.pointerId);
      }
      start();
    };

    const onKeyDown = (event) => {
      const step = 0.12;
      if (event.key === 'ArrowLeft') targetRotation.y -= step;
      else if (event.key === 'ArrowRight') targetRotation.y += step;
      else if (event.key === 'ArrowUp') targetRotation.x = clamp(targetRotation.x - step, -0.8, 0.8);
      else if (event.key === 'ArrowDown') targetRotation.x = clamp(targetRotation.x + step, -0.8, 0.8);
      else return;
      event.preventDefault();
      graph.rotation.x = targetRotation.x;
      graph.rotation.y = targetRotation.y;
      renderOnce();
    };

    visual.addEventListener('pointerdown', onPointerDown);
    visual.addEventListener('pointermove', onPointerMove);
    visual.addEventListener('pointerup', endPointer);
    visual.addEventListener('pointercancel', endPointer);
    visual.addEventListener('lostpointercapture', endPointer);
    visual.addEventListener('keydown', onKeyDown);

    const draw = () => {
      frame = 0;
      if (!active || !visible || dragging) return;

      const delta = Math.min(0.04, clock.getDelta());
      elapsed += delta;

      if (!reducedMotion.matches) {
        inertia.x *= 0.94;
        inertia.y *= 0.94;
        targetRotation.x = clamp(targetRotation.x + inertia.x, -0.8, 0.8);
        targetRotation.y += inertia.y + delta * 0.065;
        graph.rotation.x += (targetRotation.x - graph.rotation.x) * 0.09;
        graph.rotation.y += (targetRotation.y - graph.rotation.y) * 0.09;

        core.rotation.y += delta * 0.18;
        core.rotation.x = Math.sin(elapsed * 0.28) * 0.06;
        coreEdges.rotation.copy(core.rotation);
        rings.forEach((ring, index) => {
          ring.rotation.z += delta * (index % 2 ? -0.018 : 0.014);
          ring.rotation.y += delta * (index % 2 ? 0.012 : -0.01);
        });
      }

      nodes.forEach((node) => {
        const point = orbitPosition(node, elapsed);
        node.sphere.position.copy(point);
        node.halo.position.copy(point);
        const positions = node.link.geometry.attributes.position;
        positions.setXYZ(0, 0, 0, 0);
        positions.setXYZ(1, point.x, point.y, point.z);
        positions.needsUpdate = true;
      });

      renderer.render(scene, camera);
      if (!reducedMotion.matches) frame = window.requestAnimationFrame(draw);
    };

    const clock = new THREE.Clock();
    const start = () => {
      if (!active || !visible || dragging) return;
      if (reducedMotion.matches) {
        renderOnce();
        return;
      }
      if (!frame) {
        clock.getDelta();
        frame = window.requestAnimationFrame(draw);
      }
    };
    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    resize();
    visual.classList.add('is-live');
    visual.setAttribute('aria-label', 'Diagrama 3D interativo. Arraste com o mouse ou o dedo para girar; use as setas do teclado quando o diagrama estiver selecionado.');

    const observer = new IntersectionObserver((entries) => {
      active = Boolean(entries[0]?.isIntersecting);
      if (active) start();
      else stop();
    }, { threshold: 0.08 });
    observer.observe(visual);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(visual);

    const onVisibilityChange = () => {
      visible = !document.hidden;
      if (visible) start();
      else stop();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const onMotionChange = (event) => {
      if (event.matches) {
        stop();
        renderOnce();
      } else {
        start();
      }
    };
    reducedMotion.addEventListener?.('change', onMotionChange);

    window.addEventListener('pagehide', () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      reducedMotion.removeEventListener?.('change', onMotionChange);
      visual.removeEventListener('pointerdown', onPointerDown);
      visual.removeEventListener('pointermove', onPointerMove);
      visual.removeEventListener('pointerup', endPointer);
      visual.removeEventListener('pointercancel', endPointer);
      visual.removeEventListener('lostpointercapture', endPointer);
      visual.removeEventListener('keydown', onKeyDown);
      renderer.dispose();
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
    }, { once: true });
  }).catch(() => {
    // Keep the SVG graph visible if WebGL or the Three.js module is unavailable.
    canvas.hidden = true;
    visual.removeAttribute('tabindex');
  });
})();