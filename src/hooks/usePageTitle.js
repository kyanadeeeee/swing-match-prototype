import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title ? `${title} | Swing Match` : 'Swing Match - ゴルフスイング分析アプリ';
    
    // Cleanup function to restore original title when component unmounts
    return () => {
      document.title = originalTitle;
    };
  }, [title]);
};

export default usePageTitle;