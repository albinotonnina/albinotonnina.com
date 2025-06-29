/**
 * ANIMATION DEBUGGER
 * 
 * Provides real-time debugging information about the current animation state.
 * Shows active scenes, current timing, and element states on screen.
 * 
 * Note: This module provides a lightweight stub in production builds.
 */

// Production stub - lightweight no-op implementation
const createProductionStub = () => ({
  init: () => {},
  toggle: () => {},
  update: () => {},
  logState: () => {},
  exportState: () => ({}),
  jumpToScene: () => {},
  listScenes: () => {},
});

// Development implementation
const createDevelopmentDebugger = () => {

class AnimationDebugger {
  constructor() {
    this.isEnabled = false;
    this.overlay = null;
    this.currentTime = 0;
    this.sceneTiming = null;
    this.activeAnimations = new Map();
    this.lastUpdateTime = 0;
    this.hasShownWelcome = false;
    
    // Create toggle shortcut (Ctrl/Cmd + D)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  /**
   * Initialize the debugger with scene timing information
   */
  init(sceneTiming) {
    this.sceneTiming = sceneTiming;
    this.createOverlay();
    
    // Show welcome message once
    if (!this.hasShownWelcome) {
      console.log('🎬 Animation Debugger available! Press Ctrl/Cmd + D to toggle.');
      this.hasShownWelcome = true;
    }
  }

  /**
   * Toggle the debug overlay on/off
   */
  toggle() {
    this.isEnabled = !this.isEnabled;
    if (this.overlay) {
      this.overlay.style.display = this.isEnabled ? 'block' : 'none';
    }
    
    console.log(`Animation Debugger ${this.isEnabled ? 'enabled' : 'disabled'}`);
    if (this.isEnabled) {
      console.log('Press Ctrl/Cmd + D to toggle debugger');
    }
  }

  /**
   * Update the debugger with current animation state
   */
  update(currentTime, activeElements = []) {
    if (!this.isEnabled || !this.overlay) return;
    
    this.currentTime = currentTime;
    
    // Throttle updates to avoid performance issues
    const now = Date.now();
    if (now - this.lastUpdateTime < 100) return; // Update every 100ms
    this.lastUpdateTime = now;
    
    this.updateDisplay(activeElements);
  }

  /**
   * Create the debug overlay UI
   */
  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'animation-debugger';
    this.overlay.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 350px;
      max-height: 80vh;
      background: rgba(0, 0, 0, 0.85);
      color: #00ff00;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #00ff00;
      z-index: 10000;
      overflow-y: auto;
      display: none;
      box-shadow: 0 4px 20px rgba(0, 255, 0, 0.3);
    `;

    this.overlay.innerHTML = `
      <div style="border-bottom: 1px solid #00ff00; padding-bottom: 10px; margin-bottom: 10px;">
        <h3 style="margin: 0; color: #00ff00; font-size: 14px;">🎬 ANIMATION DEBUGGER</h3>
        <div style="color: #888; font-size: 10px; margin-top: 5px;">Press Ctrl/Cmd + D to toggle</div>
      </div>
      <div id="debug-content"></div>
    `;

    document.body.appendChild(this.overlay);
  }

  /**
   * Update the debug display with current information
   */
  updateDisplay(activeElements) {
    const content = document.getElementById('debug-content');
    if (!content) return;

    const currentScene = this.getCurrentScene();
    const sceneProgress = this.getSceneProgress(currentScene);
    const timeInfo = this.getTimeInfo();

    content.innerHTML = `
      ${timeInfo}
      ${this.renderCurrentScene(currentScene, sceneProgress)}
      ${this.renderActiveAnimations(activeElements)}
      ${this.renderSceneTimeline()}
    `;
  }

  /**
   * Get current scene based on timing
   */
  getCurrentScene() {
    if (!this.sceneTiming) return 'unknown';
    
    const time = this.currentTime;
    
    if (time < this.sceneTiming.freelance[0]) return 'desk';
    if (time >= this.sceneTiming.freelance[0] && time < this.sceneTiming.freelance[1]) return 'freelance';
    if (time >= this.sceneTiming.company[0] && time < this.sceneTiming.company[1]) return 'company';
    if (time >= this.sceneTiming.founder[0] && time < this.sceneTiming.founder[1]) return 'founder';
    if (time >= this.sceneTiming.frame[0] && time < this.sceneTiming.frame[1]) return 'frame';
    if (time >= this.sceneTiming.lightsOff[0] && time < this.sceneTiming.lightsOff[1]) return 'lightsOff';
    if (time >= this.sceneTiming.contacts[0] && time < this.sceneTiming.contacts[1]) return 'contacts';
    
    return 'post-contacts';
  }

  /**
   * Calculate progress within current scene
   */
  getSceneProgress(scene) {
    if (!this.sceneTiming || scene === 'unknown') return 0;
    
    const time = this.currentTime;
    let sceneStart, sceneEnd;

    switch (scene) {
      case 'desk':
        return Math.min(1, time / this.sceneTiming.freelance[0]);
      case 'freelance':
        [sceneStart, sceneEnd] = this.sceneTiming.freelance;
        break;
      case 'company':
        [sceneStart, sceneEnd] = this.sceneTiming.company;
        break;
      case 'founder':
        [sceneStart, sceneEnd] = this.sceneTiming.founder;
        break;
      case 'frame':
        [sceneStart, sceneEnd] = this.sceneTiming.frame;
        break;
      case 'lightsOff':
        [sceneStart, sceneEnd] = this.sceneTiming.lightsOff;
        break;
      case 'contacts':
        [sceneStart, sceneEnd] = this.sceneTiming.contacts;
        break;
      default:
        return 1;
    }

    return Math.max(0, Math.min(1, (time - sceneStart) / (sceneEnd - sceneStart)));
  }

  /**
   * Generate time information display
   */
  getTimeInfo() {
    const totalDuration = 12200; // From DURATION constant in transitions.js
    const progress = (this.currentTime / totalDuration) * 100;
    
    return `
      <div style="margin-bottom: 15px; padding: 8px; background: rgba(0, 255, 0, 0.1); border-radius: 4px;">
        <div><strong>⏱️ TIME:</strong> ${this.currentTime.toFixed(0)}ms / ${totalDuration}ms</div>
        <div><strong>📊 PROGRESS:</strong> ${progress.toFixed(1)}%</div>
        <div style="margin-top: 5px;">
          <div style="background: #333; height: 4px; border-radius: 2px;">
            <div style="background: #00ff00; height: 100%; width: ${progress}%; border-radius: 2px; transition: width 0.1s;"></div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render current scene information
   */
  renderCurrentScene(scene, progress) {
    const sceneEmojis = {
      desk: '🖥️',
      freelance: '🏠',
      company: '🏢', 
      founder: '🚀',
      frame: '🖼️',
      lightsOff: '🌙',
      contacts: '💻',
      'post-contacts': '✅'
    };

    const progressBar = '█'.repeat(Math.floor(progress * 10)) + '░'.repeat(10 - Math.floor(progress * 10));

    return `
      <div style="margin-bottom: 15px; padding: 8px; background: rgba(0, 255, 0, 0.1); border-radius: 4px;">
        <div><strong>${sceneEmojis[scene] || '❓'} CURRENT SCENE:</strong> ${scene.toUpperCase()}</div>
        <div><strong>🎯 SCENE PROGRESS:</strong> ${(progress * 100).toFixed(1)}%</div>
        <div style="font-family: monospace; margin-top: 5px;">[${progressBar}]</div>
      </div>
    `;
  }

  /**
   * Render active animations
   */
  renderActiveAnimations(activeElements) {
    const maxVisible = 8; // Limit to prevent overflow
    const visibleElements = activeElements.slice(0, maxVisible);
    const remaining = activeElements.length - maxVisible;

    let animationsHtml = `
      <div style="margin-bottom: 15px;">
        <div style="border-bottom: 1px solid #444; padding-bottom: 5px; margin-bottom: 8px;">
          <strong>🎭 ACTIVE ANIMATIONS (${activeElements.length})</strong>
        </div>
    `;

    if (visibleElements.length === 0) {
      animationsHtml += `<div style="color: #666; font-style: italic;">No active animations</div>`;
    } else {
      visibleElements.forEach(element => {
        const truncatedName = element.length > 25 ? element.substring(0, 25) + '...' : element;
        animationsHtml += `<div style="color: #9f9;">• ${truncatedName}</div>`;
      });

      if (remaining > 0) {
        animationsHtml += `<div style="color: #666; margin-top: 5px;">... and ${remaining} more</div>`;
      }
    }

    animationsHtml += `</div>`;
    return animationsHtml;
  }

  /**
   * Render scene timeline
   */
  renderSceneTimeline() {
    if (!this.sceneTiming) return '';

    const scenes = [
      { name: 'DESK', start: this.sceneTiming.desk, end: this.sceneTiming.freelance[0], emoji: '🖥️' },
      { name: 'FREELANCE', start: this.sceneTiming.freelance[0], end: this.sceneTiming.freelance[1], emoji: '🏠' },
      { name: 'COMPANY', start: this.sceneTiming.company[0], end: this.sceneTiming.company[1], emoji: '🏢' },
      { name: 'FOUNDER', start: this.sceneTiming.founder[0], end: this.sceneTiming.founder[1], emoji: '🚀' },
      { name: 'FRAME', start: this.sceneTiming.frame[0], end: this.sceneTiming.frame[1], emoji: '🖼️' },
      { name: 'LIGHTS OFF', start: this.sceneTiming.lightsOff[0], end: this.sceneTiming.lightsOff[1], emoji: '🌙' },
      { name: 'CONTACTS', start: this.sceneTiming.contacts[0], end: this.sceneTiming.contacts[1], emoji: '💻' },
    ];

    let timelineHtml = `
      <div>
        <div style="border-bottom: 1px solid #444; padding-bottom: 5px; margin-bottom: 8px;">
          <strong>📅 SCENE TIMELINE</strong>
        </div>
    `;

    scenes.forEach(scene => {
      const isActive = this.currentTime >= scene.start && this.currentTime <= scene.end;
      const isPast = this.currentTime > scene.end;
      const color = isActive ? '#00ff00' : isPast ? '#666' : '#999';
      const indicator = isActive ? '▶️' : isPast ? '✅' : '⏳';
      
      timelineHtml += `
        <div style="color: ${color}; margin: 3px 0; display: flex; justify-content: space-between;">
          <span>${indicator} ${scene.emoji} ${scene.name}</span>
          <span style="font-size: 10px;">${scene.start}-${scene.end}ms</span>
        </div>
      `;
    });

    timelineHtml += `</div>`;
    return timelineHtml;
  }

  /**
   * Log animation state to console
   */
  logState() {
    if (!this.isEnabled) return;
    
    console.group('🎬 Animation State');
    console.log('Current Time:', this.currentTime);
    console.log('Current Scene:', this.getCurrentScene());
    console.log('Scene Timing:', this.sceneTiming);
    console.groupEnd();
  }

  /**
   * Export current state as JSON for debugging
   */
  exportState() {
    return {
      currentTime: this.currentTime,
      currentScene: this.getCurrentScene(),
      sceneProgress: this.getSceneProgress(this.getCurrentScene()),
      sceneTiming: this.sceneTiming,
      isEnabled: this.isEnabled
    };
  }

  /**
   * Jump to a specific scene (for testing)
   */
  jumpToScene(sceneName) {
    if (!this.sceneTiming || !this.sceneTiming[sceneName]) {
      console.error(`Scene "${sceneName}" not found. Available scenes:`, Object.keys(this.sceneTiming));
      return;
    }

    let targetTime;
    if (Array.isArray(this.sceneTiming[sceneName])) {
      targetTime = this.sceneTiming[sceneName][0]; // Start of scene
    } else {
      targetTime = this.sceneTiming[sceneName];
    }

    window.scrollTo(0, targetTime);
    console.log(`🎬 Jumped to ${sceneName} scene at ${targetTime}ms`);
  }

  /**
   * List all available scenes
   */
  listScenes() {
    if (!this.sceneTiming) {
      console.log('Scene timing not initialized');
      return;
    }

    console.group('🎭 Available Scenes');
    Object.entries(this.sceneTiming).forEach(([name, timing]) => {
      const timeRange = Array.isArray(timing) ? `${timing[0]}-${timing[1]}ms` : `${timing}ms+`;
      console.log(`${name}: ${timeRange}`);
    });
    console.groupEnd();
  }
}

  return new AnimationDebugger();
};

// Create and export the appropriate implementation
const debuggerInstance = process.env.NODE_ENV === 'production' 
  ? createProductionStub() 
  : createDevelopmentDebugger();

// Make debugger available globally for console access in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  window.animationDebugger = debuggerInstance;
}

export default debuggerInstance;
