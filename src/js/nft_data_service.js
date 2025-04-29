// Import Buffer from 'buffer' package
import { Buffer } from 'buffer';

// Constants
const RPC_ENDPOINT = 'https://free.rpc.fastnear.com';
const CONTRACT_ID = 'lncernft.learnclub.near';
const BATCH_SIZE = 50;
const STORAGE_KEY = 'web3stick_nft_data';
const STORAGE_TIMESTAMP_KEY = 'web3stick_nft_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Fetch NFT data with caching
export async function getNFTData() {
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