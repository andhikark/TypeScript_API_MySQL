import express from 'express';
import { Request,Response } from 'express';

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req : Request, res : Response) => {
    res.send('Hello World!');
})

app.post('/', (req : Request, res : Response) => {
    res.send({
        data: req.body
    })
});

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})