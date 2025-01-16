import client, { callActorWithRetry } from "./ApifyClient";

export default async function getUserProfiles(handles) {
    // Start user profile analysis
    const actor = client.actor("tLs1g71YVTPoXAPnb");
    const userProfileRun = await callActorWithRetry(actor, {
      memoryMbytes: 128, // Limit memory usage to 512MB
      "user_names": handles
    });

    // Get the results
    const { items: userProfiles } = await client
      .dataset(userProfileRun.defaultDatasetId) // "4ybGXJ8H43t8hs5t6"
      .listItems();

    return userProfiles;
}