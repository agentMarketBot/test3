class CountdownApp {
    constructor() {
        this.targetDate = null;
        this.countdownInterval = null;
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.targetDateInput = document.getElementById('target-date');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.daysEl = document.getElementById('days');
        this.hoursEl = document.getElementById('hours');
        this.minutesEl = document.getElementById('minutes');
        this.secondsEl = document.getElementById('seconds');
        this.messageEl = document.getElementById('message');
        
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0);
        this.targetDateInput.value = this.formatDateTimeLocal(tomorrow);
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startCountdown());
        this.resetBtn.addEventListener('click', () => this.resetCountdown());
    }

    formatDateTimeLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
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

        // Clear any existing interval
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        this.showMessage('Countdown started!', 'success');
        this.startBtn.textContent = 'Update Target';
        
        // Update immediately and then every second
        this.updateCountdown();
        this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
    }

    updateCountdown() {
        const now = new Date().getTime();
        const targetTime = this.targetDate.getTime();
        const difference = targetTime - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            this.daysEl.textContent = String(days).padStart(2, '0');
            this.hoursEl.textContent = String(hours).padStart(2, '0');
            this.minutesEl.textContent = String(minutes).padStart(2, '0');
            this.secondsEl.textContent = String(seconds).padStart(2, '0');

            // Update message based on time remaining
            if (days > 0) {
                this.showMessage(`${days} day${days !== 1 ? 's' : ''} remaining`, 'info');
            } else if (hours > 0) {
                this.showMessage(`${hours} hour${hours !== 1 ? 's' : ''} remaining`, 'info');
            } else if (minutes > 0) {
                this.showMessage(`${minutes} minute${minutes !== 1 ? 's' : ''} remaining`, 'warning');
            } else {
                this.showMessage(`${seconds} second${seconds !== 1 ? 's' : ''} remaining`, 'warning');
            }
        } else {
            // Countdown has finished
            this.daysEl.textContent = '00';
            this.hoursEl.textContent = '00';
            this.minutesEl.textContent = '00';
            this.secondsEl.textContent = '00';
            
            this.showMessage('Time\'s up! 🎉', 'expired');
            this.stopCountdown();
        }
    }

    resetCountdown() {
        this.stopCountdown();
        this.daysEl.textContent = '00';
        this.hoursEl.textContent = '00';
        this.minutesEl.textContent = '00';
        this.secondsEl.textContent = '00';
        this.showMessage('Countdown reset', 'info');
        this.startBtn.textContent = 'Start Countdown';
    }

    stopCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }

    showMessage(text, type = 'info') {
        this.messageEl.textContent = text;
        this.messageEl.className = `message ${type}`;
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CountdownApp();
});