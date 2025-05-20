import { useEffect, useState } from 'react';
import { CameraRow } from '../../components/row';
import { CameraTableSkeleton } from '../../components/skeleton';
import { useReverseGeocode } from '../../hooks/useReverseGeocode';
import { CameraMapModal, ConfirmModal, UpdateCameraModal } from '../../components/modal';
import { useCameraManager } from '../../hooks/useCameraManager';

const CameraRowWithAddress = ({ camera, onEdit, onDelete, onView }) => {
  const { address, loading: loadingAddress } = useReverseGeocode(camera.latitude, camera.longitude);
  return (
    <CameraRow
      camera={camera}
      address={loadingAddress ? 'Loading address...' : address}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
    />
  );
};

const CameraManager = () => {
  const [isCameraModalVisible, setCameraModalVisible] = useState(false);
  const {
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
    setCameraToEdit
  } = useCameraManager();

  useEffect(() => {
    if (cameraToView) {
      setCameraModalVisible(true);
    }
  }, [cameraToView]);

  const handleCloseMapModal = () => {
    setCameraModalVisible(false);
    setTimeout(() => {
      closeModal();
    }, 500);
  };

  if (loading) return <CameraTableSkeleton />;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Camera Management</h1>

      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Link</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Address</th>
            <th className="border px-2 py-1">Installation Date</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cameras.map((cam) => (
            <CameraRowWithAddress
              key={cam._id}
              camera={cam}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onView={handleView}
            />
          ))}
        </tbody>
      </table>

      {cameraToView && (
        <CameraMapModal
          camera={cameraToView}
          onClose={handleCloseMapModal}
          isVisible={isCameraModalVisible}
        />
      )}

      {cameraToDelete && (
        <ConfirmModal
          title="Confirm Delete"
          message={
            <>
              Are you sure you want to delete the camera{' '}
              <strong>{cameraToDelete.link}</strong>?
            </>
          }
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}

      {cameraToEdit && (
        <UpdateCameraModal
          camera={cameraToEdit}
          onClose={() => setCameraToEdit(null)}
          onUpdate={confirmUpdate}
        />
      )}
    </div>
  );
};

export default CameraManager;
