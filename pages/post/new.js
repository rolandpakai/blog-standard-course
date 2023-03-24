import { useState } from "react";
import { userRouter } from "next/router";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLAyout";
import { getAppProps } from "../../utils/getAppProps";
export default function NewPost() {
  const router = userRouter();
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
    if (json?.postId) {
      router.push(`/post/${json.postId}`);
    }
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
  </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);

    return {
      props
    }
  }
});