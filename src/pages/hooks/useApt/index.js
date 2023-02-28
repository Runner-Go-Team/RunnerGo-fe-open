import { useEffect } from 'react';
import aptScripts from './aptScripts';

const useApt = (props) => {
  window.aptScripts = aptScripts;

  useEffect(() => {}, []);

  return null;
};

export default useApt;
