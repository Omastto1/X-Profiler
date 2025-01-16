# X-User Profiler

AI-powered analytics tool that evaluates X (Twitter) user profiles by analyzing content saturation, user classification, and geographic distribution. Built for campaign evaluation and creator quality assessment.

## Features

- **Content Saturation Analysis**: Calculates the percentage of marketing content in user feeds over different time periods (day/week/month)
- **User Classification**: Automatically categorizes users into relevant groups (Developer, Trader, Investor, Influencer, Media outlet, Web3 startup, etc.)
- **Geographic Distribution**: Estimates user location based on profile data, posts, and follower analysis

## Tech Stack

- Next.js
- Apify for X data scraping
- Tailwind CSS
- Node.js
- OpenAI for user classification

## Prerequisites

- Node.js (v16 or higher)
- Apify API Token
- OpenAI API Key
- Environment variables set up (see below)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/Omastto1/X-Profiler.git
cd X-Profiler
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
APIFY_API_TOKEN=your_apify_token_here
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

1. Navigate to the application's homepage
2. Enter X (Twitter) handles in the input form
3. Submit for analysis
4. View detailed analytics including:
   - Marketing content saturation metrics
   - User category classification
   - Estimated geographic location

## API Endpoints

### POST /api/analyze
Analyzes X user profiles based on provided handles.

Request body:
```json
{
  "handles": ["username1", "username2"]
}
```

Response:
```json
{
  "results": [
    {
      "handle": "username1",
      "contentSaturation": {
        "daily": 25.1,
        "weekly": 30.5,
        "monthly": 28.0
      },
      "categories": "Developer, Influencer"],
      "location": "United States"
    }
    // ... more results
  ]
}
```


## License

MIT License - see the [LICENSE](LICENSE) file for details 