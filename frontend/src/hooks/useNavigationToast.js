import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useNavigationToast = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast(location.state.toastMessage, {
        type: location.state.statusMessage === 'success' ? 'success' : 'error',
      });

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);
};