# X-User Profiler

## Introduction

Evangelist operates weekly campaigns, launching every Thursday at 4 PM CET. Once a campaign concludes, the list of qualifying posts is finalized, initiating a weekly evaluation period. During this time, posts gain impressions and popularity. At the end of the evaluation period, each post receives a score based on three factors: post alignment, creator quality, and organic impressions. The scores of the top N (usually 2) tweets per campaign are aggregated for each user, and rewards are distributed pro-rata based on their contribution to the campaign. Below is an example of a campaign:

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/c7d9c367-a1e7-4824-b8a3-9c2006fa945a/f48c64db-0b78-45ae-a1b0-1b876cf9851c/image.png)

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/c7d9c367-a1e7-4824-b8a3-9c2006fa945a/3d817d4a-1c9f-4001-9455-bfcc18506a92/image.png)

### Problem

Impressions are non-fungible because their value depends on credibility. For example, a post from Elon Musk holds significantly higher value than one from an average individual due to the credibility associated with the source.

## Task: Develop X-user Profiler POC

Automate creator quality assessment based on his X profile and published content. Calculate the following metrics:

- User content saturation
    - Calculate how much of the user feed is saturated by marketing content (on a day/week/month basis)
- User classification, classify to which categories does a user belong to based on his X profile
    - Developer
    - Trader
    - Investor
    - Influencer
    - Media outlet
    - Web3 startup
    - etc.
- Users location
    - Based on users posts, profile and followers, estimate the users country/region

## Deliverables

- Live application deployed on Vercel or a similar service, designed to profile X-user handles. The app will provide an input form where users can submit a list of X-user handles to be analyzed. Upon submission, the app will process the handles and display the results in a basic user interface. The results will include the calculated metrics for each user:
    - user content saturation (percentage of marketing content over specified periods)
    - user classification (categories such as developer, trader, influencer, etc.)
    - user location (estimated country or region based on profile, followers and produced content)
- Link to Github repo

## Tools

- APIFY to scrape X data (https://apify.com/), feel free to use the initial $5 USD credit after registration
- Our ChatGPT