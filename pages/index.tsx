import { Box } from '@mui/material';

export default function Index() {
  return (
    <Box className="flex flex-col justify-center items-center h-screen w-full border-8 border-indigo-500/100">
      <Box
        component="img"
        alt="Logo"
        src="https://i.ibb.co/p2bxYNc/Takayama-Full-Logo.png"
      />
      <Box className="mt-4 text-[2vw]"> 10/21/23 </Box>
    </Box>
  );
}
