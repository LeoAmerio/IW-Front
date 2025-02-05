import { Box, styled } from "@mui/material";

const CustomModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  height: "60vh",
  maxHeight: "95vh",
  maxWidth: "50rem",
  backgroundColor: theme.palette.background.default,
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "20px",
  boxShadow:
    "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
}));

export default CustomModalBox;
