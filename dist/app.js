class CountdownTimer {
    constructor() {
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.isRunning = false;
        this.interval = null;
        
        this.hoursInput = document.getElementById('hours');
        this.minutesInput = document.getElementById('minutes');
        this.secondsInput = document.getElementById('seconds');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.timeDisplay = document.getElementById('timeDisplay');
        this.progress = document.getElementById('progress');
        this.status = document.getElementById('status');
        
        this.init();
    }
    
    init() {
        this.updateDisplay();
        this.attachEventListeners();
    }
    
    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // Update display when inputs change
        [this.hoursInput, this.minutesInput, this.secondsInput].forEach(input => {
            input.addEventListener('input', () => {
                if (!this.isRunning) {
                    this.updateDisplay();
                }
            });
        });
        
        // Prevent negative values and enforce limits
        this.hoursInput.addEventListener('change', () => {
            this.hoursInput.value = Math.max(0, Math.min(23, this.hoursInput.value));
        });
        
        this.minutesInput.addEventListener('change', () => {
            this.minutesInput.value = Math.max(0, Math.min(59, this.minutesInput.value));
        });
        
        this.secondsInput.addEventListener('change', () => {
            this.secondsInput.value = Math.max(0, Math.min(59, this.secondsInput.value));
        });
    }
    
    start() {
        if (!this.isRunning) {
            // If starting fresh, calculate total time
            if (this.remainingSeconds === 0) {
                this.totalSeconds = this.calculateTotalSeconds();
                this.remainingSeconds = this.totalSeconds;
                
                if (this.totalSeconds === 0) {
                    this.updateStatus('Please set a time greater than 0');
                    return;
                }
            }
            
            this.isRunning = true;
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.updateStatus('Running...');
            
            // Disable inputs while running
            this.disableInputs(true);
            
            this.interval = setInterval(() => {
                this.remainingSeconds--;
                this.updateDisplay();
                this.updateProgress();
                
                if (this.remainingSeconds <= 0) {
                    this.finish();
                }
            }, 1000);
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.updateStatus('Paused');
            
            clearInterval(this.interval);
        }
    }
    
    reset() {
        this.isRunning = false;
        this.remainingSeconds = 0;
        this.totalSeconds = 0;
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        this.disableInputs(false);
        
        clearInterval(this.interval);
        
        this.updateDisplay();
        this.updateProgress();
        this.updateStatus('Ready to start');
        this.status.classList.remove('finished');
    }
    
    finish() {
        this.isRunning = false;
        this.remainingSeconds = 0;
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        this.disableInputs(false);
        
        clearInterval(this.interval);
        
        this.updateDisplay();
        this.updateProgress();
        this.updateStatus('Time\'s up!');
        this.status.classList.add('finished');
        
        // Play notification sound (if available)
        this.playNotificationSound();
        
        // Show browser notification (if permission granted)
        this.showNotification();
    }
    
    calculateTotalSeconds() {
        const hours = parseInt(this.hoursInput.value) || 0;
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;
        
        return hours * 3600 + minutes * 60 + seconds;
    }
    
    updateDisplay() {
        let seconds = this.remainingSeconds;
        
        if (seconds === 0 && !this.isRunning) {
            // Show input values when not running
            seconds = this.calculateTotalSeconds();
        }
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            this.timeDisplay.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            this.timeDisplay.textContent = 
                `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }
    
    updateProgress() {
        if (this.totalSeconds > 0) {
            const progressPercent = ((this.totalSeconds - this.remainingSeconds) / this.totalSeconds) * 100;
            this.progress.style.width = `${progressPercent}%`;
        } else {
            this.progress.style.width = '0%';
        }
    }
    
    updateStatus(message) {
        this.status.textContent = message;
    }
    
    disableInputs(disabled) {
        this.hoursInput.disabled = disabled;
        this.minutesInput.disabled = disabled;
        this.secondsInput.disabled = disabled;
    }
    
    playNotificationSound() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        } catch (error) {
            console.log('Audio notification not available');
        }
    }
    
    showNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Countdown Timer', {
                body: 'Time\'s up!',
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23667eea"/></svg>'
            });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Countdown Timer', {
                        body: 'Time\'s up!',
                        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23667eea"/></svg>'
                    });
                }
            });
        }
    }
}

// Initialize the countdown timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CountdownTimer();
});

// Request notification permission on page load
document.addEventListener('DOMContentLoaded', () => {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});