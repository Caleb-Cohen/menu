import { Box } from '@mui/material';

export default function index() {
  return (
    <div className="flex flex-col justify-center items-center">
      <span className="mt-[33vw] text-[2vw]">10/21/23</span>
      <img
        src="/images/top_logo_mark.png"
        alt="Top Image"
        className="absolute top-0"
      />
      <img
        src="/images/Takayama_Logo.png"
        alt="Bottom Image"
        className="absolute top-0"
      />
    </div>

  );
}
