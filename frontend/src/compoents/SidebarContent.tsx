import {
    Box,
    ListItemText,
    ListItemAvatar,
    ListItemButton,
    Avatar,
} from '@mui/material'


const SidebarContent = ({username, isSelected}: { username: string, isSelected: boolean }) => {

    const getInitials = (username: string | undefined) => {
        if (!username) return '?';

        const matches = username.match(/[A-Z]/g);

        if (matches && matches.length >= 2) {
            return matches.slice(0, 2).join('');
        }

        return username.slice(0, 2).toUpperCase();
    };

    function handleActiveUserClicked() {
        const event = new CustomEvent<string>('active-user-clicked', {detail: username});
        window.dispatchEvent(event)
        console.log(username)
    }

    return (
        <ListItemButton onClick={handleActiveUserClicked} selected={isSelected}
                        sx={{
                            pl: 1.5,
                            position: 'relative',
                            '&.Mui-selected::before': {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: '4px',
                                backgroundColor: '#6B1CB0',
                                borderTopLeftRadius: '4px',
                                borderBottomLeftRadius: '4px',
                            },
                            '&.Mui-selected': {
                                backgroundColor: '#f5f5f5',
                            },
                            '&.Mui-selected:hover': {
                                backgroundColor: '#e0e0e0',
                            }
                        }}
        >
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