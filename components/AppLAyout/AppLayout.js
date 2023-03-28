import { useContext, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import Image from 'next/image';
import Link from "next/link";

import { Logo } from '../Logo';
import PostsContext from '../../context/postsContext';

export const AppLayout = ({ children, ...rest }) => {
  const { user } = useUser();
  const { availableTokens, posts: postsFromSSR, postId, postCreated } = rest;
  const { posts, setPostsFromSSR, getPosts, noMorePosts } = useContext(PostsContext)

  useEffect(() => {
    setPostsFromSSR(postsFromSSR);
    if (postId) {
      const exists = postsFromSSR.find(post => post._id === postId);
      if (!exists) {
        getPosts({
          lastPostDate: postCreated,
          getNewerPosts: true,
        });
      }
    }
  }, [postsFromSSR, setPostsFromSSR, postId, postCreated, getPosts]);

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-slate-800 px-2">
          <Logo />
          <Link 
            href="/post/new" 
            className="btn"
          >
            New Post
          </Link>
          <Link 
            href="/token-topup" 
            className="block mt-2 text-center"
          >
            <FontAwesomeIcon 
              icon={faCoins}
              className="text-yellow-500"
            />
            <span className="pl-1">{availableTokens} tokens available</span>
          </Link>
        </div>
        <div className="px-4 flex-1 overflow-hidden bg-gradient-to-b from-slate-800 to-cyan-800">
          {posts.map(post => (
             <Link 
              key={post._id} 
              href={`/post/${post._id}`}
              className={`py-1 border block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-sm ${postId === post._id ? "bg-white/20 border-white" : "border-white/0 "}`}
             >
              {post.topic}
             </Link>
          ))}
          {!noMorePosts && (
            <div 
              onClick={() => getPosts({ lastPostDate: posts[posts.length - 1].created })}
              className="hover:underline hover:text-slate-200 text-sm text-slate-400 text-center cursor-pointer mt-4"
            >
              Load more posts
            </div>
          )}
        </div>
        <div className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2">
        {
        !!user 
        ? (
          <>
            <div className="min-w-[50px]">
              <Image 
                src={user.picture} 
                alt={user.name} 
                height={50}
                width={50}
                className="rounded-full"
              />
            </div>
            <div className="flex-1">
              <div className="font-bold">{user.email}</div>
              <Link className="text-sm" href="/api/auth/logout">Logout</Link>
            </div>
          </>
        )
        : <Link href="/api/auth/login">Login</Link>
      }
        </div>
      </div>
      {children}
    </div>
  );
};