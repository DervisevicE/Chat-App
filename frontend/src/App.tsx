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


interface Message {
    text: string;
    senderUsername: string;
    timestamp?: string;
}

function App() {

    const [messages, setMessages] = useState<Message[]>([])
    const [username, setUsername] = useState<string>("")
    const [openDialog, setOpenDialog] = useState<boolean>(true);


    const adjectives = ['Quick', 'Brave', 'Silly', 'Witty', 'Pretty', 'Cute'];
    const animals = ['Panda', 'Tiger', 'Mouse', 'Otter', 'Koala', 'Cat', 'Bird'];

    useEffect(() => {
        const newName = generateRandomName();
        setUsername(newName);
    }, []);

    console.log(username)

    const generateRandomName = () => {
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const animal = animals[Math.floor(Math.random() * animals.length)];
        const number = Math.floor(Math.random() * 1000);
        return `${adj}${animal}${number}`;
    };

    const stompClient = useStompClient();
    useSubscription("/topic/messages", (message) => {
        const msgObj: Message = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, msgObj]);
    });


    function onSend() {
        const message = {
            text: "text",
            senderUsername: username
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


            <Sidebar/>

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

                <TextInput onSend={onSend}/>
            </div>


        </div>
    )
}

export default App
