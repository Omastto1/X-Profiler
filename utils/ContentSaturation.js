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

function getWeekTweets(tweets) {
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const weekTweets = tweets.filter((tweet) => {
    const tweetDate = new Date(tweet.createdAt);
    return tweetDate >= last7Days;
  });

  return weekTweets;
}

function getMonthTweets(tweets) {
  const last28Days = new Date();
  last28Days.setDate(last28Days.getDate() - 28);

  const monthTweets = tweets.filter((tweet) => {
    const tweetDate = new Date(tweet.createdAt);
    return tweetDate >= last28Days;
  });

  return monthTweets;
}

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
