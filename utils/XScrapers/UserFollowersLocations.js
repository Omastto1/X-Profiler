import client, { callActorWithRetry } from "./ApifyClient";

// Prepare Actor input
let followers_input = {
  memoryMbytes: 128, // Limit memory usage to 128MB
  maxFollowers: 200,
  maxFollowings: 200,
  getFollowers: true,
  getFollowing: false,
};

export default async function getUserFollowersLocations({ handle }) {
  followers_input.user_names = [handle];

  // Run the Actor and wait for it to finish
  // const actor = client.actor("C2Wk3I6xAqC4Xi63f");
  // const run = await callActorWithRetry(actor, {
  //   ...followers_input,
  //   memoryMbytes: 512 // Limit memory usage to 512MB
  // });

  const { items } = await client.dataset('KZegtEBc8TN3z3Fha').listItems(); // run.defaultDatasetId

  return {
    locations: items
      .filter((item) => item.location)
      .map((item) => item.location),
  };
}
