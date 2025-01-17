import classifyUser from "@/utils/evaluateUserCategories";
import getUsersProfiles from "@/utils/XScrapers/UsersProfiles";
import getUsersTweets from "@/utils/XScrapers/UserTweets";
import getUsersFollowersLocations from "@/utils/XScrapers/UserFollowersLocations";
import getContentSaturation from "@/utils/ContentSaturation";

/**
 * API handler for analyzing X (Twitter) profiles
 * @returns {Promise<void>} JSON response with analyzed profile data or error
 * @property {Object[]} profiles - Array of analyzed profile objects
 * @property {string} profiles[].handle - The X handle
 * @property {string} [profiles[].imageUrl] - URL to profile image
 * @property {Object} profiles[].contentSaturation - Content saturation metrics
 * @property {string} profiles[].classification - Comma-separated list of user categories
 * @property {string} profiles[].location - User's determined location or region
 * @property {string} profiles[].status - Analysis status ('completed'|'error')
 * @property {string} [profiles[].error] - Error message if status is 'error'
 */
export default async function handler(req, res) {
  const { handles } = req.body;

  if (!handles || !Array.isArray(handles) || handles.length === 0) {
    return res.status(400).json({
      error: "Please provide an array of handles to analyze",
    });
  }

  try {
    // Fetch all data in parallel
    const [userProfiles, allTweets, allFollowersData] = await Promise.all([
      getUsersProfiles({ handles }),
      getUsersTweets({ handles }),
      getUsersFollowersLocations({ handles }),
    ]);

    // Process all users in parallel
    const results = await Promise.all(
      handles.map(async (handle, idx) => {
        const profile = userProfiles.find(
          (p) => p.core.screen_name.toLowerCase() === handle.toLowerCase()
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

        const tweets = allTweets[idx];
        const { locations: followerLocations } = allFollowersData[idx];

        // Run content analysis and classification in parallel
        const [contentSaturation, userClassification] = await Promise.all([
          getContentSaturation(tweets),
          classifyUser({
            handle: profile.core.screen_name,
            description: profile.profile_bio.description,
            location: profile.location.location,
            tweets: tweets.map((tweet) => tweet.text),
            followerLocations,
          }),
        ]);

        const { location, region, categories } = userClassification;

        return {
          handle,
          imageUrl: profile.avatar.image_url,
          contentSaturation,
          classification: categories.join(", "),
          location: location !== "Unknown" ? location : region || "Unknown",
          status: "completed",
        };
      })
    );

    res.json({ profiles: results });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({
      error: "Failed to analyze profiles",
      details: error.message,
    });
  }
}
