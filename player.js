import audios from "./data.js";
import { path, secondsToMinutes } from "./utils.js";
import elements from "./playerElements.js";

export default {
    audioData: audios,
    currentAudio: {},
    currentPlaying: 0,
    isPlaying: false,
    start() {
        elements.get.call(this);

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile) {
            document.querySelector('.icone-volume').style.display = 'none';
            document.querySelector('#vol-control').style.display = 'none';
            document.querySelector('#current-duration').style.marginLeft = '35px';
            document.querySelector('#total-duration').style.marginRight = '-35px';
        }

        this.playPause.addEventListener('touchend', (event) => {
            event.preventDefault();
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        });
        this.botaoProximo.addEventListener('touchend', () => {
            this.depois();
        });
        this.botaoAnterior.addEventListener('touchend', () => {
            this.antes();
        });
        this.update();
    },
    play() {
        this.isPlaying = true;
        this.audio.play();
        this.playPause.classList.remove('mdi-play');
        this.playPause.classList.add('mdi-pause');
    },
    pause() {
        this.isPlaying = false;
        this.audio.pause();
        this.playPause.classList.remove('mdi-pause');
        this.playPause.classList.add('mdi-play');
    },
    togglePlayPause() {
        if(this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    },
    toggleMute() {
        this.audio.muted = !this.audio.muted;
        this.mute.classList.remove('mdi-volume-high');
        this.mute.classList.remove('mdi-volume-mute');
        this.mute.classList.add(this.audio.muted ? 'mdi-volume-mute' : 'mdi-volume-high');
    },
    next() {
        this.currentPlaying++;
        if (this.currentPlaying == this.audioData.length) {
            this.currentPlaying = 0;
        }
        this.update();
        this.play();
    },
    setVolume(value) {
        this.audio.volume = value / 100;
    },
    setSeek(value) {
        this.audio.currentTime = value;
    },
    timeUpdate() {
        this.currentDuration.innerText = secondsToMinutes(this.audio.currentTime);
        this.seekbar.value = this.audio.currentTime;
    },
    update() {
        this.currentAudio = this.audioData[this.currentPlaying];
        this.cover.style.background = `url('${path(this.currentAudio.cover)}') no-repeat center center / cover`;
        this.title.innerHTML = `<i class="mdi mdi-music"</i> ${this.currentAudio.title}`;
        this.artist.innerHTML = `<i class="mdi mdi-account"</i> ${this.currentAudio.artist}`;
        elements.createAudioElement.call(this, path(this.currentAudio.file));
        this.audio.onloadeddata = () => {
            elements.actions.call(this);
        }
        
    },
    restart() {
        this.currentPlaying = 0;
        this.update();
    },
    antes() {
        this.pause();
        this.currentPlaying--;
        if (this.currentPlaying < 0) {
            this.currentPlaying = this.audioData.length - 1;
        }
        this.update();
        this.play();
    },
    depois() {
        this.pause();
        this.currentPlaying++;
        if (this.currentPlaying == this.audioData.length) {
            this.currentPlaying = 0;
        }
        this.update();
        this.play();
    },
};