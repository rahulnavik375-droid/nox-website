gsap.registerPlugin(ScrollTrigger);

document.body.classList.add("is-loading");

const loader = document.getElementById("loader");
const loaderProgress = document.getElementById("loaderProgress");
const loaderPercent = document.getElementById("loaderPercent");

let loadingValue = 0;

const loaderTimer = setInterval(() => {
  loadingValue += Math.floor(Math.random() * 8) + 3;

  if (loadingValue >= 100) {
    loadingValue = 100;
    clearInterval(loaderTimer);

    setTimeout(() => {
      loader.classList.add("is-hidden");
      document.body.classList.remove("is-loading");
      revealHero();
    }, 500);
  }

  loaderProgress.style.width = `${loadingValue}%`;
  loaderPercent.textContent = `${loadingValue}%`;
}, 80);

function revealHero() {
  gsap.to(".reveal-up", {
    opacity: 1,
    y: 0,
    duration: 1.2,
    stagger: 0.12,
    ease: "power4.out"
  });
}

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  document.querySelector(".scroll-progress span").style.height = `${progress * 100}%`;
});

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

menuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("is-open");
  menuButton.classList.toggle("is-open");
});

document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("is-open");
    menuButton.classList.remove("is-open");
  });
});

const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

if (window.matchMedia("(pointer: fine)").matches) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    gsap.to(cursorDot, {
      x: mouseX,
      y: mouseY,
      duration: 0.12,
      overwrite: true
    });
  });

  gsap.ticker.add(() => {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;

    gsap.set(cursorRing, {
      x: ringX,
      y: ringY
    });
  });

  document.querySelectorAll("[data-cursor='hover']").forEach((element) => {
    element.addEventListener("mouseenter", () => cursorRing.classList.add("is-hover"));
    element.addEventListener("mouseleave", () => cursorRing.classList.remove("is-hover"));
  });
}

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -8;
    const rotateY = ((x / rect.width) - 0.5) * 8;

    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 800,
      duration: 0.35,
      ease: "power2.out"
    });
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.5)"
    });
  });
});

gsap.utils.toArray(".section-heading, .about-statement, .stat-card, .service-card, .showcase-heading, .project-card, .contact-heading, .contact-form").forEach((element) => {
  gsap.from(element, {
    opacity: 0,
    y: 70,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: element,
      start: "top 84%",
      once: true
    }
  });
});

gsap.to(".hero-copy", {
  yPercent: 22,
  opacity: 0.2,
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});

gsap.to(".experience-title", {
  y: -80,
  scrollTrigger: {
    trigger: ".experience",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});

gsap.to(".label-one", {
  y: -100,
  x: 40,
  scrollTrigger: {
    trigger: ".experience",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});

gsap.to(".label-two", {
  y: 80,
  x: -50,
  scrollTrigger: {
    trigger: ".experience",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});

gsap.to(".label-three", {
  y: -60,
  x: 30,
  scrollTrigger: {
    trigger: ".experience",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});

let heroScene;
let experienceScene;

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;

  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);

  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.15, "rgba(141,255,241,.9)");
  gradient.addColorStop(0.4, "rgba(141,255,241,.25)");
  gradient.addColorStop(1, "rgba(141,255,241,0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);

  return new THREE.CanvasTexture(canvas);
}

function createParticleField(count, spread, color) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count * 3; index += 3) {
    positions[index] = (Math.random() - 0.5) * spread;
    positions[index + 1] = (Math.random() - 0.5) * spread;
    positions[index + 2] = (Math.random() - 0.5) * spread;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color,
    size: 0.035,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  return new THREE.Points(geometry, material);
}

function createHeroScene() {
  const canvas = document.getElementById("heroCanvas");
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const group = new THREE.Group();
  scene.add(group);

  const coreGeometry = new THREE.IcosahedronGeometry(1.35, 5);
  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x15252b,
    roughness: 0.2,
    metalness: 0.75,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
    emissive: 0x09282b,
    emissiveIntensity: 1.2
  });

  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  group.add(core);

  const wireframe = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.48, 2),
    new THREE.MeshBasicMaterial({
      color: 0x8dfff1,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    })
  );
  group.add(wireframe);

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xff8157,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide
  });

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.8, 0.012, 10, 120),
    ringMaterial
  );
  ring.rotation.x = Math.PI / 2.4;
  ring.rotation.y = 0.2;
  group.add(ring);

  const secondRing = ring.clone();
  secondRing.material = ringMaterial.clone();
  secondRing.material.color.setHex(0xd8ff65);
  secondRing.scale.setScalar(1.18);
  secondRing.rotation.x = Math.PI / 3;
  secondRing.rotation.z = Math.PI / 2;
  group.add(secondRing);

  const particles = createParticleField(1000, 13, 0x8dfff1);
  scene.add(particles);

  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: createGlowTexture(),
      color: 0x8dfff1,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.38
    })
  );
  glow.scale.set(5.5, 5.5, 1);
  group.add(glow);

  const ambientLight = new THREE.AmbientLight(0x24333a, 1.2);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x8dfff1, 5, 9);
  cyanLight.position.set(3, 2, 4);
  scene.add(cyanLight);

  const orangeLight = new THREE.PointLight(0xff8157, 4, 8);
  orangeLight.position.set(-3, -1, 2);
  scene.add(orangeLight);

  const mouse = { x: 0, y: 0 };
  const targetMouse = { x: 0, y: 0 };

  window.addEventListener("mousemove", (event) => {
    targetMouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
    targetMouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
  });

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener("resize", resize);

  function animate(time) {
    requestAnimationFrame(animate);

    mouse.x += (targetMouse.x - mouse.x) * 0.04;
    mouse.y += (targetMouse.y - mouse.y) * 0.04;

    group.rotation.y += 0.0028;
    group.rotation.x = mouse.y * 0.12;
    group.position.x = mouse.x * 0.25;
    group.position.y = -mouse.y * 0.15;

    core.rotation.x = time * 0.00015;
    core.rotation.y = time * 0.0002;
    wireframe.rotation.y -= 0.0015;
    ring.rotation.z += 0.004;
    secondRing.rotation.x -= 0.002;

    particles.rotation.y += 0.00025;
    particles.rotation.x = mouse.y * 0.04;

    cyanLight.position.x = 3 + mouse.x * 2;
    orangeLight.position.y = -1 - mouse.y * 2;

    renderer.render(scene, camera);
  }

  animate(0);

  return { scene, camera, renderer };
}

