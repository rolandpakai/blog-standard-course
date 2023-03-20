import { useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLAyout";

export default function NewPost() {
  const [postContent, setPostContent] = useState("");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/generatePost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ topic, keywords })
    });

    const json = await response.json();

    setPostContent(json.post.postContent);
  };

  return (
  <div>
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <string>
            Generate a blog post on the topic of
          </string>
        </label>
        <textarea 
          className="txtarea"
          value={topic} 
          onChange={e => setTopic(e.target.value)}/>
      </div>
      <div>
        <label>
          <string>
            Targeting the following keywords
          </string>
        </label>
        <textarea 
          className="txtarea"
          value={keywords} 
          onChange={e => setKeywords(e.target.value)}/>
      </div>
      <button type="submit" className="btn" >
        Generate
      </button>

    </form>
    <div 
      className="max-w-screen-sm p-10"
      dangerouslySetInnerHTML={{__html: postContent}} />
  </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {}
  }
});
