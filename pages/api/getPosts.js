import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from '../../lib/mongodb';

export default withApiAuthRequired(async function handler(req, res){
  try {
    const { lastPostDate, getNewerPosts } = req.body;
    const { user } = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db('BlogStandard');

    const userProfile = await db.collection('users').findOne({
      auth0Id: user.sub
    });

    const posts = await db.collection('posts')
      .find({
        userId: userProfile._id,
        created: { [getNewerPosts ? "$gt" : "$lt"] : new Date(lastPostDate)},
      })
      .sort({ created: -1 })
      .limit(getNewerPosts ? 0 : 5)
      .toArray();

    return res.status(200).json({ posts });
  } catch (error) {
    console.error(error)
  }
});