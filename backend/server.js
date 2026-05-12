const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(cors()); 
app.use(express.json()); 

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const db = mysql.createPool(dbConfig);

app.get('/bands', (req, res) => {
    const { country, year, hasSpotify } = req.query;
    let sql="SELECT * FROM nu_metal_list WHERE 1=1";
    let params = [];
    if(country) {
        sql+=" AND country = ?";
        params.push(country);
    }
    if(year) {
        sql+=" AND formed_year != '?' AND formed_year >= ?";
        params.push(year);
    }
    if(hasSpotify) {
        sql+=" AND spotify_link NOT IN ('-', '?', '')";
    }
    sql+= " ORDER BY RAND() LIMIT 1";


    db.query(sql, params, (err,result) => {
        if(err) {
            console.log('Erreur fetch : ', err);
            res.status(500).send('err serveur');
            return;
        }
        res.json(result);
    });

});
app.listen(3000, () => console.log('Server running on port 3000'));
