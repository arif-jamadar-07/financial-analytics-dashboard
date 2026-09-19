
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import PersonIcon from "@mui/icons-material/Person";
import MessageIcon from "@mui/icons-material/Message";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const drawerWidth = 250;

const Sidebar = ({
  mobileOpen,
  onClose,
  onLogout,
}: SidebarProps) => {
  const menuItems = [
    {
      label: "Dashboard",
      icon: <DashboardIcon />,
      active: true,
    },
    {
      label: "Transactions",
      icon: <ReceiptLongIcon />,
    },
    {
      label: "Wallet",
      icon: <AccountBalanceWalletIcon />,
    },
    {
      label: "Analytics",
      icon: <AnalyticsIcon />,
    },
    {
      label: "Personal",
      icon: <PersonIcon />,
    },
    {
      label: "Message",
      icon: <MessageIcon />,
    },
    {
      label: "Setting",
      icon: <SettingsIcon />,
    },
  ];

  // Shared drawer content keeps mobile and desktop navigation consistent.
  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        color: "text.primary",
        transition:
          "background-color 0.2s ease, color 0.2s ease",
      }}
    >
      {/* Application branding */}
      <Box
        sx={{
          height: 72,
          minHeight: 72,
          display: "flex",
          alignItems: "center",
          px: 3,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight={800}
            color="primary"
            sx={{
              letterSpacing: "-0.3px",
            }}
          >
            FinanceFlow
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Financial management
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Primary navigation */}
      <List
        sx={{
          px: 1.5,
          py: 2,
          flexGrow: 1,
        }}
      >
        {menuItems.map((item) => (
          <ListItemButton
            key={item.label}
            selected={item.active}
            onClick={onClose}
            sx={{
              borderRadius: 2,
              mb: 0.75,
              minHeight: 46,
              color: "text.secondary",

              "& .MuiListItemIcon-root": {
                color: "text.secondary",
                minWidth: 40,
              },

              "&:hover": {
                bgcolor: "action.hover",
                color: "text.primary",

                "& .MuiListItemIcon-root": {
                  color: "primary.main",
                },
              },

              "&.Mui-selected": {
                bgcolor: "action.selected",
                color: "primary.main",

                "& .MuiListItemIcon-root": {
                  color: "primary.main",
                },
              },

              "&.Mui-selected:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>

            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: item.active ? 600 : 500,
              }}
            />
          </ListItemButton>
        ))}
      </List>

      {/* Logout action */}
      <Box
        sx={{
          p: 1.5,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <ListItemButton
          onClick={onLogout}
          sx={{
            borderRadius: 2,
            minHeight: 46,
            color: "error.main",

            "& .MuiListItemIcon-root": {
              minWidth: 40,
              color: "error.main",
            },

            "&:hover": {
              bgcolor: "error.main",
              color: "#fff",

              "& .MuiListItemIcon-root": {
                color: "#fff",
              },
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontWeight: 600,
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile navigation */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "background.paper",
            color: "text.primary",
            borderRight: 1,
            borderColor: "divider",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop navigation */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: {
            xs: "none",
            md: "block",
          },

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "background.paper",
            color: "text.primary",
            borderRight: 1,
            borderColor: "divider",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export { drawerWidth };

export default Sidebar;
