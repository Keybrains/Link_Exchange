import { Box, MenuItem, Stack, IconButton, Typography, Tooltip } from '@mui/material';

export default function LanguagePopover() {

  const handleHelpClick = () => {
    window.open('https://keybrainstech.com/backlinks/', '_blank');
  };

  return (
    <>
      <Stack spacing={0.75}>
        <Tooltip title="Need Any Help">
          <Typography
            style={{
              color: '#010ED0',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              transition: 'color 0.3s ease-in-out',
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
