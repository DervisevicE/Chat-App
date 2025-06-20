// index.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { StompSessionProvider } from 'react-stomp-hooks';
import { getGeneratedUsername } from './api/services/userService.ts';
import { Typography } from '@mui/material';

const container = document.getElementById('root')!;
const root = createRoot(container);

// Temporary loading screen
root.render(<Typography>Loading...</Typography>);

// Fetch username, then render the app with the provider
getGeneratedUsername().then((response) => {
    const username = response.data;

    root.render(
        <StrictMode>
            <StompSessionProvider
                url="http://localhost:8080/chat"
                connectHeaders={{ username }}
            >
                <App username={username} />
            </StompSessionProvider>
        </StrictMode>
    );
});
