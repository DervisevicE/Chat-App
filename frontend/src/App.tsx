import './App.css'
import Sidebar from './compoents/Sidebar.tsx'
import MessageBubble from './compoents/MessageBubble.tsx'
import TextInput from './compoents/TexInput.tsx'
import {StompSessionProvider, useStompClient, useSubscription} from "react-stomp-hooks";
import {useState} from 'react';


function App() {

    const [messages, setMessages] = useState<string[]>([])

    const stompClient = useStompClient();
    useSubscription("/topic/messages", (message) => setMessages((messages) => {
        return [...messages, message.body]
    }));


    function onSend() {
        const message = {
            text:"text"
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

            <Sidebar/>

            <div className="app-content">
                <div className="message-list">
                    {messages.map((message) => {
                        return <MessageBubble isOwner={true} value={message}/>
                    })}

                </div>

                <TextInput onSend={onSend}/>
            </div>


        </div>
    )
}

export default App
