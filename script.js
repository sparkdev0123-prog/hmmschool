    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector("#navLinks");
    const scrollTop = document.querySelector(".scroll-top");

    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.querySelector("i").className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.querySelector("i").className = "fa-solid fa-bars";
      });
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

    window.addEventListener("scroll", () => {
      scrollTop.classList.toggle("visible", window.scrollY > 520);
    }, { passive: true });

    scrollTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.querySelectorAll(".js-form").forEach((form) => {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const status = form.querySelector(".form-status");
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton ? submitButton.innerHTML : "";

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
        }
        if (status) status.textContent = "Sending your message...";

        try {
          const response = await fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: { Accept: "application/json" }
          });

          if (!response.ok) throw new Error("Form submission failed");

          if (status) {
            status.textContent = form.dataset.emailForm === "admission"
              ? "Thank you. Your admission enquiry has been sent to the school office."
              : "Thank you. Your message has been sent to the school office.";
          }
          form.reset();
        } catch (error) {
          if (status) status.textContent = "Sorry, something went wrong. Please call the school office or try again.";
        } finally {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
          }
        }
      });
    });

/* ===== Gallery & Interaction Scripts ===== */

    // ---------- Festival Gallery Click-to-Open System ----------
    (function () {
      function buildFolderImages(folder, count) {
        const arr = [];
        for (let i = 1; i <= count; i++) {
          arr.push("images/" + folder + "/img" + i + ".jpg");
        }
        return arr;
      }

      const galleryData = {
        "republic-day": {
          title: "Republic Day",
          type: "grid",
          images: buildFolderImages("republic-day", 16)
        },
        "christmas": {
          title: "Christmas",
          type: "grid",
          images: buildFolderImages("christmas", 8)
        },
        "janmashtami": {
          title: "Janmashtami",
          type: "grid",
          images: buildFolderImages("janmashtami", 12)
        },
        "independence-day": {
          title: "Independence Day",
          type: "grid",
          images: buildFolderImages("republic-day", 16)
        }
      };

      const galleryOverlay = document.getElementById("galleryModalOverlay");
      const galleryTitle = document.getElementById("galleryModalTitle");
      const galleryBody = document.getElementById("galleryModalBody");
      const galleryClose = document.getElementById("galleryModalClose");

      const lightboxOverlay = document.getElementById("lightboxOverlay");
      const lightboxImg = document.getElementById("lightboxImg");
      const lightboxClose = document.getElementById("lightboxClose");
      const lightboxPrev = document.getElementById("lightboxPrev");
      const lightboxNext = document.getElementById("lightboxNext");

      let currentImages = [];
      let currentIndex = 0;

      function openGallery(key) {
        const data = galleryData[key];
        if (!data) return;

        galleryTitle.textContent = data.title;
        galleryBody.innerHTML = "";

        if (!data.images || data.images.length === 0) {
          galleryBody.className = "gallery-modal-body";
          const note = document.createElement("p");
          note.className = "gallery-empty-note";
          note.textContent = "Photos for this section are coming soon.";
          galleryBody.appendChild(note);
        } else if (data.type === "single") {
          galleryBody.className = "gallery-modal-body single-photo";
          const img = document.createElement("img");
          img.src = data.images[0];
          img.alt = data.title + " photo";
          img.addEventListener("click", function () {
            openLightbox(data.images, 0);
          });
          galleryBody.appendChild(img);
        } else {
          galleryBody.className = "gallery-modal-body";
          const grid = document.createElement("div");
          grid.className = "gallery-photo-grid";
          data.images.forEach(function (src, idx) {
            const btn = document.createElement("button");
            btn.type = "button";
            const img = document.createElement("img");
            img.src = src;
            img.alt = data.title + " photo " + (idx + 1);
            img.loading = "lazy";
            btn.appendChild(img);
            btn.addEventListener("click", function () {
              openLightbox(data.images, idx);
            });
            grid.appendChild(btn);
          });
          galleryBody.appendChild(grid);
        }

        galleryOverlay.classList.add("is-open");
        document.body.style.overflow = "hidden";
      }

      function closeGallery() {
        galleryOverlay.classList.remove("is-open");
        document.body.style.overflow = "";
      }

      function openLightbox(images, index) {
        currentImages = images;
        currentIndex = index;
        lightboxImg.src = currentImages[currentIndex];
        lightboxOverlay.classList.add("is-open");
        const multi = currentImages.length > 1;
        lightboxPrev.style.display = multi ? "flex" : "none";
        lightboxNext.style.display = multi ? "flex" : "none";
      }

      function closeLightbox() {
        lightboxOverlay.classList.remove("is-open");
        lightboxImg.src = "";
      }

      function showPrev() {
        if (!currentImages.length) return;
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        lightboxImg.src = currentImages[currentIndex];
      }

      function showNext() {
        if (!currentImages.length) return;
        currentIndex = (currentIndex + 1) % currentImages.length;
        lightboxImg.src = currentImages[currentIndex];
      }

      document.querySelectorAll("[data-gallery-key]").forEach(function (el) {
        el.addEventListener("click", function () {
          openGallery(el.getAttribute("data-gallery-key"));
        });
      });

      galleryClose.addEventListener("click", closeGallery);
      galleryOverlay.addEventListener("click", function (e) {
        if (e.target === galleryOverlay) closeGallery();
      });

      lightboxClose.addEventListener("click", closeLightbox);
      lightboxPrev.addEventListener("click", showPrev);
      lightboxNext.addEventListener("click", showNext);
      lightboxOverlay.addEventListener("click", function (e) {
        if (e.target === lightboxOverlay) closeLightbox();
      });

      document.addEventListener("keydown", function (e) {
        if (lightboxOverlay.classList.contains("is-open")) {
          if (e.key === "Escape") closeLightbox();
          if (e.key === "ArrowLeft") showPrev();
          if (e.key === "ArrowRight") showNext();
        } else if (galleryOverlay.classList.contains("is-open")) {
          if (e.key === "Escape") closeGallery();
        }
      });
    })();
