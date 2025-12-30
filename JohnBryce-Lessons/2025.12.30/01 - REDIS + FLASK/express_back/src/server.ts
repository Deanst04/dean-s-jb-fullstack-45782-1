import express, { Request, Response } from 'express';
import { createClient } from 'redis';
import cors from 'cors';
// We import axios just in case you need server-to-server calls later, 
// though for this specific flow, React will use axios to call THIS server.
import axios from 'axios'; 

const app = express();
const PORT = 3000;

// --- MIDDLEWARE ---
// 1. CORS: Allows your future React app (usually on port 5173) to talk to this server
app.use(cors()); 
// 2. JSON Parser: Critical for Axios! It lets Express read 'req.body' from JSON requests
app.use(express.json()); 

async function startServer() {
    try {
        // --- REDIS SETUP ---
        
        // Client 1: Publisher & Reader (Standard)
        const redisClient = createClient();
        redisClient.on('error', (err) => console.log('Redis Client Error', err));
        await redisClient.connect();

        // Client 2: Subscriber (Listener)
        const subscriber = redisClient.duplicate();
        await subscriber.connect();

        console.log('✅ Node.js API Ready: Listening for Pub/Sub events...');

        // --- BACKGROUND LISTENER ---
        // Listen to Python (or other sources) and log to console
        await subscriber.subscribe('global_chat', (message) => {
            try {
                const data = JSON.parse(message);
                console.log(`\n🔔 [EVENT RECEIVED] From ${data.from}:`);
                console.log(`   User: ${data.username} | Message: ${data.text}`);
            } catch (err) {
                console.log("Raw message received:", message);
            }
        });

        // --- API ROUTES (JSON ONLY) ---

        // GET: Fetch the current persisted message
        app.get('/api/message', async (req: Request, res: Response) => {
            try {
                const msg = await redisClient.get('class_msg') || '';
                // Respond with JSON for React
                res.json({ 
                    success: true, 
                    currentMessage: msg 
                });
            } catch (error) {
                res.status(500).json({ success: false, error: "Redis Error" });
            }
        });

        // POST: Send a new message (React will call this via Axios)
        app.post('/api/send', async (req: Request, res: Response) => {
            // Destructure data sent by React's Axios
            const { username, message } = req.body;

            if (!username || !message) {
                res.status(400).json({ success: false, error: "Missing username or message" });
                return;
            }

            try {
                // 1. Save to Redis (Persistence)
                await redisClient.set('class_msg', message);

                // 2. Publish event (Real-time)
                const chatPayload = {
                    username: username,
                    text: message,
                    from: 'NodeJS API',
                    timestamp: new Date().toISOString()
                };
                
                await redisClient.publish('global_chat', JSON.stringify(chatPayload));

                console.log(`📤 API sent message from: ${username}`);

                // Return success JSON
                res.json({ success: true, payload: chatPayload });

            } catch (error) {
                res.status(500).json({ success: false, error: "Failed to publish" });
            }
        });

        // Start Server
        app.listen(PORT, () => {
            console.log(`🚀 API Server running on http://localhost:${PORT}`);
            console.log(`👉 Ready for React Axios requests!`);
        });

    } catch (e) {
        console.error('Failed to start server:', e);
    }
}

startServer();