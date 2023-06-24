import express ,{ Request,Response } from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql';
import routes from './routes';
dotenv.config();


const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(routes);


app.get('/details/:id', (req : Request, res : Response) => {

    var pool = mysql.createPool({
        host    : process.env.HOST,
        user   : process.env.USER,
        password : process.env.PASSWORD,
        database : process.env.DATABASE,
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

    // res.send({
    //     message: "Hello World!",
    //     id: req.params.id,
    //     name: req.params.name
    // });
})

app.post('/register', (req : Request, res : Response) => {

    var pool = mysql.createPool({
        host    : process.env.HOST,
        user   : process.env.USER,
        password : process.env.PASSWORD,
        database : process.env.DATABASE,
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

        console.log('line 91');
        console.log(req.body);

        let sqlQuery =  `call registeruser(?,?,?)`;


        //if you got connection 
        conn.query(sqlQuery,[req.body.email,req.body.phone,req.body.password], function(err: any, rows: any) {
            if(err){
                conn.release();
                return res.send({
                    success: false,
                    statusCode : 400
                });
            }

            console.log('line 103');
             console.log(req.body);

            //for simplicity just send the rows
            res.send({
                message : 'success',
                statusCode: 200,
                // data : rows
            });

            //close connection 
            conn.release();
        });
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

app.listen(process.env.PORT, () => {
    console.log(`The application is listening on port ${process.env.PORT}`);
})