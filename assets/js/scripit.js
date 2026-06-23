/* ============================================ */
/* Device preview bar                            */
/* ============================================ */

const siteContainer = document.getElementById("site-container");
const previewButtons = document.querySelectorAll(".preview-buttons button");
const header = document.getElementById("siteHeader");

const previewWidths = {
    desktop: "100%",
    tablet: "768px",
    tabletPortrait: "600px",
    mobile: "375px"
};

// Numeric pixel values for breakpoint decisions
const previewPxWidths = {
    desktop: Infinity,
    tablet: 768,
    tabletPortrait: 600,
    mobile: 375
};

/* ============================================ */
/* Sync --container-w CSS variable + breakpoint  */
/* data attribute whenever the preview changes.  */
/*                                               */
/* position:fixed elements ignore container      */
/* queries — they size to the viewport, not to   */
/* their ancestor. So we:                        */
/*   1. Write --container-w so the header/nav    */
/*      can clamp their width to the container.  */
/*   2. Set data-breakpoint on #siteHeader so    */
/*      CSS attribute selectors can collapse the */
/*      nav and show the hamburger at the right  */
/*      preview size (tablet / mobile).          */
/* ============================================ */

function syncContainerState(view) {

    const pixelWidth = previewPxWidths[view];

    // 1. Update CSS variable
    const cssValue = view === "desktop" ? "100vw" : previewWidths[view];
    document.documentElement.style.setProperty("--container-w", cssValue);

    // 2. Set breakpoint attribute for CSS selectors
    // Collapse nav at ≤ 900px (tablet, tabletPortrait, mobile)
    if (pixelWidth <= 900) {
        header.setAttribute("data-breakpoint", view);
    } else {
        header.removeAttribute("data-breakpoint");
    }

    // 3. Close mobile menu when switching views
    const navLinks = document.getElementById("navLinks");
    const menuToggle = document.getElementById("menuToggle");
    navLinks.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");

    // 4. Dot rail: show only on desktop preview (>900px)
    const dotRail = document.getElementById("dotRail");
    if (dotRail) {
        dotRail.style.display = pixelWidth > 900 ? "" : "none";
    }
}

previewButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const view = button.dataset.view;

        siteContainer.style.maxWidth = previewWidths[view];
        siteContainer.classList.toggle("framed", view !== "desktop");

        previewButtons.forEach((b) => b.classList.remove("active"));
        button.classList.add("active");

        syncContainerState(view);
        updateHeaderState();

    });

});

// Initialise on page load with desktop defaults
syncContainerState("desktop");


/* ============================================ */
/* Header: solid background once page is scrolled */
/* ============================================ */

function updateHeaderState(){

    if(window.scrollY > 40){
        header.classList.add("scrolled");
    }

    else{
        header.classList.remove("scrolled");
    }

}

updateHeaderState();

window.addEventListener("scroll", updateHeaderState);


/* ============================================ */
/* Mobile menu toggle                            */
/* ============================================ */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {

    const isOpen = navLinks.classList.toggle("open");

    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen);

});

navLinks.querySelectorAll(".nav-link").forEach((link) => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("open");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");

    });

});


/* ============================================ */
/* Scroll-reveal + scroll-spy for each section   */
/* ============================================ */

const sections = document.querySelectorAll(".page");
 
if (sections.length) {
 
    const navLinkByHash = {};
    document.querySelectorAll(".nav-link").forEach((link) => {
        navLinkByHash[link.getAttribute("href")] = link;
    });
 
    const dotByHash = {};
    document.querySelectorAll(".dot").forEach((dot) => {
        dotByHash[dot.getAttribute("href")] = dot;
    });
 
    const sectionObserver = new IntersectionObserver((entries) => {
 
        entries.forEach((entry) => {
 
            const hash = "#" + entry.target.id;
 
            if (entry.isIntersecting) {
 
                entry.target.classList.add("in-view");
 
                document.querySelectorAll(".nav-link.current").forEach((el) => el.classList.remove("current"));
                if (navLinkByHash[hash]) navLinkByHash[hash].classList.add("current");
 
                document.querySelectorAll(".dot.current").forEach((el) => el.classList.remove("current"));
                if (dotByHash[hash]) dotByHash[hash].classList.add("current");
            }
        });
 
    }, { threshold: 0.4 });
 
    sections.forEach((section) => sectionObserver.observe(section));
}
 
 
/* ============================================ */
/* PROJECT CARDS — video play on hover           */
/* ============================================ */
 
function initProjectCards() {
 
    document.querySelectorAll(".project-card").forEach((card) => {
 
        const video = card.querySelector(".project-video");
        if (!video) return;
 
        card.addEventListener("mouseenter", () => {
            video.currentTime = 0;
            video.play().catch(() => {});
        });
 
        card.addEventListener("mouseleave", () => {
            video.pause();
        });
    });
}
 
initProjectCards();
 
 
/* ============================================ */
/* DYNAMIC GRID — projects-data.js              */
/* ============================================ */
 
const projectGrid = document.getElementById("projectGrid");
 
if (projectGrid && typeof PROJECTS !== "undefined") {
 
    projectGrid.innerHTML = "";
 
    PROJECTS.forEach((project) => {
 
        const card = document.createElement("a");
        card.className = "project-card";
        card.href = `project.html?id=${project.id}`;
 
        card.innerHTML = `
            <video class="project-video"
                   src="${project.video}"
                   poster="${project.poster}"
                   muted loop playsinline></video>
            <div class="project-card-overlay">
                <span class="play-icon">▶</span>
                <span class="project-name">${project.title}</span>
            </div>
        `;
 
        projectGrid.appendChild(card);
    });
 
    initProjectCards();
}
 
 
/* ============================================ */
/* FEEDBACK FORM — validation, stars, popup      */
/* ============================================ */
 
function setupFeedbackForm(){
 
    const form = document.getElementById("feedbackForm");
 
    if(!form) return;
 
    const stars = form.querySelectorAll(".star");
    const popup = document.getElementById("popup");
 
    let rating = 0;
 
    stars.forEach((star) => {
 
        star.addEventListener("click", () => {
 
            rating = star.dataset.value;
 
            stars.forEach((s) => {
                s.classList.remove("active");
            });
 
            for(let i = 0; i < rating; i++){
                stars[i].classList.add("active");
            }
 
        });
 
    });
 
    form.addEventListener("submit", function(e){
 
        e.preventDefault();
 
        let valid = true;
 
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();
 
        document.getElementById("nameError").innerText = "";
        document.getElementById("emailError").innerText = "";
        document.getElementById("messageError").innerText = "";
        document.getElementById("ratingError").innerText = "";
 
        if(name === ""){
            document.getElementById("nameError").innerText =
            "Please enter your name";
            valid = false;
        }
 
        const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
        if(!emailPattern.test(email)){
            document.getElementById("emailError").innerText =
            "Enter a valid email";
            valid = false;
        }
 
        if(message.length < 10){
            document.getElementById("messageError").innerText =
            "Message should be at least 10 characters";
            valid = false;
        }
 
        if(rating == 0){
            document.getElementById("ratingError").innerText =
            "Please select a rating";
            valid = false;
        }
 
        if(valid && popup){
 
            popup.style.display = "flex";
 
            form.reset();
 
            stars.forEach((star) => {
                star.classList.remove("active");
            });
 
            rating = 0;
        }
 
    });
 
}
 
setupFeedbackForm();
 
function closePopup(){
 
    const popup = document.getElementById("popup");
 
    if(popup){
        popup.style.display = "none";
    }
}