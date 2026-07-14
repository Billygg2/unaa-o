const songs = [
  {
    title: "Lose My Mind",
    artist: "Lil Peep",
    category: "yo",
    dedication: "La canción que yo le dediqué como Feliz 5 Meses.",
    cover: "assets/img/Changes.jpg",
    audio: "assets/music/Lose My Mind.mp3"
  },
  {
    title: "Morfina",
    artist: "HUMBE",
    category: "ella",
    dedication: "Sari me la dedicó por los 7 Meses 'Porque conmigo aprendio que el amor no se limita... se expande.'",
    cover: "assets/img/DUEÑO DEL CIELO.jpg",
    audio: "assets/music/Morfina.mp3"
  },
  {
    title: "about u",
    artist: "Lil Peep",
    category: "yo",
    dedication: "Una canción de 7 Meses 'Desearia poder saber si estarias a mi lado...'",
    cover: "assets/img/about u.jpg",
    audio: "assets/music/about u.mp3"
  }
];

const audioPlayer = document.getElementById("audioPlayer");
const songsContainer = document.getElementById("songsContainer");

const currentCover = document.getElementById("currentCover");
const currentTitle = document.getElementById("currentTitle");
const currentArtist = document.getElementById("currentArtist");

const playPauseButton = document.getElementById("playPauseButton");
const playAllButton = document.getElementById("playAllButton");

const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");

const shuffleButton = document.getElementById("shuffleButton");
const randomButton = document.getElementById("randomButton");
const repeatButton = document.getElementById("repeatButton");

const progressBar = document.getElementById("progressBar");
const volumeBar = document.getElementById("volumeBar");

const currentTimeElement = document.getElementById("currentTime");
const durationElement = document.getElementById("duration");

const songCount = document.getElementById("songCount");
const favoriteButton = document.getElementById("favoriteButton");

const filterButtons = document.querySelectorAll(".filter-button");
const menuItems = document.querySelectorAll(".menu-item");

const letterModal = document.getElementById("letterModal");
const surpriseModal = document.getElementById("surpriseModal");

const openLetterButton = document.getElementById("openLetterButton");
const closeLetterButton = document.getElementById("closeLetterButton");

const surpriseButton = document.getElementById("surpriseButton");
const closeSurpriseButton = document.getElementById(
  "closeSurpriseButton"
);

let currentSongIndex = 0;
let currentFilter = "todas";
let isPlaying = false;
let isRepeating = false;
let isShuffleEnabled = false;
let selectedSong = false;

audioPlayer.volume = 0.8;

songCount.textContent = `${songs.length} ${
  songs.length === 1 ? "canción" : "canciones"
}`;

/**
 * Obtiene las canciones según el filtro seleccionado.
 */
function getFilteredSongs() {
  if (currentFilter === "todas") {
    return songs.map((song, originalIndex) => ({
      ...song,
      originalIndex
    }));
  }

  return songs
    .map((song, originalIndex) => ({
      ...song,
      originalIndex
    }))
    .filter((song) => song.category === currentFilter);
}

/**
 * Muestra las canciones en la pantalla.
 */
function renderSongs() {
  const filteredSongs = getFilteredSongs();

  songsContainer.innerHTML = "";

  if (filteredSongs.length === 0) {
    songsContainer.innerHTML = `
      <div style="
        padding: 35px;
        color: #b3b3b3;
        text-align: center;
      ">
        No hay canciones en esta sección.
      </div>
    `;

    return;
  }

  filteredSongs.forEach((song, visibleIndex) => {
    const songRow = document.createElement("div");

    songRow.className = "song-row";

    if (
      selectedSong &&
      song.originalIndex === currentSongIndex
    ) {
      songRow.classList.add("active");
    }

    songRow.dataset.index = song.originalIndex;

    songRow.innerHTML = `
      <div class="song-number">
        <span class="song-number-text">${visibleIndex + 1}</span>
        <i class="fa-solid fa-play song-play-icon"></i>
      </div>

      <div class="song-main-information">
        <img
          src="${song.cover}"
          alt="Portada de ${escapeHtml(song.title)}"
          class="song-cover"
        >

        <div class="song-text">
          <p class="song-title">${escapeHtml(song.title)}</p>
          <p class="song-artist">${escapeHtml(song.artist)}</p>
        </div>
      </div>

      <p class="song-dedication">
        ${escapeHtml(song.dedication)}
      </p>

      <span class="song-duration">♪</span>
    `;

    songRow.addEventListener("click", () => {
      const clickedIndex = Number(songRow.dataset.index);

      if (
        selectedSong &&
        clickedIndex === currentSongIndex
      ) {
        togglePlayPause();
      } else {
        loadSong(clickedIndex);
        playSong();
      }
    });

    songsContainer.appendChild(songRow);
  });
}

