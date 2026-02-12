# WhatsAppBotMultiDevice

This WhatsApp bot project allows users to easily perform various actions such as downloading songs, getting lyrics, creating memes, and more. It is built using **Baileys** (for WhatsApp Web API), **Express** (for the web server), and **MongoDB** (for data persistence).

## 📂 Project Structure & Code Explanation

Here is a detailed breakdown of the codebase to help you understand how the bot works.

### 1. **Project Root**
- **`index.js`**: The main entry point of the application.
  - **Sets up an Express server** on port 8000 (default) to serve the QR code page (`/`) and API endpoints (`/send`).
  - **Initializes the WebSocket server** to stream the QR code to the frontend in real-time.
  - **Calls `startSock()`** from `connection.js` to initiate the WhatsApp connection.
  - **Handles graceful shutdowns** to close connections and save metrics.

- **`connection.js`**: Manages the WhatsApp socket connection.
  - Uses `@whiskeysockets/baileys` to connect to WhatsApp.
  - Handles **authentication state** (saving/loading credentials).
  - Implements **reconnection logic** (retries on disconnect).
  - Sets up the event listener loop by calling `events(sock)`.

- **`mongodb.js`**: database connection setup.
  - Connects to your MongoDB instance using the key from `.env`.
  - Ensures necessary collections (like `AuthTable`) exist on startup.

### 2. **Core Functions (`/functions`)**
This directory serves as the "brain" of the bot, containing utility scripts and event handlers.

- **`getEvents.js`**: The central event router.
  - Listens to Baileys events like `messages.upsert` (new messages), `connection.update` (login status), and `group-participants.update`.
  - Routes these events to specific handlers (e.g., passing new messages to `getMessagesEvent.js`).

- **`getMessagesEvent.js`**: The main message processor.
  - **Parses incoming messages**: Checks if they are text, images, buttons, etc.
  - **Detects Commands**: Checks if a message starts with the `PREFIX` (defined in `.env`).
  - **Permission Check**: Verifies if the user is a Public user, Group Member, Admin, or the Bot Owner.
  - **Executes Commands**: specific command handlers loaded from the `commands/` directory.
  - **Spam Protection**: Ignores messages from the bot itself or if the bot is "typing" (debouncing).

- **`getAddCommands.js`**: The command loader.
  - **Dynamically imports** all `.js` files from the `commands/` directory.
  - Categorizes them into `commandsPublic`, `commandsMembers`, `commandsAdmins`, and `commandsOwners`.
  - This allows the bot to easily extend functionality just by adding a new file in the `commands` folder.

- **`fileUtils.js`**, **`memoryUtils.js`**, **`lidUtils.js`**: various helper functions for file handling, memory management, and JID normalization.

### 3. **Commands Directory (`/commands`)**
Contains the actual logic for bot features, organized by permission level:
- **`public/`**: Commands available to everyone (e.g., stickers, lyrics).
- **`group/`**: Commands specific to groups.
  - **`admins/`**: Commands only admins can use (e.g., promote, demur, ban).
  - **`members/`**: Commands for regular group members.
- **`owner/`**: Commands restricted to the bot owner (e.g., broadcast, eval).

**How a Command Works:**
Each command file exports a function that returns an object with:
- `cmd`: An array of command keywords (e.g., `['-help', '-menu']`).
- `handler`: The asynchronous function that executes when the command is called.

### 4. **Scripts (`/scripts`)**
- **`backupDb.js`**: A utility script to backup MongoDB collections (`Members`, `Groups`, `Bot`) to local JSON files in a `backups/` directory.

---

## 🚀 Installation & Setup

For detailed deployment instructions on Docker, Koyeb, Heroku, and Railway, please refer to [DEPLOYMENT.md](DEPLOYMENT.md).

### Prerequisites
1. **Node.js**: Install Node.js (v18 or higher recommended).
2. **MongoDB**: You need a MongoDB connection string (local or Atlas).
3. **FFmpeg**: Required for media processing (stickers, video conversion).

