import client, { callActorWithRetry } from "./ApifyClient";

// Prepare Actor input
let followers_input = {
  memoryMbytes: 128, // Limit memory usage to 128MB
  maxFollowers: 200,
  maxFollowings: 200,
  getFollowers: true,
  getFollowing: false,
};

/**
 * Fetches the locations of followers for a given X (Twitter) handle using Apify Actor
 *
 * @async
 * @param {Object} params - The parameters object
 * @param {string} params.handle - The X (Twitter) handle to fetch followers' locations for
 * @returns {Promise<Object>} Object containing an array of locations of the user's followers
 * @property {string[]} locations - Array of location strings from followers' profiles
 *
 * @example
 * const result = await getUserFollowersLocations({ handle: "exampleUser" });
 * console.log(result.locations); // ['Location1', 'Location2', ...]
 */
export default async function getUsersFollowersLocations({ handles }) {
  // Run the Actor and wait for it to finish
  const actor = client.actor("C2Wk3I6xAqC4Xi63f");
  const run = await callActorWithRetry(actor, {
    ...followers_input,
    user_names: handles, // Use user_names parameter for batch processing
  });

  const { items } = await client.dataset(run.defaultDatasetId).listItems(); // 'KZegtEBc8TN3z3Fha'

  return handles.map((handle) => ({
    locations: items
      .filter(
        (item) =>
          item.location &&
          item.target_username.toLowerCase() === handle.toLowerCase()
      )
      .map((item) => item.location),
  }));
}
