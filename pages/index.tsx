import { Box, Typography } from '@mui/material';

export default function Index() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
      <Box
        component="img"
        alt="Logo"
        src="https://i.ibb.co/p2bxYNc/Takayama-Full-Logo.png"
        sx={{
          objectFit: 'contain',
        }}
      />
      <Typography sx={{ justifyContent: 'center' }}> 10/21/23 </Typography>
    </Box>
  );
}
