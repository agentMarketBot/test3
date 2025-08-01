class CountdownTimer {
    constructor() {
        this.targetDate = null;
        this.intervalId = null;
        this.isRunning = false;
        
        this.elements = {
            datetime: document.getElementById('datetime'),
            startBtn: document.getElementById('start-btn'),
            resetBtn: document.getElementById('reset-btn'),
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            message: document.getElementById('message')
        };
        
        this.init();
    }
    
    init() {
        this.elements.startBtn.addEventListener('click', () => this.handleStart());
        this.elements.resetBtn.addEventListener('click', () => this.handleReset());
        
        // Set minimum datetime to current time
        const now = new Date();
        const localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        this.elements.datetime.min = localISOTime;
        
        this.showMessage('Set a target date and time to start the countdown!', 'info');
    }
    
    handleStart() {
        const datetimeValue = this.elements.datetime.value;
        
        if (!datetimeValue) {
            this.showMessage('Please select a target date and time!', 'error');
            return;
        }
        
        this.targetDate = new Date(datetimeValue);
        const now = new Date();
        
        if (this.targetDate <= now) {
            this.showMessage('Target date must be in the future!', 'error');
            return;
        }
        
        if (this.isRunning) {
            this.stop();
        }
        
        this.start();
        this.showMessage('Countdown started!', 'success');
    }
    
    handleReset() {
        this.stop();
        this.resetDisplay();
        this.elements.datetime.value = '';
        this.showMessage('Countdown reset. Set a new target date!', 'info');
    }
    
    start() {
        this.isRunning = true;
        this.elements.startBtn.textContent = 'Stop';
        this.elements.startBtn.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
        
        this.intervalId = setInterval(() => {
            this.updateDisplay();
        }, 1000);
        
        this.updateDisplay(); // Initial update
    }
    
    stop() {
        this.isRunning = false;
        this.elements.startBtn.textContent = 'Start Countdown';
        this.elements.startBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    updateDisplay() {
        if (!this.targetDate) return;
        
        const now = new Date();
        const timeDiff = this.targetDate - now;
        
        if (timeDiff <= 0) {
            this.onCountdownComplete();
            return;
        }
        
        const timeData = this.calculateTimeUnits(timeDiff);
        this.displayTime(timeData);
    }
    
    calculateTimeUnits(timeDiff) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        return { days, hours, minutes, seconds };
    }
    
    displayTime({ days, hours, minutes, seconds }) {
        this.elements.days.textContent = this.padZero(days);
        this.elements.hours.textContent = this.padZero(hours);
        this.elements.minutes.textContent = this.padZero(minutes);
        this.elements.seconds.textContent = this.padZero(seconds);
    }
    
    resetDisplay() {
        this.elements.days.textContent = '00';
        this.elements.hours.textContent = '00';
        this.elements.minutes.textContent = '00';
        this.elements.seconds.textContent = '00';
    }
    
    onCountdownComplete() {
        this.stop();
        this.resetDisplay();
        this.showMessage('🎉 Time\'s up! The countdown has reached zero!', 'success');
        
        // Optional: Play a sound or show notification
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
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        } catch (error) {
            console.log('Audio notification not available');
        }
    }
    
    showMessage(text, type = 'info') {
        this.elements.message.textContent = text;
        this.elements.message.className = `message ${type}`;
    }
    
    padZero(num) {
        return num.toString().padStart(2, '0');
    }
}

// Initialize the countdown timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CountdownTimer();
});

// Export for potential testing or module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CountdownTimer;
}