### Setup

1. **Clone your repository:**
   ```bash
   git clone <YOUR-REPO-URL>
   cd WhatsAppBotMultiDevice
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (use `.env.example` as a template).

   ```env
   # Required
   PREFIX=-
   MY_NUMBER=1234567890
   MODERATORS=1234567890
   MONGODB_KEY=mongodb+srv://...

   # Optional (for full features)
   OPENAI_API_KEY=sk-...
   GOOGLE_API_KEY=...
   ```

4. **Start the Bot:**
   ```bash
   npm start
   ```

5. **Scan QR Code:**
   Open `http://localhost:8000` in your browser and scan the QR code with WhatsApp (Linked Devices).

---

## 📜 Commands List

| **Group Commands**  |                      **Explanation**                      |              **Example**               | **Working/Not Working** |
| :-----------------: | :-------------------------------------------------------: | :------------------------------------: | :---------------------: |
|       -alive        |             Check if the bot is online or not             |                `-alive`                |            ✔            |
|       -admin        |                  List of admin commands                   |                `-admin`                |            ✔            |
|       -song        |                  Download a song by name                  |      `-song love me like you do`       |           ❌            |
|         -l          |                   Get lyrics for a song                   | `-l Main woh chaand by darshan raval`  |            ✔            |
|       -delete       |             Delete a message sent by the bot              |               `-delete`                |            ✔            |
|        -joke        |                     Get a random joke                     |                `-joke`                 |            ✔            |
|  -joke categories   |            Get a joke from a specific category            |          `-joke programming`           |            ✔            |
|        -meme        |                     Get a random meme                     |                `-meme`                 |            ✔            |
|       -movie        |              Get a download link for a movie              |           `-movie Avengers`            |           ❌            |
|       -anime        |        Get a quote from an anime character or show        |                `-anime`                |            ✔            |
|     -anime name     | Get a quote from an anime character with a specific name  |         `-anime name Saitama`          |            ✔            |
|    -anime title     |   Get a quote from an anime show with a specific title    |      `-anime title One Punch Man`      |            ✔            |
|      -sticker       |        Create a sticker from different media types        |   `-sticker pack myBitBot author MD`   |            ✔            |
|    -sticker crop    |                   Crop the sticker size                   |            `-sticker crop`             |            ✔            |
|   -sticker author   |                Add metadata to the sticker                |          `-sticker author MD`          |            ✔            |
|    -sticker pack    |                Add metadata to the sticker                |        `-sticker pack myBitBot`        |            ✔            |
| -sticker nometadata |           Remove all metadata from the sticker            |         `-sticker nometadata`          |            ✔            |
|       -steal        |          Send a sticker with the bot's metadata           |                `-steal`                |            ✔            |
|       -toimg        |               Convert a sticker to an image               |                `-toimg`                |            ✔            |
|       -image        |               Convert a sticker to an image               |                `-image`                |            ✔            |
|        -img         |             Search for an image using Google              |            `-img cute cat`             |            ✔            |
|        -mp3         |                 Convert a video to audio                  |                 `-mp3`                 |            ✔            |
|      -mp4audio      |                 Convert a video to audio                  |              `-mp4audio`               |            ✔            |
|       -tomp3        |                 Convert a video to audio                  |                `-tomp3`                |            ✔            |
|        -fact        |                     Get a random fact                     |                `-fact`                 |            ✔            |
|        -news        |                      Show tech news                       |                `-news`                 |            ✔            |
|  -news categories   |            Show news from a specific category             |             `-news sports`             |            ✔            |
|        -list        |            Show a list of categories for news             |                `-list`                 |            ✔            |
|        -idp         | Download the private profile picture of an Instagram user |            `-idp username`             |           ❌            |
|       -insta        |               Download media from Instagram               |          `-insta linkadress`           |            ✔            |
|       -gender       |            Get the gender percentage of a name            |          `-gender FirstName`           |            ✔            |
|         -yt         |       Download a YouTube video in the best quality        |           `-yt youtubelink`            |           ❌            |
|         -vs         |              Search for and download a video              |        `-vs khena galat galat`         |           ❌            |
|        -horo        |    Show your horoscope based on your astrological sign    |             `-horo pisces`             |            ✔            |
|       -advice       |             Get a random advice from the bot              |               `-advice`                |            ✔            |
|       -quote        |              Get a random quote from the bot              |                `-quote`                |            ✔            |
|        -proq        |           Get a programming quote from the bot            |                `-proq`                 |            ✔            |
|      -proquote      |           Get a programming quote from the bot            |              `-proquote`               |           ❌            |
|        -qpt         |              Get a poem written by an author              | `-qpt author Shakespeare title sonnet` |           ❌            |
|     -qpt author     |          Get a poem written by a specific author          |       `-qpt author Shakespeare`        |            ✔            |
|    -qpt authors     |              Get a list of authors for poems              |             `-qpt authors`             |            ✔            |
|      -qpoetry       |              Get a poem written by an author              |               `-qpoetry`               |            ✔            |
|      -removebg      |            Remove the background from an image            |              `-removebg`               |            ✔            |
|        -nsfw        |            Get the NSFW percentage of an image            |                `-nsfw`                 |           ❌            |
|        -tts         |                 Change text to a sticker                  |              `-tts text`               |            ✔            |
|        -text        |            Add a header and footer to an image            |       `-text TopText;BottomText`       |            ✔            |
|         -ud         |                Show the meaning of a name                 |              `-ud Mahesh`              |            ✔            |
|        -dic         |      Get the definition of a word from a dictionary       |              `-dic Love`               |            ✔            |
|      -txtmeme       |            Add a header and footer to an image            |     `-txtmeme TopText;BottomText`      |            ✔            |
|       -source       |                    Get the source code                    |               `-source`                |            ✔            |

