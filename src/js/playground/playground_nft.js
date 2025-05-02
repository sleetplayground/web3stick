// Import NFT data service
import { getNFTData } from '../nft_data_service';

// Initialize NFT data and search functionality
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize NFT data
    await initNFTData();
    
    // Set up search functionality
    setupSearch();
});

// Initialize NFT data
async function initNFTData() {
    try {
        await getNFTData(); // This will fetch and cache the NFT data
    } catch (error) {
        console.error('Error initializing NFT data:', error);
    }
}

// Set up search functionality
function setupSearch() {
    const searchBar = document.getElementById('searchBar');
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'suggestions-container';
    searchBar.parentNode.appendChild(suggestionsContainer);

    searchBar.addEventListener('input', handleSearch);
}

// Handle search input
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const allNFTs = JSON.parse(localStorage.getItem('web3stick_nft_data')) || [];
    const suggestionsContainer = document.querySelector('.suggestions-container');
    
    // Clear previous suggestions
    suggestionsContainer.innerHTML = '';
    
    if (!searchTerm) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    // Filter NFTs based on search term
    const filteredNFTs = allNFTs.filter(nft => {
        const title = (nft.metadata.title || '').toLowerCase();
        const owner = (nft.owner_id || '').toLowerCase();
        return title.includes(searchTerm) || owner.includes(searchTerm);
    }).slice(0, 5); // Limit to 5 suggestions

    // Display suggestions
    if (filteredNFTs.length > 0) {
        suggestionsContainer.style.display = 'block';
        filteredNFTs.forEach(nft => {
            const suggestion = createSuggestionItem(nft);
            suggestionsContainer.appendChild(suggestion);
        });
    } else {
        suggestionsContainer.style.display = 'none';
    }
}

// Create suggestion item
function createSuggestionItem(nft) {
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    item.innerHTML = `
        ${nft.metadata.title || 'Untitled'}
        <small>${nft.owner_id}</small>
    `;

    // Handle click on suggestion
    item.addEventListener('click', () => {
        loadNFTImage(nft);
        document.querySelector('.suggestions-container').style.display = 'none';
        document.getElementById('searchBar').value = nft.metadata.title || 'Untitled';
    });

    return item;
}

// Load NFT image into SVG
function loadNFTImage(nft) {
    const svgImage = document.querySelector('.plaground_SVG image');
    if (svgImage && nft.metadata.media) {
        const cleanMediaUrl = nft.metadata.media.replace(/[\s`]/g, '');
        svgImage.setAttribute('href', cleanMediaUrl);
    }
}

// Close suggestions when clicking outside
document.addEventListener('click', (event) => {
    const suggestionsContainer = document.querySelector('.suggestions-container');
    const searchBar = document.getElementById('searchBar');
    
    if (!searchBar.contains(event.target) && !suggestionsContainer.contains(event.target)) {
        suggestionsContainer.style.display = 'none';
    }
});