import {
    Box,
    List,
    ListItemText,
    ListItemAvatar,
    ListItemButton,
    ListSubheader,
    Avatar,
} from '@mui/material'


const Sidebar = () => {

    return (
        <List
            sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
                borderRadius: '20px',
                margin: '10px',
                overflowY: 'auto',
                height: '100vh'
            }}
            subheader={<ListSubheader>Users</ListSubheader>}

        >
            <ListItemButton>
                <ListItemAvatar>
                    <Box sx={{position: 'relative', display: 'inline-block'}}>
                        <Avatar>
                            E
                        </Avatar>
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: 12,
                                height: 12,
                                bgcolor: '#44b700',
                                border: '2px solid white',
                                borderRadius: '50%',
                            }}
                        />
                    </Box>
                </ListItemAvatar>
                <ListItemText primary="username1234"/>
            </ListItemButton>

        </List>
    );
}

export default Sidebar;