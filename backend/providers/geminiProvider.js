const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

let genAI = null;
let model = null;

const initGemini = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        logger.warn("API Key is not set. Gemini provider will fail.");
        return;
    }
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
};

const systemPrompt = `You are a helpful assistant for Indian citizens looking for government schemes.
Your task is to fetch REAL Indian Government schemes based on the user's search query.

CRITICAL INSTRUCTIONS:
- Return ONLY real Indian Government schemes.
- Never invent schemes.
- Never generate fake ministries.
- Never fabricate eligibility.
- Never create fake benefits.
- Never create placeholder URLs.
- If a field is unavailable, leave it blank.
- Do not fabricate URLs or ministries.
- Never hallucinate.

Respond STRICTLY in the following JSON format:
{
  "schemes": [
    {
      "id": "unique-id",
      "name": "Official Scheme Name",
      "description": "A concise description",
      "category": "e.g., Agriculture, Women, Education, Health, Startup, Housing",
      "ministry": "Official Ministry/Department Name",
      "eligibility": "A short summary of eligibility criteria",
      "benefits": "A short summary of benefits",
      "documents": ["Aadhaar Card", "Income Certificate"],
      "officialWebsite": "URL to the official scheme website",
      "applyLink": "URL to the application portal",
      "governmentLevel": "Central or State",
      "launchYear": "Year",
      "status": "Active or Closed",
      "lastUpdated": "YYYY-MM-DD",
      "tags": ["tag1", "tag2"],
      "source": "Name of the source",
      "sourceUrl": "URL to the source"
    }
  ]
}
If nothing is verified, respond with: {"schemes": []}`;

const fetchSchemesFromGemini = async (searchQuery) => {
    if (!model) {
        initGemini();
        if (!model) {
            logger.error("[Gemini Provider] Gemini API not configured. Check API KEY.");
            return [];
        }
    }

    const prompt = `${systemPrompt}\n\nUser Request: ${searchQuery}`;
    logger.log(`[Gemini Provider] Request Query: ${searchQuery}`);

    // Attempt up to 2 times for timeout/transient errors
    for (let attempt = 1; attempt <= 2; attempt++) {
        try {
            logger.log(`[Gemini Provider] Attempt ${attempt} started...`);

            // 2. Simple SDK Call
            const result = await model.generateContent(prompt);

            // 3. Raw Response
            const rawResponseText = result.response.text();
            logger.log(`[Gemini Provider] Raw Response Text: \n${rawResponseText}`);

            // 4. Strip markdown code fences
            const cleanedResponseText = rawResponseText.replace(/```json/gi, '').replace(/```/g, '').trim();
            logger.log(`[Gemini Provider] Cleaned Response Text: \n${cleanedResponseText}`);

            try {
                // 5. Parse JSON
                const data = JSON.parse(cleanedResponseText);
                logger.log(`[Gemini Provider] Parsed JSON Successfully`);

                // 7. Validate schemes array
                if (data && Array.isArray(data.schemes)) {
                    data.schemes.forEach((scheme, index) => {
                        // 9. Generate pseudo-IDs
                        if (!scheme.id || scheme.id === 'unique-id') {
                            scheme.id = 'scheme_' + Math.random().toString(36).substr(2, 9);
                        }

                        // 8. Populate defaults for optional fields
                        scheme.documents = Array.isArray(scheme.documents) ? scheme.documents : [];
                        scheme.officialWebsite = scheme.officialWebsite || "";
                        scheme.applyLink = scheme.applyLink || "";
                        scheme.status = scheme.status || "Active";
                        scheme.governmentLevel = scheme.governmentLevel || "";
                        scheme.lastUpdated = scheme.lastUpdated || "";
                        scheme.tags = Array.isArray(scheme.tags) ? scheme.tags : [];
                        scheme.category = scheme.category || "General";
                        scheme.launchYear = scheme.launchYear || "";

                        logger.log(`[Gemini Provider] Validated Scheme ${index + 1}: ${scheme.name}`);
                    });

                    // 10. Return parsed schemes
                    return data.schemes;
                } else {
                    logger.warn(`[Gemini Provider] Validation Error: Response JSON is missing 'schemes' array`);
                    return [];
                }
            } catch (parseError) {
                // 6. Detailed Parse Error Logging
                logger.error("[Gemini Provider] JSON Parse Error:", parseError.message);
                logger.error("[Gemini Provider] Raw Response:", rawResponseText);
                logger.error("[Gemini Provider] Cleaned Response:", cleanedResponseText);
                // Throw error to trigger retry logic, avoiding silent return immediately
                throw new Error("Failed to parse JSON");
            }
        } catch (error) {
            logger.error(`[Gemini Provider] Gemini API attempt ${attempt} failed:`, error.message);
            if (attempt === 2) {
                logger.error(`[Gemini Provider] Failed to fetch from Gemini provider after 2 attempts`);
                return [];
            }
        }
    }
};

module.exports = {
    fetchSchemesFromGemini
};
