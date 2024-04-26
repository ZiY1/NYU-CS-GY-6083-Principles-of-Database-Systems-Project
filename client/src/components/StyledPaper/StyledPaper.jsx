import { Paper } from "@mui/material";
import styled from "styled-components";

const StyledPaper = styled(Paper)`
  position: relative; // Make the paper a reference for positioning
  padding: 20px; // Ensure padding for internal content
  width: 80%;
  max-width: 900px;
  margin: auto;
  margin-top: 4rem;
  margin-bottom: 4rem;
  background: #f3f7fd !important;
`;

export default StyledPaper;