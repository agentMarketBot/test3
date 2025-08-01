import './style.css'

class CountdownApp {
  constructor() {
    this.targetDate = null;
    this.intervalId = null;
    this.isRunning = false;
    this.init();
  }

  init() {
    this.createHTML();
    this.bindEvents();
    this.updateDisplay();
  }

  createHTML() {
    document.querySelector('#app').innerHTML = `
      <div class="countdown-container">
        <h1 class="countdown-title">Countdown Timer</h1>
        
        <div class="countdown-input">
          <div class="input-group">
            <label for="days">Days:</label>
            <input type="number" id="days" min="0" max="365" value="0">
          </div>
          <div class="input-group">
            <label for="hours">Hours:</label>
            <input type="number" id="hours" min="0" max="23" value="0">
          </div>
          <div class="input-group">
            <label for="minutes">Minutes:</label>
            <input type="number" id="minutes" min="0" max="59" value="5">
          </div>
          <div class="input-group">
            <label for="seconds">Seconds:</label>
            <input type="number" id="seconds" min="0" max="59" value="0">
          </div>
        </div>

        <div class="countdown-display">
          <div class="time-unit">
            <div class="time-value" id="display-days">00</div>
            <div class="time-label">Days</div>
          </div>
          <div class="time-unit">
            <div class="time-value" id="display-hours">00</div>
            <div class="time-label">Hours</div>
          </div>
          <div class="time-unit">
            <div class="time-value" id="display-minutes">05</div>
            <div class="time-label">Minutes</div>
          </div>
          <div class="time-unit">
            <div class="time-value" id="display-seconds">00</div>
            <div class="time-label">Seconds</div>
          </div>
        </div>

        <div class="controls">
          <button id="start-btn">Start</button>
          <button id="pause-btn" disabled>Pause</button>
          <button id="reset-btn">Reset</button>
        </div>
      </div>
    `;
  }

  bindEvents() {
    document.getElementById('start-btn').addEventListener('click', () => this.start());
    document.getElementById('pause-btn').addEventListener('click', () => this.pause());
    document.getElementById('reset-btn').addEventListener('click', () => this.reset());

    // Update display when inputs change
    ['days', 'hours', 'minutes', 'seconds'].forEach(unit => {
      document.getElementById(unit).addEventListener('input', () => {
        if (!this.isRunning) {
          this.updateDisplay();
        }
      });
    });
  }

  start() {
    if (!this.isRunning) {
      this.setTargetDate();
      this.isRunning = true;
      this.intervalId = setInterval(() => this.tick(), 1000);
      
      document.getElementById('start-btn').disabled = true;
      document.getElementById('pause-btn').disabled = false;
      
      // Disable inputs while running
      ['days', 'hours', 'minutes', 'seconds'].forEach(unit => {
        document.getElementById(unit).disabled = true;
      });
    }
  }

  pause() {
    if (this.isRunning) {
      this.isRunning = false;
      clearInterval(this.intervalId);
      
      document.getElementById('start-btn').disabled = false;
      document.getElementById('pause-btn').disabled = true;
      
      // Re-enable inputs
      ['days', 'hours', 'minutes', 'seconds'].forEach(unit => {
        document.getElementById(unit).disabled = false;
      });
    }
  }

  reset() {
    this.pause();
    
    // Reset inputs to default
    document.getElementById('days').value = 0;
    document.getElementById('hours').value = 0;
    document.getElementById('minutes').value = 5;
    document.getElementById('seconds').value = 0;
    
    this.updateDisplay();
    this.clearFinishedState();
  }

  setTargetDate() {
    const days = parseInt(document.getElementById('days').value) || 0;
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;

    const totalMs = (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds) * 1000;
    this.targetDate = new Date(Date.now() + totalMs);
  }

  tick() {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;

    if (distance < 0) {
      this.finish();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.updateDisplayValues(days, hours, minutes, seconds);
  }

  updateDisplay() {
    const days = parseInt(document.getElementById('days').value) || 0;
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;

    this.updateDisplayValues(days, hours, minutes, seconds);
  }

  updateDisplayValues(days, hours, minutes, seconds) {
    document.getElementById('display-days').textContent = String(days).padStart(2, '0');
    document.getElementById('display-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('display-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('display-seconds').textContent = String(seconds).padStart(2, '0');
  }

  finish() {
    this.pause();
    this.updateDisplayValues(0, 0, 0, 0);
    
    // Add finished state styling
    document.querySelectorAll('.time-value').forEach(el => {
      el.classList.add('finished');
    });
    
    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Countdown Finished!', {
        body: 'Your countdown timer has reached zero.',
        icon: '/vite.svg'
      });
    }
    
    // Play audio notification (if available)
    this.playNotificationSound();
  }

  clearFinishedState() {
    document.querySelectorAll('.time-value').forEach(el => {
      el.classList.remove('finished');
    });
  }

  playNotificationSound() {
    // Create a simple beep sound using Web Audio API
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    }
  }
}

// Request notification permission on load
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

// Initialize the app
new CountdownApp();