/*
Glen Austin Sports Club
Part 3 - Interactive JavaScript
*/
document.addEventListener("DOMContentLoaded", function () {
// 1. Mobile navigation
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-nav");
if (menuButton && navigation) {
menuButton.addEventListener("click", function () {
navigation.classList.toggle("open");
const menuIsOpen = navigation.classList.contains("open");
menuButton.setAttribute("aria-expanded", menuIsOpen);
menuButton.setAttribute(
"aria-label",
menuIsOpen ? "Close navigation menu" : "Open navigation menu"
);
menuButton.textContent = menuIsOpen ? "✕" : "☰";
});
navigation.querySelectorAll("a").forEach(function (link) {
link.addEventListener("click", function () {
navigation.classList.remove("open");
menuButton.setAttribute("aria-expanded", "false");
menuButton.setAttribute("aria-label", "Open navigation menu");
menuButton.textContent = "☰";
});
});
window.addEventListener("resize", function () {
if (window.innerWidth > 800) {
navigation.classList.remove("open");
menuButton.setAttribute("aria-expanded", "false");
menuButton.textContent = "☰";
}
});
}
// 2. Automatically update the copyright year
document.querySelectorAll("#year").forEach(function (element) {
element.textContent = new Date().getFullYear();
});
// 3. Gallery lightbox
const galleryImages = document.querySelectorAll(
".gallery-grid img, .gallery-item img, .gallery-card img"
);
if (galleryImages.length > 0) {
const lightbox = document.createElement("div");
lightbox.id = "gallery-lightbox";
lightbox.setAttribute("role", "dialog");
lightbox.setAttribute("aria-modal", "true");
lightbox.setAttribute("aria-label", "Enlarged gallery image");
lightbox.innerHTML = `
<button type="button" id="lightbox-close"
aria-label="Close enlarged image">&times;</button>
<button type="button" id="lightbox-previous"
aria-label="Previous image">&#10094;</button>
<figure>
<img id="lightbox-image" src="" alt="">
<figcaption id="lightbox-caption"></figcaption>
</figure>
<button type="button" id="lightbox-next"
aria-label="Next image">&#10095;</button>
`;
document.body.appendChild(lightbox);
const enlargedImage = document.querySelector("#lightbox-image");
const caption = document.querySelector("#lightbox-caption");
const closeButton = document.querySelector("#lightbox-close");
const previousButton = document.querySelector("#lightbox-previous");
const nextButton = document.querySelector("#lightbox-next");
let currentImageIndex = 0;
function showImage(index) {
if (index < 0) {
index = galleryImages.length - 1;
}
if (index >= galleryImages.length) {
index = 0;
}
currentImageIndex = index;
const image = galleryImages[index];
enlargedImage.src = image.src;
enlargedImage.alt = image.alt || "Sports club photograph";
const figure = image.closest("figure");
const imageCaption = figure
? figure.querySelector("figcaption")
: null;
caption.textContent = imageCaption
? imageCaption.textContent
: image.alt;
}
galleryImages.forEach(function (image, index) {
image.style.cursor = "zoom-in";
image.setAttribute("tabindex", "0");
image.setAttribute("role", "button");
image.setAttribute(
"aria-label",
"Enlarge image: " + (image.alt || "Sports club photograph")
);
function openImage() {
showImage(index);
lightbox.classList.add("lightbox-open");
document.body.style.overflow = "hidden";
closeButton.focus();
}
image.addEventListener("click", openImage);
image.addEventListener("keydown", function (event) {
if (event.key === "Enter" || event.key === " ") {
event.preventDefault();
openImage();
}
});
});
function closeLightbox() {
lightbox.classList.remove("lightbox-open");
document.body.style.overflow = "";
}
closeButton.addEventListener("click", closeLightbox);
previousButton.addEventListener("click", function () {
showImage(currentImageIndex - 1);
});
nextButton.addEventListener("click", function () {
showImage(currentImageIndex + 1);
});
lightbox.addEventListener("click", function (event) {
if (event.target === lightbox) {
closeLightbox();
}
});
document.addEventListener("keydown", function (event) {
if (!lightbox.classList.contains("lightbox-open")) {
return;
}
if (event.key === "Escape") {
closeLightbox();
}
if (event.key === "ArrowLeft") {
showImage(currentImageIndex - 1);
}
if (event.key === "ArrowRight") {
showImage(currentImageIndex + 1);
}
});
}
// 4. Search and filter sports cards
const searchInput = document.querySelector("#sports-search");
const sportFilter = document.querySelector("#sports-filter");
const sportCards = document.querySelectorAll(".sport-card");
const searchMessage = document.querySelector("#search-message");
function filterSports() {
const searchTerm = searchInput
? searchInput.value.toLowerCase().trim()
: "";
const selectedSport = sportFilter
? sportFilter.value.toLowerCase()
: "all";
let visibleCards = 0;
sportCards.forEach(function (card) {
const cardText = card.textContent.toLowerCase();
const matchesSearch = cardText.includes(searchTerm);
const heading = card.querySelector("h2, h3, h4");
const sportName = heading
? heading.textContent.toLowerCase()
: "";
const matchesCategory =
selectedSport === "all" ||
sportName.includes(selectedSport);
if (matchesSearch && matchesCategory) {
card.style.display = "";
visibleCards++;
} else {
card.style.display = "none";
}
});
if (searchMessage) {
searchMessage.textContent = visibleCards === 0
? "No sports were found. Try another search."
: visibleCards + " sport(s) found.";
}
}
if (searchInput) {
searchInput.addEventListener("input", filterSports);
}
if (sportFilter) {
sportFilter.addEventListener("change", filterSports);
}
 // 5. Contact form validation and Formspree submission

    const contactForm = document.querySelector("#contact-form");
    const contactResponse = document.querySelector("#contact-response");

    if (contactForm && contactResponse) {

        contactForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            // Check that all required fields are completed
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            const submitButton = contactForm.querySelector(
                'button[type="submit"]'
            );

            const originalButtonText = submitButton
                ? submitButton.textContent
                : "";

            // Show loading message
            contactResponse.hidden = false;
            contactResponse.className = "form-response loading";
            contactResponse.textContent =
                "Sending your message. Please wait...";

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
            }

            try {

                const formData = new FormData(contactForm);

                const response = await fetch(contactForm.action, {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Accept": "application/json"
                    }
                });

                const result = await response.json();

                if (response.ok) {

                    // Successful submission
                    contactResponse.className = "form-response success";
                    contactResponse.textContent =
                        "Thank you! Your message has been sent successfully. " +
                        "Glen Austin Sports Club will get back to you.";

                    contactForm.reset();

                } else {

                    // Formspree returned an error
                    contactResponse.className = "form-response error";
                    contactResponse.textContent =
                        result.errors
                            ? result.errors.map(error => error.message).join(" ")
                            : "Sorry, your message could not be sent. Please try again.";

                }

            } catch (error) {

                // Network or connection error
                contactResponse.className = "form-response error";
                contactResponse.textContent =
                    "We could not send your message because of a connection problem. " +
                    "Please check your internet connection and try again.";

            } finally {

                // Re-enable the button
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }

            }

            contactResponse.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

        });

    }


