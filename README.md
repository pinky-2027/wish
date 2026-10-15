# 🎂 Puri's 22nd Birthday Surprise — Cute Interactive Digital Gift 💖

A personalized, Pinterest-inspired interactive 3-screen digital birthday experience built with love for Puri's 22nd Birthday!

---

## ✨ Features

1. **Screen 1: Birthday Welcome 🎂**
   - Automatic typewriter animation: **"Happy Birthday Puriii"** on page load.
   - Level 22 Unlocked glowing badge: `LEVEL 22 UNLOCKED 🎮✨`.
   - Adorable handcrafted animated birthday cake with flickering flame.
   - Cute animated party puppy mascot with dog ears matching your photo filter!
   - Floating pastel stars, clouds, balloons, ribbons, and butterflies.
   - Built-in Web Audio API melodic chimes (no external audio files needed; toggle on/off anytime).

2. **Screen 2: Interactive Birthday Adventure 🎮**
   - **Quest HUD & Progress Stepper** (Arrive ➔ Catch Hearts ➔ Open Gift).
   - **Floating Hearts Mini-Game**: Tap/click 5 floating pastel hearts with popping visual feedback & melodic notes (includes a convenient skip button).
   - **3D Animated Mystery Gift Box**: Tap the gift box to unwrap it with an explosion of colorful confetti!
   - Unlocks the party kitten celebration and the button to open Puri's letter.

3. **Screen 3: The Personal Birthday Letter & Photo 💌**
   - **Your Real Photo Together**: Displayed exclusively on Screen Three inside a cute rounded pastel gradient frame with floating hearts and gentle hover animation.
   - **Your 100% Unaltered Personal Letter**: Formatted like a warm handwritten letter card with beautiful typography, paragraph highlighting, and signoff.
   - **Extra Surprises**:
     - *"One Last Birthday Surprise? 🎁"* reveals the Level 22 wish.
     - *"Tap here for extra birthday love! 🫧"* bursts flying hearts across the screen.
     - Confetti cannons celebrate on arrival!
     - *"Relive Your Birthday Surprise ↻"* resets and loops back to Screen 1.

---

## 🚀 How to Run Locally in VS Code

### Option A: Using the Terminal (Fastest)
1. Open your terminal in VS Code (`Ctrl + ~`).
2. Run:
   ```bash
   python -m http.server 8080
   ```
3. Open your browser and go to:
   ```
   http://localhost:8080
   ```

### Option B: Using VS Code "Live Server" Extension
1. Install the **Live Server** extension by Ritwick Dey in VS Code.
2. Right-click on [`index.html`](index.html) and select **"Open with Live Server"**.

---

## 🌐 Free Hosting & How to Get a Shareable Link for Puri

To send Puri a link he can open directly on his phone via WhatsApp or Instagram, choose any of these free static hosting options:

### 1. Netlify Drop (Easiest & Fastest — Instant Link in 30 Seconds, No Terminal Needed)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Sign in with GitHub, Google, or email (it's 100% free).
3. Drag and drop your `wish` folder (`F:\wish`) right into the browser window.
4. Netlify will deploy it instantly and give you a free public HTTPS URL like:
   `https://puris-22nd-birthday.netlify.app`
5. You can rename the site to anything you want in **Site settings ➔ Change site name**.

### 2. GitHub Pages (Free forever)
1. Initialize git in your project:
   ```bash
   git init
   git add .
   git commit -m "Puri 22nd birthday surprise"
   ```
2. Create a new GitHub repository named `puri-birthday` and push your code:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/puri-birthday.git
   git push -u origin main
   ```
3. In your repo settings, go to **Pages ➔ Branch: main ➔ Save**.
4. Within 1 minute, your site will be live at:
   `https://<your-username>.github.io/puri-birthday/`

### 3. Vercel
1. Install Vercel CLI or import your GitHub repository at [vercel.com](https://vercel.com).
2. Deploy with zero configuration.
