// API URL - your live backend
const API_URL = 'https://choir-archive-backendd.onrender.com/api';

// Fetch functions
async function getSongs() {
    const response = await fetch(`${API_URL}/songs`);
    return await response.json();
}

async function getSongsByCategory(category) {
    const response = await fetch(`${API_URL}/songs/category/${category}`);
    return await response.json();
}

async function getSong(slug) {
    const response = await fetch(`${API_URL}/songs/${slug}`);
    return await response.json();
}

// Order of Mass (correct liturgical sequence)
const massOrder = [
    { slug: "entrance", name: "Entrance" },
    { slug: "kyrie", name: "Kyrie" },
    { slug: "gloria", name: "Gloria" },
    { slug: "psalm", name: "Responsorial Psalm" },
    { slug: "gospel-acclamation", name: "Gospel Acclamation" },
    { slug: "offertory", name: "Offertory" },
    { slug: "sanctus", name: "Sanctus" },
    { slug: "agnus-dei", name: "Agnus Dei" },
    { slug: "communion", name: "Communion" },
    { slug: "recessional", name: "Recessional" },
    { slug: "marian", name: "Marian Hymns" }
];

// Display Order of Mass (vertical grid)
async function displayMassOrder() {
    const list = document.getElementById('massList');
    if (!list) return;
    
    const songs = await getSongs();
    
    list.innerHTML = massOrder.map(item => {
        const count = songs.filter(s => s.category === item.slug).length;
        return `
            <li class="mass-item">
                <a href="category.html?cat=${item.slug}">
                    <span class="name">${item.name}</span>
                    <span class="count">${count} songs</span>
                </a>
            </li>
        `;
    }).join('');
}

// Display Latest Additions (horizontal scroll)
async function displayLatest() {
    const container = document.getElementById('latestList');
    if (!container) return;
    
    const songs = await getSongs();
    const latest = songs.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)).slice(0, 6);
    
    container.innerHTML = latest.map(song => `
        <div class="song-card" onclick="goToSong('${song.slug}')">
            <div class="category">${song.category}</div>
            <h4>${song.title}</h4>
            <p class="composer">${song.composer}</p>
            <div class="meta">${song.language} • Added ${song.dateAdded}</div>
        </div>
    `).join('');
}

// Search function
function search() {
    const q = document.getElementById('searchInput').value;
    if (q) window.location.href = `search.html?q=${encodeURIComponent(q)}`;
}

// Go to song page
function goToSong(slug) {
    window.location.href = `song.html?song=${slug}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
    await displayMassOrder();
    await displayLatest();
});
