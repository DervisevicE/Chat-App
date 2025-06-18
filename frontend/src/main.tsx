import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {StompSessionProvider} from "react-stomp-hooks";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <StompSessionProvider
            url={"http://localhost:8080/chat"}
        >
            <App/>
        </StompSessionProvider>
    </StrictMode>,
)
