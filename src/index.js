import './style.css';

class CountdownTimer {
    constructor() {
        this.totalTime = 0;
        this.remainingTime = 0;
        this.isRunning = false;
        this.intervalId = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.hoursInput = document.getElementById('hours');
        this.minutesInput = document.getElementById('minutes');
        this.secondsInput = document.getElementById('seconds');
        
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.displayHours = document.getElementById('displayHours');
        this.displayMinutes = document.getElementById('displayMinutes');
        this.displaySeconds = document.getElementById('displaySeconds');
        
        this.progressFill = document.getElementById('progressFill');
        this.completionMessage = document.getElementById('completionMessage');
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startCountdown());
        this.pauseBtn.addEventListener('click', () => this.pauseCountdown());
        this.resetBtn.addEventListener('click', () => this.resetCountdown());
        
        [this.hoursInput, this.minutesInput, this.secondsInput].forEach(input => {
            input.addEventListener('input', () => this.updateFromInputs());
        });
    }
    
    updateFromInputs() {
        if (!this.isRunning) {
            const hours = parseInt(this.hoursInput.value) || 0;
            const minutes = parseInt(this.minutesInput.value) || 0;
            const seconds = parseInt(this.secondsInput.value) || 0;
            
            this.totalTime = hours * 3600 + minutes * 60 + seconds;
            this.remainingTime = this.totalTime;
            this.updateDisplay();
            this.updateProgress();
        }
    }
    
    startCountdown() {
        if (this.remainingTime <= 0) {
            this.updateFromInputs();
        }
        
        if (this.remainingTime > 0) {
            this.isRunning = true;
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.completionMessage.classList.add('hidden');
            
            this.intervalId = setInterval(() => {
                this.remainingTime--;
                this.updateDisplay();
                this.updateProgress();
                
                if (this.remainingTime <= 0) {
                    this.completeCountdown();
                }
            }, 1000);
        }
    }
    
    pauseCountdown() {
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    resetCountdown() {
        this.pauseCountdown();
        this.updateFromInputs();
        this.completionMessage.classList.add('hidden');
    }
    
    completeCountdown() {
        this.pauseCountdown();
        this.completionMessage.classList.remove('hidden');
        
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Countdown Complete!', {
                body: 'Your timer has finished.',
                icon: '⏰'
            });
        }
        
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
            console.log('Audio notification not supported');
        }
    }
    
    updateDisplay() {
        const hours = Math.floor(this.remainingTime / 3600);
        const minutes = Math.floor((this.remainingTime % 3600) / 60);
        const seconds = this.remainingTime % 60;
        
        this.displayHours.textContent = hours.toString().padStart(2, '0');
        this.displayMinutes.textContent = minutes.toString().padStart(2, '0');
        this.displaySeconds.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateProgress() {
        if (this.totalTime > 0) {
            const progressPercentage = ((this.totalTime - this.remainingTime) / this.totalTime) * 100;
            this.progressFill.style.width = `${progressPercentage}%`;
        } else {
            this.progressFill.style.width = '0%';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CountdownTimer();
    
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});