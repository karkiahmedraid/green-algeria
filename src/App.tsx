import { useEffect } from 'react';
import './App.css'
import AlgeriaTreeCampaign from './layouts/Green-algeria-page';
import { preloadNSFWModel } from './utils/nsfwDetection';

function App() {
  // Preload NSFW detection model in background on app start
  useEffect(() => {
    preloadNSFWModel();
  }, []);

  return (
    <AlgeriaTreeCampaign />
  )
}

export default App
