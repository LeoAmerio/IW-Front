import * as React from 'react';
import { Box, Button, Container, LinearProgress, Modal } from '@mui/material';
import { Cancel, Check } from '@mui/icons-material';
import CustomModalBox from './ui/CustomModalBox';

interface Props {
  open: boolean;
  handleSubmit: any;
  handleClose: any;
  loading: boolean;
  children: React.ReactNode;
  disabled?: boolean;
}

const ConfirmModal = ({ open, handleSubmit, handleClose, children, loading, disabled }: Props) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="Confirmación"
      aria-describedby="Confirmación de borrado">
      <CustomModalBox 
        // sx={{ width: '25rem', textAlign: 'center' }}
        sx={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          width: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: 'auto',
        }}
      >
        <Box mb={3}>
          {children}
        </Box>

        <Box 
          display="flex" 
          justifyContent="center" 
          // flexWrap="wrap" 
          gap={2}
          mb={loading ? 2 : 0}
        >
          <Button
            id="continue-confirm-modal-btn"
            variant="contained"
            color="error"
            onClick={handleSubmit}
            disabled={disabled ? disabled : loading}
            startIcon={<Check />}>
            Continuar
          </Button>
          <Button
            id="cancel-confirm-modal-btn"
            variant="contained"
            color="info"
            onClick={handleClose}
            sx={{ marginLeft: '0.5rem' }}
            disabled={loading}
            startIcon={<Cancel />}>
            Cancelar
          </Button>
          {loading && <LinearProgress sx={{ marginTop: 1 }} />}
        </Box>
      </CustomModalBox>
    </Modal>
  );
};

export default ConfirmModal;
