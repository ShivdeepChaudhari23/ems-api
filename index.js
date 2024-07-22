import express from 'express';
import cors from 'cors';
import { adminRouter } from './Routes/AdminRoute.js';
import { loginRouter } from './Routes/Login.js';

const app = express();

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());

app.use('/login', loginRouter);

app.use('/admin', adminRouter);

app.listen(3000, () => {
    console.log('App is running');
});
