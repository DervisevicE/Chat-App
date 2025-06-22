import './App.css'
import Sidebar from './compoents/Sidebar.tsx'
import MessageBubble from './compoents/MessageBubble.tsx'
import TextInput from './compoents/TexInput.tsx'
import {useStompClient, useSubscription} from "react-stomp-hooks";
import {useEffect, useRef, useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, Snackbar, type SnackbarCloseReason
} from '@mui/material';
import {getActiveUsers} from "./api/services/userService.ts";
import {openConversation} from "./api/services/conversationService.ts";
import type {ConversationResponse, MessageResponse} from "./api/types.ts";
import {getMessages} from "./api/services/messageService.ts";

interface User {
    username: string
}

function App({username}: { username: string }) {

    const [open, setOpen] = useState<boolean>(false);
    const [notification, setNotification] = useState<string | undefined>(undefined)
    const [messages, setMessages] = useState<MessageResponse[]>([])
    const [openDialog, setOpenDialog] = useState<boolean>(true);
    const [text, setText] = useState('');
    const [activeUsers, setActiveUsers] = useState<User[]>([])
    const [conversation, setConversation] = useState<ConversationResponse | undefined>(undefined)
    const lastMessageRef = useRef(null);

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const messageListRef = useRef<HTMLDivElement>(null);

    const handlers: Record<string, (notification: Record<string, never>) => void> = {
        "NEW_MESSAGE": (notification: Record<string, never>) => {
            const message = notification["data"]["message"];
            if (message["conversationId"] === conversation?.conversationId) {
                setMessages((m) => [...m, message])
                if (lastMessageRef.current) {
                    (lastMessageRef.current as Element).scrollIntoView({behavior: "smooth"});
                }
            } else {
                const conversationType = message["conversationId"] === "global" ? "in global chat" : "in private conversation";
                setNotification(`${message["senderUsername"]}  ${conversationType}: ${message["text"]}`)
                setOpen(true);
            }
        },
        "USER_CONNECTED": (notification: Record<string, never>) => {
            setNotification(`New user joined the app: ${notification["data"]["username"]}`)
            setOpen(true);
        },
        "USER_DISCONNECTED": (notification: Record<string, never>) => {
            setNotification(`${notification["data"]["username"]} disconnected from the app`)
            setOpen(true);
        },
        "NEW_CONVERSATION": (notification: Record<string, never>) => {
            setNotification(`New conversation started with ${notification["data"]["username"]}`)
            setOpen(true);
        }
    }

    const setFilteredActiveUsers = (users: User[]) => {
        setActiveUsers([{username: "Global"}, ...users.filter(u => u.username !== username)]);
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

    const activeUserClickedHandler = (event: CustomEvent) => {
        event.preventDefault();
        console.log(event);
        if (event.detail == "Global") {
            setConversation({
                conversationId: 'global',
                usernameA: "",
                usernameB: "",
            });
            return;
        }

        openConversation({
            usernamesA: username,
            usernamesB: (event as CustomEvent).detail
        }).then(response => {
            const conversation = response.data;
            console.log('Conversation', conversation)
            setConversation(conversation)
        })
    }

    useEffect(() => {
        if (!username) return;

        getActiveUsers().then((res) => {
            setFilteredActiveUsers(res.data);
        });

        setConversation({
            conversationId: 'global',
            usernameA: '',
            usernameB: ''
        });

        // @ts-expect-error just to not be red
        window.removeEventListener("active-user-clicked", activeUserClickedHandler);
        // @ts-expect-error just to not be red
        window.addEventListener("active-user-clicked", activeUserClickedHandler);
    }, [username]);

    useEffect(() => {
        if (conversation === undefined) {
            return
        }

        setPage(0);
        setMessages([]);
        setHasMore(true);

        getMessages(conversation.conversationId, 0).then(
            (response) => {
                const reversed = response.data.reverse();
                setMessages(reversed)
            }
        )

        setTimeout(() => {
            if (lastMessageRef.current) {
                (lastMessageRef.current as Element).scrollIntoView({behavior: 'smooth'});
            }
        }, 100);

    }, [conversation]);

    useEffect(() => {
        const container = messageListRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (container.scrollTop === 0 && !loadingMore && hasMore) {
                setLoadingMore(true);
                const nextPage = page + 1;
                getMessages(conversation!.conversationId, nextPage).then((response) => {
                    const newMessages = response.data.reverse();
                    if (newMessages.length === 0) {
                        setHasMore(false);
                    } else {
                        setMessages(prev => [...newMessages, ...prev]);
                        setPage(nextPage);

                        requestAnimationFrame(() => {
                            container.scrollTop = container.children[0].scrollHeight;
                        });
                    }
                    setLoadingMore(false);
                });
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [conversation, page, hasMore, loadingMore]);

    console.log("PAGE IS", page)
    console.log("MESSAGES", messages)


    const stompClient = useStompClient();

    useSubscription("/topic/messages", (message) => {
        const msgObj: MessageResponse = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, msgObj]);
    });

    useSubscription(`/topic/notifications/${username}`, (notification) => {
        const body = JSON.parse(notification.body) as Record<string, never>;
        console.log(`User ${username} got notification ${notification.body}`)
        if (handlers[body["type"]]) {
            handlers[body["type"]](body);
        } else {
            console.log("No handler for notification", notification);
        }
    })

    useSubscription("/topic/notifications", (notification) => {
        const body = JSON.parse(notification.body) as Record<string, never>;
        if (handlers[body["type"]]) {
            handlers[body["type"]](body);
        } else {
            console.log("No handler for notification", notification);
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
            conversationId: conversation?.conversationId
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


    useEffect(() => {
        console.log("Updated messages:");
        messages.forEach((msg, index) => {
            console.log(`${index}:`, msg);
        });
    }, [messages]);

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
                        <div className="message-list" ref={messageListRef}>
                            {messages.map(({text, senderUsername, timestamp}, index) => index === messages.length - 1 ? (
                                <MessageBubble
                                    ref={index === messages.length - 1 ? lastMessageRef : null}
                                    key={index}
                                    isOwner={senderUsername === username}
                                    value={text}
                                    senderUsername={senderUsername}
                                    timestamp={timestamp}
                                />
                            ) : (
                                <MessageBubble
                                    key={index}
                                    isOwner={senderUsername === username}
                                    value={text}
                                    senderUsername={senderUsername}
                                    timestamp={timestamp}
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
