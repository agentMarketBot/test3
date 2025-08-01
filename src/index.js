import './style.css';

class CountdownApp {
    constructor() {
        this.timer = null;
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.isRunning = false;
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.hoursInput = document.getElementById('hours');
        this.minutesInput = document.getElementById('minutes');
        this.secondsInput = document.getElementById('seconds');
        
        this.startBtn = document.getElementById('start-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.resetBtn = document.getElementById('reset-btn');
        
        this.displayHours = document.getElementById('display-hours');
        this.displayMinutes = document.getElementById('display-minutes');
        this.displaySeconds = document.getElementById('display-seconds');
        
        this.progressFill = document.getElementById('progress-fill');
        this.status = document.getElementById('status');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        [this.hoursInput, this.minutesInput, this.secondsInput].forEach(input => {
            input.addEventListener('input', () => this.updateDisplay());
        });
    }
    
    start() {
        if (this.isRunning) return;
        
        const hours = parseInt(this.hoursInput.value) || 0;
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;
        
        this.totalSeconds = hours * 3600 + minutes * 60 + seconds;
        
        if (this.totalSeconds <= 0) {
            this.updateStatus('Please set a valid time!');
            return;
        }
        
        this.remainingSeconds = this.totalSeconds;
        this.isRunning = true;
        
        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
        this.updateStatus('Countdown active...');
        this.status.className = 'status active';
        
        this.timer = setInterval(() => {
            this.remainingSeconds--;
            this.updateDisplay();
            this.updateProgress();
            
            if (this.remainingSeconds <= 0) {
                this.finish();
            }
        }, 1000);
    }
    
    stop() {
        if (!this.isRunning) return;
        
        clearInterval(this.timer);
        this.isRunning = false;
        
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.updateStatus('Countdown stopped');
        this.status.className = 'status';
    }
    
    reset() {
        this.stop();
        this.remainingSeconds = 0;
        this.totalSeconds = 0;
        this.updateDisplay();
        this.updateProgress();
        this.updateStatus('Ready to start');
        this.status.className = 'status';
    }
    
    finish() {
        this.stop();
        this.updateStatus('Time\'s up!');
        this.status.className = 'status finished';
        
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Countdown Timer', {
                body: 'Time\'s up!',
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23667eea"/></svg>'
            });
        }
        
        this.playNotificationSound();
    }
    
    updateDisplay() {
        let displaySeconds;
        
        if (this.isRunning) {
            displaySeconds = this.remainingSeconds;
        } else {
            const hours = parseInt(this.hoursInput.value) || 0;
            const minutes = parseInt(this.minutesInput.value) || 0;
            const seconds = parseInt(this.secondsInput.value) || 0;
            displaySeconds = hours * 3600 + minutes * 60 + seconds;
        }
        
        const hours = Math.floor(displaySeconds / 3600);
        const minutes = Math.floor((displaySeconds % 3600) / 60);
        const secs = displaySeconds % 60;
        
        this.displayHours.textContent = hours.toString().padStart(2, '0');
        this.displayMinutes.textContent = minutes.toString().padStart(2, '0');
        this.displaySeconds.textContent = secs.toString().padStart(2, '0');
    }
    
    updateProgress() {
        if (this.totalSeconds > 0) {
            const progress = (this.remainingSeconds / this.totalSeconds) * 100;
            this.progressFill.style.width = `${Math.max(0, progress)}%`;
        } else {
            this.progressFill.style.width = '100%';
        }
    }
    
    updateStatus(message) {
        this.status.textContent = message;
    }
    
    playNotificationSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CountdownApp();
    
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});