# Boop!
## Startup instructions

### To build docker image, run the following
```docker build -t chat-app .```

### To run the build image, run the following
```docker run -d -p 8080:8080 --name chat-app chat-app```

### Open the app at http://localhost:8080