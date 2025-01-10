// Mapping song titles to audio file names
const songs = {
    "Millionaire": "Millionaire.mp3",
    "Jatt Mehkma": "Jatt Mehkma - Glory 128 Kbps.mp3",
    "High On Me": "High On Me - Glory 128 Kbps.mp3",
    "Fuck Them": "Fuck Them - Glory 128 Kbps.mp3",
    "Bonita": "Bonita - Glory 128 Kbps.mp3"
};

// Get all song title elements
const songTitles = document.querySelectorAll(".song-title");

// Create an audio element
const audioPlayer = new Audio();
const seekBar = document.querySelector(".seekbar");
const circle = document.querySelector(".circle");
const volumeControl = document.querySelector(".volume-control");
const songInfoDiv = document.querySelector(".songinfo");
const playPauseButton = document.querySelector("#playPauseButton"); // Single play/pause button
const forwardButton = document.querySelector(".forward");
const previousButton = document.querySelector(".previous");
const shuffleButton = document.querySelector(".shuffle");
const loopButton = document.querySelector(".loop");

// Set the initial state of the button (should show "Play" initially)
let isPlaying = false;
playPauseButton.src = "./Pictures_and_logos/play.svg"; // Initially show the play button

// Add click event listeners to song titles
songTitles.forEach((titleElement) => {
    titleElement.addEventListener("click", () => {
        const songName = titleElement.textContent.trim(); // Get the clicked song name

        if (songs[songName]) {
            const songPath = `http://127.0.0.1:5500/songs/${songs[songName]}`; // Construct the file path

            if (audioPlayer.src !== songPath) {
                audioPlayer.src = songPath; // Set the new song source
                updateSongInfo(songName); // Update song info in UI
            }

            audioPlayer.play(); // Play the song
            isPlaying = true;
            playPauseButton.src = "./Pictures_and_logos/pause.svg"; // Show pause button
        } else {
            console.error(`Audio file for '${songName}' not found!`);
        }
    });
});

// Automatically play the next song when the current song ends
audioPlayer.addEventListener("ended", () => {
    let currentIndex = getCurrentSongIndex();
    if (currentIndex !== -1 && currentIndex < songTitles.length - 1) {
        songTitles[currentIndex + 1].click();
    } else {
        console.log("End of playlist.");
    }
});

// Play/pause toggle button functionality
playPauseButton.addEventListener("click", () => {
    if (isPlaying) {
        audioPlayer.pause();
        playPauseButton.src = "./Pictures_and_logos/play.svg"; // Change icon to play
    } else {
        audioPlayer.play();
        playPauseButton.src = "./Pictures_and_logos/pause.svg"; // Change icon to pause
    }
    isPlaying = !isPlaying; // Toggle the play/pause state
});

// Forward button functionality
forwardButton.addEventListener("click", () => {
    let currentIndex = getCurrentSongIndex();
    if (currentIndex !== -1) {
        let nextIndex = (currentIndex + 1) % songTitles.length; // Cycle through to the next song
        songTitles[nextIndex].click();
    }
});

// Previous button functionality
previousButton.addEventListener("click", () => {
    let currentIndex = getCurrentSongIndex();
    if (currentIndex !== -1) {
        let prevIndex = (currentIndex - 1 + songTitles.length) % songTitles.length; // Cycle through to the previous song
        songTitles[prevIndex].click();
    }
});

// Shuffle button functionality
shuffleButton.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * songTitles.length);
    songTitles[randomIndex].click(); // Play a random song
});

// Loop button functionality
let isLooping = false;
loopButton.addEventListener("click", () => {
    isLooping = !isLooping;
    audioPlayer.loop = isLooping;
    loopButton.classList.toggle("active", isLooping);
});

// Function to update the song info in the UI
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
    progressBar.style.width = `${progress}%`; // Update progress bar width
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

// Volume Control functionality
volumeControl.addEventListener("input", (event) => {
    audioPlayer.volume = event.target.value / 100;
});
