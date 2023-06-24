import { Router,Request,Response } from "express";
import mysql from 'mysql';
import bcrypt from 'bcrypt';
import pool from "../config/db.connection";
import generateToken from "../config/token.generate";
import authenticate from "../config/authenticate.token";

const saltround = 10;
const userRouter = Router();

userRouter.get('/', (request: Request, response: Response) => {
    return response.json("ok ");
})


userRouter.get('/details/:id', authenticate, (req : Request, res : Response) => {

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
});

userRouter.post('/register', (req : Request, res : Response) => {

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

        bcrypt.hash(req.body.password, saltround, (error: any, hash: string) => {
            if(error){
                res.send({
                    success: false,
                    statusCode: 500,
                    message : 'Getting error during the connection'
                })
                return;
            }else{
                console.log('line 91');
                console.log(req.body);

                let sqlQuery =  `call registeruser(?,?,?)`;


                //if you got connection 
                conn.query(sqlQuery,[req.body.email,req.body.phone,hash], function(err: any, rows: any) {
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
            }
        });

    });
});

//user login
userRouter.post('/login', (req : Request, res : Response) => {

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

        console.log(req.body);
        pool.query('SELECT password FROM register WHERE email = ?',[req.body.email], function(err: any, rows: any) {
            if(err){
                conn.release();
                return res.send({
                    success: false,
                    statusCode : 400,
                    data : err
                });
            }

            console.log(rows[0].password);
            const hash = rows[0].password;
            // load hash from password DB
            bcrypt.compare(req.body.password, hash, function(err: any, result: any) {
                if(err){
                    res.send({
                        message : 'failed',
                        statusCode: 500,
                        data : err
                    })
                }

                if(result){
                    res.send({
                        message : 'success',
                        statusCode: 200,
                        data : {token : generateToken(req.body.email)}
                    });
                }else{
                    res.send({
                        message: 'failed',
                        statusCode: 500,
                        data:err
                    });
                }
            });

            //close connection 
            conn.release();
        });
        
    })
});

export default userRouter;