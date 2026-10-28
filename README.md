<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lockscreen</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        body, html {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        /* --- BAGIAN WALLPAPER --- */
        .lockscreen-container {
            width: 100%;
            height: 100%;
            background-image: url('https://pin.it/6Fpm3K52i');
            background-size: cover;
            background-position: center;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;
            padding-bottom: 80px;
            position: relative;
        }

        /* Efek gelap tipis agar teks tetap terbaca */
        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            z-index: 1;
        }

        /* --- KONTROL LOCKSCREEN --- */
        .lock-content {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 85%;
            max-width: 300px;
        }

        .clock {
            color: #fff;
            font-size: 3.5rem;
            font-weight: 300;
            margin-bottom: 2px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        .date {
            color: #eee;
            font-size: 0.95rem;
            margin-bottom: 30px;
            text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
        }

        .input-group {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        input[type="password"] {
            width: 100%;
            padding: 12px 15px;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 12px;
            color: #fff;
            font-size: 1rem;
            text-align: center;
            outline: none;
            letter-spacing: 4px;
        }

        input[type="password"]::placeholder {
            color: rgba(255, 255, 255, 0.6);
            letter-spacing: normal;
        }

        input[type="password"]:focus {
            border-color: rgba(255, 255, 255, 0.8);
            background: rgba(255, 255, 255, 0.3);
        }

        button {
            width: 100%;
            padding: 12px;
            background: rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            border-radius: 12px;
            color: #fff;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: 0.2s;
        }

        button:hover {
            background: rgba(255, 255, 255, 0.5);
        }

        .hint-text {
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.8rem;
            margin-top: 10px;
            text-align: center;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        }

        .error-msg {
            color: #ffcccc;
            font-size: 0.85rem;
            margin-top: 8px;
            min-height: 20px;
            text-align: center;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        }

        /* --- HALAMAN SETELAH TERBUKA --- */
        #unlocked-page {
            display: none;
            width: 100%;
            height: 100%;
            background: #ffffff;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.2rem;
        }
    </style>
</head>
<body>

    <!-- BAGIAN 1: LOCKSCREEN -->
    <div class="lockscreen-container" id="lockscreen">
        <div class="overlay"></div>

        <div class="lock-content">
            <!-- Jam Statis 14.12 -->
            <div class="clock" id="clock">14:12</div>
            <div class="date">Rabu, 28 Oktober</div>

            <!-- Form Password -->
            <div class="input-group">
                <input type="password" id="passcode" placeholder="PIN" oninput="playKeySound()" />
                <button onclick="checkPassword()">Buka</button>
            </div>

            <!-- Hint Sandi -->
            <div class="hint-text">Hint: profile author</div>
            <div class="error-msg" id="errorMsg"></div>
        </div>
    </div>

    <!-- BAGIAN 2: HALAMAN UTAMA KETIKA TERBUKA -->
    <div id="unlocked-page" style="display: none;">
        <p>Berhasil Masuk</p>
    </div>

    <script>
        // Efek Suara Ketikan
        function playKeySound() {
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(400 + Math.random() * 100, audioCtx.currentTime);

                gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start();
                osc.stop(audioCtx.currentTime + 0.04);
            } catch(e) {
                // Abaikan jika diblokir browser sebelum interaksi
            }
        }

        // Logika Password (PIN: 1007)
        const passwordBenar = "1007"; 

        function checkPassword() {
            const inputVal = document.getElementById('passcode').value;
            const errorText = document.getElementById('errorMsg');

            if (inputVal === passwordBenar) {
                document.getElementById('lockscreen').style.display = 'none';
                document.getElementById('unlocked-page').style.display = 'flex';
            } else {
                errorText.innerText = "PIN salah";
                document.getElementById('passcode').value = "";
            }
        }
    </script>
</body>
</html>