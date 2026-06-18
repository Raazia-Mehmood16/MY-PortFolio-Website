/* ============================================ */
/* Video play/pause toggle                       */
/*                                                 */
/* The icon now stays in sync with the video's    */
/* REAL playback state (via the play/pause        */
/* events) instead of being hardcoded — and we     */
/* explicitly call .play() once on load as a       */
/* fallback for browsers that don't always honour  */
/* the autoplay attribute right away.              */
/* ============================================ */

const heroVideo   = document.getElementById("heroVideo");
const videoToggle = document.getElementById("videoToggle");

heroVideo.play().catch(() => {
    // autoplay was blocked by the browser — reflect that in the icon
    videoToggle.textContent = "▶";
});

heroVideo.addEventListener("play", () => {
    videoToggle.textContent = "⏸";
});

heroVideo.addEventListener("pause", () => {
    videoToggle.textContent = "▶";
});

videoToggle.addEventListener("click", () => {
    if (heroVideo.paused) {
        heroVideo.play();
    } else {
        heroVideo.pause();
    }
});


/* ============================================ */
/* Screenshot lightbox — click a thumbnail to     */
/* view it full-size. Closes on the × button,     */
/* clicking the dark backdrop, or pressing Esc.    */
/* ============================================ */

(function setupLightbox() {

    const lightbox    = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const closeBtn     = document.getElementById("lightboxClose");

    if (!lightbox || !lightboxImg || !closeBtn) return;

    document.querySelectorAll(".screenshot img").forEach(img => {
        img.addEventListener("click", () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.style.display = "flex";
        });
    });

    function closeLightbox() {
        lightbox.style.display = "none";
    }

    closeBtn.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeLightbox();
    });

})();


/* ============================================ */
/* Project feedback form (the dark card under     */
/* "Share Your Thoughts") — uses its OWN popup,    */
/* #thankYouPopup.                                */
/* ============================================ */

(function setupDetailForm() {

    const form  = document.getElementById("detailFeedbackForm");
    const stars = document.querySelectorAll("#starRow .star");
    const popup = document.getElementById("thankYouPopup");
    let rating = 0;

    stars.forEach(star => {
        star.addEventListener("click", () => {
            rating = parseInt(star.dataset.value);
            stars.forEach((s, i) => {
                s.classList.toggle("active", i < rating);
            });
        });
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name    = document.getElementById("fb-name").value.trim();
        const email   = document.getElementById("fb-email").value.trim();
        const message = document.getElementById("fb-message").value.trim();

        ["fbNameError", "fbEmailError", "fbMessageError", "fbRatingError"].forEach(id => {
            document.getElementById(id).textContent = "";
        });

        let valid = true;

        if (!name) {
            document.getElementById("fbNameError").textContent = "Please enter your name.";
            valid = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById("fbEmailError").textContent = "Enter a valid email address.";
            valid = false;
        }

        if (message.length < 10) {
            document.getElementById("fbMessageError").textContent = "Message must be at least 10 characters.";
            valid = false;
        }

        if (rating === 0) {
            document.getElementById("fbRatingError").textContent = "Please select a star rating.";
            valid = false;
        }

        if (valid) {
            popup.style.display = "flex";
            form.reset();
            stars.forEach(s => s.classList.remove("active"));
            rating = 0;
        }
    });

})();

function closeDetailPopup() {
    document.getElementById("thankYouPopup").style.display = "none";
}

document.getElementById("thankYouPopup").addEventListener("click", function (e) {
    if (e.target === this) closeDetailPopup();
});

/* Note: the old site-wide footer feedback form (#feedbackForm /
   #popup) and its setupFeedbackForm()/closePopup() helpers have
   been removed along with the "Let's Connect" footer block — this
   page now only has the one project feedback form above, with its
   own #thankYouPopup. */