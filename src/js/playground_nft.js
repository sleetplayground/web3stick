// Constants
const STORAGE_KEY = 'web3stick_nft_data';
const EDITED_NFT_KEY = 'web3stick_edited_nft';

// DOM Elements
const searchBar = document.getElementById('searchBar');
const canvas = document.getElementById('nftCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const saveButton = document.getElementById('saveButton');
const nftNameSpan = document.getElementById('nftName');
const nftOwnerSpan = document.getElementById('nftOwner');
const nftImage = document.getElementById('nftImage');

console.log('Initializing NFT playground components...');

// Canvas Setup
function setupCanvas() {
    console.log('Setting up canvas...');
    // Set canvas size for high quality
    const size = 1000;
    canvas.width = size;
    canvas.height = size;
    
    // Set initial background
    ctx.fillStyle = colorPicker.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    console.log('Canvas initialized with color:', colorPicker.value);
    
    // Set blend mode
    ctx.globalCompositeOperation = 'difference';
    console.log('Canvas setup complete');
}

// Drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Drawing functions
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getCanvasCoordinates(e);
    console.log('Started drawing at coordinates:', { x: lastX, y: lastY });
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
    console.log('Drawing line to:', { x: currentX, y: currentY });
}

function stopDrawing() {
    if (isDrawing) {
        console.log('Stopped drawing');
        isDrawing = false;
    }
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
    console.log('Fetching NFT data from storage...');
    try {
        const cachedData = localStorage.getItem(STORAGE_KEY);
        if (cachedData) {
            console.log('Found cached NFT data');
            return JSON.parse(cachedData);
        }
        console.log('No cached NFT data found');
        return [];
    } catch (error) {
        console.error('Error fetching NFT data:', error);
        return [];
    }
}

function createSuggestionsContainer() {
    console.log('Creating suggestions container...');
    let container = document.querySelector('.suggestions-container');
    if (!container) {
        console.log('No existing container found, creating new one');
        container = document.createElement('div');
        container.className = 'suggestions-container';
        searchBar.parentNode.appendChild(container);
    }
    return container;
}

async function showSuggestions(searchText) {
    console.log('Showing suggestions for search text:', searchText);
    const container = createSuggestionsContainer();
    container.innerHTML = '';
    
    if (!searchText) {
        console.log('No search text provided, hiding suggestions');
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
    // Reset original image data
    originalImageData = null;
    
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

// Save canvas state
function saveCanvasState() {
    console.log('Saving canvas state...');
    try {
        // Create a download link
        const link = document.createElement('a');
        
        // Get the canvas data as PNG
        const imageData = canvas.toDataURL('image/png');
        link.href = imageData;
        
        // Generate filename with NFT name and timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${nftNameSpan.textContent || 'nft'}_${timestamp}.png`;
        link.download = filename;
        
        // Save to localStorage for reference
        const currentNFT = {
            image: imageData,
            name: nftNameSpan.textContent,
            owner: nftOwnerSpan.textContent,
            timestamp: timestamp
        };
        localStorage.setItem(EDITED_NFT_KEY, JSON.stringify(currentNFT));
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('Canvas saved as PNG successfully');
        alert('NFT saved as PNG successfully!');
    } catch (error) {
        console.error('Error saving canvas state:', error);
        alert('Failed to save NFT');
    }
}

// Event Listeners
window.addEventListener('load', () => {
    console.log('Window loaded, initializing components...');
    setupCanvas();
});

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

// Save button event
saveButton.addEventListener('click', saveCanvasState);

// Store original image data
let originalImageData = null;

// Color picker event
colorPicker.addEventListener('input', (e) => {
    console.log('Color changed to:', e.target.value);
    // Store current canvas state if not already stored
    if (!originalImageData) {
        console.log('Storing original canvas state');
        originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    
    // Reset composite operation to default
    ctx.globalCompositeOperation = 'source-over';
    
    // Clear canvas and set new background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = e.target.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set blend mode for drawing
    ctx.globalCompositeOperation = 'difference';
    
    // Draw the original content back if it exists
    if (originalImageData) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(originalImageData, 0, 0);
        
        ctx.drawImage(tempCanvas, 0, 0);
    }
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