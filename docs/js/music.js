document.addEventListener("DOMContentLoaded", () => {
  const tracks = window.MUSIC_TRACK || [];

  const audio = document.getElementById("music-audio");

  const playBtn = document.getElementById("music-play");
  const nextBtn = document.getElementById("music-next");

  const playBtnMobile = document.getElementById("music-play-mobile");
  const nextBtnMobile = document.getElementById("music-next-mobile");

  const musicUI = document.querySelector(".music-inline");

  if (!audio || !tracks.length) return;

  let index = Number(localStorage.getItem("musicTrack"));

  if (isNaN(index) || index < 0 || index >= tracks.length) {
    index = 0;
  }
  let isChangingTrack = false;

  function updateUI() {
    if (!musicUI) return;
    musicUI.classList.toggle("playing", !audio.paused);
  }

  function setIcon(btn, isPlaying) {
    if (!btn) return;
    btn.innerHTML = isPlaying
      ? '<i class="fas fa-pause"></i>'
      : '<i class="fas fa-play"></i>';
  }

  function loadTrack(i, resumeTime = true) {
    console.log("TRACK:", i, tracks[i]);
    audio.src = tracks[i];
    audio.load();

    const savedTime = Number(localStorage.getItem("musicTime")) || 0;

    if (!resumeTime) {
      audio.currentTime = 0;
      return;
    }

    audio.onloadedmetadata = () => {
      audio.currentTime = savedTime;
    };
  }

  loadTrack(index);

  // restore autoplay state
  if (localStorage.getItem("musicPlaying") === "true") {
    audio
      .play()
      .then(() => {
        setIcon(playBtn, true);
        setIcon(playBtnMobile, true);
        updateUI();
      })
      .catch(() => {});
  }

  function saveState() {
    localStorage.setItem("musicTrack", index);
    localStorage.setItem("musicTime", audio.currentTime);
    localStorage.setItem("musicPlaying", !audio.paused);
  }

  audio.addEventListener("timeupdate", saveState);

  // PLAY / PAUSE (desktop + mobile)
  function togglePlay() {
    if (audio.paused) {
      audio.play().then(() => {
        setIcon(playBtn, true);
        setIcon(playBtnMobile, true);
      });
    } else {
      audio.pause();
      setIcon(playBtn, false);
      setIcon(playBtnMobile, false);
    }

    updateUI();
    saveState();
  }

  playBtn?.addEventListener("click", togglePlay);
  playBtnMobile?.addEventListener("click", togglePlay);

  // NEXT TRACK (desktop + mobile)
  function nextTrack() {
    if (isChangingTrack) return;
    isChangingTrack = true;
  

    try {
      index = (index + 1) % tracks.length;

      localStorage.setItem("musicTrack", index);
      localStorage.setItem("musicTime", 0);

      loadTrack(index);

      audio.play().then(() => {
        setIcon(playBtn, true);
        setIcon(playBtnMobile, true);
        updateUI();
        saveState();
      });
    } finally {
      isChangingTrack = false;
    }
  }

  nextBtn?.addEventListener("click", nextTrack);
  nextBtnMobile?.addEventListener("click", nextTrack);

  // auto next
  audio.addEventListener("ended", nextTrack);

  // UI sync
  audio.addEventListener("play", () => {
    setIcon(playBtn, true);
    setIcon(playBtnMobile, true);
    updateUI();
  });

  audio.addEventListener("pause", () => {
    setIcon(playBtn, false);
    setIcon(playBtnMobile, false);
    updateUI();
  });
});