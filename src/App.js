import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {

  const fetching = useRef(false);
  const ssr = useRef('');
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (!content) return;

    new window.LiveStory(`ls-${content.id}`, { type: content.type });

    // or in a second way
    //const script = document.createElement('script');
    //script.async = true;
    //script.innerHTML = `(function(w){w.fpls_load=w.fpls_load||[];w.fpls_load.push(function(){
    //  w.ls_${content.id}=w.ls_${content.id}||new LiveStory("ls-${content.id}", {type:"${content.type}"})})})(window);`;
  
    //document.body.appendChild(script);
  
    //return () => {
    //  document.body.removeChild(script);
    //}
  }, [content]);

  useEffect(() => {
    if (content || fetching.current) return;
    fetching.current = true;

    console.log('Fetching content item');

    async function fetchContent() {
      const res = await fetch('https://livestory.cdn.content.amplience.net/content/id/13a060bb-8528-47e0-a462-cf97d49c07a2?locale=it-IT');
      const item = await res.json();

      console.log('Content item:', item);

      if (item.content.ssc) {
        const ssc_res = await fetch(item.content.ssc);
        ssr.current = await ssc_res.text();
      }

      setContent(item.content);
    }

    fetchContent();
  }, [content, fetching]);

  return (
    <div className="App">
      <div id={`ls-${content?.id}`} data-id={content?.id} data-store="STORE_ID" data-lang="it_IT" // dynamic passing of data-lang attribute, e.g. "it", "en", "en_US", "it_IT"
        dangerouslySetInnerHTML={{ __html: ssr.current ? ssr.current : '' }}> 
      </div>  
    </div>
  );
}

export default App;