// 6. Enquiry form validation and email submission
const enquiryForm = document.querySelector("#enquiry-form");
const enquiryResponse = document.querySelector("#enquiry-response");

if (enquiryForm && enquiryResponse) {

    enquiryForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const detailsField = enquiryForm.querySelector(
            '[name="details"]'
        );

        // Clear previous custom validation errors
        if (detailsField) {
            detailsField.setCustomValidity("");
        }

        // Check required fields
        if (!enquiryForm.checkValidity()) {
            enquiryForm.reportValidity();
            return;
        }

        // Check message length
        if (detailsField && detailsField.value.trim().length < 10) {
            detailsField.setCustomValidity(
                "Please enter at least 10 characters describing your enquiry."
            );
            detailsField.reportValidity();
            return;
        }

        const submitButton = enquiryForm.querySelector(
            'button[type="submit"]'
        );

        const originalButtonText = submitButton.textContent;

        // Show sending message
        enquiryResponse.hidden = false;
        enquiryResponse.className = "form-response loading";
        enquiryResponse.textContent =
            "Sending your enquiry. Please wait...";

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        try {

            const formData = new FormData(enquiryForm);

            const response = await fetch(enquiryForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            });

            const result = await response.json();

            if (response.ok) {

                // Clear all submitted details
                enquiryForm.reset();

                // Display success message
                enquiryResponse.className = "form-response success";
                enquiryResponse.textContent =
                    "Thank you! Your enquiry has been sent successfully. " +
                    "Glen Austin Sports Club will get back to you.";

            } else {

                enquiryResponse.className = "form-response error";
                enquiryResponse.textContent = result.errors
                    ? result.errors.map(error => error.message).join(" ")
                    : "Sorry, your enquiry could not be sent. Please try again.";

            }

        } catch (error) {

            enquiryResponse.className = "form-response error";
            enquiryResponse.textContent =
                "We could not send your enquiry because of a connection problem. " +
                "Please check your internet connection and try again.";

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;

        }

        enquiryResponse.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    });
}
// 8. Simple reveal animation when elements enter the screen
const animatedElements = document.querySelectorAll(
".sport-card, .info-box, .gallery-item, .stat-card"
);
if ("IntersectionObserver" in window && animatedElements.length > 0) {
const observer = new IntersectionObserver(
function (entries, currentObserver) {
entries.forEach(function (entry) {
if (entry.isIntersecting) {
entry.target.classList.add("is-visible");
currentObserver.unobserve(entry.target);
}
});
},
{
threshold: 0.15
}
);
animatedElements.forEach(function (element) {
element.classList.add("reveal");
observer.observe(element);
});
}
// 9. Basic accordion functionality
const accordionButtons = document.querySelectorAll(".accordion-button");
accordionButtons.forEach(function (button) {
button.addEventListener("click", function () {
const panelId = button.getAttribute("aria-controls");
const panel = panelId
? document.getElementById(panelId)
: button.nextElementSibling;
if (!panel) {
return;
}
const isExpanded =
button.getAttribute("aria-expanded") === "true";
button.setAttribute("aria-expanded", String(!isExpanded));
panel.hidden = isExpanded;
});
 
});
});