<br>

| **Admin Commands** |             **Explanation**             |        **Example**        | **Working/Not Working** |
| :----------------: | :-------------------------------------: | :-----------------------: | :---------------------: |
|        -add        |      Add a new member to the group      |    `-add phone number`    |            ✔            |
|        -ban        |     Kick a member out of the group      |      `-ban @mention`      |            ✔            |
|      -promote      |   Give admin permissions to a member    |    `-promote @mention`    |            ✔            |
|      -demote       | Remove admin permissions from a member  |    `-demote @mention`     |            ✔            |
|      -rename       |       Change the group's subject        |   `-rename new-subject`   |            ✔            |
|      -welcome      |     Set the group's welcome message     |        `-welcome`         |            ✔            |
|       -chat        |      Enable or disable group chat       | `-chat on` or `-chat off` |            ✔            |
|       -link        |          Get the group's link           |          `-link`          |            ✔            |
|       -warn        |       Give a warning to a member        |     `-warn @mention`      |            ✔            |
|      -unwarn       |     Remove a warning from a member      |    `-unwarn @mention`     |            ✔            |
|      -tagall       | Send an attendance alert to all members |     `-tagall message`     |            ✔            |

---

## Deploy on Koyeb.com

To set up Koyeb for this project, follow these steps:

-   Create an account on Koyeb at https://app.koyeb.com/auth/signup.
-   Log in to the Koyeb dashboard and create a new app at https://app.koyeb.com/apps/new.
-   In the 'Deploy' section, choose your preferred deployment method (GitHub or Docker).
-   Set any necessary environment variables.
-   Add the build and run commands: `npm i` and `node index.js`

## Deploy on Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/YOUR_USERNAME/WhatsAppBotMultiDevice)

---

# Note for Developers
This bot is designed to be potentially deployed on serverless or containerized environments. It includes:
- **`memoryUtils.js`**: To monitor and manage heap usage.
- **`performanceMonitor.js`**: To track errors and command usage stats.

We also use **ES Modules** (`import`/`export`) throughout the project.

---
If you enjoyed using this project, please consider giving it a :star: on GitHub. Your support is greatly appreciated! :heart:
