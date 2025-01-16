import OpenAI from 'openai';

// Configure OpenAI API
const configuration = {
  apiKey: process.env['OPENAI_API_KEY'],
};
const openai = new OpenAI(configuration);

export default async function evaluateMessages(messages) {
  // Define the function schema
  const functions = [
    {
      name: "evaluate_marketing_content",
      description: "Evaluate if messages are marketing content",
      parameters: {
        type: "object",
        properties: {
          evaluations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                message_number: { type: "integer" },
                is_marketing: { type: "boolean" },
              },
              required: ["message_number", "is_marketing"],
            },
          },
        },
        required: ["evaluations"],
      },
    },
  ];

  // Prepare the messages array for the prompt
  const formattedMessages = messages
    .map((msg, idx) => `${idx + 1}. "${msg}"`)
    .join("\n");

  // Create the prompt
  const prompt = `
    Evaluate the following messages and determine whether each is marketing content.
    Respond using the specified JSON format:
    [
      {"message_number": 1, "message": "Example message", "is_marketing": true},
      {"message_number": 2, "message": "Another example message", "is_marketing": false},
      ...
    ]
    Messages:
    ${formattedMessages}
  `;

  // Call the OpenAI API
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [{ role: "user", content: prompt }],
    functions,
    function_call: { name: "evaluate_marketing_content" }, // Explicitly call the function
  });

  // Parse the function response
  const functionResponse =
    response.choices[0].message.function_call.arguments;
  const evaluations = JSON.parse(functionResponse).evaluations;

  return evaluations;
}