import { Modal } from '@mui/material';
import React from 'react';
import ClearIcon from '@mui/icons-material/Clear';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
};

const imageStyle = {
  maxWidth: '100%',
  maxHeight: '100%',
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
};

export const OpenImageDialog = (props) => {
  const handleClose = () => props.setOpen(false);

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div style={modalStyle}>
        <img src={props.selectedImage} alt="Selected content" style={imageStyle} />
        <ClearIcon
          style={{
            cursor: 'pointer',
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'black',
          }}
          onClick={handleClose}
        />
      </div>
    </Modal>
  );
};
