// Import NFT data service
import { getNFTData } from './nft_data_service';

// State management
let currentPage = 1;
let itemsPerPage = 10;
let filteredNFTs = [];

// Main initialization
document.addEventListener('DOMContentLoaded', initNFTGallery);

// Initialize the NFT gallery
async function initNFTGallery() {
    console.log('Initializing NFT gallery...');
    const nftData = await getNFTData();
    if (nftData && nftData.length > 0) {
        filteredNFTs = nftData;
        hideLoadingSpinner();
        setupEventListeners();
        updateGalleryDisplay();
    }
}

// Setup event listeners for search and pagination
function setupEventListeners() {
    const searchInput = document.getElementById('nft-search');
    const itemsPerPageSelect = document.getElementById('items-per-page');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    searchInput.addEventListener('input', handleSearch);
    itemsPerPageSelect.addEventListener('change', handleItemsPerPageChange);
    prevButton.addEventListener('click', () => changePage(-1));
    nextButton.addEventListener('click', () => changePage(1));
}

// Handle search functionality
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const allNFTs = JSON.parse(localStorage.getItem('web3stick_nft_data')) || [];
    
    filteredNFTs = allNFTs.filter(nft => {
        const title = (nft.metadata.title || '').toLowerCase();
        const owner = (nft.owner_id || '').toLowerCase();
        return title.includes(searchTerm) || owner.includes(searchTerm);
    });

    currentPage = 1;
    updateGalleryDisplay();
}

// Handle items per page change
function handleItemsPerPageChange(event) {
    itemsPerPage = parseInt(event.target.value);
    currentPage = 1;
    updateGalleryDisplay();
}

// Handle page navigation
function changePage(delta) {
    const maxPage = Math.ceil(filteredNFTs.length / itemsPerPage);
    const newPage = currentPage + delta;

    if (newPage >= 1 && newPage <= maxPage) {
        currentPage = newPage;
        updateGalleryDisplay();
    }
}

// Update gallery display with current filters and pagination
function updateGalleryDisplay() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentNFTs = filteredNFTs.slice(startIndex, endIndex);

    renderNFTGallery(currentNFTs);
    updatePaginationControls();
}

// Update pagination controls
function updatePaginationControls() {
    const maxPage = Math.ceil(filteredNFTs.length / itemsPerPage);
    const currentPageSpan = document.getElementById('current-page');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    currentPageSpan.textContent = currentPage;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === maxPage;
}

// UI rendering functions
function renderNFTGallery(nftData) {
    const gallery = document.getElementById('nft-gallery');
    gallery.innerHTML = '';

    nftData.forEach(nft => {
        const card = createNFTCard(nft);
        gallery.appendChild(card);
    });
}

function createNFTCard(nft) {
    const card = document.createElement('div');
    card.className = 'nft-card';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'nft-image-container';

    const image = document.createElement('img');
    image.className = 'nft-image';
    image.alt = nft.metadata.title || 'NFT Image';
    
    // Lazy loading with IntersectionObserver
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Clean up the media URL by removing backticks and extra spaces
                const cleanMediaUrl = nft.metadata.media.replace(/[\s`]/g, '');
                image.src = cleanMediaUrl;
                image.onload = () => image.classList.add('loaded');
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(imageContainer);
    imageContainer.appendChild(image);

    const info = document.createElement('div');
    info.className = 'nft-info';

    info.innerHTML = `
        <h3 class="nft-title">${nft.metadata.title || 'Untitled'}</h3>
        <p class="nft-owner">${nft.owner_id}</p>
    `;

    card.appendChild(imageContainer);
    card.appendChild(info);
    return card;
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}