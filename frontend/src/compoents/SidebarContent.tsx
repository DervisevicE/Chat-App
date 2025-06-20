import {
    Box,
    ListItemText,
    ListItemAvatar,
    ListItemButton,
    Avatar,
} from '@mui/material'


const SidebarContent = ({username}: { username: string }) => {

    const getInitials = (username: string | undefined) => {
        if (!username) return '?';

        const matches = username.match(/[A-Z]/g);

        if (matches && matches.length >= 2) {
            return matches.slice(0, 2).join('');
        }

        return username.slice(0, 2).toUpperCase();
    };

    return (
        <ListItemButton>
            <ListItemAvatar>
                <Box sx={{position: 'relative', display: 'inline-block'}}>
                    <Avatar>
                        {getInitials(username)}
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
            <ListItemText primary={username}/>
        </ListItemButton>
    );
}

export default SidebarContent;