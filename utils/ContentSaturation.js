/**
 * Filters tweets to get only those from today
 * @param {Object[]} tweets - Array of tweet objects
 * @param {string} tweets[].createdAt - ISO date string of when the tweet was created
 * @returns {Object[]} Array of tweets from today
 */
function getTodayTweets(tweets) {
  const today = new Date();
  const todayTweets = tweets.filter((tweet) => {
    const tweetDate = new Date(tweet.createdAt);
    return (
      tweetDate.getDate() === today.getDate() &&
      tweetDate.getMonth() === today.getMonth() &&
      tweetDate.getFullYear() === today.getFullYear()
    );
  });

  return todayTweets;
}

/**
 * Filters tweets to get only those from the last 7 days
 * @param {Object[]} tweets - Array of tweet objects
 * @param {string} tweets[].createdAt - ISO date string of when the tweet was created
 * @returns {Object[]} Array of tweets from the last 7 days
 */
function getWeekTweets(tweets) {
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const weekTweets = tweets.filter((tweet) => {
    const tweetDate = new Date(tweet.createdAt);
    return tweetDate >= last7Days;
  });

  return weekTweets;
}

/**
 * Filters tweets to get only those from the last 28 days
 * @param {Object[]} tweets - Array of tweet objects
 * @param {string} tweets[].createdAt - ISO date string of when the tweet was created
 * @returns {Object[]} Array of tweets from the last 28 days
 */
function getMonthTweets(tweets) {
  const last28Days = new Date();
  last28Days.setDate(last28Days.getDate() - 28);

  const monthTweets = tweets.filter((tweet) => {
    const tweetDate = new Date(tweet.createdAt);
    return tweetDate >= last28Days;
  });

  return monthTweets;
}

/**
 * Calculates the percentage of marketing content in a user's tweets over different time periods
 * @param {Object[]} tweets - Array of tweet objects
 * @param {string} tweets[].createdAt - ISO date string of when the tweet was created
 * @param {boolean} tweets[].isMarketing - Whether the tweet is classified as marketing content
 * @returns {Object} Content saturation percentages
 * @property {number} daily - Percentage of marketing tweets from today
 * @property {number} weekly - Percentage of marketing tweets from last 7 days
 * @property {number} monthly - Percentage of marketing tweets from last 28 days
 */
export default function getContentSaturation(tweets) {
  const todayTweets = getTodayTweets(tweets);
  const weekTweets = getWeekTweets(tweets);
  const monthTweets = getMonthTweets(tweets);

  const contentSaturation = {
    daily: Math.round(
      (todayTweets.reduce(
        (acc, tweet) => acc + (tweet.isMarketing ? 1 : 0),
        0
      ) /
        todayTweets.length) *
        100,
      1
    ),
    weekly: Math.round(
      (weekTweets.reduce((acc, tweet) => acc + (tweet.isMarketing ? 1 : 0), 0) /
        weekTweets.length) *
        100,
      1
    ),
    monthly: Math.round(
      (monthTweets.reduce(
        (acc, tweet) => acc + (tweet.isMarketing ? 1 : 0),
        0
      ) /
        monthTweets.length) *
        100,
      1
    ),
  };

  return contentSaturation;
}
