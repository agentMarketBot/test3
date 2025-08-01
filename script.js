class CountdownApp {
    constructor() {
        this.targetDate = null;
        this.countdownInterval = null;
        this.isRunning = false;
        
        this.initializeElements();
        this.bindEvents();
        this.setDefaultDate();
    }
    
    initializeElements() {
        this.targetDateInput = document.getElementById('target-date');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.daysElement = document.getElementById('days');
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.messageElement = document.getElementById('message');
        this.countdownDisplay = document.getElementById('countdown-display');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.toggleCountdown());
        this.resetBtn.addEventListener('click', () => this.resetCountdown());
        this.targetDateInput.addEventListener('change', () => this.updateTargetDate());
    }
    
    setDefaultDate() {
        // Set default to 1 hour from now
        const now = new Date();
        const defaultDate = new Date(now.getTime() + (60 * 60 * 1000));
        this.targetDateInput.value = this.formatDateTimeLocal(defaultDate);
        this.updateTargetDate();
    }
    
    formatDateTimeLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    
    updateTargetDate() {
        const inputValue = this.targetDateInput.value;
        if (inputValue) {
            this.targetDate = new Date(inputValue);
            if (!this.isRunning) {
                this.updateDisplay();
            }
        }
    }
    
    toggleCountdown() {
        if (!this.targetDate) {
            this.showMessage('Please select a target date and time!', 'error');
            return;
        }
        
        if (this.isRunning) {
            this.stopCountdown();
        } else {
            this.startCountdown();
        }
    }
    
    startCountdown() {
        if (!this.targetDate) return;
        
        const now = new Date().getTime();
        const target = this.targetDate.getTime();
        
        if (target <= now) {
            this.showMessage('Please select a future date and time!', 'error');
            return;
        }
        
        this.isRunning = true;
        this.startBtn.textContent = 'Stop';
        this.targetDateInput.disabled = true;
        this.countdownDisplay.classList.remove('expired');
        this.showMessage('Countdown started!', 'success');
        
        this.countdownInterval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
        
        // Update immediately
        this.updateCountdown();
    }
    
    stopCountdown() {
        this.isRunning = false;
        this.startBtn.textContent = 'Start Countdown';
        this.targetDateInput.disabled = false;
        
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        
        this.showMessage('Countdown stopped.', 'info');
    }
    
    resetCountdown() {
        this.stopCountdown();
        this.setDefaultDate();
        this.updateDisplay();
        this.showMessage('Countdown reset to 1 hour from now.', 'info');
    }
    
    updateCountdown() {
        const now = new Date().getTime();
        const target = this.targetDate.getTime();
        const timeLeft = target - now;
        
        if (timeLeft <= 0) {
            this.onCountdownExpired();
            return;
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        this.displayTime(days, hours, minutes, seconds);
    }
    
    updateDisplay() {
        if (!this.targetDate) return;
        
        const now = new Date().getTime();
        const target = this.targetDate.getTime();
        const timeLeft = target - now;
        
        if (timeLeft <= 0) {
            this.displayTime(0, 0, 0, 0);
            this.showMessage('The selected time has already passed.', 'error');
            return;
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        this.displayTime(days, hours, minutes, seconds);
        this.showMessage('Ready to start countdown!', 'info');
    }
    
    displayTime(days, hours, minutes, seconds) {
        this.daysElement.textContent = String(days).padStart(2, '0');
        this.hoursElement.textContent = String(hours).padStart(2, '0');
        this.minutesElement.textContent = String(minutes).padStart(2, '0');
        this.secondsElement.textContent = String(seconds).padStart(2, '0');
    }
    
    onCountdownExpired() {
        this.stopCountdown();
        this.displayTime(0, 0, 0, 0);
        this.countdownDisplay.classList.add('expired');
        this.showMessage('🎉 Time\'s up! Countdown completed! 🎉', 'expired');
        
        // Play a notification sound if available
        this.playNotificationSound();
    }
    
    playNotificationSound() {
        // Create a simple beep sound using Web Audio API
        try {
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
            console.log('Audio notification not available');
        }
    }
    
    showMessage(text, type = 'info') {
        this.messageElement.textContent = text;
        this.messageElement.className = `message ${type}`;
        
        // Clear message after 3 seconds for non-expired messages
        if (type !== 'expired') {
            setTimeout(() => {
                if (this.messageElement.textContent === text) {
                    this.messageElement.textContent = '';
                    this.messageElement.className = 'message';
                }
            }, 3000);
        }
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CountdownApp();
});