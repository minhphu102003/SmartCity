import { createPortal } from 'react-dom';

const FullImagePortal = ({ children }) => {
  if (typeof window === 'undefined') return null;

  const container = document.getElementById('portal-root') || document.body;
  return createPortal(children, container);
};

export default FullImagePortal;