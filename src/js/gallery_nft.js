// Import Buffer from 'buffer' package
import { Buffer } from 'buffer';

// Constants
const RPC_ENDPOINT = 'https://free.rpc.fastnear.com';
const CONTRACT_ID = 'lncernft.learnclub.near';
const BATCH_SIZE = 50;
const STORAGE_KEY = 'web3stick_nft_data';
const STORAGE_TIMESTAMP_KEY = 'web3stick_nft_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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
    const allNFTs = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
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

// Fetch NFT data with caching
async function getNFTData() {
    try {
        const cachedData = await getCachedData();
        if (cachedData) {
            console.log('Using cached NFT data');
            return cachedData;
        }

        console.log('Fetching fresh NFT data...');
        const totalSupply = await fetchTotalSupply();
        console.log('Total NFT supply:', totalSupply);

        const allNFTs = [];
        for (let i = 0; i < totalSupply; i += BATCH_SIZE) {
            const batch = await fetchNFTBatch(i);
            allNFTs.push(...batch);
            console.log(`Fetched batch ${i} to ${i + batch.length}`);
        }

        await cacheData(allNFTs);
        return allNFTs;
    } catch (error) {
        console.error('Error fetching NFT data:', error);
        return [];
    }
}

// Fetch total supply of NFTs
async function fetchTotalSupply() {
    try {
        const response = await fetch(RPC_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 'dontcare',
                method: 'query',
                params: {
                    request_type: 'call_function',
                    finality: 'final',
                    account_id: CONTRACT_ID,
                    method_name: 'nft_total_supply',
                    args_base64: Buffer.from('{}').toString('base64')
                }
            })
        });

        const data = await response.json();
        if (!data.result || !data.result.result) {
            throw new Error('Invalid response format');
        }
        const resultString = Buffer.from(data.result.result).toString('utf8');
        const parsedValue = parseInt(resultString.replace(/"/g, ''));
        if (isNaN(parsedValue)) {
            throw new Error('Failed to parse total supply value');
        }
        return parsedValue;
    } catch (error) {
        console.error('Error in fetchTotalSupply:', error);
        throw error;
    }
}

// Fetch a batch of NFTs
async function fetchNFTBatch(fromIndex) {
    try {
        const args = JSON.stringify({ from_index: fromIndex.toString() });
        const response = await fetch(RPC_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 'dontcare',
                method: 'query',
                params: {
                    request_type: 'call_function',
                    finality: 'final',
                    account_id: CONTRACT_ID,
                    method_name: 'nft_tokens',
                    args_base64: Buffer.from(args).toString('base64')
                }
            })
        });

        const data = await response.json();
        if (!data.result || !data.result.result) {
            throw new Error('Invalid response format');
        }
        const resultString = Buffer.from(data.result.result, 'base64').toString('utf8');
        return JSON.parse(resultString);
    } catch (error) {
        console.error('Error in fetchNFTBatch:', error);
        throw error;
    }
}

// Cache management functions
async function getCachedData() {
    const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
    const data = localStorage.getItem(STORAGE_KEY);

    if (!timestamp || !data) return null;

    const age = Date.now() - parseInt(timestamp);
    if (age > CACHE_DURATION) {
        console.log('Cache expired');
        return null;
    }

    return JSON.parse(data);
}

async function cacheData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
        console.log('NFT data cached successfully');
    } catch (error) {
        console.error('Error caching NFT data:', error);
    }
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