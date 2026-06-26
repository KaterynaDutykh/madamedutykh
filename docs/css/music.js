document.addEventListener("DOMContentLoaded", () => {

    const tracks = [
      "/audio/jazz_background_melody.mp3",
    ];
  
    let index = Math.floor(Math.random() * tracks.length);
  
    const audio = document.getElementById("music-audio");
    const playBtn = document.getElementById("music-play");
    const nextBtn = document.getElementById("music-next");
  
    function loadTrack(i) {
      audio.src = tracks[i];
      audio.volume = 0.35;
    }
  
    loadTrack(index);
  
    function play() {
      audio.play();
      playBtn.textContent = "⏸";
    }
  
    function pause() {
      audio.pause();
      playBtn.textContent = "▶";
    }
  
    playBtn.addEventListener("click", async () => {
      if (audio.paused) {
        await play();
      } else {
        pause();
      }
    });
  
    nextBtn.addEventListener("click", async () => {
      index = (index + 1) % tracks.length;
      loadTrack(index);
      await play();
    });
  
    audio.addEventListener("ended", async () => {
      index = (index + 1) % tracks.length;
      loadTrack(index);
      await play();
    });
  
  });