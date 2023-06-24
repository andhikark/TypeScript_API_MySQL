import express from 'express';
import { Request,Response } from 'express';
import mysql from 'mysql';

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/details/:id', (req : Request, res : Response) => {

    var pool = mysql.createPool({
        host    : '127.0.0.1',
        user   : 'root',
        password : 'Password@123',
        database : 'sakila',
        connectionLimit : 10,
        multipleStatements : true
    })

    pool.getConnection(function(err: any, conn:any) {
        if(err){
            console.log('entered into error');
            res.send({
                success: false,
                statusCode : 500,
                message : 'Getting error during connection'
            })

            return;
        }

        console.log('The id : ' + req.params.id);

        //if you got connection 
        conn.query('SELECT * FROM actor WHERE actor_id = ?',[req.params.id], function(err: any, rows: any) {
            if(err){
                conn.release();
                return res.send({
                    success: false,
                    statusCode : 400
                });
            }

            //for simplicity just send the rows
            res.send({
                message : 'success',
                statusCode: 200,
                data : rows
            });

            //close connection 
            conn.release();
        });
    });

    res.send({
        message: "Hello World!",
        id: req.params.id,
        name: req.params.name
    });
})

app.post('/Id/:id/Name/:name', (req : Request, res : Response) => {
    res.send({
        data: req.body,
        params: {
            id: req.params.id,
            name: req.params.name
        }
    })
});

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})