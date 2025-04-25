// Constants
const STORAGE_KEY = 'web3stick_nft_data';

// DOM Elements
const searchBar = document.getElementById('searchBar');
const canvas = document.getElementById('nftCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const saveButton = document.getElementById('saveButton');
const nftNameSpan = document.getElementById('nftName');
const nftOwnerSpan = document.getElementById('nftOwner');
const nftImage = document.getElementById('nftImage');

// Canvas Setup
function setupCanvas() {
    // Set canvas size for high quality
    const size = 1000;
    canvas.width = size;
    canvas.height = size;
    
    // Set initial background
    ctx.fillStyle = colorPicker.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set blend mode
    ctx.globalCompositeOperation = 'difference';
}

// Drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Drawing functions
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getCanvasCoordinates(e);
}

function draw(e) {
    if (!isDrawing) return;
    
    const [currentX, currentY] = getCanvasCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    [lastX, lastY] = [currentX, currentY];
}

function stopDrawing() {
    isDrawing = false;
}

function getCanvasCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return [
        (e.clientX - rect.left) * scaleX,
        (e.clientY - rect.top) * scaleY
    ];
}

// NFT Search and Display
async function getNFTData() {
    try {
        const cachedData = localStorage.getItem(STORAGE_KEY);
        if (cachedData) {
            return JSON.parse(cachedData);
        }
        return [];
    } catch (error) {
        console.error('Error fetching NFT data:', error);
        return [];
    }
}

function createSuggestionsContainer() {
    let container = document.querySelector('.suggestions-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'suggestions-container';
        searchBar.parentNode.appendChild(container);
    }
    return container;
}

async function showSuggestions(searchText) {
    const container = createSuggestionsContainer();
    container.innerHTML = '';
    
    if (!searchText) {
        container.style.display = 'none';
        return;
    }
    
    const nftData = await getNFTData();
    const matches = nftData.filter(nft => 
        nft.metadata.title.toLowerCase().includes(searchText.toLowerCase())
    );
    
    if (matches.length > 0) {
        container.style.display = 'block';
        matches.forEach(nft => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = `
                ${nft.metadata.title}
                <small>${nft.owner}</small>
            `;
            div.onclick = () => loadNFT(nft);
            container.appendChild(div);
        });
    } else {
        container.style.display = 'none';
    }
}

async function loadNFT(nft) {
    // Update NFT details
    nftNameSpan.textContent = nft.metadata.title;
    nftOwnerSpan.textContent = nft.owner;
    
    // Load NFT image
    const cleanMediaUrl = nft.metadata.media.replace(/[\s`]/g, '');
    nftImage.src = cleanMediaUrl;
    
    // Clear suggestions
    const container = document.querySelector('.suggestions-container');
    if (container) {
        container.style.display = 'none';
    }
    
    // Clear search bar
    searchBar.value = '';
}

// Event Listeners
window.addEventListener('load', setupCanvas);

// Canvas drawing events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch events for mobile
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startDrawing(e.touches[0]);
});
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e.touches[0]);
});
canvas.addEventListener('touchend', stopDrawing);

// Color picker event
colorPicker.addEventListener('input', (e) => {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = e.target.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'difference';
});

// Search bar events
searchBar.addEventListener('input', (e) => showSuggestions(e.target.value));

// Click outside search suggestions to close
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        const container = document.querySelector('.suggestions-container');
        if (container) {
            container.style.display = 'none';
        }
    }
});