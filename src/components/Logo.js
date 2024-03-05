import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import LogoImage from '../assets/SWAPALINKLOGO.svg';

// ----------------------------------------------------------------------

export default function Logo({ sx }) {
  return <Box component="img" src={LogoImage} sx={{ width: 40, height: 40, ...sx }} />;
}

Logo.propTypes = {
  sx: PropTypes.object,
};
