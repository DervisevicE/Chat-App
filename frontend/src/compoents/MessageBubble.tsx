import {Avatar, Box, Typography} from "@mui/material";


const MessageBubble = ({isOwner, value}: { isOwner: boolean, value: string }) => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: isOwner ? 'flex-end' : 'flex-start',
            alignItems: 'flex-end',
            gap: '12px'
        }}>

            {!isOwner && (
                <Avatar>
                    E
                </Avatar>
            )}

            <Box sx={{
                width: '60%',
                background: isOwner ? 'linear-gradient(90deg,rgba(107, 28, 176, 1) 1%, rgba(175, 101, 224, 1) 33%, rgba(174, 136, 235, 1) 100%)' : '#fff',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
                <Typography variant='body2' sx={{
                    color: isOwner ? 'white' : '#000'
                }}>
                    {value}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        textAlign: 'right',
                        fontSize: '0.7rem',
                        color: isOwner ? '#f3f3f3' : '#6a6a6a',
                        mt: 0.5,
                    }}
                >
                    12:22AM
                </Typography>
            </Box>

            {isOwner && (
                <Avatar>
                    E
                </Avatar>
            )}
        </Box>
    )
}


export default MessageBubble;