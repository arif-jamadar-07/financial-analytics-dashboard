
import { useState } from "react";

import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";

interface HeaderProps {
  onMenuClick: () => void;
  darkMode: boolean;
  onThemeToggle: () => void;
  onLogout: () => void;
}

const Header = ({
  onMenuClick,
  darkMode,
  onThemeToggle,
  onLogout,
}: HeaderProps) => {
  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const menuOpen = Boolean(anchorEl);

  const handleProfileClick = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout();
  };

  const userData = localStorage.getItem("user");

  const user = userData
    ? JSON.parse(userData)
    : null;

  const userName = user?.name || "Admin";

  const avatarLetter = userName
    .charAt(0)
    .toUpperCase();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) =>
          theme.zIndex.drawer + 1,

        backgroundColor: darkMode
          ? "#0f172a"
          : "#ffffff",

        color: darkMode
          ? "#f8fafc"
          : "#0f172a",

        borderBottom: darkMode
          ? "1px solid #1e293b"
          : "1px solid #e2e8f0",

        transition:
          "background-color 0.2s ease, color 0.2s ease",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "72px !important",
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },

          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Header navigation and branding */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            minWidth: 0,
          }}
        >
          <IconButton
            onClick={onMenuClick}
            sx={{
              mr: 1,
              display: {
                xs: "inline-flex",
                md: "none",
              },
              color: "inherit",
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              fontWeight={700}
              noWrap
              sx={{
                fontSize: {
                  xs: "1rem",
                  sm: "1.15rem",
                },
              }}
            >
              Financial Dashboard
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: darkMode
                  ? "#94a3b8"
                  : "#64748b",

                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            >
              Monitor your financial activity
            </Typography>
          </Box>
        </Box>

        {/* Theme controls and user profile */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: {
              xs: 0.5,
              sm: 1.5,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <LightModeIcon
              sx={{
                fontSize: 19,
                color: darkMode
                  ? "#64748b"
                  : "#f59e0b",
              }}
            />

            <Switch
              checked={darkMode}
              onChange={onThemeToggle}
              size="small"
              inputProps={{
                "aria-label": "Toggle dark mode",
              }}
            />

            <DarkModeIcon
              sx={{
                fontSize: 19,
                color: darkMode
                  ? "#60a5fa"
                  : "#64748b",
              }}
            />
          </Box>

          <Box
            onClick={handleProfileClick}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",

              px: {
                xs: 0.5,
                sm: 1,
              },

              py: 0.5,
              borderRadius: 2,

              "&:hover": {
                backgroundColor: darkMode
                  ? "#1e293b"
                  : "#f1f5f9",
              },
            }}
          >
            <Box
              sx={{
                textAlign: "right",
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                noWrap
              >
                {userName}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: darkMode
                    ? "#94a3b8"
                    : "#64748b",
                }}
              >
                Administrator
              </Typography>
            </Box>

            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: darkMode
                  ? "#2563eb"
                  : "primary.main",
                fontWeight: 700,
              }}
            >
              {avatarLetter}
            </Avatar>
          </Box>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 190,
            borderRadius: 2,
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1,
          }}
        >
          <Typography
            variant="body2"
            fontWeight={600}
          >
            {userName}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Administrator
          </Typography>
        </Box>

        <MenuItem
          variant="outlined"
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={onLogout}
          sx={{
            ml: {
              xs: 0,
              sm: 1,
            },

            borderColor: "#e2e8f0",
            color: "#475569",
            textTransform: "none",
            fontWeight: 600,

            minWidth: {
              xs: 40,
              sm: 100,
            },

            px: {
              xs: 1,
              sm: 1.5,
            },

            "& .MuiButton-startIcon": {
              mr: {
                xs: 0,
                sm: 0.75,
              },
            },

            "&:hover": {
              borderColor: "#cbd5e1",
              backgroundColor: "#f8fafc",
            },
          }}
        />

        <Divider />

        <MenuItem
          onClick={handleLogout}
          sx={{
            color: "error.main",
            gap: 1,
            mt: 0.5,
          }}
        >
          <LogoutIcon fontSize="small" />
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;

