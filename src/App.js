import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {

  const [loaded, setLoaded] = useState(false);
  const fetching = useRef(false);
  const [content, setContent] = useState({});

  useEffect(() => {
    if (!loaded || !content) return;

    const script = document.createElement('script');
    script.async = true;
    script.innerHTML = `(function(w){w.fpls_load=w.fpls_load||[];w.fpls_load.push(function(){
      w.ls_${content.id}=w.ls_${content.id}||new LiveStory("ls-${content.id}", {type:"${content.type}"})})})(window);`;
    script.addEventListener('load', () => setLoaded(true));
  
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    }
  }, [loaded, content]);

  useEffect(() => {
    if (loaded || fetching.current) return;
    fetching.current = true;

    console.log('Fething content item');

    async function fetchContent() {
      const res = await fetch('https://livestory.cdn.content.amplience.net/content/id/13a060bb-8528-47e0-a462-cf97d49c07a2?locale=it-IT');
      const item = await res.json();

      console.log('Content item:', item);

      setContent(item.content);
      setLoaded(true);
    }

    fetchContent();
  }, [loaded, fetching]);

  return (
    <div className="App">
      <div id={`ls-${content.id}`} data-id={content.id} data-store="STORE_ID" data-lang="it_IT"> {/* dynamic passing of data-lang attribute, e.g. "it", "en", "en_US", "it_IT" */}
        {/* content.ssc ? content.ssc : '' */}
      </div>  
    </div>
  );
}

export default App;
