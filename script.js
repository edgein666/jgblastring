async function loadGallery() {
    const gallery = document.getElementById('image-gallery');
    if (!gallery) return;

    try {
        const response = await fetch('images.json', { cache: 'no-cache' });
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
        console.error('Kunde inte läsa images.json:', e);
        gallery.innerHTML = "<p>Fel vid laddning av galleri.</p>";
    }
}

function openLightbox(imageSrc, altText) {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${imageSrc}" alt="${altText}">
        </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    
    // Close on click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
            closeLightbox(lightbox);
        }
    });
    
    // Close on ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeLightbox(lightbox);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

function closeLightbox(lightbox) {
    document.body.style.overflow = ''; // Restore scroll
    lightbox.remove();
}

window.addEventListener('DOMContentLoaded', loadGallery);
