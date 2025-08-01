class CountdownTimer {
    constructor() {
        this.targetDate = null;
        this.interval = null;
        this.isActive = false;
        
        this.initializeElements();
        this.attachEventListeners();
        this.setDefaultDate();
    }
    
    initializeElements() {
        this.elements = {
            targetDateInput: document.getElementById('target-date'),
            startBtn: document.getElementById('start-btn'),
            resetBtn: document.getElementById('reset-btn'),
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            message: document.getElementById('message')
        };
    }
    
    attachEventListeners() {
        this.elements.startBtn.addEventListener('click', () => this.toggleCountdown());
        this.elements.resetBtn.addEventListener('click', () => this.resetCountdown());
        this.elements.targetDateInput.addEventListener('change', () => this.validateDate());
    }
    
    setDefaultDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0);
        
        const isoString = tomorrow.toISOString().slice(0, 16);
        this.elements.targetDateInput.value = isoString;
    }
    
    validateDate() {
        const selectedDate = new Date(this.elements.targetDateInput.value);
        const now = new Date();
        
        if (selectedDate <= now) {
            this.elements.message.textContent = 'Please select a future date and time';
            this.elements.message.className = 'message expired';
            return false;
        }
        
        this.elements.message.textContent = '';
        this.elements.message.className = 'message';
        return true;
    }
    
    toggleCountdown() {
        if (this.isActive) {
            this.stopCountdown();
        } else {
            this.startCountdown();
        }
    }
    
    startCountdown() {
        if (!this.validateDate()) {
            return;
        }
        
        this.targetDate = new Date(this.elements.targetDateInput.value);
        this.isActive = true;
        this.elements.startBtn.textContent = 'Stop';
        this.elements.targetDateInput.disabled = true;
        
        this.updateDisplay();
        this.interval = setInterval(() => this.updateDisplay(), 1000);
        
        this.elements.message.textContent = `Counting down to ${this.targetDate.toLocaleString()}`;
        this.elements.message.className = 'message';
    }
    
    stopCountdown() {
        this.isActive = false;
        this.elements.startBtn.textContent = 'Start Countdown';
        this.elements.targetDateInput.disabled = false;
        
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
        this.elements.message.textContent = 'Countdown stopped';
        this.elements.message.className = 'message';
    }
    
    resetCountdown() {
        this.stopCountdown();
        this.setDefaultDate();
        this.updateDisplay(true);
        this.elements.message.textContent = '';
        this.elements.message.className = 'message';
    }
    
    updateDisplay(isReset = false) {
        if (isReset) {
            this.elements.days.textContent = '00';
            this.elements.hours.textContent = '00';
            this.elements.minutes.textContent = '00';
            this.elements.seconds.textContent = '00';
            return;
        }
        
        const now = new Date().getTime();
        const target = this.targetDate.getTime();
        const difference = target - now;
        
        if (difference <= 0) {
            this.handleCountdownExpired();
            return;
        }
        
        const timeValues = this.calculateTimeValues(difference);
        this.displayTimeValues(timeValues);
    }
    
    calculateTimeValues(difference) {
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
    }
    
    displayTimeValues(timeValues) {
        this.elements.days.textContent = this.formatTimeValue(timeValues.days);
        this.elements.hours.textContent = this.formatTimeValue(timeValues.hours);
        this.elements.minutes.textContent = this.formatTimeValue(timeValues.minutes);
        this.elements.seconds.textContent = this.formatTimeValue(timeValues.seconds);
    }
    
    formatTimeValue(value) {
        return value.toString().padStart(2, '0');
    }
    
    handleCountdownExpired() {
        this.elements.days.textContent = '00';
        this.elements.hours.textContent = '00';
        this.elements.minutes.textContent = '00';
        this.elements.seconds.textContent = '00';
        
        this.elements.message.textContent = '🎉 Time\'s up! 🎉';
        this.elements.message.className = 'message expired';
        
        this.stopCountdown();
        this.playNotificationSound();
    }
    
    playNotificationSound() {
        try {
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
        } catch (error) {
            console.log('Audio notification not available');
        }
    }
}

// Initialize the countdown timer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CountdownTimer();
});