/**
 * Carga una canción en el reproductor.
 */
function loadSong(index) {
  if (!songs[index]) {
    return;
  }

  currentSongIndex = index;
  selectedSong = true;

  const song = songs[currentSongIndex];

  audioPlayer.src = song.audio;

  currentCover.src = song.cover;
  currentCover.alt = `Portada de ${song.title}`;

  currentTitle.textContent = song.title;
  currentArtist.textContent = song.artist;

  progressBar.value = 0;
  currentTimeElement.textContent = "0:00";
  durationElement.textContent = "0:00";

  updateActiveSong();
}

/**
 * Reproduce la canción seleccionada.
 */
async function playSong() {
  if (!selectedSong) {
    loadSong(0);
  }

  try {
    await audioPlayer.play();

    isPlaying = true;
    updatePlayIcons();
    updateActiveSong();
  } catch (error) {
    console.error("No se pudo reproducir la canción:", error);

    alert(
      "No se pudo cargar la canción. Revisa que el nombre y la ruta del MP3 sean correctos."
    );
  }
}

/**
 * Pausa la canción.
 */
function pauseSong() {
  audioPlayer.pause();

  isPlaying = false;
  updatePlayIcons();
  updateActiveSong();
}

/**
 * Alterna entre reproducir y pausar.
 */
function togglePlayPause() {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

/**
 * Cambia los iconos de reproducción.
 */
function updatePlayIcons() {
  const playerIcon = playPauseButton.querySelector("i");
  const heroIcon = playAllButton.querySelector("i");

  if (isPlaying) {
    playerIcon.className = "fa-solid fa-pause";
    heroIcon.className = "fa-solid fa-pause";
  } else {
    playerIcon.className = "fa-solid fa-play";
    heroIcon.className = "fa-solid fa-play";
  }
}

/**
 * Marca la canción activa en la lista.
 */
function updateActiveSong() {
  const rows = document.querySelectorAll(".song-row");

  rows.forEach((row) => {
    const rowIndex = Number(row.dataset.index);
    const icon = row.querySelector(".song-play-icon");

    row.classList.toggle(
      "active",
      selectedSong && rowIndex === currentSongIndex
    );

    if (!icon) {
      return;
    }

    if (
      selectedSong &&
      rowIndex === currentSongIndex &&
      isPlaying
    ) {
      icon.className = "fa-solid fa-pause song-play-icon";
    } else {
      icon.className = "fa-solid fa-play song-play-icon";
    }
  });
}

/**
 * Reproduce la canción anterior.
 */
function playPreviousSong() {
  if (songs.length === 0) {
    return;
  }

  if (isShuffleEnabled) {
    playRandomSong();
    return;
  }

  currentSongIndex--;

  if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
  }

  loadSong(currentSongIndex);
  playSong();
}

/**
 * Reproduce la siguiente canción.
 */
function playNextSong() {
  if (songs.length === 0) {
    return;
  }

  if (isShuffleEnabled) {
    playRandomSong();
    return;
  }

  currentSongIndex++;

  if (currentSongIndex >= songs.length) {
    currentSongIndex = 0;
  }

  loadSong(currentSongIndex);
  playSong();
}

/**
 * Selecciona una canción aleatoria.
 */
function playRandomSong() {
  if (songs.length === 0) {
    return;
  }

  if (songs.length === 1) {
    loadSong(0);
    playSong();
    return;
  }

  let randomIndex;

  do {
    randomIndex = Math.floor(Math.random() * songs.length);
  } while (randomIndex === currentSongIndex);

  loadSong(randomIndex);
  playSong();
}

/**
 * Convierte segundos a minutos y segundos.
 */
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

