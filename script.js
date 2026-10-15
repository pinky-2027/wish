/**
 * PURI'S 22ND BIRTHDAY — A CUTE, INTERACTIVE DIGITAL SURPRISE
 * Complete Interactive Logic & Animations
 */

(function () {
  'use strict';

  // --- State Management ---
  const state = {
    currentScreen: 1,
    heartsCollected: 0,
    targetHearts: 5,
    isGiftUnlocked: false,
    soundEnabled: true,
    heartSpawnerInterval: null
  };

  // --- Audio Synthesizer (Zero External Dependencies, Pure Web Audio API) ---
  class SoundSynth {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, type = 'sine', duration = 0.25, gainLevel = 0.15) {
      if (!state.soundEnabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio policy or unsupported
      }
    }

    // Melodic sound effects
    chimePop() {
      this.playTone(587.33, 'triangle', 0.2, 0.18); // D5
      setTimeout(() => this.playTone(880, 'sine', 0.3, 0.15), 80); // A5
    }

    heartCollectSound(count) {
      const notes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]; // C5, D5, E5, G5, A5, C6
      const freq = notes[Math.min(count, notes.length - 1)];
      this.playTone(freq, 'sine', 0.35, 0.2);
    }

    fanfareSound() {
      const fanfares = [523.25, 659.25, 783.99, 1046.5];
      fanfares.forEach((freq, idx) => {
        setTimeout(() => this.playTone(freq, 'triangle', 0.4, 0.2), idx * 120);
      });
    }

    giftOpenSound() {
      const chords = [440, 554.37, 659.25, 880, 1108.7];
      chords.forEach((freq, idx) => {
        setTimeout(() => this.playTone(freq, 'sine', 0.5, 0.15), idx * 70);
      });
    }
  }

  const sound = new SoundSynth();

  // --- DOM Elements ---
  const elements = {
    screens: {
      1: document.getElementById('screen-1'),
      2: document.getElementById('screen-2'),
      3: document.getElementById('screen-3')
    },
    typewriterText: document.getElementById('typewriter-text'),
    typewriterCursor: document.getElementById('typewriter-cursor'),
    titleBurst: document.getElementById('title-burst'),
    btnEnterSurprise: document.getElementById('btn-enter-surprise'),
    soundToggleBtn: document.getElementById('sound-toggle-btn'),
    // Screen 2
    stepNode1: document.getElementById('step-node-1'),
    stepNode2: document.getElementById('step-node-2'),
    stepNode3: document.getElementById('step-node-3'),
    bar12: document.getElementById('bar-1-2'),
    bar23: document.getElementById('bar-2-3'),
    gameStageHearts: document.getElementById('game-stage-hearts'),
    gameStageGift: document.getElementById('game-stage-gift'),
    heartsCountNum: document.getElementById('hearts-count-num'),
    heartsPipsContainer: document.getElementById('hearts-pips-container'),
    heartPlayArena: document.getElementById('heart-play-arena'),
    btnSkipHearts: document.getElementById('btn-skip-hearts'),
    mysteryGiftBox: document.getElementById('mystery-gift-box'),
    giftLid: document.getElementById('gift-lid'),
    giftPromptText: document.getElementById('gift-prompt-text'),
    giftUnlockedContent: document.getElementById('gift-unlocked-content'),
    btnOpenLetter: document.getElementById('btn-open-letter'),
    // Screen 3
    letterParagraphs: document.querySelectorAll('.letter-paragraph'),
    btnFinalSurprise: document.getElementById('btn-final-surprise'),
    finalSurpriseReveal: document.getElementById('final-surprise-reveal'),
    tapHeartZone: document.getElementById('tap-heart-zone'),
    btnBurstHearts: document.getElementById('btn-burst-hearts'),
    btnReplayExperience: document.getElementById('btn-replay-experience'),
    ambientCanvas: document.getElementById('ambient-canvas')
  };

  // --- Ambient Background Particles Canvas ---
  function initAmbientCanvas() {
    const canvas = elements.ambientCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const symbols = ['💖', '✨', '🌸', '⭐', '🫧', '🎀'];

    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        size: 14 + Math.random() * 16,
        speedY: 0.3 + Math.random() * 0.7,
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: 0.2 + Math.random() * 0.45,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: 0.02 + Math.random() * 0.02
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.swing += p.swingSpeed;
        p.x += Math.sin(p.swing) * 0.6 + p.speedX;

        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(p.symbol, p.x, p.y);
      });

      requestAnimationFrame(render);
    }

    render();
  }

  // --- Confetti Cannon System ---
  function launchConfetti(x = 0.5, y = 0.5, count = 50) {
    const colors = ['#ff7597', '#ffb6c1', '#c7b8ea', '#ffd7ba', '#a8e6cf', '#ffbe0b', '#d4f0f7'];

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.style.position = 'fixed';
      piece.style.width = `${Math.floor(8 + Math.random() * 10)}px`;
      piece.style.height = `${Math.floor(6 + Math.random() * 10)}px`;
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.left = `${x * 100}vw`;
      piece.style.top = `${y * 100}vh`;
      piece.style.zIndex = '9999';
      piece.style.pointerEvents = 'none';

      const angle = Math.random() * Math.PI * 2;
      const velocity = 8 + Math.random() * 14;
      let vx = Math.cos(angle) * velocity;
      let vy = Math.sin(angle) * velocity - 6;
      let rotation = Math.random() * 360;
      let rotSpeed = (Math.random() - 0.5) * 20;
      let opacity = 1;

      document.body.appendChild(piece);

      let curX = x * window.innerWidth;
      let curY = y * window.innerHeight;

      const anim = () => {
        curX += vx;
        curY += vy;
        vy += 0.45; // gravity
        vx *= 0.98; // drag
        rotation += rotSpeed;
        opacity -= 0.015;

        piece.style.transform = `translate(${curX - x * window.innerWidth}px, ${curY - y * window.innerHeight}px) rotate(${rotation}deg)`;
        piece.style.opacity = opacity;

        if (opacity > 0 && curY < window.innerHeight + 50) {
          requestAnimationFrame(anim);
        } else {
          piece.remove();
        }
      };

      requestAnimationFrame(anim);
    }
  }

  // --- Typewriter Effect on Screen One ---
  function startTypewriterGreeting() {
    const textToType = "Happy Birthday Puriii";
    const targetEl = elements.typewriterText;
    const cursorEl = elements.typewriterCursor;
    if (!targetEl) return;

    targetEl.textContent = "";
    if (cursorEl) cursorEl.style.display = "inline-block";

    let index = 0;
    const speed = 100; // ms per char

    function typeNextChar() {
      if (index < textToType.length) {
        targetEl.textContent += textToType.charAt(index);
        index++;
        if (state.soundEnabled && index % 2 === 0) {
          sound.playTone(600 + index * 20, 'sine', 0.08, 0.04);
        }
        setTimeout(typeNextChar, speed + (Math.random() * 40 - 20));
      } else {
        // Typing finished: gentle sparkle pop & confetti burst around the title
        if (cursorEl) {
          setTimeout(() => {
            cursorEl.style.animation = 'blinkCursor 1.2s infinite';
          }, 600);
        }
        launchConfetti(0.5, 0.35, 30);
        sound.chimePop();
      }
    }

    // Delay slight tick for page entrance
    setTimeout(typeNextChar, 450);
  }

  // --- Screen Navigation ---
  function switchScreen(targetIndex) {
    if (state.currentScreen === targetIndex) return;

    // Hide old screen
    const oldScreen = elements.screens[state.currentScreen];
    if (oldScreen) {
      oldScreen.classList.remove('screen-active');
    }

    // Update state
    state.currentScreen = targetIndex;

    // Show new screen
    const newScreen = elements.screens[targetIndex];
    if (newScreen) {
      newScreen.classList.add('screen-active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Lifecycle triggers per screen
    if (targetIndex === 2) {
      setupGameScreen();
    } else if (targetIndex === 3) {
      setupLetterScreen();
    }
  }

  // --- Screen Two: Interactive Game Logic ---
  function setupGameScreen() {
    // Reset to Stage 1 (Hearts)
    state.heartsCollected = 0;
    state.isGiftUnlocked = false;

    updateHeartHUD();
    elements.gameStageHearts.classList.remove('stage-hidden');
    elements.gameStageHearts.classList.add('active-stage');

    elements.gameStageGift.classList.add('stage-hidden');
    elements.giftLid.classList.remove('opened');
    elements.giftUnlockedContent.classList.add('hidden');
    elements.giftPromptText.style.display = 'block';

    // Update stepper
    elements.stepNode1.className = 'step-item step-done';
    elements.stepNode2.className = 'step-item step-active';
    elements.stepNode3.className = 'step-item';
    elements.bar12.className = 'step-connector active-bar';
    elements.bar23.className = 'step-connector';

    // Start spawning hearts in arena
    startSpawningHearts();
  }

  function startSpawningHearts() {
    stopSpawningHearts();
    const arena = elements.heartPlayArena;
    if (!arena) return;
    arena.innerHTML = '<div class="arena-background-grid"></div>';

    // Heart emojis variety
    const heartStyles = ['💖', '💗', '💕', '💓', '💝', '🌸', '✨'];

    function spawnHeart() {
      if (state.heartsCollected >= state.targetHearts) {
        stopSpawningHearts();
        return;
      }

      const heart = document.createElement('div');
      heart.className = 'floating-target-heart';
      heart.textContent = heartStyles[Math.floor(Math.random() * heartStyles.length)];

      const arenaWidth = arena.clientWidth || 320;
      const leftPos = Math.floor(20 + Math.random() * (arenaWidth - 60));
      heart.style.left = `${leftPos}px`;

      const duration = 3.6 + Math.random() * 1.6;
      heart.style.animationDuration = `${duration}s`;

      // Catch event listener (works for both touch & click)
      const catchHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        catchHeart(heart, e.clientX || (e.touches && e.touches[0].clientX), e.clientY || (e.touches && e.touches[0].clientY));
      };

      heart.addEventListener('mousedown', catchHandler);
      heart.addEventListener('touchstart', catchHandler, { passive: false });

      arena.appendChild(heart);

      // Remove heart after animation
      setTimeout(() => {
        if (heart.parentNode === arena) {
          heart.remove();
        }
      }, duration * 1000);
    }

    // Initial batch
    spawnHeart();
    setTimeout(spawnHeart, 400);
    setTimeout(spawnHeart, 900);

    // Continuous spawn
    state.heartSpawnerInterval = setInterval(spawnHeart, 900);
  }

  function stopSpawningHearts() {
    if (state.heartSpawnerInterval) {
      clearInterval(state.heartSpawnerInterval);
      state.heartSpawnerInterval = null;
    }
  }

  function catchHeart(heartElement, clientX, clientY) {
    if (state.heartsCollected >= state.targetHearts) return;

    state.heartsCollected++;
    sound.heartCollectSound(state.heartsCollected);

    // Visual pop feedback at touch location
    const rect = heartElement.getBoundingClientRect();
    const popX = clientX || (rect.left + rect.width / 2);
    const popY = clientY || (rect.top + rect.height / 2);

    const popText = document.createElement('div');
    popText.className = 'heart-pop-particle';
    popText.textContent = `+1 Heart! 💖`;
    popText.style.left = `${popX}px`;
    popText.style.top = `${popY}px`;
    document.body.appendChild(popText);

    setTimeout(() => popText.remove(), 800);

    // Remove the caught heart
    heartElement.remove();

    // Update HUD
    updateHeartHUD();

    // Check completion
    if (state.heartsCollected >= state.targetHearts) {
      stopSpawningHearts();
      setTimeout(onHeartsMissionComplete, 500);
    }
  }

  function updateHeartHUD() {
    if (elements.heartsCountNum) {
      elements.heartsCountNum.textContent = state.heartsCollected;
    }
    const pips = elements.heartsPipsContainer.querySelectorAll('.pip');
    pips.forEach((pip, idx) => {
      if (idx < state.heartsCollected) {
        pip.textContent = '💖';
        pip.style.transform = 'scale(1.2)';
      } else {
        pip.textContent = '🤍';
        pip.style.transform = 'scale(1)';
      }
    });
  }

  function onHeartsMissionComplete() {
    sound.fanfareSound();
    launchConfetti(0.5, 0.4, 45);

    // Transition to Stage 2: Mystery Gift
    elements.gameStageHearts.classList.add('stage-hidden');
    elements.gameStageHearts.classList.remove('active-stage');

    elements.gameStageGift.classList.remove('stage-hidden');

    // Update Stepper
    elements.stepNode2.className = 'step-item step-done';
    elements.stepNode3.className = 'step-item step-active';
    elements.bar23.className = 'step-connector active-bar';
  }

  // Handle Opening the Gift Box
  function openMysteryGift() {
    if (state.isGiftUnlocked) return;
    state.isGiftUnlocked = true;

    sound.giftOpenSound();

    // Animate Lid
    elements.giftLid.classList.add('opened');
    elements.giftPromptText.style.display = 'none';

    // Celebration Confetti burst
    launchConfetti(0.5, 0.45, 60);

    // Reveal message and button
    setTimeout(() => {
      elements.giftUnlockedContent.classList.remove('hidden');
    }, 450);
  }

  // --- Screen Three: Personal Birthday Wish & Letter ---
  function setupLetterScreen() {
    // Grand celebratory confetti
    launchConfetti(0.2, 0.3, 35);
    launchConfetti(0.8, 0.3, 35);
    launchConfetti(0.5, 0.2, 50);

    sound.fanfareSound();

    // Reset extra surprises state
    if (elements.finalSurpriseReveal) {
      elements.finalSurpriseReveal.classList.add('hidden');
    }
  }

  // --- Interactive Extra Surprises on Screen Three ---
  function revealFinalSurprise() {
    if (!elements.finalSurpriseReveal) return;
    const isHidden = elements.finalSurpriseReveal.classList.contains('hidden');
    if (isHidden) {
      elements.finalSurpriseReveal.classList.remove('hidden');
      sound.chimePop();
      launchConfetti(0.5, 0.8, 30);
    } else {
      elements.finalSurpriseReveal.classList.add('hidden');
    }
  }

  // Tap Heart Zone: Flying hearts burst
  function burstFlyingHearts(e) {
    const x = e.clientX || window.innerWidth / 2;
    const y = e.clientY || window.innerHeight / 2;
    sound.chimePop();

    const heartEmojis = ['💖', '💕', '💗', '💓', '✨', '🌸', '🎀'];

    for (let i = 0; i < 14; i++) {
      const heart = document.createElement('div');
      heart.className = 'flying-love-heart';
      heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;

      const angle = (Math.random() * 360) * (Math.PI / 180);
      const distance = 80 + Math.random() * 120;
      const dx = `${Math.cos(angle) * distance}px`;
      const dy = `${Math.sin(angle) * distance - 50}px`;
      const rot = `${(Math.random() - 0.5) * 60}deg`;

      heart.style.setProperty('--dx', dx);
      heart.style.setProperty('--dy', dy);
      heart.style.setProperty('--rot', rot);

      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1200);
    }
  }

  // Relive the experience
  function resetAndReplay() {
    stopSpawningHearts();
    switchScreen(1);
    startTypewriterGreeting();
  }

  // Sound Toggle Handler
  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    if (elements.soundToggleBtn) {
      const icon = elements.soundToggleBtn.querySelector('.sound-icon');
      const text = elements.soundToggleBtn.querySelector('.sound-text');
      if (state.soundEnabled) {
        icon.textContent = '🔔';
        text.textContent = 'Sound: ON';
        sound.chimePop();
      } else {
        icon.textContent = '🔕';
        text.textContent = 'Sound: OFF';
      }
    }
  }

  // --- Attach Event Listeners ---
  function initEvents() {
    // Sound Toggle
    if (elements.soundToggleBtn) {
      elements.soundToggleBtn.addEventListener('click', toggleSound);
    }

    // Screen 1 -> Screen 2
    if (elements.btnEnterSurprise) {
      elements.btnEnterSurprise.addEventListener('click', () => {
        sound.chimePop();
        switchScreen(2);
      });
    }

    // Screen 2: Skip Heart Mini-Game
    if (elements.btnSkipHearts) {
      elements.btnSkipHearts.addEventListener('click', () => {
        state.heartsCollected = state.targetHearts;
        updateHeartHUD();
        stopSpawningHearts();
        onHeartsMissionComplete();
      });
    }

    // Screen 2: Gift Box Interaction
    if (elements.mysteryGiftBox) {
      elements.mysteryGiftBox.addEventListener('click', openMysteryGift);
      elements.mysteryGiftBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openMysteryGift();
        }
      });
    }

    // Screen 2 -> Screen 3 (Letter)
    if (elements.btnOpenLetter) {
      elements.btnOpenLetter.addEventListener('click', () => {
        sound.chimePop();
        switchScreen(3);
      });
    }

    // Screen 3: Extra Surprises
    if (elements.btnFinalSurprise) {
      elements.btnFinalSurprise.addEventListener('click', revealFinalSurprise);
    }

    if (elements.btnBurstHearts) {
      elements.btnBurstHearts.addEventListener('click', burstFlyingHearts);
    }

    if (elements.btnReplayExperience) {
      elements.btnReplayExperience.addEventListener('click', () => {
        sound.chimePop();
        resetAndReplay();
      });
    }

    // Touch/click anywhere to awaken audio context gracefully
    window.addEventListener('click', () => sound.init(), { once: true });
    window.addEventListener('touchstart', () => sound.init(), { once: true });
  }

  // --- Bootstrap on Page Load ---
  function init() {
    initAmbientCanvas();
    initEvents();
    startTypewriterGreeting();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
