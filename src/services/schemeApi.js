// API Configuration
// API Configuration
const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api`;

// Simple in-memory cache for frontend to avoid re-fetching same queries instantly
const cache = new Map();
export const fetchSchemes = async ({
    page = 1,
    itemsPerPage = 12,
    searchQuery = "",
    categoryFilter = "All",
    stateFilter = "All",
    language = "en"
}) => {
    try {
        const queryParams = new URLSearchParams();
        if (searchQuery.trim()) queryParams.append('query', searchQuery);
        if (categoryFilter !== 'All') queryParams.append('category', categoryFilter);
        if (stateFilter !== 'All') queryParams.append('state', stateFilter);

        const url = `${API_URL}/schemes?${queryParams.toString()}`;

        let allSchemes = [];

        // Check simple frontend cache
        if (cache.has(url)) {
            allSchemes = cache.get(url);
        } else {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch schemes from backend");
            }
            const data = await response.json();
            allSchemes = data.schemes || [];
            cache.set(url, allSchemes);
        }

        // Apply Pagination
        const startIndex = (page - 1) * itemsPerPage;
        const paginatedResults = allSchemes.slice(startIndex, startIndex + itemsPerPage);

        return {
            data: paginatedResults,
            totalCount: allSchemes.length,
            totalPages: Math.ceil(allSchemes.length / itemsPerPage) || 1,
            currentPage: page
        };
    } catch (error) {
        console.error("Error fetching schemes:", error);
        return { data: [], totalCount: 0, totalPages: 1, currentPage: 1 };
    }
};

export const fetchSchemeById = async (id, language = 'en') => {
    // Since we don't have a specific endpoint for ID, we can search the cache
    // or we might need to make a general query. Usually, the user navigates from the directory.
    // For simplicity, let's look through all cached values first.
    for (const schemes of cache.values()) {
        const found = schemes.find(s => s.id === id);
        if (found) return found;
    }

    // If not found in cache, we could query Gemini for the specific ID, but ID is a generated UUID.
    // In a real app with a DB, we'd hit /api/schemes/:id
    // For now, if someone refreshes the page directly on a scheme detail, they might need to go back.
    console.warn("Scheme not found in local cache. Please return to directory.");
    return null;
};

export const checkEligibilityAPI = async (userProfile, language = 'en') => {
    try {
        const url = `${API_URL}/schemes/eligibility`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userProfile)
        });
        
        if (!response.ok) throw new Error("Failed to check eligibility");
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error checking eligibility:", error);
        return { matchedSchemes: [], recommendations: [], summary: "Error calculating eligibility.", score: 0 };
    }
};

export const sendChatMessage = async (message, language = 'en') => {
    try {
        const url = `${API_URL}/schemes/chat`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        
        if (!response.ok) throw new Error("Failed to send chat message");
        
        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("Error sending chat message:", error);
        return "I'm having trouble connecting to my knowledge base right now. Please try again later.";
    }
};
export const getAIRecommendations = async (userProfile, language = 'en') => {
    try {
        const result = await fetchSchemes({ searchQuery: userProfile, language });
        return result.data.slice(0, 3).map(scheme => ({
            id: scheme.id,
            category: scheme.category,
            name: scheme.name,
            shortDesc: scheme.description,
            tags: scheme.tags || []
        }));
    } catch (error) {
        console.error("Error fetching AI recommendations:", error);
        return [];
    }
};
