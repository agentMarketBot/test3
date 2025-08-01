import './styles.css';

class CountdownApp {
    constructor() {
        this.targetDate = null;
        this.intervalId = null;
        this.isPaused = false;
        this.remainingTime = 0;
        
        this.initializeElements();
        this.attachEventListeners();
        this.setDefaultDate();
    }
    
    initializeElements() {
        this.targetDateInput = document.getElementById('target-date');
        this.startButton = document.getElementById('start-countdown');
        this.resetButton = document.getElementById('reset-countdown');
        this.pauseButton = document.getElementById('pause-countdown');
        this.daysElement = document.getElementById('days');
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.messageElement = document.getElementById('message');
        this.countdownDisplay = document.getElementById('countdown-display');
    }
    
    attachEventListeners() {
        this.startButton.addEventListener('click', () => this.startCountdown());
        this.resetButton.addEventListener('click', () => this.resetCountdown());
        this.pauseButton.addEventListener('click', () => this.togglePause());
    }
    
    setDefaultDate() {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const defaultDate = tomorrow.toISOString().slice(0, 16);
        this.targetDateInput.value = defaultDate;
    }
    
    startCountdown() {
        const inputValue = this.targetDateInput.value;
        if (!inputValue) {
            this.showMessage('Please select a target date and time!', 'error');
            return;
        }
        
        this.targetDate = new Date(inputValue);
        const now = new Date();
        
        if (this.targetDate <= now) {
            this.showMessage('Please select a future date and time!', 'error');
            return;
        }
        
        this.isPaused = false;
        this.startButton.textContent = 'Running...';
        this.startButton.disabled = true;
        this.pauseButton.textContent = 'Pause';
        this.messageElement.textContent = '';
        this.countdownDisplay.classList.remove('expired');
        
        this.updateCountdown();
        this.intervalId = setInterval(() => this.updateCountdown(), 1000);
    }
    
    updateCountdown() {
        if (this.isPaused) return;
        
        const now = new Date();
        const timeDifference = this.targetDate - now;
        
        if (timeDifference <= 0) {
            this.countdownExpired();
            return;
        }
        
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        
        this.daysElement.textContent = String(days).padStart(2, '0');
        this.hoursElement.textContent = String(hours).padStart(2, '0');
        this.minutesElement.textContent = String(minutes).padStart(2, '0');
        this.secondsElement.textContent = String(seconds).padStart(2, '0');
        
        this.remainingTime = timeDifference;
    }
    
    countdownExpired() {
        clearInterval(this.intervalId);
        this.daysElement.textContent = '00';
        this.hoursElement.textContent = '00';
        this.minutesElement.textContent = '00';
        this.secondsElement.textContent = '00';
        
        this.showMessage('🎉 Time\'s Up! 🎉', 'success');
        this.countdownDisplay.classList.add('expired');
        this.startButton.disabled = false;
        this.startButton.textContent = 'Start Countdown';
        this.pauseButton.textContent = 'Pause';
        
        // Play a notification sound (if supported)
        this.playNotificationSound();
    }
    
    resetCountdown() {
        clearInterval(this.intervalId);
        this.isPaused = false;
        this.remainingTime = 0;
        
        this.daysElement.textContent = '00';
        this.hoursElement.textContent = '00';
        this.minutesElement.textContent = '00';
        this.secondsElement.textContent = '00';
        
        this.startButton.disabled = false;
        this.startButton.textContent = 'Start Countdown';
        this.pauseButton.textContent = 'Pause';
        this.messageElement.textContent = '';
        this.countdownDisplay.classList.remove('expired');
    }
    
    togglePause() {
        if (!this.intervalId) return;
        
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.pauseButton.textContent = 'Resume';
            this.showMessage('⏸️ Countdown Paused', 'warning');
        } else {
            this.pauseButton.textContent = 'Pause';
            this.messageElement.textContent = '';
        }
    }
    
    showMessage(message, type = 'info') {
        this.messageElement.textContent = message;
        this.messageElement.className = `message ${type}`;
        
        if (type === 'error' || type === 'warning') {
            setTimeout(() => {
                if (this.messageElement.textContent === message) {
                    this.messageElement.textContent = '';
                    this.messageElement.className = 'message';
                }
            }, 3000);
        }
    }
    
    playNotificationSound() {
        try {
            // Create a simple beep sound using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Audio notification not supported');
        }
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CountdownApp();
});