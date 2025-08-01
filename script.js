class CountdownTimer {
    constructor() {
        this.countdownInterval = null;
        this.targetDate = null;
        this.isRunning = false;
        
        this.initializeElements();
        this.bindEvents();
        this.setDefaultDateTime();
    }
    
    initializeElements() {
        this.datetimeInput = document.getElementById('datetime-input');
        this.startBtn = document.getElementById('start-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.message = document.getElementById('message');
        
        this.timeElements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startCountdown());
        this.stopBtn.addEventListener('click', () => this.stopCountdown());
    }
    
    setDefaultDateTime() {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const formatted = tomorrow.toISOString().slice(0, 16);
        this.datetimeInput.value = formatted;
    }
    
    startCountdown() {
        const inputValue = this.datetimeInput.value;
        
        if (!inputValue) {
            this.showMessage('Please select a date and time!', 'error');
            return;
        }
        
        this.targetDate = new Date(inputValue);
        const now = new Date();
        
        if (this.targetDate <= now) {
            this.showMessage('Please select a future date and time!', 'error');
            return;
        }
        
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
        this.datetimeInput.disabled = true;
        
        this.showMessage('Countdown started!', 'running');
        this.updateCountdown();
        this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
    }
    
    stopCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.datetimeInput.disabled = false;
        
        this.showMessage('Countdown stopped.', '');
        this.resetDisplay();
    }
    
    updateCountdown() {
        const now = new Date();
        const timeLeft = this.targetDate - now;
        
        if (timeLeft <= 0) {
            this.onCountdownExpired();
            return;
        }
        
        const timeUnits = this.calculateTimeUnits(timeLeft);
        this.updateDisplay(timeUnits);
    }
    
    calculateTimeUnits(timeLeft) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        return { days, hours, minutes, seconds };
    }
    
    updateDisplay(timeUnits) {
        Object.keys(timeUnits).forEach(unit => {
            this.timeElements[unit].textContent = this.padZero(timeUnits[unit]);
        });
    }
    
    resetDisplay() {
        Object.values(this.timeElements).forEach(element => {
            element.textContent = '00';
        });
    }
    
    onCountdownExpired() {
        this.stopCountdown();
        this.showMessage('🎉 Time\'s up! 🎉', 'expired');
        this.playNotificationSound();
    }
    
    playNotificationSound() {
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUgCkGU2/LNeSsFJYDM8dqJOwkWZLnr57BdGg8+ltryxnkpBSl+zPLaizsIGGS57OihUgwLUKXh8bllIAg+ltrzxnkpBSl+zPLaizsIGGS57OihUgwLUKXh8bllIAg+ltrzxnkpBSl+zPLaizsIGGS57OihUgwLUKXh8bllIAg+ltrzxnkpBSl+zPLaizsIGGS57OihUgwLUKXh8bllIAg+ltrzxnkpBSl+zPLaizsIGGS57OihUgwLUKXh8bllIAg+ltrzxnkpBSl+zPLaizsIGGS57OihUgwLUKXh8bllIAg+ltrzxnkpBSl+zPLaizsIGGS57OihUgwLUKXh8bllIAg+ltrzxnkpBSl+zPLaizsIGGS57OihUgwLUKXh8bllIAg+ltrzxnkpBSl+zPLaizsIGGS57OihUgwLUKXh8bllIAg+ltrzxnkpBSl+zPLaizsIGGS57OihUgwLUKXh8bllIAg+ltrzxnkpBSl+zPLaizsIGGS57OihUgwLUKXh8bllIAg+ltrzxnkpBSl+zPLaizsIGGS57OihUgwLUKXh8bllIAg+ltrzxnkpBSl+zPLaizsIGGS57OihUgwLUKXh8bllIAg+ltrzxnkpBSl+zPLaizsIGGS57OihUgwLUKXh8bllIAg+ltrzxnkpBSl+zPLaizsIGGS57OihUgwLUKXh8bllIAg+ltrzxnkpBSl+zPLaizsIGGS57OihUgwLUKXh8bllIA==');
            audio.play().catch(e => console.log('Could not play notification sound:', e));
        } catch (e) {
            console.log('Could not create notification sound:', e);
        }
    }
    
    showMessage(text, className = '') {
        this.message.textContent = text;
        this.message.className = `message ${className}`;
    }
    
    padZero(num) {
        return num.toString().padStart(2, '0');
    }
}

// Initialize the countdown timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CountdownTimer();
});