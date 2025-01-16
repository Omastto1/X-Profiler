import { ApifyClient } from "apify-client";

const client = new ApifyClient({
    token: process.env["APIFY_API_TOKEN"],
});

/**
 * Creates a promise that resolves after a specified delay
 * @param {number} ms - The delay in milliseconds
 * @returns {Promise<void>} A promise that resolves after the delay
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calls an Apify actor with retry logic for memory limit errors
 * @param {Object} actor - The Apify actor instance to call
 * @param {Object} input - The input parameters for the actor
 * @param {number} [maxRetries=5] - Maximum number of retry attempts
 * @param {number} [initialDelay=10000] - Initial delay in milliseconds between retries (doubles with each retry)
 * @returns {Promise<Object>} The actor run result
 * @throws {Error} When max retries are exceeded or on non-memory-related errors
 * 
 * @example
 * const result = await callActorWithRetry(actor, { ...input });
 * console.log(result); // { ... }
 */
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