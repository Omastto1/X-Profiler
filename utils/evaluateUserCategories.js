import OpenAI from 'openai';

// Configure OpenAI API
const configuration = {
  apiKey: process.env['OPENAI_API_KEY'],
};
const openai = new OpenAI(configuration);

export default async function classifyUser({handle, description, tweets, location, followerLocations}) {
  // Define the function schema
  const functions = [
    {
      name: "classify_user",
      description: "Classify a user categories and location (or region) based on their profile description, tweets, location and locations of their followers.",
      parameters: {
        type: "object",
        properties: {
          handle: { type: "string" },
          categories: { type: "array", items: { type: "string" } },
          location: { type: "string" },
          region: { type: "string" },
        },
        required: ["handle", "categories", "location", "region"],
      },
    },
  ];

  // Create the prompt
  const prompt = `
    Classify the following user into categories and user's real world location (or region). You may use predefined categories such as Developer, Trader, Investor, Influencer, Media outlet, Web3 startup, or Others. If none of the predefined categories fit, introduce a new category. Users can belong to multiple categories. Look up location (or region) either from description, from provided tweets, from provided user location, or from locations of their followers. If no location (or region) is found, set it to "Unknown".
    Provide your response in the following JSON format:
    {
      "handle": "Example handle",
      "categories": ["Developer", "Influencer"],
      "location": "New York, NY",
      "region": "North America"
    }
    Profile (handle: ${handle}):
    description: ${description}
    location: ${location}
    tweets: ${tweets}
    followerLocations: ${followerLocations}
  `;

  // Call the OpenAI API
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [{ role: "user", content: prompt }],
    functions,
    function_call: { name: "classify_user" }, // Explicitly call the function
  });

  // Parse the function response
  const functionResponse = response.choices[0].message.function_call.arguments;
  const classification = JSON.parse(functionResponse);

  return classification;
}
