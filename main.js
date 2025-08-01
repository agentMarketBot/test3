class CountdownApp {
    constructor() {
        this.targetDate = null;
        this.intervalId = null;
        this.initializeElements();
        this.bindEvents();
        this.setMinDateTime();
    }

    initializeElements() {
        this.elements = {
            targetDateInput: document.getElementById('target-date'),
            eventNameInput: document.getElementById('event-name'),
            startButton: document.getElementById('start-countdown'),
            resetButton: document.getElementById('reset-countdown'),
            countdownDisplay: document.getElementById('countdown-display'),
            eventTitle: document.getElementById('event-title'),
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            message: document.getElementById('countdown-message')
        };
    }

    bindEvents() {
        this.elements.startButton.addEventListener('click', () => this.startCountdown());
        this.elements.resetButton.addEventListener('click', () => this.resetCountdown());
        
        // Allow Enter key to start countdown
        this.elements.targetDateInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startCountdown();
        });
        
        this.elements.eventNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startCountdown();
        });
    }

    setMinDateTime() {
        // Set minimum date to current date and time
        const now = new Date();
        const minDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString().slice(0, 16);
        this.elements.targetDateInput.min = minDateTime;
    }

    startCountdown() {
        const targetDateTime = this.elements.targetDateInput.value;
        
        if (!targetDateTime) {
            this.showMessage('Please select a target date and time.', 'error');
            return;
        }

        this.targetDate = new Date(targetDateTime);
        const now = new Date();

        if (this.targetDate <= now) {
            this.showMessage('Please select a future date and time.', 'error');
            return;
        }

        // Set event title
        const eventName = this.elements.eventNameInput.value || 'Your Event';
        this.elements.eventTitle.textContent = `Countdown to ${eventName}`;

        // Show countdown display
        this.elements.countdownDisplay.style.display = 'block';
        
        // Start the countdown
        this.updateCountdown();
        this.intervalId = setInterval(() => this.updateCountdown(), 1000);

        this.showMessage('Countdown started!', 'success');
    }

    updateCountdown() {
        const now = new Date();
        const timeDifference = this.targetDate - now;

        if (timeDifference <= 0) {
            this.onCountdownExpired();
            return;
        }

        const timeLeft = this.calculateTimeLeft(timeDifference);
        this.displayTime(timeLeft);
        this.updateMessage(timeLeft);
    }

    calculateTimeLeft(timeDifference) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    }

    displayTime({ days, hours, minutes, seconds }) {
        this.elements.days.textContent = this.formatTime(days);
        this.elements.hours.textContent = this.formatTime(hours);
        this.elements.minutes.textContent = this.formatTime(minutes);
        this.elements.seconds.textContent = this.formatTime(seconds);
    }

    formatTime(time) {
        return time.toString().padStart(2, '0');
    }

    updateMessage({ days, hours, minutes, seconds }) {
        const totalHours = days * 24 + hours;
        let message = '';

        if (days > 0) {
            message = `${days} day${days !== 1 ? 's' : ''} and ${hours} hour${hours !== 1 ? 's' : ''} remaining`;
        } else if (hours > 0) {
            message = `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''} remaining`;
        } else if (minutes > 0) {
            message = `${minutes} minute${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''} remaining`;
        } else {
            message = `${seconds} second${seconds !== 1 ? 's' : ''} remaining`;
        }

        this.elements.message.textContent = message;
        this.elements.message.className = 'countdown-message';
    }

    onCountdownExpired() {
        clearInterval(this.intervalId);
        this.displayTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        this.elements.message.textContent = '🎉 Time\'s up! Your event has arrived! 🎉';
        this.elements.message.className = 'countdown-message expired';
        
        // Play a subtle notification (if supported)
        this.playNotification();
    }

    playNotification() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Audio notification not supported');
        }
    }

    showMessage(text, type) {
        // Temporarily show a message in the input section
        const existingMessage = document.querySelector('.temp-message');
        if (existingMessage) existingMessage.remove();

        const messageEl = document.createElement('div');
        messageEl.className = `temp-message ${type}`;
        messageEl.textContent = text;
        messageEl.style.cssText = `
            margin-top: 1rem;
            padding: 0.5rem;
            border-radius: 5px;
            background: ${type === 'error' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(116, 185, 255, 0.2)'};
            border: 1px solid ${type === 'error' ? 'rgba(255, 107, 107, 0.5)' : 'rgba(116, 185, 255, 0.5)'};
        `;

        this.elements.startButton.parentNode.appendChild(messageEl);
        
        setTimeout(() => messageEl.remove(), 3000);
    }

    resetCountdown() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.elements.countdownDisplay.style.display = 'none';
        this.elements.targetDateInput.value = '';
        this.elements.eventNameInput.value = '';
        this.targetDate = null;

        // Remove any temporary messages
        const existingMessage = document.querySelector('.temp-message');
        if (existingMessage) existingMessage.remove();

        this.setMinDateTime();
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CountdownApp();
});

// Add some utility functions for potential future enhancements
window.CountdownUtils = {
    // Format duration in a human-readable way
    formatDuration: (milliseconds) => {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
        if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    },

    // Get time until a specific date
    getTimeUntil: (targetDate) => {
        return new Date(targetDate) - new Date();
    }
};