class CountdownApp {
    constructor() {
        this.countdownInterval = null;
        this.targetDate = null;
        this.eventName = '';
        
        this.initializeElements();
        this.bindEvents();
        this.loadSavedCountdown();
    }
    
    initializeElements() {
        this.eventNameInput = document.getElementById('event-name');
        this.targetDateInput = document.getElementById('target-date');
        this.startButton = document.getElementById('start-countdown');
        this.resetButton = document.getElementById('reset-countdown');
        this.countdownDisplay = document.getElementById('countdown-display');
        this.eventTitle = document.getElementById('event-title');
        this.statusMessage = document.getElementById('status-message');
        
        this.timeElements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
    }
    
    bindEvents() {
        this.startButton.addEventListener('click', () => this.startCountdown());
        this.resetButton.addEventListener('click', () => this.resetCountdown());
        
        // Set minimum date to current time
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString().slice(0, 16);
        this.targetDateInput.min = localDateTime;
    }
    
    startCountdown() {
        const eventName = this.eventNameInput.value.trim();
        const targetDateTime = this.targetDateInput.value;
        
        if (!eventName) {
            alert('Please enter an event name');
            return;
        }
        
        if (!targetDateTime) {
            alert('Please select a target date and time');
            return;
        }
        
        this.targetDate = new Date(targetDateTime);
        this.eventName = eventName;
        
        // Check if target date is in the future
        if (this.targetDate <= new Date()) {
            alert('Please select a future date and time');
            return;
        }
        
        // Save countdown to localStorage
        this.saveCountdown();
        
        // Show countdown display
        this.countdownDisplay.style.display = 'block';
        this.eventTitle.textContent = this.eventName;
        
        // Start the countdown timer
        this.updateCountdown();
        this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
        
        // Hide input section
        document.querySelector('.input-section').style.display = 'none';
    }
    
    updateCountdown() {
        const now = new Date().getTime();
        const targetTime = this.targetDate.getTime();
        const timeDifference = targetTime - now;
        
        if (timeDifference <= 0) {
            this.handleCountdownComplete();
            return;
        }
        
        const timeUnits = this.calculateTimeUnits(timeDifference);
        this.displayTime(timeUnits);
        this.clearStatusMessage();
    }
    
    calculateTimeUnits(timeDifference) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        
        return { days, hours, minutes, seconds };
    }
    
    displayTime(timeUnits) {
        Object.keys(timeUnits).forEach(unit => {
            this.timeElements[unit].textContent = 
                timeUnits[unit].toString().padStart(2, '0');
        });
    }
    
    handleCountdownComplete() {
        clearInterval(this.countdownInterval);
        
        // Display completion message
        this.statusMessage.textContent = `🎉 ${this.eventName} has arrived!`;
        this.statusMessage.className = 'status-message completed';
        
        // Reset all time units to 00
        Object.values(this.timeElements).forEach(element => {
            element.textContent = '00';
        });
        
        // Clear saved countdown
        this.clearSavedCountdown();
        
        // Play celebration animation
        this.celebrateCompletion();
    }
    
    celebrateCompletion() {
        // Add celebration effect to countdown display
        this.countdownDisplay.style.animation = 'none';
        setTimeout(() => {
            this.countdownDisplay.style.animation = 'pulse 1s ease-in-out infinite';
        }, 10);
        
        // Create confetti effect
        this.createConfetti();
    }
    
    createConfetti() {
        const colors = ['#667eea', '#764ba2', '#48bb78', '#f56565', '#ed8936'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-10px';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '1000';
                confetti.style.animation = 'fall 3s linear forwards';
                
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 100);
        }
    }
    
    resetCountdown() {
        // Clear the interval
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        
        // Reset form
        this.eventNameInput.value = '';
        this.targetDateInput.value = '';
        
        // Hide countdown display
        this.countdownDisplay.style.display = 'none';
        this.countdownDisplay.style.animation = 'none';
        
        // Show input section
        document.querySelector('.input-section').style.display = 'block';
        
        // Clear saved countdown
        this.clearSavedCountdown();
        
        // Reset status message
        this.clearStatusMessage();
    }
    
    saveCountdown() {
        const countdownData = {
            eventName: this.eventName,
            targetDate: this.targetDate.toISOString()
        };
        localStorage.setItem('countdownApp', JSON.stringify(countdownData));
    }
    
    loadSavedCountdown() {
        const savedData = localStorage.getItem('countdownApp');
        if (savedData) {
            try {
                const { eventName, targetDate } = JSON.parse(savedData);
                const savedTargetDate = new Date(targetDate);
                
                // Check if saved countdown is still valid (in the future)
                if (savedTargetDate > new Date()) {
                    this.eventNameInput.value = eventName;
                    this.targetDateInput.value = new Date(savedTargetDate.getTime() - 
                        savedTargetDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                } else {
                    this.clearSavedCountdown();
                }
            } catch (error) {
                console.error('Error loading saved countdown:', error);
                this.clearSavedCountdown();
            }
        }
    }
    
    clearSavedCountdown() {
        localStorage.removeItem('countdownApp');
    }
    
    clearStatusMessage() {
        this.statusMessage.textContent = '';
        this.statusMessage.className = 'status-message';
    }
}

// Add CSS animation for confetti
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CountdownApp();
});