import classifyUser from "@/utils/evaluateUserCategories";
import getUserProfiles from "@/utils/XScrapers/UsersProfiles";
import getUserTweets from "@/utils/XScrapers/UserTweets";
import getUserFollowersLocations from "@/utils/XScrapers/UserFollowersLocations";
import getContentSaturation from "@/utils/ContentSaturation";

export default async function handler(req, res) {
  const { handles } = req.body;

  if (!handles || !Array.isArray(handles) || handles.length === 0) {
    return res.status(400).json({
      error: "Please provide an array of handles to analyze",
    });
  }

  try {
    const profileStartTime = performance.now();

    const userProfiles = await getUserProfiles(handles);
    
    const profileEndTime = performance.now();
    console.log(`[X Scraper] Retrieving ${handles.length} profiles took ${((profileEndTime - profileStartTime)/1000).toFixed(2)} seconds`);

    // Process and analyze the data
    const resultsPromises = handles.map(async (handle) => {
      // Find valid profile in User Profiles response
      const profile = userProfiles.find(
        (p) =>
          p.__typename == "User" &&
          p.core.screen_name.toLowerCase() === handle.toLowerCase()
      );

      if (!profile) {
        return {
          handle,
          contentSaturation: { daily: 0, weekly: 0, monthly: 0 },
          classification: "Unknown",
          location: "Unknown",
          status: "error",
          error: "Profile not found",
        };
      }

      const tweetsStartTime = performance.now();

      const tweets = await getUserTweets(handle);

      const tweetsEndTime = performance.now();
      console.log(`[X Scraper] Retrieving tweets for ${handle} took ${((tweetsEndTime - tweetsStartTime)/1000).toFixed(2)} seconds`);

      const contentSaturation = getContentSaturation(tweets);

      const followersStartTime = performance.now();

      const { locations: followerLocations } = await getUserFollowersLocations({
        handle: profile.core.screen_name,
      });

      const followersEndTime = performance.now();
      console.log(`[X Scraper] Retrieving followers for ${handle} took ${((followersEndTime - followersStartTime)/1000).toFixed(2)} seconds`);

      // Classify user region and categories based on their bio, location, tweets, and follower locations
      const {
        location,
        region,
        categories: classification,
      } = await classifyUser({
        handle: profile.core.screen_name,
        description: profile.profile_bio.description,
        location: profile.location.location,
        tweets: tweets.map((tweet) => tweet.text),
        followerLocations,
      });

      return {
        handle,
        imageUrl: profile.avatar.image_url,
        contentSaturation,
        classification: classification.join(", "),
        location: location !== "Unknown" ? location : region || "Unknown",
        status: "completed",
      };
    });

    const results = await Promise.all(resultsPromises);
    res.json({ profiles: results });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({
      error: "Failed to analyze profiles",
      details: error.message,
    });
  }
}
