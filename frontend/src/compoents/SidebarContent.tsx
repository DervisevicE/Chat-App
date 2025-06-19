import {
    Box,
    ListItemText,
    ListItemAvatar,
    ListItemButton,
    Avatar,
} from '@mui/material'


const SidebarContent = () => {

    return (
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
    );
}

export default SidebarContent;