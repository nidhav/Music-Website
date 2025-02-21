let pause = document.getElementById("pause");
let play = document.getElementById('play');
let bottomBar = document.querySelector('.bottom');
let songImages = document.querySelectorAll('.songs div div');
let currentSongTitle = document.createElement('p');
currentSongTitle.className = 'now-playing';
let currentSong = null;

// Sample songs mapping with actual playable MP3s
const songs = {
  'Ranjha': 'https://soundcloud.com/faique-memon-946798958/ranjha-full?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
  'Sun Sathiyaa': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'Jab Tak': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'Solid Body': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'Kini Kini': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  'Adhram Madhuram': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
};

document.querySelector('.icons').appendChild(currentSongTitle);

// Play/Pause button functionality
play.addEventListener("click", () => {
    if (currentSong) {
        currentSong.play();
        pause.style.display = 'flex';
        play.style.display = 'none';
    }
});

pause.addEventListener("click", () => {
    if (currentSong) {
        currentSong.pause();
        pause.style.display = 'none';
        play.style.display = 'block';
    }
});

// Forward and backward buttons functionality
document.querySelectorAll('#x').forEach(button => {
    button.addEventListener('click', () => {
        if (currentSong) {
            const currentTime = currentSong.currentTime;
            if (button.classList.contains('fa-forward-step')) {
                currentSong.currentTime = Math.min(currentTime + 10, currentSong.duration);
            } else {
                currentSong.currentTime = Math.max(currentTime - 10, 0);
            }
        }
    });
});

// Add click event listeners to all song containers
songImages.forEach(container => {
    // Create play icon if it doesn't exist
    if (!container.querySelector('.fa-circle-play')) {
        const playIcon = document.createElement('i');
        playIcon.className = 'fa-regular fa-circle-play';
        container.appendChild(playIcon);
    }

    // Handle click on song
    container.addEventListener('click', () => {
        const songTitle = container.querySelector('p').textContent;
        const songUrl = songs[songTitle];

        if (!songUrl) {
            console.error('Song URL not found for:', songTitle);
            return;
        }

        bottomBar.style.display = 'flex';
        currentSongTitle.textContent = 'Now Playing: ' + songTitle;
        
        // Reset all play icons
        document.querySelectorAll('.fa-circle-play').forEach(icon => {
            icon.style.color = 'transparent';
        });
        
        // Show play icon for current song
        const playIcon = container.querySelector('.fa-circle-play');
        playIcon.style.color = 'white';

        // Stop current song if playing
        if (currentSong) {
            currentSong.pause();
            currentSong.currentTime = 0;
        }

        // Create and play new song
        currentSong = new Audio(songUrl);
        
        currentSong.addEventListener('canplay', () => {
            currentSong.play()
                .then(() => {
                    play.style.display = 'none';
                    pause.style.display = 'flex';
                })
                .catch(error => {
                    console.error('Playback failed:', error);
                    play.style.display = 'block';
                    pause.style.display = 'none';
                });
        });

        // Handle song ending
        currentSong.addEventListener('ended', () => {
            play.style.display = 'block';
            pause.style.display = 'none';
            progressBar.value = 0;
        });

        // Handle loading errors
        currentSong.addEventListener('error', (e) => {
            console.error('Error loading audio:', e);
            play.style.display = 'block';
            pause.style.display = 'none';
        });
    });
});

// Progress bar functionality
const progressBar = document.getElementById('bar');

progressBar.addEventListener('input', () => {
    if (currentSong) {
        const time = (progressBar.value / 100) * currentSong.duration;
        currentSong.currentTime = time;
    }
});

// Update progress bar as song plays
setInterval(() => {
    if (currentSong && !currentSong.paused) {
        const progress = (currentSong.currentTime / currentSong.duration) * 100;
        progressBar.value = isNaN(progress) ? 0 : progress;
    }
}, 100);