import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import clientPromise from '../../lib/mongodb';

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const { postId } = req.body;
    const { user } = await getSession(req, res);

    const client = await clientPromise;
    const db = client.db('BlogStandard');
  
    const userProfile = await db.collection('users').findOne({
      auth0Id: user.sub
    });

    await db.collection('posts').deleteOne({
      _id: new Object(postId),
      userId: userProfile._id,
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    consol.log('ERROR deletePost', error)
  }
});