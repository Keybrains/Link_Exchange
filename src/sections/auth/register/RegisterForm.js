import { AsYouType, getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { Dropdown } from 'bootstrap';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Stack,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';

import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

export default function RegisterForm({ onSubmit }) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstname: Yup.string().required('First name required'),
    lastname: Yup.string().required('Last name required'),
    companyname: Yup.string().optional(),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    phonenumber: Yup.string().required('Phone number is required'),
    username: Yup.string().required('User name is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]+$/,
        'Password must contain at least one number, one special character, one uppercase letter, and one lowercase letter'
      ),

    retypePassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const defaultValues = {
    firstname: '',
    lastname: '',
    companyname: '',
    email: '',
    phonenumber: '',
    username: '',
    password: '',
    retypePassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });
  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState('');

  useEffect(() => {
    const countries = getCountries();
    const codes = countries.map((country) => ({
      name: country,
      dialCode: `+${getCountryCallingCode(country)}`,
    }));
    setCountryCodes(codes);
  }, []);

  // Display the list of country codes and their phone number codes
  console.log(countryCodes);

  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Function to update the formatted phone number when the country code changes
  const handleCountryCodeChange = (countryCode) => {
    setSelectedCountryCode(countryCode);
    setFormattedPhoneNumber(`${countryCode}`);
  };

  // Update formatted phone number when selectedCountryCode changes
  useEffect(() => {
    if (selectedCountryCode) {
      setFormattedPhoneNumber(`${selectedCountryCode}`);
    }
  }, [selectedCountryCode]);

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Stack spacing={1}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstname" label="First Name" />
          <RHFTextField name="lastname" label="Last Name" />
        </Stack>
        <RHFTextField name="companyname" label="Company Name (Optional)" />
        <RHFTextField name="email" label="Email Address" />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '0px' } }}>
            <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
              Country Number Code*
            </InputLabel>
            <Select
              onChange={(e) => handleCountryCodeChange(e.target.value)}
              value={selectedCountryCode}
              labelId="Code"
              id="Code"
              label="Code"
              displayEmpty
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: '200px', // Set your desired height
                    width: '150px', // Set your desired width
                  },
                },
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                getContentAnchorEl: null,
              }}
            >
              {/* <MenuItem value="" disabled>
                Code
              </MenuItem> */}
              {countryCodes.map((country, index) => (
                <MenuItem key={index} value={country.dialCode}>
                  {`${country.name} (${country.dialCode})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <RHFTextField
            name="phonenumber"
            id="phonenumber"
            label="Phone Number"
            value={formattedPhoneNumber}
            onChange={(e) => {
              setFormattedPhoneNumber(e.target.value);
              setPhoneNumber(e.target.value); // Store the actual phone number separately
            }}
            onBlur={() => {
              // Set the actual phone number after the user exits the input
              methods.setValue('phonenumber', phoneNumber, { shouldValidate: true });
            }}
            style={{
              marginTop: '15px',
            }}
            error={!!methods.formState.errors.phonenumber}
            helperText={methods.formState.errors.phonenumber?.message || ''}
          />
        </Stack>
        <RHFTextField name="username" label="User Name" />
        <Typography sx={{ color: 'text.secondary', mb: 1, pl: 1, fontSize: '0.8rem' }}>
          *Password must contain at least one number, one special character, one uppercase letter, and one lowercase
          letter
        </Typography>

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField
          name="retypePassword"
          label="Retype Password"
          type={showRetypePassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowRetypePassword(!showRetypePassword)}>
                  <Iconify icon={showRetypePassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={methods.formState.isSubmitting}
        >
          Register
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
