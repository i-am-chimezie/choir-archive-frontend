// API URL - your live backend
const API_URL = 'https://choir-archive-backendd.onrender.com/api';

// Global fetch functions
async function getSongs() {
    const response = await fetch(`${API_URL}/songs`);
    return await response.json();
}

async function getSong(slug) {
    const response = await fetch(`${API_URL}/songs/${slug}`);
    return await response.json();
}

// Order of Mass (correct liturgical sequence)
const massOrder = [
    { slug: "Entrance", name: "Entrance" },
    { slug: "Gloria", name: "Gloria" },
    { slug: "Psalm", name: "Psalm" },
    { slug: "Alleluia", name: "Alleluia" },
    { slug: "Offertory", name: "Offertory" },
    { slug: "Sanctus", name: "Sanctus" },
    { slug: "Agnus Dei", name: "Agnus Dei" },
    { slug: "Communion", name: "Communion" },
    { slug: "Recessional", name: "Recessional" }
];

// Display Order of Mass
async function displayMassOrder() {
    const list = document.getElementById('massList');
    if (!list) return;
    
    try {
        const songs = await getSongs();
        
        list.innerHTML = massOrder.map(item => {
            const count = songs.filter(s => s.category === item.slug).length;
            return `
                <li class="mass-item">
                    <a href="songs.html?category=${item.slug}">
                        <span class="name">${item.name}</span>
                        <span class="count">${count} songs</span>
                    </a>
                </li>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading mass order:', error);
    }
}

// Display Latest Additions
async function displayLatest() {
    const container = document.getElementById('latestList');
    if (!container) return;
    
    try {
        const songs = await getSongs();
        const latest = songs.slice(0, 6);
        
        container.innerHTML = latest.map(song => `
            <div class="song-card" onclick="window.location.href='song.html?song=${song.slug}'">
                <div class="category">${escapeHtml(song.category)}</div>
                <h4>${escapeHtml(song.title)}</h4>
                <p class="composer">${escapeHtml(song.composer)}</p>
                <div class="meta">${escapeHtml(song.language)}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading latest songs:', error);
    }
}

// Search function
window.search = function() {
    const q = document.getElementById('searchInput').value;
    if (q) window.location.href = `songs.html?search=${encodeURIComponent(q)}`;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Initialize homepage
if (document.getElementById('massList')) {
    document.addEventListener('DOMContentLoaded', async function() {
        await displayMassOrder();
        await displayLatest();
    });
}
