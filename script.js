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

  // Interactive 3D graph inspired by Obsidian Graph View.
  // Background drag rotates the graph; Shift/right/middle drag pans; node drag repositions;
  // wheel zooms; hover highlights neighbours; click selects only (no Markdown navigation).
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
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
    camera.position.set(0, 0.15, 7.5);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0xFFFFFF, 0x305B4F, 1.7));
    const key = new THREE.PointLight(0xB2D6C9, 21, 12);
    key.position.set(-2.2, 3.4, 4);
    scene.add(key);
    const fill = new THREE.PointLight(0x348C6F, 15, 10);
    fill.position.set(2.8, -2, 1.4);
    scene.add(fill);
    const pointerLight = new THREE.PointLight(0x9BC7B8, 3.5, 5.5);
    pointerLight.position.set(0, 0, 3.4);
    scene.add(pointerLight);

    const graph = new THREE.Group();
    scene.add(graph);

    const geometries = [];
    const materials = [];
    const trackGeometry = (geometry) => { geometries.push(geometry); return geometry; };
    const trackMaterial = (material) => { materials.push(material); return material; };

    const coreGeometry = trackGeometry(new THREE.IcosahedronGeometry(1, 2));
    const coreMaterial = trackMaterial(new THREE.MeshPhysicalMaterial({
      color: 0x305B4F,
      metalness: 0.34,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      emissive: 0x10201C,
      emissiveIntensity: 0.28
    }));
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.userData.graphNodeId = 'core';
    graph.add(core);

    const coreAura = new THREE.Mesh(
      trackGeometry(new THREE.SphereGeometry(0.76, 24, 24)),
      trackMaterial(new THREE.MeshBasicMaterial({
        color: 0x6D9E8F,
        transparent: true,
        opacity: 0.05,
        depthWrite: false
      }))
    );
    graph.add(coreAura);

    const orbitSpecs = [
      { radius: 1.45, rotation: [0.86, 0.18, -0.08], color: 0x9BC7B8, opacity: 0.22 },
      { radius: 1.88, rotation: [0.24, 0.9, 0.22], color: 0x6D9E8F, opacity: 0.17 },
      { radius: 2.18, rotation: [1.12, -0.34, 0.5], color: 0x9BC7B8, opacity: 0.13 }
    ];
    const orbits = orbitSpecs.map((spec) => {
      const orbit = new THREE.Mesh(
        trackGeometry(new THREE.TorusGeometry(spec.radius, 0.006, 6, 128)),
        trackMaterial(new THREE.MeshBasicMaterial({
          color: spec.color,
          transparent: true,
          opacity: spec.opacity,
          depthWrite: false
        }))
      );
      orbit.rotation.set(spec.rotation[0], spec.rotation[1], spec.rotation[2]);
      graph.add(orbit);
      return orbit;
    });

    const nodeGeometry = trackGeometry(new THREE.SphereGeometry(1, 20, 20));
    const haloGeometry = trackGeometry(new THREE.SphereGeometry(1, 16, 16));
    const nodes = [];
    const centerNode = {
      id: 'core',
      mesh: core,
      base: new THREE.Vector3(0, 0, 0),
      offset: new THREE.Vector3(),
      phase: 0,
      size: 0.52,
      material: coreMaterial,
      halo: coreAura,
      central: true
    };
    nodes.push(centerNode);

    const nodeSpecs = [
      { id: 'n1', position: [-1.45, 0.76, 0.22], size: 0.12, tone: 0 },
      { id: 'n2', position: [-1.48, -0.82, -0.18], size: 0.105, tone: 1 },
      { id: 'n3', position: [1.48, 0.8, -0.16], size: 0.115, tone: 0 },
      { id: 'n4', position: [1.53, -0.78, 0.2], size: 0.105, tone: 1 },
      { id: 'n5', position: [-0.2, 1.72, -0.54], size: 0.1, tone: 1 },
      { id: 'n6', position: [0.16, -1.68, 0.48], size: 0.115, tone: 0 },
      { id: 'n7', position: [-0.86, 0.02, 1.18], size: 0.095, tone: 0 },
      { id: 'n8', position: [0.94, -0.02, -1.16], size: 0.105, tone: 1 }
    ];

    const nodeTones = [
      trackMaterial(new THREE.MeshPhysicalMaterial({
        color: 0xB2D6C9,
        metalness: 0.14,
        roughness: 0.2,
        clearcoat: 1,
        emissive: 0x1E443A,
        emissiveIntensity: 0.24
      })),
      trackMaterial(new THREE.MeshPhysicalMaterial({
        color: 0x6D9E8F,
        metalness: 0.2,
        roughness: 0.24,
        clearcoat: 0.85,
        emissive: 0x10201C,
        emissiveIntensity: 0.2
      }))
    ];
    const haloMaterialBase = new THREE.MeshBasicMaterial({
      color: 0x9BC7B8,
      transparent: true,
      opacity: 0.075,
      depthWrite: false
    });
    trackMaterial(haloMaterialBase);

    nodeSpecs.forEach((spec, index) => {
      const material = trackMaterial(nodeTones[spec.tone].clone());
      const mesh = new THREE.Mesh(nodeGeometry, material);
      mesh.scale.setScalar(spec.size);
      mesh.position.set(spec.position[0], spec.position[1], spec.position[2]);
      mesh.userData.graphNodeId = spec.id;
      graph.add(mesh);

      const halo = new THREE.Mesh(haloGeometry, trackMaterial(haloMaterialBase.clone()));
      halo.scale.setScalar(spec.size * 2.2);
      halo.position.copy(mesh.position);
      graph.add(halo);

      nodes.push({
        id: spec.id,
        mesh,
        halo,
        base: mesh.position.clone(),
        offset: new THREE.Vector3(),
        phase: index * 0.8,
        size: spec.size,
        material,
        central: false
      });
    });

    // Links form a readable network, not just spokes from the central sphere.
    const edgePairs = [
      ['core','n1'], ['core','n2'], ['core','n3'], ['core','n4'],
      ['core','n5'], ['core','n6'], ['core','n7'], ['core','n8'],
      ['n1','n2'], ['n1','n5'], ['n1','n7'], ['n2','n6'],
      ['n2','n7'], ['n3','n4'], ['n3','n5'], ['n3','n8'],
      ['n4','n6'], ['n4','n8'], ['n5','n7'], ['n6','n8']
    ];
    const nodeById = new Map(nodes.map((node) => [node.id, node]));
    const adjacency = new Map(nodes.map((node) => [node.id, new Set()]));
    const edges = edgePairs.map(([from, to]) => {
      adjacency.get(from).add(to);
      adjacency.get(to).add(from);
      const geometry = trackGeometry(new THREE.BufferGeometry());
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
      const material = trackMaterial(new THREE.LineBasicMaterial({
        color: 0x9BC7B8,
        transparent: true,
        opacity: 0.28,
        depthWrite: false
      }));
      const line = new THREE.Line(geometry, material);
      line.frustumCulled = false;
      graph.add(line);
      return { from: nodeById.get(from), to: nodeById.get(to), line, material };
    });

    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    const dragPlane = new THREE.Plane();
    const dragIntersection = new THREE.Vector3();
    const cameraNormal = new THREE.Vector3();
    const inverseGraphRotation = new THREE.Quaternion();
    const graphRotation = new THREE.Quaternion();
    const worldPointer = new THREE.Vector3();
    const cameraRight = new THREE.Vector3();
    const cameraUp = new THREE.Vector3();
    const activePointers = new Map();
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    let width = 1;
    let height = 1;
    let hoveredId = null;
    let selectedId = null;
    let gesture = null;
    let frame = 0;
    let active = false;
    let visible = !document.hidden;
    let elapsed = 0;
    let lastTime = 0;

    const resize = () => {
      const rect = visual.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      render();
    };

    const render = () => renderer.render(scene, camera);
    const pointerRay = (event) => {
      const rect = visual.getBoundingClientRect();
      pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
    };
    const pickNode = (event) => {
      pointerRay(event);
      const hits = raycaster.intersectObjects(nodes.filter((node) => !node.central).map((node) => node.mesh), false);
      if (!hits.length) {
        const coreHit = raycaster.intersectObject(core, false)[0];
        if (!coreHit) return null;
        return nodeById.get('core');
      }
      return nodeById.get(hits[0].object.userData.graphNodeId) || null;
    };

    const setHighlight = (nodeId) => {
      const focusId = nodeId || selectedId;
      const neighbors = focusId ? adjacency.get(focusId) : null;
      nodes.forEach((node) => {
        const isFocus = node.id === focusId;
        const isNeighbor = neighbors?.has(node.id) || false;
        const dim = Boolean(focusId) && !isFocus && !isNeighbor;
        const factor = isFocus ? 1.55 : isNeighbor ? 1.16 : dim ? 0.74 : 1;
        node.mesh.scale.setScalar(node.size * factor);
        if (!node.central) {
          node.material.emissiveIntensity = isFocus ? 0.85 : isNeighbor ? 0.48 : dim ? 0.08 : 0.2;
          node.halo.material.opacity = isFocus ? 0.22 : isNeighbor ? 0.12 : dim ? 0.025 : 0.075;
        }
      });
      edges.forEach((edge) => {
        const touches = focusId && (edge.from.id === focusId || edge.to.id === focusId);
        const neighborLink = focusId && (edge.from.id === focusId || edge.to.id === focusId);
        edge.material.opacity = focusId ? (neighborLink ? 0.82 : 0.055) : 0.28;
        edge.material.color.setHex(touches ? 0xB2D6C9 : 0x6D9E8F);
      });
    };

    const updateEdges = () => {
      edges.forEach((edge) => {
        const positions = edge.line.geometry.attributes.position;
        positions.setXYZ(0, edge.from.mesh.position.x, edge.from.mesh.position.y, edge.from.mesh.position.z);
        positions.setXYZ(1, edge.to.mesh.position.x, edge.to.mesh.position.y, edge.to.mesh.position.z);
        positions.needsUpdate = true;
      });
    };

    const applyZoom = (delta) => {
      camera.position.z = clamp(camera.position.z * Math.exp(delta * 0.0012), 4.2, 13);
      render();
    };

    const updatePointerLight = (event) => {
      const rect = visual.getBoundingClientRect();
      const x = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
      const y = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
      visual.style.setProperty('--pointer-x', (((x + 1) / 2) * 100) + '%');
      visual.style.setProperty('--pointer-y', (((y + 1) / 2) * 100) + '%');
      pointerLight.position.set(x * 2, -y * 1.4, 3.4);
      pointerLight.intensity = 3.2 + (Math.abs(x) + Math.abs(y)) * 1.2;
    };

    const onPointerDown = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0 && event.button !== 1 && event.button !== 2) return;
      activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY, type: event.pointerType });

      if (event.pointerType === 'touch' && activePointers.size === 2) {
        const points = [...activePointers.values()];
        const dx = points[0].x - points[1].x;
        const dy = points[0].y - points[1].y;
        gesture = {
          mode: 'pinch',
          startDistance: Math.max(1, Math.hypot(dx, dy)),
          startZoom: camera.position.z
        };
        visual.setPointerCapture?.(event.pointerId);
        event.preventDefault();
        return;
      }

      const node = event.button === 0 && !event.shiftKey ? pickNode(event) : null;
      const mode = node ? 'node' : (event.button === 2 || event.button === 1 || event.shiftKey) ? 'pan' : 'rotate';
      gesture = {
        mode,
        pointerId: event.pointerId,
        node,
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        lastY: event.clientY,
        moved: false,
        startPosition: node ? node.mesh.position.clone() : null
      };

      visual.setPointerCapture?.(event.pointerId);
      visual.classList.toggle('is-panning', mode === 'pan');
      visual.classList.toggle('is-node-dragging', mode === 'node');
      if (mode === 'node') setHighlight(node.id);
      event.preventDefault();
    };

    const moveDraggedNode = (event, node) => {
      graph.updateMatrixWorld(true);
      pointerRay(event);
      graph.updateWorldMatrix(true, false);
      node.mesh.getWorldPosition(worldPointer);
      camera.getWorldDirection(cameraNormal);
      dragPlane.setFromNormalAndCoplanarPoint(cameraNormal, worldPointer);
      if (!raycaster.ray.intersectPlane(dragPlane, dragIntersection)) return;
      const local = graph.worldToLocal(dragIntersection.clone());
      node.mesh.position.copy(local);
      node.offset.copy(local.sub(node.base));
    };

    const onPointerMove = (event) => {
      const previous = activePointers.get(event.pointerId);
      if (previous) activePointers.set(event.pointerId, { ...previous, x: event.clientX, y: event.clientY });

      updatePointerLight(event);
      visual.classList.remove('pointer-idle');

      if (gesture?.mode === 'pinch' && activePointers.size >= 2) {
        const points = [...activePointers.values()];
        const dx = points[0].x - points[1].x;
        const dy = points[0].y - points[1].y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        camera.position.z = clamp(gesture.startZoom * (gesture.startDistance / distance), 4.2, 13);
        render();
        event.preventDefault();
        return;
      }

      if (gesture && gesture.pointerId === event.pointerId) {
        const dx = event.clientX - gesture.lastX;
        const dy = event.clientY - gesture.lastY;
        if (Math.abs(event.clientX - gesture.startX) + Math.abs(event.clientY - gesture.startY) > 4) gesture.moved = true;

        if (gesture.mode === 'rotate') {
          graph.rotation.y += dx * 0.006;
          graph.rotation.x = clamp(graph.rotation.x + dy * 0.006, -1.35, 1.35);
        } else if (gesture.mode === 'pan') {
          const worldPerPixel = (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * camera.position.z) / height;
          camera.getWorldQuaternion(graphRotation);
          cameraRight.set(1, 0, 0).applyQuaternion(graphRotation);
          cameraUp.set(0, 1, 0).applyQuaternion(graphRotation);
          graph.position.addScaledVector(cameraRight, dx * worldPerPixel);
          graph.position.addScaledVector(cameraUp, -dy * worldPerPixel);
        } else if (gesture.mode === 'node' && gesture.node && !gesture.node.central) {
          moveDraggedNode(event, gesture.node);
          updateEdges();
          setHighlight(gesture.node.id);
        }
        gesture.lastX = event.clientX;
        gesture.lastY = event.clientY;
        render();
        event.preventDefault();
        return;
      }

      const hit = pickNode(event);
      const nextId = hit?.id || null;
      if (nextId !== hoveredId) {
        hoveredId = nextId;
        visual.classList.toggle('node-hover', Boolean(nextId));
        setHighlight(hoveredId);
        render();
      }
    };

    const endPointer = (event) => {
      const activeGesture = gesture;
      if (activeGesture?.mode !== 'pinch' && activeGesture?.pointerId === event.pointerId) {
        if (activeGesture.mode === 'node' && activeGesture.node) {
          selectedId = activeGesture.moved ? activeGesture.node.id : (selectedId === activeGesture.node.id ? null : activeGesture.node.id);
        } else if (!activeGesture.moved && activeGesture.mode === 'rotate') {
          selectedId = null;
        }
        gesture = null;
        visual.classList.remove('is-panning', 'is-node-dragging');
        setHighlight(hoveredId);
        render();
      }
      activePointers.delete(event.pointerId);
      if (gesture?.mode === 'pinch' && activePointers.size < 2) gesture = null;
      if (visual.hasPointerCapture?.(event.pointerId)) visual.releasePointerCapture(event.pointerId);
    };

    const onPointerLeave = () => {
      if (gesture) return;
      hoveredId = null;
      visual.classList.add('pointer-idle');
      visual.classList.remove('node-hover');
      setHighlight(null);
      pointerLight.intensity = 2.8;
      render();
    };

    const onWheel = (event) => {
      event.preventDefault();
      applyZoom(event.deltaY);
    };

    const onContextMenu = (event) => event.preventDefault();

    const onKeyDown = (event) => {
      const fast = event.shiftKey ? 2.6 : 1;
      const rotateStep = 0.1 * fast;
      if (event.key === 'ArrowLeft') graph.rotation.y -= rotateStep;
      else if (event.key === 'ArrowRight') graph.rotation.y += rotateStep;
      else if (event.key === 'ArrowUp') graph.rotation.x = clamp(graph.rotation.x - rotateStep, -1.35, 1.35);
      else if (event.key === 'ArrowDown') graph.rotation.x = clamp(graph.rotation.x + rotateStep, -1.35, 1.35);
      else if (event.key === '+' || event.key === '=') camera.position.z = clamp(camera.position.z - 0.5 * fast, 4.2, 13);
      else if (event.key === '-') camera.position.z = clamp(camera.position.z + 0.5 * fast, 4.2, 13);
      else return;
      event.preventDefault();
      render();
    };

    const update = (delta) => {
      elapsed += delta;
      nodes.forEach((node) => {
        if (node.central || gesture?.mode === 'node' && gesture.node?.id === node.id || node.offset.lengthSq() > 0) return;
        node.mesh.position.y = node.base.y + Math.sin(elapsed * 0.55 + node.phase) * 0.012;
      });
      core.rotation.y += delta * 0.12;
      core.rotation.x = Math.sin(elapsed * 0.24) * 0.035;
      coreAura.scale.setScalar(1 + Math.sin(elapsed * 0.7) * 0.012);
      orbits.forEach((orbit, index) => {
        orbit.rotation.z += delta * (index % 2 ? -0.008 : 0.007);
        orbit.rotation.y += delta * (index % 2 ? 0.006 : -0.005);
      });
      updateEdges();
    };

    const draw = (timestamp) => {
      frame = 0;
      if (!active || !visible) return;
      const delta = lastTime ? Math.min(0.04, (timestamp - lastTime) / 1000) : 0.016;
      lastTime = timestamp;
      if (!reducedMotion.matches) update(delta);
      render();
      if (!reducedMotion.matches) frame = window.requestAnimationFrame(draw);
    };

    const start = () => {
      if (!active || !visible || reducedMotion.matches) {
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

    visual.addEventListener('pointerdown', onPointerDown);
    visual.addEventListener('pointermove', onPointerMove);
    visual.addEventListener('pointerup', endPointer);
    visual.addEventListener('pointercancel', endPointer);
    visual.addEventListener('lostpointercapture', endPointer);
    visual.addEventListener('pointerleave', onPointerLeave);
    visual.addEventListener('wheel', onWheel, { passive: false });
    visual.addEventListener('contextmenu', onContextMenu);
    visual.addEventListener('keydown', onKeyDown);

    visual.classList.add('is-live', 'pointer-idle');
    visual.setAttribute('aria-label', 'Grafo 3D interativo: arraste o fundo para girar; Shift ou botão direito mais arraste para mover; arraste esferas para reposicioná-las; role para aproximar; passe o cursor sobre uma esfera para destacar suas conexões; clique para selecionar sem abrir documentos.');

    updateEdges();
    resize();

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
        render();
      } else start();
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
      visual.removeEventListener('pointerleave', onPointerLeave);
      visual.removeEventListener('wheel', onWheel);
      visual.removeEventListener('contextmenu', onContextMenu);
      visual.removeEventListener('keydown', onKeyDown);
      renderer.dispose();
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
    }, { once: true });
  }).catch(() => {
    canvas.hidden = true;
    visual.removeAttribute('tabindex');
  });
})();