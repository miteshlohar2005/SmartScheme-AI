import { db } from '../firebase';
import { collection, getDocs, query, where, limit, startAfter, orderBy } from 'firebase/firestore';
import Fuse from 'fuse.js';

// We will use mock data if Firebase isn't fully set up with a database yet
// This allows the frontend to work perfectly while we finalize the DB.
import { mockSchemes } from '../data/schemeSeeder';

export const fetchSchemes = async ({
    page = 1,
    itemsPerPage = 10,
    searchQuery = "",
    categoryFilter = "All",
    stateFilter = "All",
    language = "en"
}) => {
    try {
        // 1. Start with our mock data as the source of truth for now
        let results = [...mockSchemes];

        // 2. Apply Filters
        if (categoryFilter !== "All") {
            results = results.filter(s => s.category === categoryFilter);
        }

        if (stateFilter !== "All") {
            results = results.filter(s => s.state === stateFilter || s.state === "Central");
        }

        // 3. Apply Fuzzy Search (Fuse.js)
        if (searchQuery.trim() !== "") {
            const fuse = new Fuse(results, {
                keys: [
                    `en.name`, `hi.name`, `mr.name`,
                    'tags',
                    'category',
                    `en.shortDesc`, `hi.shortDesc`, `mr.shortDesc`
                ],
                threshold: 0.3, // 0.0 requires perfect match, 1.0 matches anything
            });
            const searchResults = fuse.search(searchQuery);
            results = searchResults.map(result => result.item);
        }

        // 4. Transform data based on selected language
        // Flatten the localized object into the main object for easy UI mapping
        const localizedResults = results.map(scheme => ({
            id: scheme.id,
            category: scheme.category,
            state: scheme.state,
            launchYear: scheme.launchYear,
            tags: scheme.tags,
            url: scheme.url,
            applicationMode: scheme.applicationMode,
            name: scheme[language]?.name || scheme.en.name,
            shortDesc: scheme[language]?.shortDesc || scheme.en.shortDesc,
            desc: scheme[language]?.desc || scheme.en.desc,
            eligibility: scheme[language]?.eligibility || scheme.en.eligibility,
            benefits: scheme[language]?.benefits || scheme.en.benefits,
            documents: scheme[language]?.documents || scheme.en.documents,
        }));

        // 5. Apply Pagination
        const startIndex = (page - 1) * itemsPerPage;
        const paginatedResults = localizedResults.slice(startIndex, startIndex + itemsPerPage);

        return {
            data: paginatedResults,
            totalCount: localizedResults.length,
            totalPages: Math.ceil(localizedResults.length / itemsPerPage),
            currentPage: page
        };

    } catch (error) {
        console.error("Error fetching schemes:", error);
        return { data: [], totalCount: 0, totalPages: 0, currentPage: 1 };
    }
};

export const fetchSchemeById = async (id, language = 'en') => {
    try {
        const scheme = mockSchemes.find(s => s.id === id);
        if (!scheme) return null;

        return {
            id: scheme.id,
            category: scheme.category,
            state: scheme.state,
            launchYear: scheme.launchYear,
            tags: scheme.tags,
            url: scheme.url,
            applicationMode: scheme.applicationMode,
            name: scheme[language]?.name || scheme.en.name,
            shortDesc: scheme[language]?.shortDesc || scheme.en.shortDesc,
            desc: scheme[language]?.desc || scheme.en.desc,
            eligibility: scheme[language]?.eligibility || scheme.en.eligibility,
            benefits: scheme[language]?.benefits || scheme.en.benefits,
            documents: scheme[language]?.documents || scheme.en.documents,
        };
    } catch (error) {
        console.error("Error fetching scheme by ID:", error);
        return null;
    }
};

export const getAIRecommendations = async (userProfile, language = 'en') => {
    // Simulate AI fetching tailored schemes
    let results = [...mockSchemes];

    // Basic mock AI logic: find schemes where tags intersect with user profile words
    const profileWords = userProfile.toLowerCase().split(' ');

    const recommended = results.filter(scheme => {
        return scheme.tags.some(tag => profileWords.includes(tag.toLowerCase()));
    });

    // Apply language transformation
    const localizedRecommendations = (recommended.length > 0 ? recommended : results.slice(0, 3)).map(scheme => ({
        id: scheme.id,
        category: scheme.category,
        name: scheme[language]?.name || scheme.en.name,
        shortDesc: scheme[language]?.shortDesc || scheme.en.shortDesc,
        tags: scheme.tags
    }));

    return localizedRecommendations;
};
