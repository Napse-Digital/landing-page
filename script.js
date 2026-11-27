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

  // Orbital graph: pointer position subtly adjusts perspective and light; no click or drag.
  const canvas = document.querySelector('#architecture-canvas');
  const visual = document.querySelector('[data-architecture-visual]');
  if (!canvas || !visual || !('WebGLRenderingContext' in window)) return;
  const threeUrl = 'https://cdn.jsdelivr.net/npm/three@0.187.0/build/three.module.js';

  import(threeUrl).then((THREE) => {
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
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
    camera.position.set(0, 0.18, 7.5);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0xFFFFFF, 0x305B4F, 1.75));

    const key = new THREE.PointLight(0xB2D6C9, 21, 12);
    key.position.set(-2.2, 3.4, 4);
    scene.add(key);
    const fill = new THREE.PointLight(0x348C6F, 15, 10);
    fill.position.set(2.8, -2, 1.4);
    scene.add(fill);
    const pointerLight = new THREE.PointLight(0x9BC7B8, 4.2, 5.5);
    pointerLight.position.set(0, 0, 3.4);
    scene.add(pointerLight);

    const graph = new THREE.Group();
    scene.add(graph);
    const geometries = [];
    const materials = [];
    const geo = (value) => { geometries.push(value); return value; };
    const mat = (value) => { materials.push(value); return value; };

    const coreGeometry = geo(new THREE.IcosahedronGeometry(0.56, 2));
    const core = new THREE.Mesh(coreGeometry, mat(new THREE.MeshPhysicalMaterial({
      color: 0x305B4F, metalness: 0.34, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.12
    })));
    graph.add(core);
    const coreEdges = new THREE.LineSegments(
      geo(new THREE.EdgesGeometry(coreGeometry)),
      mat(new THREE.LineBasicMaterial({ color: 0x9BC7B8, transparent: true, opacity: 0.24 }))
    );
    graph.add(coreEdges);
    graph.add(new THREE.Mesh(
      geo(new THREE.SphereGeometry(0.78, 24, 24)),
      mat(new THREE.MeshBasicMaterial({ color: 0x6D9E8F, transparent: true, opacity: 0.055, depthWrite: false }))
    ));

    const orbitSpecs = [
      { radius: 1.42, rotation: [0.86, 0.18, -0.08], color: 0x9BC7B8, opacity: 0.24 },
      { radius: 1.82, rotation: [0.24, 0.9, 0.22], color: 0x6D9E8F, opacity: 0.19 },
      { radius: 2.12, rotation: [1.12, -0.34, 0.5], color: 0x9BC7B8, opacity: 0.14 }
    ];
    const orbits = orbitSpecs.map((spec) => {
      const orbit = new THREE.Mesh(
        geo(new THREE.TorusGeometry(spec.radius, 0.006, 6, 128)),
        mat(new THREE.MeshBasicMaterial({ color: spec.color, transparent: true, opacity: spec.opacity, depthWrite: false }))
      );
      orbit.rotation.set(spec.rotation[0], spec.rotation[1], spec.rotation[2]);
      graph.add(orbit);
      return orbit;
    });

    const sphereGeometry = geo(new THREE.SphereGeometry(1, 20, 20));
    const sphereMaterials = [
      mat(new THREE.MeshPhysicalMaterial({ color: 0xB2D6C9, metalness: 0.16, roughness: 0.2, clearcoat: 1, emissive: 0x1E443A, emissiveIntensity: 0.26 })),
      mat(new THREE.MeshPhysicalMaterial({ color: 0x6D9E8F, metalness: 0.2, roughness: 0.24, clearcoat: 0.85, emissive: 0x10201C, emissiveIntensity: 0.22 }))
    ];
    const haloGeometry = geo(new THREE.SphereGeometry(1, 16, 16));
    const haloMaterial = mat(new THREE.MeshBasicMaterial({ color: 0x9BC7B8, transparent: true, opacity: 0.075, depthWrite: false }));

    const specs = [
      [1.38,0.1,0.2,[0.86,0.18,0],0.105,0],
      [1.64,1.8,-0.15,[0.25,0.95,0.25],0.13,1],
      [1.92,3.05,0.12,[1.18,-0.32,0.42],0.095,0],
      [1.52,4.4,-0.17,[0.6,-0.62,0.8],0.12,1],
      [2.08,5.35,0.1,[1.32,0.42,-0.38],0.1,0],
      [1.78,2.35,-0.11,[0.42,1.22,-0.25],0.115,1],
      [1.7,0.86,0.14,[1,-0.3,0.55],0.085,0],
      [2,4.98,-0.085,[0.42,0.74,-0.7],0.09,1]
    ];
    const nodes = specs.map((item) => {
      const [radius,phase,speed,rotation,size,material] = item;
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterials[material]);
      sphere.scale.setScalar(size);
      graph.add(sphere);
      const halo = new THREE.Mesh(haloGeometry, haloMaterial);
      halo.scale.setScalar(size * 2.1);
      graph.add(halo);
      const buffer = geo(new THREE.BufferGeometry());
      buffer.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
      const line = new THREE.Line(buffer, mat(new THREE.LineBasicMaterial({
        color: 0x9BC7B8, transparent: true, opacity: 0.22, depthWrite: false
      })));
      line.frustumCulled = false;
      graph.add(line);
      return { radius, phase, speed, plane: new THREE.Euler(rotation[0],rotation[1],rotation[2]), sphere, halo, line };
    });

    const clamp = (value,min,max) => Math.min(max,Math.max(min,value));
    let elapsed = 0;
    const updateNodes = (time) => {
      nodes.forEach((node) => {
        const angle = node.phase + time * node.speed;
        const point = new THREE.Vector3(
          Math.cos(angle) * node.radius,
          Math.sin(angle) * node.radius,
          Math.sin(angle * 0.72) * 0.12
        ).applyEuler(node.plane);
        node.sphere.position.copy(point);
        node.halo.position.copy(point);
        const position = node.line.geometry.attributes.position;
        position.setXYZ(0,0,0,0);
        position.setXYZ(1,point.x,point.y,point.z);
        position.needsUpdate = true;
      });
    };

    let width = 1;
    let height = 1;
    const render = () => renderer.render(scene,camera);
    const resize = () => {
      const rect = visual.getBoundingClientRect();
      width = Math.max(1,Math.floor(rect.width));
      height = Math.max(1,Math.floor(rect.height));
      camera.aspect = width / height;
      camera.position.z = width < 520 ? 8 : 7.5;
      camera.updateProjectionMatrix();
      renderer.setSize(width,height,false);
      updateNodes(elapsed);
      render();
    };

    let frame = 0;
    let active = false;
    let visible = !document.hidden;
    const pointerTarget = { x:0, y:0 };
    const pointerCurrent = { x:0, y:0 };
    const keyboardTarget = { x:0, y:0 };

    const onPointerMove = (event) => {
      if (event.pointerType === 'touch') return;
      const rect = visual.getBoundingClientRect();
      pointerTarget.x = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2,-1,1);
      pointerTarget.y = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2,-1,1);
      visual.style.setProperty('--pointer-x',(((pointerTarget.x + 1) / 2) * 100) + '%');
      visual.style.setProperty('--pointer-y',(((pointerTarget.y + 1) / 2) * 100) + '%');
      visual.classList.remove('pointer-idle');
      if (reducedMotion.matches) {
        pointerCurrent.x = pointerTarget.x;
        pointerCurrent.y = pointerTarget.y;
        pointerLight.position.set(pointerCurrent.x * 2,-pointerCurrent.y * 1.4,3.4);
        graph.rotation.y = pointerCurrent.x * 0.08;
        graph.rotation.x = -pointerCurrent.y * 0.06;
        render();
      }
    };
    const onPointerLeave = () => {
      pointerTarget.x = 0;
      pointerTarget.y = 0;
      visual.classList.add('pointer-idle');
    };
    const onKeyDown = (event) => {
      const step = 0.1;
      if (event.key === 'ArrowLeft') keyboardTarget.y = clamp(keyboardTarget.y - step,-0.45,0.45);
      else if (event.key === 'ArrowRight') keyboardTarget.y = clamp(keyboardTarget.y + step,-0.45,0.45);
      else if (event.key === 'ArrowUp') keyboardTarget.x = clamp(keyboardTarget.x - step,-0.35,0.35);
      else if (event.key === 'ArrowDown') keyboardTarget.x = clamp(keyboardTarget.x + step,-0.35,0.35);
      else return;
      event.preventDefault();
      if (reducedMotion.matches) {
        graph.rotation.x = keyboardTarget.x;
        graph.rotation.y = keyboardTarget.y;
        render();
      }
    };
    visual.addEventListener('pointermove',onPointerMove);
    visual.addEventListener('pointerleave',onPointerLeave);
    visual.addEventListener('keydown',onKeyDown);

    let lastTime = 0;
    const draw = (timestamp) => {
      frame = 0;
      if (!active || !visible) return;
      const delta = lastTime ? Math.min(0.04,(timestamp - lastTime) / 1000) : 0.016;
      lastTime = timestamp;
      elapsed += delta;
      pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.055;
      pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.055;

      if (!reducedMotion.matches) {
        graph.rotation.y = Math.sin(elapsed * 0.16) * 0.025 + pointerCurrent.x * 0.1 + keyboardTarget.y;
        graph.rotation.x = Math.cos(elapsed * 0.14) * 0.018 - pointerCurrent.y * 0.075 + keyboardTarget.x;
        core.rotation.y += delta * 0.16;
        core.rotation.x = Math.sin(elapsed * 0.22) * 0.045;
        coreEdges.rotation.copy(core.rotation);
        orbits.forEach((orbit,index) => {
          orbit.rotation.z += delta * (index % 2 ? -0.012 : 0.01);
          orbit.rotation.y += delta * (index % 2 ? 0.009 : -0.008);
        });
      }
      pointerLight.position.set(pointerCurrent.x * 2.1,-pointerCurrent.y * 1.45,3.4);
      pointerLight.intensity = 3.4 + (Math.abs(pointerCurrent.x) + Math.abs(pointerCurrent.y)) * 1.1;
      updateNodes(elapsed);
      render();
      if (!reducedMotion.matches) frame = window.requestAnimationFrame(draw);
    };

    const start = () => {
      if (!active || !visible) return;
      if (reducedMotion.matches) {
        updateNodes(0);
        render();
        return;
      }
      if (!frame) {
        lastTime = 0;
        frame = window.requestAnimationFrame(draw);
      }
    };
    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    visual.classList.add('is-live','pointer-idle');
    visual.setAttribute('aria-label','Diagrama 3D de arquitetura. O movimento do cursor dentro do painel altera suavemente a perspectiva. Use as setas do teclado para ajustar a orientação.');
    updateNodes(0);
    resize();

    const observer = new IntersectionObserver((entries) => {
      active = Boolean(entries[0]?.isIntersecting);
      if (active) start();
      else stop();
    },{ threshold:0.08 });
    observer.observe(visual);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(visual);

    const onVisibilityChange = () => {
      visible = !document.hidden;
      if (visible) start();
      else stop();
    };
    document.addEventListener('visibilitychange',onVisibilityChange);
    const onMotionChange = (event) => {
      if (event.matches) {
        stop();
        updateNodes(0);
        render();
      } else start();
    };
    reducedMotion.addEventListener?.('change',onMotionChange);

    window.addEventListener('pagehide',() => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange',onVisibilityChange);
      reducedMotion.removeEventListener?.('change',onMotionChange);
      visual.removeEventListener('pointermove',onPointerMove);
      visual.removeEventListener('pointerleave',onPointerLeave);
      visual.removeEventListener('keydown',onKeyDown);
      renderer.dispose();
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
    },{ once:true });
  }).catch(() => {
    canvas.hidden = true;
    visual.removeAttribute('tabindex');
  });
})();