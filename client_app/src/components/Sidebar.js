import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import BarChartIcon from '@mui/icons-material/BarChart';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme();

  const toggleDrawer = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const drawerWidth = collapsed ? 80 : 260;
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Students', icon: <GroupIcon />, path: '/students' },
    { text: 'Vaccination Drives', icon: <EventIcon />, path: '/drives' },
    { text: 'Reports', icon: <BarChartIcon />, path: '/reports' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          borderRight: 'none',
          overflowX: 'hidden',
          transition: 'width 0.3s ease',
          boxShadow: theme.shadows[3],
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      <Box>
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: collapsed ? 'center' : 'space-between',
            alignItems: 'center',
            px: 2,
            paddingTop: '20px',
          }}
        >
          {!collapsed && (
            <Box display="flex" alignItems="center" gap={1}>
              <VaccinesIcon sx={{ color: '#a78bfa' }} />
              <Typography variant="h5" noWrap fontWeight="bold" color="#ffffff">
                VaxSure
              </Typography>
            </Box>
          )}
          <IconButton onClick={toggleDrawer} sx={{ color: '#ffffff' }}>
            {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
          </IconButton>
        </Toolbar>

        <Divider sx={{ borderColor: '#374151', mb: 2 }} />

        <List>
          {menuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <Tooltip
                title={collapsed ? item.text : ''}
                placement="right"
                arrow
                key={item.text}
              >
                <ListItem
                  button
                  component={Link}
                  to={item.path}
                  selected={isSelected}
                  sx={{
                    color: '#ffffff',
                    transition: 'all 0.3s ease',
                    borderRadius: '8px',
                    mx: 1,
                    my: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: '#4c1d95',
                      '&:hover': {
                        backgroundColor: '#5b21b6',
                      },
                    },
                    '&:hover': {
                      backgroundColor: '#334155',
                      boxShadow: theme.shadows[2],
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: '#a5b4fc', minWidth: 50 }}>
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '16px',
                        fontWeight: isSelected ? 'bold' : 'medium',
                      }}
                    />
                  )}
                </ListItem>
              </Tooltip>
            );
          })}
        </List>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Divider sx={{ borderColor: '#374151', mb: 1 }} />
        <Tooltip title={collapsed ? 'Logout' : ''} placement="right" arrow>
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              color: '#ffffff',
              mx: 1,
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#334155',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#f87171', minWidth: 50 }}>
              <LogoutIcon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontSize: '16px',
                  fontWeight: 'medium',
                }}
              />
            )}
          </ListItem>
        </Tooltip>
      </Box>
    </Drawer>
  );
};

export default Sidebar;