// components/BreadCrumbs.js
import React from "react";
import { Breadcrumbs, Link, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BreadCrumbs = ({ name, url }) => {
  const navigate = useNavigate();

  return (
    <Stack spacing={2}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link
          underline="hover"
          key="1"
          color="inherit"
          href="/"
          onClick={() => navigate(url)}
        >
          Courses
        </Link>
        <Typography key="3" color="text.primary">
          {name}
        </Typography>
      </Breadcrumbs>
    </Stack>
  );
};

export default BreadCrumbs;
