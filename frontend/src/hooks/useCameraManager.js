import { useState, useEffect, useContext } from 'react';
import { getCameras, deleteCamera, updateCamera } from '../services/camera';
import MethodContext from '../context/methodProvider';

export const useCameraManager = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cameraToView, setCameraToView] = useState(null);
  const [cameraToDelete, setCameraToDelete] = useState(null);
  const [cameraToEdit, setCameraToEdit] = useState(null);

  const { notify } = useContext(MethodContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCameras({ page: 1, limit: 20 });
        setCameras(data?.data || []);
      } catch (error) {
        console.error('Failed to fetch cameras:', error);
        notify('Failed to fetch cameras.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [notify]);

  const handleView = (camera) => setCameraToView(camera);
  const closeModal = () => setCameraToView(null);

  const handleEdit = (camera) => setCameraToEdit(camera);
  const handleDeleteClick = (camera) => setCameraToDelete(camera);
  const cancelDelete = () => setCameraToDelete(null);

  const confirmDelete = async () => {
    if (!cameraToDelete) return;

    try {
      await deleteCamera(cameraToDelete._id);
      setCameras((prev) => prev.filter((c) => c._id !== cameraToDelete._id));
      setCameraToDelete(null);
      notify('Camera deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete camera:', error);
      notify('Failed to delete camera.', 'error');
    }
  };

  const confirmUpdate = async (updatedCam) => {
    try {
      const updated = await updateCamera(updatedCam._id, updatedCam);
      setCameras((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );
      setCameraToEdit(null);
      notify('Camera updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update camera:', error);
      notify('Failed to update camera.', 'error');
    }
  };

  return {
    cameras,
    loading,
    cameraToView,
    cameraToEdit,
    cameraToDelete,
    handleView,
    closeModal,
    handleEdit,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    confirmUpdate,
    setCameraToEdit,
  };
};