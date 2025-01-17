import client, { callActorWithRetry } from "./ApifyClient";
import evaluateMessages from "@/utils/evaluateTweetMarketing";

let posts_input = {
  memoryMbytes: 512, // Limit memory usage to 512MB
  "filter:blue_verified": false,
  "filter:consumer_video": false,
  "filter:has_engagement": false,
  "filter:hashtags": false,
  "filter:images": false,
  "filter:links": false,
  "filter:media": false,
  "filter:mentions": false,
  "filter:native_video": false,
  "filter:nativeretweets": false,
  "filter:news": false,
  "filter:pro_video": false,
  "filter:quote": false,
  "filter:replies": false,
  "filter:safe": false,
  "filter:spaces": false,
  "filter:twimg": false,
  "filter:verified": false,
  "filter:videos": false,
  "filter:vine": false,
  "include:nativeretweets": false,
  lang: "en",
  maxItems: 30,
  queryType: "Top",
  min_retweets: 0,
  min_faves: 0,
  min_replies: 0,
  "-min_retweets": 0,
  "-min_faves": 0,
  "-min_replies": 0,
};

/**
 * Fetches recent tweets from a specified X (Twitter) handle and evaluates them for marketing content with LLM
 *
 * @param {string} handle - The X (Twitter) username to fetch tweets from
 * @returns {Promise<Object[]>} Array of tweet objects with additional marketing evaluation
 * @property {string} text - The tweet content
 * @property {boolean} isMarketing - Whether the tweet is classified as marketing content
 * ...
 *
 * @example
 * const result = await getUserTweets("exampleUser");
 * console.log(result); // [{ ... }, ...]
 */
export default async function getUsersTweets({ handles }) {
  const date28DaysAgo = new Date();
  date28DaysAgo.setDate(date28DaysAgo.getDate() - 28);
  const formattedDate =
    date28DaysAgo.toISOString().split("T")[0] + "_00:00:00_UTC";

  posts_input = {
    ...posts_input,
    searchTerms: handles.map(
      (handle) => `from:${handle} since:${formattedDate}`
    ),
    since: formattedDate,
  };

  const actor = client.actor("CJdippxWmn9uRfooo");
  const tweets_run = await callActorWithRetry(actor, posts_input);

  // Fetch and print Actor results from the run's dataset (if any)
  const { items } = await client
    .dataset(tweets_run.defaultDatasetId)
    .listItems(); // "YARhKNQrY52id47Eo"

  // Filter tweets for the specific handle
  const relevantTweets = items.filter((item) => item.type === "tweet");

  const relevantTweetsWithMarketing = await evaluateMessages(
    relevantTweets.map((tweet) => tweet.text)
  )
    .then((results) => {
      return relevantTweets.map((tweet, index) => {
        if (results[index]) {
          tweet.isMarketing = results[index].is_marketing;
        }
        return tweet;
      });
    })
    .catch((error) => {
      debugger;
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      return [];
    });

  const relevantTweetsWithMarketingList = handles.map((handle) => {
    return relevantTweetsWithMarketing.filter(
      (tweet) => tweet.author.userName.toLowerCase() === handle.toLowerCase()
    );
  });

  return relevantTweetsWithMarketingList;
}