function createExperienceScene() {
  const canvas = document.getElementById("experienceCanvas");
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 8);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const world = new THREE.Group();
  scene.add(world);

  const particleField = createParticleField(850, 18, 0xff8157);
  world.add(particleField);

  const objects = [];

  const materials = [
    new THREE.MeshStandardMaterial({
      color: 0x8dfff1,
      emissive: 0x164d4e,
      emissiveIntensity: 1.4,
      roughness: 0.25,
      metalness: 0.7
    }),
    new THREE.MeshStandardMaterial({
      color: 0xff8157,
      emissive: 0x4b1e18,
      emissiveIntensity: 1.4,
      roughness: 0.25,
      metalness: 0.7
    }),
    new THREE.MeshStandardMaterial({
      color: 0xd8ff65,
      emissive: 0x3c4c1c,
      emissiveIntensity: 1.1,
      roughness: 0.25,
      metalness: 0.7
    })
  ];

  for (let index = 0; index < 12; index++) {
    const geometryType = index % 3;
    let geometry;

    if (geometryType === 0) {
      geometry = new THREE.OctahedronGeometry(0.35 + Math.random() * 0.25, 0);
    } else if (geometryType === 1) {
      geometry = new THREE.TorusGeometry(0.35, 0.07, 8, 32);
    } else {
      geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    }

    const object = new THREE.Mesh(geometry, materials[index % materials.length]);

    object.position.set(
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 4
    );

    object.rotation.set(Math.random(), Math.random(), Math.random());
    object.userData.speed = 0.002 + Math.random() * 0.004;
    object.userData.offset = Math.random() * Math.PI * 2;

    world.add(object);
    objects.push(object);
  }

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x8dfff1,
    transparent: true,
    opacity: 0.25
  });

  for (let index = 0; index < 7; index++) {
    const points = [];

    for (let pointIndex = 0; pointIndex < 6; pointIndex++) {
      points.push(
        new THREE.Vector3(
          -5 + pointIndex * 2,
          Math.sin(pointIndex + index) * 0.8 + index - 3,
          -1.5
        )
      );
    }

    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      lineMaterial
    );

    line.rotation.z = index * 0.17;
    world.add(line);
  }

  scene.add(new THREE.AmbientLight(0x172025, 1.5));

  const cyanLight = new THREE.PointLight(0x8dfff1, 7, 15);
  cyanLight.position.set(3, 2, 4);
  scene.add(cyanLight);

  const orangeLight = new THREE.PointLight(0xff8157, 6, 14);
  orangeLight.position.set(-4, -2, 3);
  scene.add(orangeLight);

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener("resize", resize);

  let scrollOffset = 0;

  ScrollTrigger.create({
    trigger: "#experience",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
    onUpdate: (self) => {
      scrollOffset = self.progress;
    }
  });

  function animate(time) {
    requestAnimationFrame(animate);

    world.rotation.y += 0.0008;
    world.rotation.x = scrollOffset * 0.35;
    world.position.y = scrollOffset * 1.2;

    particleField.rotation.y -= 0.0004;
    particleField.rotation.x = scrollOffset * 0.15;

    objects.forEach((object) => {
      object.rotation.x += object.userData.speed;
      object.rotation.y += object.userData.speed * 1.4;
      object.position.y += Math.sin(time * 0.0007 + object.userData.offset) * 0.0007;
    });

    cyanLight.position.x = Math.sin(time * 0.0005) * 4;
    orangeLight.position.y = Math.cos(time * 0.0006) * 3;

    renderer.render(scene, camera);
  }

  animate(0);

  return { scene, camera, renderer };
}

heroScene = createHeroScene();
experienceScene = createExperienceScene();

document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const button = event.currentTarget.querySelector(".submit-button");
  const originalText = button.querySelector("span").textContent;

  button.querySelector("span").textContent = "Inquiry received";
  button.style.background = "#ff8157";

  setTimeout(() => {
    button.querySelector("span").textContent = originalText;
    button.style.background = "";
    event.currentTarget.reset();
  }, 2400);
});