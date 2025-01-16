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

export default async function getUserTweets(handle) {
  const date28DaysAgo = new Date();
  date28DaysAgo.setDate(date28DaysAgo.getDate() - 28);
  const formattedDate =
    date28DaysAgo.toISOString().split("T")[0] + "_00:00:00_UTC";

  posts_input = {
    ...posts_input,
    searchTerms: [`from:${handle} since:${formattedDate}`],
    since: formattedDate,
    from: handle,
  };

  const actor = client.actor("CJdippxWmn9uRfooo");
  const tweets_run = await callActorWithRetry(actor, posts_input);

  // Fetch and print Actor results from the run's dataset (if any)
  const { items } = await client
    .dataset(tweets_run.defaultDatasetId)
    .listItems(); // "YARhKNQrY52id47Eo"

  const relevantTweets = items.filter((item) => item.type === "tweet");

  // const relevantTweetsWithMarketing = relevantTweets.map((tweet) => {
  //   tweet.isMarketing = false;
  //   return tweet;
  // });
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

  return relevantTweetsWithMarketing;
}