/**
 * Evita que un texto insertado genere HTML accidental.
 */
function escapeHtml(text) {
  const element = document.createElement("div");

  element.textContent = text;

  return element.innerHTML;
}

/* EVENTOS DEL REPRODUCTOR */

playPauseButton.addEventListener("click", togglePlayPause);
playAllButton.addEventListener("click", togglePlayPause);

previousButton.addEventListener("click", playPreviousSong);
nextButton.addEventListener("click", playNextSong);

randomButton.addEventListener("click", playRandomSong);

shuffleButton.addEventListener("click", () => {
  isShuffleEnabled = !isShuffleEnabled;

  shuffleButton.classList.toggle(
    "active",
    isShuffleEnabled
  );
});

repeatButton.addEventListener("click", () => {
  isRepeating = !isRepeating;
  audioPlayer.loop = isRepeating;

  repeatButton.classList.toggle(
    "active",
    isRepeating
  );
});

favoriteButton.addEventListener("click", () => {
  const icon = favoriteButton.querySelector("i");

  favoriteButton.classList.toggle("active");

  if (favoriteButton.classList.contains("active")) {
    icon.className = "fa-solid fa-heart";
  } else {
    icon.className = "fa-regular fa-heart";
  }
});

audioPlayer.addEventListener("loadedmetadata", () => {
  durationElement.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener("timeupdate", () => {
  if (!audioPlayer.duration) {
    return;
  }

  const progress =
    (audioPlayer.currentTime / audioPlayer.duration) * 100;

  progressBar.value = progress;

  currentTimeElement.textContent = formatTime(
    audioPlayer.currentTime
  );

  durationElement.textContent = formatTime(
    audioPlayer.duration
  );
});

progressBar.addEventListener("input", () => {
  if (!audioPlayer.duration) {
    return;
  }

  audioPlayer.currentTime =
    (progressBar.value / 100) * audioPlayer.duration;
});

volumeBar.addEventListener("input", () => {
  audioPlayer.volume = Number(volumeBar.value);
  updateRangeFill(volumeBar, Number(volumeBar.value) * 100);
});

audioPlayer.addEventListener("ended", () => {
  if (!isRepeating) {
    playNextSong();
  }
});

/* FILTROS */

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    renderSongs();
  });
});

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    const section = item.dataset.section;

    menuItems.forEach((menuItem) => {
      menuItem.classList.remove("active");
    });

    item.classList.add("active");

    if (section === "inicio") {
      currentFilter = "todas";
    } else {
      currentFilter = section;
    }

    filterButtons.forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.filter === currentFilter
      );
    });

    renderSongs();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});

/* MODALES */

openLetterButton.addEventListener("click", () => {
  letterModal.classList.add("show");
});

closeLetterButton.addEventListener("click", () => {
  letterModal.classList.remove("show");
});

surpriseButton.addEventListener("click", () => {
  surpriseModal.classList.add("show");
});

closeSurpriseButton.addEventListener("click", () => {
  surpriseModal.classList.remove("show");
});

window.addEventListener("click", (event) => {
  if (event.target === letterModal) {
    letterModal.classList.remove("show");
  }

  if (event.target === surpriseModal) {
    surpriseModal.classList.remove("show");
  }
});

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    const activeElement = document.activeElement;

    if (
      activeElement.tagName !== "INPUT" &&
      activeElement.tagName !== "BUTTON"
    ) {
      event.preventDefault();
      togglePlayPause();
    }
  }

  if (event.key === "Escape") {
    letterModal.classList.remove("show");
    surpriseModal.classList.remove("show");
  }
});

/* INICIO */

function updateRangeFill(input, percentage) {
  const safeValue = Math.max(0, Math.min(100, percentage || 0));
  input.style.setProperty("--range-progress", `${safeValue}%`);
}

const memoriesGrid = document.getElementById("memoriesGrid");
const songFormModal = document.getElementById("songFormModal");
const memoryFormModal = document.getElementById("memoryFormModal");
const songForm = document.getElementById("songForm");
const memoryForm = document.getElementById("memoryForm");

document.getElementById("openSongFormButton").addEventListener("click", () => songFormModal.classList.add("show"));
document.getElementById("openMemoryFormButton").addEventListener("click", () => memoryFormModal.classList.add("show"));
document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => document.getElementById(button.dataset.close).classList.remove("show")));

