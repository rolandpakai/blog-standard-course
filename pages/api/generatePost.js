import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  const { topic, keywords } = req.body;

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    max_tokens: 3600,
    messages: [
      {
        role: 'system',
        content: 'Your are a blog post generator.',
      },
      {
        role: 'user',
        content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}
        The content should be formatted in SEO-friendly HTML.
        The response must also include appropriate HTML title and meta description content.
        The return format must be stringified JSON in the following format: 
        {
          "postContent": post content here
          "title": title goes here
          "metaDescription": mete description goes here
        }`,
      }
    ],
  });

  res.status(200).json({ 
    post: JSON.parse(response.data.choices[0]?.message.content.split('\n').join('')) 
  });
}
