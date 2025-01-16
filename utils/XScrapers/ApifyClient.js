import { ApifyClient } from "apify-client";

const client = new ApifyClient({
    token: process.env["APIFY_API_TOKEN"],
});

// Utility function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Wrapper function for actor.call with retry logic
async function callActorWithRetry(actor, input, maxRetries = 5, initialDelay = 10000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await actor.call(input);
        } catch (error) {
            if (error.message?.includes('exceed the memory limit') && attempt < maxRetries) {
                const waitTime = initialDelay * Math.pow(2, attempt - 1); // Exponential backoff
                console.log(`Memory limit exceeded. Retrying in ${waitTime/1000} seconds... (Attempt ${attempt}/${maxRetries})`);
                await delay(waitTime);
                continue;
            }
            throw error;
        }
    }
    throw new Error('Max retries exceeded');
}

export { client as default, callActorWithRetry };