function cleanFileName(name) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

async function blobUpload(pathname, file, pin, onProgress) {
  const { uploadPresigned } = await import("https://esm.sh/@vercel/blob@2.6.1/client");
  return uploadPresigned(pathname, file, { access: "public", handleUploadUrl: "/api/upload", clientPayload: JSON.stringify({ pin }), multipart: file.size > 20 * 1024 * 1024, onUploadProgress: onProgress });
}

async function saveMetadata(type, data, pin) {
  const file = new Blob([JSON.stringify(data)], { type: "application/json" });
  return blobUpload(`${type}/metadata/${Date.now()}.json`, file, pin);
}

function renderMemory(memory) {
  const card = document.createElement("article"); card.className = "memory-card";
  const image = document.createElement("img"); image.src = memory.image; image.alt = memory.title;
  const content = document.createElement("div"); content.className = "memory-content";
  const label = document.createElement("span"); label.textContent = memory.label;
  const title = document.createElement("h3"); title.textContent = memory.title;
  const text = document.createElement("p"); text.textContent = memory.description;
  content.append(label, title, text); card.append(image, content); memoriesGrid.appendChild(card);
}

async function loadSharedContent() {
  try {
    const response = await fetch("/api/content", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    data.songs.forEach(song => songs.push(song)); data.memories.forEach(renderMemory);
    songCount.textContent = `${songs.length} ${songs.length === 1 ? "canción" : "canciones"}`; renderSongs();
  } catch (error) { console.info("El contenido compartido estará disponible al publicar en Vercel."); }
}

songForm.addEventListener("submit", async event => {
  event.preventDefault(); const button = songForm.querySelector("button[type=submit]"); const status = songForm.querySelector(".form-status");
  const form = new FormData(songForm); const cover = form.get("cover"); const audio = form.get("audio"); const pin = form.get("pin");
  button.disabled = true; status.textContent = "Subiendo portada…";
  try {
    const coverBlob = await blobUpload(`songs/media/${Date.now()}-${cleanFileName(cover.name)}`, cover, pin);
    status.textContent = "Subiendo canción… 0%";
    const audioBlob = await blobUpload(`songs/media/${Date.now()}-${cleanFileName(audio.name)}`, audio, pin, p => status.textContent = `Subiendo canción… ${Math.round(p.percentage)}%`);
    const song = { title: form.get("title"), artist: form.get("artist"), category: form.get("category"), dedication: form.get("dedication"), cover: coverBlob.url, audio: audioBlob.url, createdAt: new Date().toISOString() };
    await saveMetadata("songs", song, pin); songs.push(song); renderSongs(); songCount.textContent = `${songs.length} canciones`; songForm.reset(); songFormModal.classList.remove("show");
  } catch (error) { status.textContent = error.message || "No se pudo guardar. Revisa la clave."; } finally { button.disabled = false; }
});

memoryForm.addEventListener("submit", async event => {
  event.preventDefault(); const button = memoryForm.querySelector("button[type=submit]"); const status = memoryForm.querySelector(".form-status"); const form = new FormData(memoryForm); const image = form.get("image"); const pin = form.get("pin");
  button.disabled = true; status.textContent = "Subiendo recuerdo…";
  try {
    const imageBlob = await blobUpload(`memories/media/${Date.now()}-${cleanFileName(image.name)}`, image, pin);
    const memory = { label: form.get("label"), title: form.get("title"), description: form.get("description"), image: imageBlob.url, createdAt: new Date().toISOString() };
    await saveMetadata("memories", memory, pin); renderMemory(memory); memoryForm.reset(); memoryFormModal.classList.remove("show");
  } catch (error) { status.textContent = error.message || "No se pudo guardar. Revisa la clave."; } finally { button.disabled = false; }
});

audioPlayer.addEventListener("timeupdate", () => updateRangeFill(progressBar, Number(progressBar.value)));
progressBar.addEventListener("input", () => updateRangeFill(progressBar, Number(progressBar.value)));
updateRangeFill(progressBar, 0); updateRangeFill(volumeBar, 80);
renderSongs(); loadSharedContent();
