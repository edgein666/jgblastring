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

            // Basic alt text from filename
            const alt = 'Blästringsprojekt ' + path.replace(/^images\//, '');

            div.innerHTML = `<img src="${path}" alt="${alt}">`;
            gallery.appendChild(div);
        });
    } catch (e) {
        console.error('Kunde inte läsa manifest.json:', e);
        gallery.innerHTML = "<p>Fel vid laddning av galleri.</p>";
    }
}

window.addEventListener('DOMContentLoaded', loadGallery);
