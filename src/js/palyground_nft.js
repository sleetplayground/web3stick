

// Constants
const STORAGE_KEY = 'web3stick_nft_data';
const searchBar = document.getElementById('searchBar');
const suggestionsContainer = document.createElement('div');
const nftCanvas = document.getElementById('nftCanvas');
const ctx = nftCanvas.getContext('2d');
const nftImage = document.getElementById('nftImage');
const nftName = document.getElementById('nftName');
const nftOwner = document.getElementById('nftOwner');

// Setup search functionality
document.addEventListener('DOMContentLoaded', () => {
    searchBar.parentNode.insertBefore(suggestionsContainer, searchBar.nextSibling);
    suggestionsContainer.className = 'suggestions-container';
    
    searchBar.addEventListener('input', handleSearchInput);
    suggestionsContainer.addEventListener('click', handleSuggestionClick);
});

// Handle search input
function handleSearchInput(event) {
    const searchTerm = event.target.value.toLowerCase();
    const allNFTs = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    const matches = allNFTs.filter(nft => {
        const title = (nft.metadata.title || '').toLowerCase();
        const owner = (nft.owner_id || '').toLowerCase();
        return title.includes(searchTerm) || owner.includes(searchTerm);
    });

    showSuggestions(matches);
}

// Show search suggestions
function showSuggestions(matches) {
    suggestionsContainer.innerHTML = '';
    
    matches.slice(0, 5).forEach(nft => {
        const suggestion = document.createElement('div');
        suggestion.className = 'suggestion-item';
        suggestion.dataset.nft = JSON.stringify(nft);
        
        suggestion.innerHTML = `
            <span>${nft.metadata.title || 'Untitled'}</span>
            <small>${nft.owner_id}</small>
        `;
        
        suggestionsContainer.appendChild(suggestion);
    });
}

// Handle suggestion click
function handleSuggestionClick(event) {
    const suggestion = event.target.closest('.suggestion-item');
    if (!suggestion) return;
    
    const nft = JSON.parse(suggestion.dataset.nft);
    loadNFT(nft);
}

// Load selected NFT
function loadNFT(nft) {
    // Clear canvas
    ctx.clearRect(0, 0, nftCanvas.width, nftCanvas.height);
    
    // Load image
    const img = new Image();
    img.src = nft.metadata.media.replace(/[\s`]/g, '');
    img.onload = () => {
        // Draw on canvas
        ctx.drawImage(img, 0, 0, nftCanvas.width, nftCanvas.height);
        
        // Update details
        nftImage.src = img.src;
        nftName.textContent = nft.metadata.title || 'Untitled';
        nftOwner.textContent = nft.owner_id;
    };
    
    // Clear search and suggestions
    searchBar.value = '';
    suggestionsContainer.innerHTML = '';
}