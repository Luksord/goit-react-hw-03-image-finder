import { useEffect } from 'react';
import '../styles.css';

export const Modal = ({ imageUrl, onClose }) => {
  //https://stackoverflow.com/questions/63074577/close-modal-popup-using-esc-key-on-keyboard
  useEffect(() => {
    const close = event => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [onClose]);

  const handleCloseModal = event => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div class="overlay" onClick={handleCloseModal}>
      <div class="modal">
        <img src={imageUrl} alt="" />
      </div>
    </div>
  );
};
