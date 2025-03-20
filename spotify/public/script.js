// Mapping song titles to audio file names
const songs = {
    "Millionaire": "Millionaire.mp3",
    "Jatt Mehkma": "Jatt Mehkma - Glory 128 Kbps.mp3",
    "High On Me": "High On Me - Glory 128 Kbps.mp3",
    "Fuck Them": "Fuck Them - Glory 128 Kbps.mp3",
    "Bonita": "Bonita - Glory 128 Kbps.mp3",
    "Payal": "Payal - Glory 320 Kbps.mp3"
};

// UI Elements
const songTitles = document.querySelectorAll(".song-title");
const audioPlayer = new Audio();
const songInfoDiv = document.querySelector(".songinfo");
const seekBar = document.querySelector(".seekbar");
const circle = document.querySelector(".circle");
const volumeControl = document.querySelector(".volume-control");
const playPauseButton = document.querySelector("#playPauseButton");
const forwardButton = document.querySelector(".forward");
const previousButton = document.querySelector(".previous");
const shuffleButton = document.querySelector(".shuffle");
const loopButton = document.querySelector(".loop");

// Play/pause state
let isPlaying = false;
playPauseButton.src = "./public/Pictures_and_logos/play.svg"; // Initial state

// Loop state
let isLooping = false;

// Add click event listeners to song titles
songTitles.forEach((titleElement) => {
    titleElement.addEventListener("click", () => {
        const songName = titleElement.textContent.trim();
        if (songs[songName]) {
            const songPath = `./public/songs/${songs[songName]}`;
            console.log("Song path: ", songPath);
            // const songPath = `http://127.0.0.1:5500/spotify/songs/${songs[songName]}`; 

            if (audioPlayer.src !== songPath) {
                audioPlayer.src = songPath;
                updateSongInfo(songName);
            }
            audioPlayer.play();
            isPlaying = true;
            playPauseButton.src = "./public/Pictures_and_logos/pause.svg";

            // Set active state
            songTitles.forEach(s => s.classList.remove("active"));
            titleElement.classList.add("active");
        }
    });
});

// Play/Pause button functionality
playPauseButton.addEventListener("click", () => {
    if (isPlaying) {
        audioPlayer.pause(); // Pause the audio
        playPauseButton.src = "./public/Pictures_and_logos/play.svg"; // Change button icon to play
    } else {
        audioPlayer.play(); // Play the audio
        playPauseButton.src = "./public/Pictures_and_logos/pause.svg"; // Change button icon to pause
    }
    isPlaying = !isPlaying; // Toggle the playing state
});

// Forward button functionality
forwardButton.addEventListener("click", () => {
    let currentIndex = getCurrentSongIndex();
    if (currentIndex !== -1) {
        let nextIndex = (currentIndex + 1) % songTitles.length;
        songTitles[nextIndex].click();
    }
});

// Previous button functionality
previousButton.addEventListener("click", () => {
    let currentIndex = getCurrentSongIndex();
    if (currentIndex !== -1) {
        let prevIndex = (currentIndex - 1 + songTitles.length) % songTitles.length;
        songTitles[prevIndex].click();
    }
});

// Shuffle button functionality
shuffleButton.addEventListener("click", () => {
    let currentIndex = getCurrentSongIndex();
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * songTitles.length);
    } while (randomIndex === currentIndex);
    songTitles[randomIndex].click();
});

// Loop button functionality
loopButton.addEventListener("click", () => {
    isLooping = !isLooping;
    audioPlayer.loop = isLooping;
    loopButton.classList.toggle("active", isLooping);
});

// Function to get the current song index
function getCurrentSongIndex() {
    return Array.from(songTitles).findIndex(song => song.classList.contains("active"));
}

// Function to update the song info
function updateSongInfo(songName) {
    songInfoDiv.textContent = `Now Playing: ${songName}`;
}

// Seekbar functionality
audioPlayer.addEventListener("timeupdate", () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    circle.style.left = `${progress}%`; // Move the circle based on progress
    updateSongTime();
    updateProgressBar(progress); // Update progress bar
});

seekBar.addEventListener("click", (event) => {
    const rect = seekBar.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const newTime = (offsetX / seekBar.offsetWidth) * audioPlayer.duration;
    audioPlayer.currentTime = newTime;
});

function updateProgressBar(progress) {
    const progressBar = document.querySelector(".seekbar .progress");
    progressBar.style.width = `${progress}%`; 
}

function updateSongTime() {
    const songTimeDiv = document.querySelector(".songtime");
    const currentTime = formatTime(audioPlayer.currentTime);
    const duration = formatTime(audioPlayer.duration);
    songTimeDiv.textContent = `${currentTime} / ${duration}`;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
}


// Volume control
volumeControl.addEventListener("input", (event) => {
    audioPlayer.volume = event.target.value / 100;
});


document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const leftSidebar = document.querySelector('.left');
    const rightContent = document.querySelector('.right');
    
    // Add initial state class
    leftSidebar.classList.add('menu-closed');
    rightContent.classList.add('full-width');
    let isMenuOpen = false;

    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        leftSidebar.classList.toggle('menu-closed');
        rightContent.classList.toggle('full-width');
        isMenuOpen = !isMenuOpen;
        
        // Rotate hamburger icon
        const hamburgerIcon = menuToggle.querySelector('.hamburger-icon');
        hamburgerIcon.style.transform = isMenuOpen ? 'rotate(0deg)' : 'rotate(180deg)';
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (isMenuOpen && !leftSidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            leftSidebar.classList.add('menu-closed');
            rightContent.classList.add('full-width');
            isMenuOpen = false;
        }
    });
});