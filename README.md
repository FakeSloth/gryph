# gryph [![Build Status](https://travis-ci.org/FakeSloth/gryph.svg?branch=master)](https://travis-ci.org/FakeSloth/gryph) [![Dependency Status](https://david-dm.org/FakeSloth/gryph.svg)](https://david-dm.org/FakeSloth/gryph) [![devDependency Status](https://david-dm.org/FakeSloth/gryph/dev-status.svg)](https://david-dm.org/FakeSloth/gryph#info=devDependencies)

A music and video streaming chat application.

Built with React and Redux on the client and Node.js and Socket.io on the server.

**See it in action: [https://gryph.herokuapp.com](https://gryph.herokuapp.com/)**

## Quick Start

```bash
$ git clone https://github.com/FakeSloth/gryph.git
$ cd gryph && npm install
$ npm start
```

## Project Structure
```
.
├── client/
│   ├── actions/                # Action creators that allow to trigger a dispatch to stores
│   ├── components/             # React Components
│   │   ├── About.js            # About Page
│   │   ├── App.js              # App Component that contains navigation and children routes
│   │   ├── Chat.js             # Contains MessageList and MessageInput
│   │   ├── MessageInput.js     # Chat Message Input
│   │   ├── Message.js          # Individual Message
│   │   ├── MessageList.js      # List of Messages
│   │   ├── Player.js           # Contains Video, VideoInput, and WaitList
│   │   ├── PlaylistInput.js    # Search videos in playlist tab
│   │   ├── PlaylistSelect.js   # Select playlists to add or remove
│   │   ├── PlaylistVideos.js   # List of playlist videos or search videos
│   │   ├── UserList.js         # List of users
│   │   ├── VideoInput.js       # Add a video input
│   │   ├── Video.js            # YouTube Video Player
│   │   └── WaitList.js         # Join/Leave WaitList for selecting playlists for the queue
│   ├── constants/              # Client-side React and Redux Constants
│   │   ├── ActionTypes.js      # Types of actions to be dispatch
│   │   ├── chooseName.js       # Choose name states
│   │   └── waitList.js         # Wait list states
│   ├── containers/             # Data Aware Components
│   │   ├── Home.js             # Home Page
│   │   ├── Name.js             # Choose name top right navigation with authentication forms
│   │   ├── Navigation.js       # Top navigation bar
│   │   ├── Playlists.js        # Playlists Page
│   │   └── Root.js             # Top level component for listening to sockets, store, and mounting the router
│   ├── reducers/               # Pure functions that change state
│   │   ├── index.js            # Combine all reducers to create a main reducer
│   │   ├── messages.js         # List of messages
│   │   ├── name.js             # Username and user list
│   │   ├── player.js           # Video player and wait list
│   │   └── playlists.js        # Playlists and search videos
│   └── store/                  # Application state tree
│   ├── index.js                # Client-side startup script
├── public/                     # Static css, js, fonts, imgs files
├── server/
│   ├── commands/               # Chat Commands
│   ├── events/                 # Socket events
│   ├── routes/                 # Server routes
│   │   ├── auth.js             # Check if a user is registered/authenticated
│   │   ├── index.js            # Home index (/) page
│   │   ├── login.js            # Login user
│   │   ├── playlists.js        # Saving playlists
│   │   ├── register.js         # Register user
│   │   └── search.js           # Search videos
│   └── views/                  # Route views
│   ├── config.js               # Server application settings
│   ├── db.js                   # Database configurations
│   ├── escapeHtml.js           # Escape HTML helper
│   ├── index.js                # Server-side startup script
│   ├── parser.js               # Chat and command parser
│   ├── sockets.js              # Handle socket interactions
│   ├── users.js                # Handle user object
├── test/                       # Tests
├── hashColor.js                # User name color hashes
├── package.json                # The list of 3rd party libraries and utilities
└── webpack.config.js           # Configurations for client-side and server-side bundles
```

## Scripts

```
# runs eslint on client and server files
$ npm run lint

# Test chat commands
$ npm run test:commands

# Test server routes
$ npm run test:server

# Run all three above
$ npm test

# Creates bundle.js
$ npm run build
```

## License

[MIT](LICENSE)
