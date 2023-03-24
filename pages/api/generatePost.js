import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { Configuration, OpenAIApi } from 'openai';
import clientPromise from '../../lib/mongodb';

export default withApiAuthRequired(async function handler(req, res) {
  const { topic, keywords } = req.body;
  const { user } = await getSession(req, res);

  if (!topic || !keywords) {
    return res.status(422);
  }

  if (topic.length > 80|| keywords.length > 80) {
    return res.status(422);
  }

  const client = await clientPromise;
  const db = client.db('BlogStandard');

  const userProfile = await db.collection('users').findOne({
    auth0Id: user.sub
  });

  if (!userProfile?.availableTokens) {
    return res.status(403);
  }

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

  await db.collection("users").updateOne({
    auth0Id: user.sub
  }, {
    $inc: {
      availableTokens: -1
    }
  });

  const parsed = JSON.parse(response.data.choices[0]?.message.content.split('\n').join(''));

  const post = db.collection('posts').insertOne({
    ...parsed,
    topic, 
    keywords,
    userId: userProfile._id,
    created: new Date(),
  });

  res.status(200).json({ 
    postId: post.insertedId,
  });
});