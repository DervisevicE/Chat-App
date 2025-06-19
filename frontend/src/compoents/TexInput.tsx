import {Box, TextField, IconButton} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

const TextInput = ({onSend, text, setText}: {
    onSend: (text: string) => void,
    text: string,
    setText: (value: string) => void
}) => {

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            marginY: '20px',
        }}>
            <Box sx={{
                backgroundColor: '#fff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '20px',
                padding: '6px',
                width: '80%',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
            }}>
                <TextField
                    sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                border: 'none',
                            },
                            '&:hover fieldset': {
                                border: 'none',
                            },
                            '&.Mui-focused fieldset': {
                                border: 'none',
                            },
                        },
                    }}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    multiline
                    maxRows={3}
                    placeholder='Type a message here...'
                />
                <IconButton onClick={() => {
                    if (text.trim() !== '') {
                        onSend(text);
                        setText('');
                    }
                }}>
                    <SendIcon sx={{fill: '#6B1CB0'}}/>
                </IconButton>
            </Box>

        </Box>
    )
}

export default TextInput;