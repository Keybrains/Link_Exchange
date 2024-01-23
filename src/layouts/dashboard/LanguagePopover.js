import { useRef, useState } from 'react';
// material
import { alpha } from '@mui/material/styles';
import { Box, MenuItem, Stack, IconButton, Typography, Tooltip } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleHelpClick = () => {
    window.open('https://keybrainstech.com/backlinks/', '_blank');
  };

  return (
    <>
      <Stack spacing={0.75}>
        <Tooltip title="Need Any Help">
          {/* Wrap Typography with an anchor tag */}
          <Typography
            style={{
              color: '#3498db',
              cursor: 'pointer',
              fontWeight: 'bold', // Make the text bold
              fontSize: '16px', // Set the font size
              // textDecoration: 'underline', // Underline the text
              transition: 'color 0.3s ease-in-out', // Add a smooth color transition
            }}
            onClick={handleHelpClick}
          >
            Help
          </Typography>
        </Tooltip>
      </Stack>
    </>
  );
}
