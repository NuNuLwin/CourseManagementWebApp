import React from "react";
import { Breadcrumbs, Link, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BreadCrumbs = ({ links }) => {
  const navigate = useNavigate();

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {links.map((link, index) => {
          if (link.url) {
            return (
              <Link
                underline="hover"
                key={index}
                color="inherit"
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.url);
                }}
              >
                {link.name}
              </Link>
            );
          } else {
            return (
              <Typography key="3" color="text.primary">
                {link.name}
              </Typography>
            );
          }
        })}
      </Breadcrumbs>
    </Stack>
  );
};

export default BreadCrumbs;
