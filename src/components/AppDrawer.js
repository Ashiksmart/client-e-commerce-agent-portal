import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Iconify from './iconify';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


export default function AppDrawer(props) {
    const {
        children,
        setDrawerOpen,
        drawerOpen
    } = props

    return (
        <div>
            {['top'].map((anchor) => (
                <React.Fragment key={anchor}
                >
                    <Drawer
                        anchor={anchor}
                        open={drawerOpen}
                        onClose={() => drawerOpen ? setDrawerOpen(false) : setDrawerOpen(true)}
                        sx={{
                            zIndex: 1250
                        }}
                        PaperProps={{
                            sx: {
                                maxWidth: 500,
                                margin: "auto",
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                                display: "flex",
                            }
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 10,
                                height: 25,
                                cursor: 'pointer',
                                userSelect: 'none',
                                opacity: 0.8
                            }}
                            onClick={() => setDrawerOpen(false)}
                        >
                            <Iconify
                                icon="basil:cancel-solid"
                                width="40px"
                            />
                        </Box>
                        <Box
                            sx={{
                                width: 'auto',
                                margin: 'auto'
                            }}
                            role="presentation"
                        >
                            {children}
                        </Box>
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}
