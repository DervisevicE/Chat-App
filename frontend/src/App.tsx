import './App.css'
import Sidebar from './compoents/Sidebar.tsx'
import MessageBubble from './compoents/MessageBubble.tsx'
import TextInput from './compoents/TexInput.tsx'
import {StompSessionProvider, useStompClient, useSubscription} from "react-stomp-hooks";
import {useEffect, useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from '@mui/material';
import {getActiveUsers, getGeneratedUsername} from "./api/services/userService.ts";


interface Message {
    text: string;
    senderUsername: string;
    timestamp?: string;
}

interface User {
    username: string
}

function App({ username }: { username: string }) {

    const [messages, setMessages] = useState<Message[]>([])
    // const [username, setUsername] = useState<string | undefined>(undefined)
    const [openDialog, setOpenDialog] = useState<boolean>(true);
    const [text, setText] = useState('');
    const [activeUsers, setActiveUsers] = useState<User[]>([])


    // useEffect(() => {
    //     getGeneratedUsername().then(
    //         (response) => {
    //
    //             setUsername(response.data)
    //         }
    //     )
    // }, []);



    useEffect(() => {
        if (!username) return;

        const interval = setInterval(() => {
            getActiveUsers().then((res) => {
                setActiveUsers(res.data);
            });
        }, 3000); // refresh every 3s

        return () => clearInterval(interval);
    }, [username]);


    const stompClient = useStompClient();
    useSubscription("/topic/messages", (message) => {
        const msgObj: Message = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, msgObj]);
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


                    <Sidebar  activeUsers={activeUsers}/>

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
