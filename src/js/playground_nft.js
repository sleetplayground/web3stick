// Constants for local storage
const STORAGE_KEY = 'web3stick_nft_data';

// Store for NFT data
let nftData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Get DOM elements
const canvas = document.getElementById('nftCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const searchBar = document.getElementById('searchBar');
const nftImage = document.getElementById('nftImage');
const nftName = document.getElementById('nftName');
const nftOwner = document.getElementById('nftOwner');
const saveButton = document.getElementById('saveButton');

// Set canvas size for high quality
function setupCanvas() {
    // Set to 1000x1000 for high quality
    canvas.width = 1000;
    canvas.height = 1000;
    // Initial background
    ctx.fillStyle = colorPicker.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Initialize canvas
setupCanvas();

// Color picker event
colorPicker.addEventListener('input', (e) => {
    ctx.fillStyle = e.target.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Redraw NFT if exists
    if (nftImage.src) {
        drawNFTOnCanvas();
    }
});

// Drawing functionality
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getCanvasCoordinates(e);
}

function draw(e) {
    if (!isDrawing) return;
    
    const [x, y] = getCanvasCoordinates(e);
    
    // Set up for white line with difference blend mode
    ctx.globalCompositeOperation = 'difference';
    ctx.strokeStyle = '#ffffff'; // White color for difference blend
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    
    // Draw line
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    [lastX, lastY] = [x, y];
}

function stopDrawing() {
    isDrawing = false;
}

// Get canvas coordinates accounting for scaling
function getCanvasCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return [
        (e.clientX - rect.left) * scaleX,
        (e.clientY - rect.top) * scaleY
    ];
}

// Add drawing event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Load and draw NFT on canvas
function drawNFTOnCanvas() {
    const img = new Image();
    img.src = nftImage.src;
    img.onload = () => {
        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
        // Draw background
        ctx.fillStyle = colorPicker.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Set blend mode for NFT
        ctx.globalCompositeOperation = 'difference';
        // Draw NFT centered and scaled
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.8;
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };
}

// Search functionality with suggestions
searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const suggestionsContainer = document.querySelector('.suggestions-container') 
        || document.createElement('div');
    
    suggestionsContainer.className = 'suggestions-container';
    
    if (!searchTerm) {
        suggestionsContainer.remove();
        return;
    }
    
    // Filter NFTs based on search term
    const suggestions = nftData.filter(nft => 
        nft.name.toLowerCase().includes(searchTerm) ||
        nft.owner.toLowerCase().includes(searchTerm)
    ).slice(0, 5);
    
    // Create suggestions HTML
    suggestionsContainer.innerHTML = suggestions.map(nft => `
        <div class="suggestion-item" data-nft-id="${nft.id}">
            <strong>${nft.name}</strong>
            <small>Owner: ${nft.owner}</small>
        </div>
    `).join('');
    
    // Add suggestions to DOM
    if (!document.querySelector('.suggestions-container')) {
        searchBar.parentNode.appendChild(suggestionsContainer);
    }
    
    // Add click handlers to suggestions
    suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const nft = nftData.find(n => n.id === item.dataset.nftId);
            if (nft) {
                nftImage.src = nft.imageUrl;
                nftName.textContent = nft.name;
                nftOwner.textContent = nft.owner;
                drawNFTOnCanvas();
                suggestionsContainer.remove();
                searchBar.value = nft.name;
            }
        });
    });
});

// Save functionality
saveButton.addEventListener('click', () => {
    // Create a temporary link to download the canvas
    const link = document.createElement('a');
    link.download = `${nftName.textContent || 'web3stick'}_edited.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// Load NFT data from local storage on page load
window.addEventListener('DOMContentLoaded', () => {
    // Update nftData from localStorage
    nftData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    // If no data exists, initialize with default NFT
    if (nftData.length === 0) {
        nftData = [{
            id: '1',
            name: 'Stick Figure #1',
            owner: 'user1.near',
            imageUrl: './img/web3stick.png'
        }];
    }
});