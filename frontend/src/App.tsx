import './App.css'
import Sidebar from './compoents/Sidebar.tsx'
import MessageBubble from './compoents/MessageBubble.tsx'
import TextInput from './compoents/TexInput.tsx'
import {useStompClient, useSubscription} from "react-stomp-hooks";
import {useEffect, useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, Snackbar, type SnackbarCloseReason
} from '@mui/material';
import {getActiveUsers} from "./api/services/userService.ts";


interface Message {
    text: string;
    senderUsername: string;
    timestamp?: string;
}

interface User {
    username: string
}

function App({username}: { username: string }) {

    const [open, setOpen] = useState<boolean>(false);
    const [notification, setNotification] = useState<string | undefined>(undefined)
    const [messages, setMessages] = useState<Message[]>([])
    const [openDialog, setOpenDialog] = useState<boolean>(true);
    const [text, setText] = useState('');
    const [activeUsers, setActiveUsers] = useState<User[]>([])

    const setFilteredActiveUsers = (users: User[]) => {
        setActiveUsers([{username: "Global"},...users.filter(u => u.username !== username)]);
    }

    const handleClose = (
        _: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    useEffect(() => {
        if (!username) return;

        getActiveUsers().then((res) => {
            setFilteredActiveUsers(res.data);
        });

    }, [username]);

    const stompClient = useStompClient();
    useSubscription("/topic/messages", (message) => {
        const msgObj: Message = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, msgObj]);
    });

    useSubscription("/topic/notifications", (message) => {
        const body = JSON.parse(message.body);
        if (body["type"] === "USER_CONNECTED") {
            setNotification(`New user joined the app: ${body["data"]["username"]}`)
            setOpen(true);
        }
    })

    useSubscription("/topic/active-users", (message) => {
        const users: User[] = JSON.parse(message.body);

        setFilteredActiveUsers(users);
    });


    function onSend(text: string) {
        const message = {
            text: text,
            senderUsername: username,
            conversationId: "global"
        }

        if (stompClient) {
            //Send Message
            stompClient.publish({
                destination: "/app/chat",
                body: JSON.stringify(message),
            });
        } else {
            //Handle error
        }
    }

    return (
        <div className="app">
            <Snackbar
                open={open}
                onClose={handleClose}
                autoHideDuration={6000}
                message={notification}
                sx={{color: 'white'}}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            />

            {username === undefined

                ?

                <Typography>Loading</Typography>

                :

                <>
                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} sx={{}}>
                        <DialogTitle>Welcome to Boop!</DialogTitle>
                        <DialogContent>
                            <Typography>Your randomly assigned name is:</Typography>
                            <Typography fontWeight="bold">
                                {username}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)} autoFocus>
                                Got it
                            </Button>
                        </DialogActions>
                    </Dialog>


                    <Sidebar activeUsers={activeUsers}/>

                    <div className="app-content">
                        <div className="message-list">
                            {messages.map(({text, senderUsername}, index) => (
                                <MessageBubble
                                    key={index}
                                    isOwner={senderUsername === username}
                                    value={text}
                                    senderUsername={senderUsername}
                                />
                            ))}

                        </div>

                        <TextInput onSend={onSend} text={text} setText={setText}/>
                    </div>
                </>


            }


        </div>
    )
}

export default App
