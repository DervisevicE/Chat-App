import {
    List,
    ListSubheader,
    Drawer,
    useTheme,
    useMediaQuery, IconButton
} from '@mui/material'
import SidebarContent from "./SidebarContent.tsx";
import MenuIcon from '@mui/icons-material/Menu';
import {useState} from "react";


const Sidebar = ({activeUsers}: { activeUsers: { username: string }[] }) => {

    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            {
                isMobile ? (
                        <>
                            {!open && (
                                <IconButton
                                    onClick={() => setOpen(true)}
                                    sx={{
                                        position: 'fixed',
                                        top: 16,
                                        left: 16,
                                        zIndex: 1300,
                                        bgcolor: '#fff',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                                    }}
                                >
                                    <MenuIcon/>
                                </IconButton>
                            )}
                            <Drawer
                                anchor="left"
                                open={open}
                                onClose={() => setOpen(false)}>
                                <List
                                    sx={{
                                        width: isMobile ? 250 : 360,
                                        maxWidth: 360,
                                        bgcolor: 'background.paper',
                                        borderRadius: isMobile ? 0 : '20px',
                                        overflowY: 'auto',
                                        height: '100vh',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        overflowX: 'hidden',
                                    }}
                                    subheader={<ListSubheader>Users</ListSubheader>}

                                >
                                    {activeUsers.map((user, index) => (
                                        <SidebarContent key={index} username={user.username}/>
                                    ))}

                                </List>
                            </Drawer>
                        </>
                    )
                    :
                    (
                        <List
                            sx={{
                                width: '100%',
                                maxWidth: 360,
                                bgcolor: 'background.paper',
                                borderRadius: '20px',
                                overflowY: 'auto',
                                height: '100vh',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                overflowX: 'hidden'
                            }}
                            subheader={<ListSubheader>Users</ListSubheader>}

                        >
                            {activeUsers.map((user, index) => (
                                <SidebarContent key={index} username={user.username}/>
                            ))}

                        </List>
                    )
            }
        </>
    )
        ;
}

export default Sidebar;