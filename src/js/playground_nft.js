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
                <small>${nft.owner_id}</small>
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
    nftOwnerSpan.textContent = nft.owner_id;
    
    // Load NFT image
    const cleanMediaUrl = nft.metadata.media.replace(/[\s`]/g, '');
    
    // Create a new image object for loading
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS for the image
    
    // Handle image loading with promise
    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load NFT image'));
        img.src = cleanMediaUrl;
    }).catch(error => {
        console.error('Error loading NFT image:', error);
        return; // Exit if image fails to load
    });
    
    // Clear canvas and set blend mode
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = colorPicker.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set blend mode before drawing image
    ctx.globalCompositeOperation = 'difference';
    
    // Calculate dimensions to maintain aspect ratio
    const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
    );
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;
    
    // Draw image on canvas with blend mode applied
    ctx.drawImage(
        img,
        x, y,
        img.width * scale,
        img.height * scale
    );
    
    // Update display image
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
    // Store the current canvas content
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);
    
    // Clear and fill with new background color
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = e.target.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Restore the content with difference blend mode
    ctx.globalCompositeOperation = 'difference';
    ctx.drawImage(tempCanvas, 0, 0);
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