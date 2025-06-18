import './App.css'
import Sidebar from './compoents/Sidebar.tsx'
import MessageBubble from './compoents/MessageBubble.tsx'
import TextInput from './compoents/TexInput.tsx'

function App() {

    return (
        <div className="app">

            <Sidebar/>

            <div className="app-content">
                <div className="message-list">
                    <MessageBubble isOwner={true}/>
                    <MessageBubble isOwner={true}/>
                    <MessageBubble isOwner={false}/>
                    <MessageBubble isOwner={false}/>
                    <MessageBubble isOwner={true}/>
                    <MessageBubble isOwner={false}/>
                    <MessageBubble isOwner={false}/>
                    <MessageBubble isOwner={true}/>
                    <MessageBubble isOwner={false}/>
                    <MessageBubble isOwner={false}/>
                    <MessageBubble isOwner={true}/>
                    <MessageBubble isOwner={true}/>
                </div>

                <TextInput/>
            </div>


        </div>
    )
}

export default App
