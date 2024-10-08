import { Box, Alert } from "@mui/material";
import React from "react";

interface CustomChipProps {
  children: React.ReactNode;
}

const CustomChip = ({children}: CustomChipProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ marginBlock: "2rem" }}
      height="100%"
    >
      <Alert id="no-line-uploaded-alert" severity="info">
        {children}
      </Alert>
    </Box>
  );
};

export default CustomChip;
