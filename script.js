async function loadGallery() {
    const gallery = document.getElementById('image-gallery');
    if (!gallery) return;

    try {
        const response = await fetch('manifest.json', { cache: 'no-cache' });
        if (!response.ok) {
            gallery.innerHTML = "<p>Bilder kommer snart.</p>";
            return;
        }

        const images = await response.json();
        if (!Array.isArray(images) || images.length === 0) {
            gallery.innerHTML = "<p>Inga bilder uppladdade ännu.</p>";
            return;
        }

        images.forEach(path => {
            const div = document.createElement('div');
            div.className = 'gallery-item';

            // Better Swedish alt text from filename
            const filename = path.replace(/^images\//, '').replace(/\.[^.]+$/, '');
            const cleanName = filename.replace(/[-_]/g, ' ');
            const alt = 'Blästringsarbete – ' + cleanName;

            div.innerHTML = `<img src="${path}" alt="${alt}" loading="lazy">`;

            // Click to open lightbox
            div.addEventListener('click', () => openLightbox(path, alt));

            gallery.appendChild(div);
        });
    } catch (e) {
        console.error('Kunde inte läsa manifest.json:', e);
        gallery.innerHTML = "<p>Fel vid laddning av galleri.</p>";
    }
}

function openLightbox(imageSrc, altText) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${imageSrc}" alt="${altText}">
        </div>
    `;

    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
            closeLightbox(lightbox);
        }
    });

    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeLightbox(lightbox);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

function closeLightbox(lightbox) {
    document.body.style.overflow = '';
    lightbox.remove();
}

function setupMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('nav-open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-open');
        });
    });
}

window.addEventListener('DOMContentLoaded', () => {
    loadGallery();
    setupMobileNav();
});
