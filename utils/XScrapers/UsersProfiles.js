import client, { callActorWithRetry } from "./ApifyClient";

/**
 * Fetches detailed profile information for multiple X (Twitter) handles using Apify Actor
 *
 * @async
 * @param {string[]} handles - Array of X (Twitter) usernames to fetch profile data for
 * @returns {Promise<Object[]>} Array of user profile objects containing detailed information about each user
 *
 * @example
 * const result = await getUserProfiles(["user1", "user2", "user3"]);
 * console.log(result); // [{  ... }, ...]
 */
export default async function getUsersProfiles({ handles }) {
  // Start user profile analysis
  const actor = client.actor("tLs1g71YVTPoXAPnb");
  const userProfileRun = await callActorWithRetry(actor, {
    memoryMbytes: 128, // Limit memory usage to 512MB
    user_names: handles,
  });

  // Get the results
  const { items: userProfiles } = await client
    .dataset(userProfileRun.defaultDatasetId) // "4ybGXJ8H43t8hs5t6"
    .listItems();

  return userProfiles.filter((profile) => profile.__typename == "User");
}
