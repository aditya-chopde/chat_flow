# ChatFlow

![ChatFlow Preview](./public/home.png)

ChatFlow is a beautifully designed, feature-rich chat application that offers a modern communication experience with real-time messaging, group chats, and end-to-end encryption for secure and private conversations. Optimized for lightning-fast performance and smooth animations, ChatFlow is the perfect choice for seamless and enjoyable communication.

## Features

- **Real-time Messaging**: Instant messaging with smooth animations and real-time updates.
- **Group Chats**: Create and manage group conversations with ease.
- **Secure & Private**: End-to-end encryption keeps your conversations safe.
- **Lightning Fast**: Optimized performance for a seamless user experience.

## Technologies Used

- Next.js
- React
- Tailwind CSS
- Supabase
- Socket.io
- Radix UI components
- Framer Motion for animations

## Local Setup

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd chat-flow

2. Install frontend dependencies:

   ```bash
   npm install
   ```

   or if you use pnpm:

   ```bash
   pnpm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

   or

   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to:

   ```
   http://localhost:3000
   ```

---

## WebSocket Server Setup (Local)

To run the WebSocket (Socket.IO) server locally, follow these steps. The WebSocket server is located inside the `ws` folder at the root of the project.

1. Navigate to the `ws` directory:

   ```bash
   cd ws
   ```

2. Install server dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
   pnpm install
   ```

3. Start the WebSocket server:

   ```bash
   node index.js
   ```

   or if you're using `nodemon`:

   ```bash
   nodemon index.js
   ```

4. By default, the WebSocket server will run on:

   ```
   http://localhost:4000
   ```

> Make sure this server is running while using the frontend to enable real-time messaging features.

---

## Build and Start for Production

To build and start the project in production mode:

```bash
npm run build
npm start
```

or with pnpm:

```bash
pnpm build
pnpm start
```

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

---
