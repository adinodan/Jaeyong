const CORRECT_PASSCODE = "1007";
let currentInput = "", audioCtx = null, isLockscreen = true, startY = 0;
const lockscreen = document.getElementById('lockscreen'), passcodeScreen = document.getElementById('passcode-screen');

// Fungsi Universal untuk Efek Suara (Tap / Klik / Ketik)
function playClickSound() {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {}
}

// Tambahkan efek suara saat layar/tombol umum di-tap
document.addEventListener('click', (e) => {
    // Membunyikan suara jika mengklik ikon aplikasi, tombol, atau elemen interaktif
    if (e.target.closest('.app-item') || e.target.closest('.action-btn') || e.target.closest('.safari-search-widget') || e.target.closest('.spotify-btn')) {
        playClickSound();
    }
});

lockscreen.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, {passive: true});
lockscreen.addEventListener('touchend', e => { if (isLockscreen && startY - e.changedTouches[0].clientY > 30) { playClickSound(); showPasscodeScreen(); } }, {passive: true});
lockscreen.addEventListener('mousedown', e => { startY = e.clientY; });
lockscreen.addEventListener('mouseup', e => { if (isLockscreen && startY - e.clientY > 30) { playClickSound(); showPasscodeScreen(); } });

lockscreen.addEventListener('click', e => { if (isLockscreen && !e.target.closest('.action-btn')) { playClickSound(); showPasscodeScreen(); } });
document.getElementById('swipe-area').addEventListener('click', () => { if (isLockscreen) { playClickSound(); showPasscodeScreen(); } });

function showPasscodeScreen() { 
    playClickSound();
    passcodeScreen.classList.add('active'); 
}

function pressKey(num) {
    playClickSound(); // Suara saat mengetik angka passcode
    if (currentInput.length < 4) {
        currentInput += num;
        updateDots();
        if (currentInput.length === 4) setTimeout(checkPasscode, 150);
    }
}

function deleteKey() {
    playClickSound(); // Suara saat tombol Hapus ditekan
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        updateDots();
        document.getElementById('error-msg').innerText = "";
    }
}

function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, idx) => {
        dot.classList.toggle('filled', idx < currentInput.length);
    });
}

function checkPasscode() {
    const errorMsg = document.getElementById('error-msg'), dotsContainer = document.getElementById('dots-container');
    if (currentInput === CORRECT_PASSCODE) {
        playClickSound();
        isLockscreen = false;
        passcodeScreen.classList.remove('active');
        lockscreen.style.opacity = '0';
        lockscreen.style.pointerEvents = 'none';
        document.getElementById('homescreen').classList.add('unlocked');
        errorMsg.innerText = "";
        triggerImessNotification();
    } else {
        playClickSound();
        errorMsg.innerText = "Passcode salah, cek kembali akun author";
        dotsContainer.classList.add('shake');
        setTimeout(() => { dotsContainer.classList.remove('shake'); currentInput = ""; updateDots(); }, 400);
    }
}

function toggleFlashlight(e) { 
    e.stopPropagation(); 
    playClickSound();
    document.getElementById('flashlight-btn').classList.toggle('active'); 
}

function handleScroll() {
    const slider = document.getElementById('slider');
    document.getElementById('dot1').classList.toggle('active', slider.scrollLeft <= slider.clientWidth / 2);
    document.getElementById('dot2').classList.toggle('active', slider.scrollLeft > slider.clientWidth / 2);
}

let currentPhotoIndex = 0;
const photoSlides = document.querySelectorAll('.photo-slide');
setInterval(() => {
    if (photoSlides.length > 0) {
        photoSlides[currentPhotoIndex].classList.remove('active');
        currentPhotoIndex = (currentPhotoIndex + 1) % photoSlides.length;
        photoSlides[currentPhotoIndex].classList.add('active');
    }
}, 3000);

function triggerImessNotification() {
    setTimeout(() => {
        playClickSound(); // Suara notifikasi masuk
        const banner = document.getElementById('imessage-banner');
        banner.classList.add('show');
        setTimeout(() => { banner.classList.remove('show'); }, 5000);
    }, 1000);
}

function openImessModal() {
    playClickSound();
    document.getElementById('imessage-banner').classList.remove('show');
    document.getElementById('imess-modal').classList.add('active');
}

function closeImessModal() {
    playClickSound();
    document.getElementById('imess-modal').classList.remove('active');
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    if (input.value.trim() !== "") {
        playClickSound(); // Suara saat mengirim pesan
        const chatBody = document.getElementById('imess-chat-body');
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble sent';
        bubble.innerHTML = `${input.value} <span class="chat-time">14.12</span>`;
        chatBody.appendChild(bubble);
        input.value = "";
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}
