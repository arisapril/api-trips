const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors')
require('dotenv').config()

const connect = mysql.createConnection(process.env.DATABASE_URL)

app.use(bodyParser.json());
app.use(cors())

app.post('/api/login', (req, res) => {
    const email = req.body.email;
    const passwords = req.body.passwords;
    connect.query("select * from user where email = '" + email + "' and passwords = '" + passwords + "'", (error, result) => {
        if (error) {
            res.status(500).send('Error');
        } else {
            if (result.length === 0) {
                res.send('nologin');
            } else {
                res.send(result)
            }
        }
    });
});

app.get('/api/view', (req, res) => {
    connect.query("select * from ticket", (error, result) => {
        if (error) {
            res.status(500).send('Error');
        } else {
            res.send(result);
        }
    });
});

app.put('/api/update', function (req, res, next) {
  connect.query(
    'UPDATE `ticket` SET `trips`= ?, `amount`= ?, `names`= ? WHERE idticket = ?',
    [req.body.trips, req.body.amount, req.body.names, req.body.idticket],
    function(err, results) {
      res.send(results);
    }
  );
})

app.delete('/api/delete/:id', function (req, res, next) {
  const id = req.params.id;
  connect.query(
    'DELETE FROM `ticket` WHERE idticket = ?',
    [id],
    function(err, results) {
      res.json(err);
    }
  );
})

app.post('/api/buy', function (req, res, next) {
  connect.query(
    'INSERT INTO `ticket`(`trips`, `amount`, `names`) VALUES (?, ?, ?)',
    [ req.body.trips, req.body.amount, req.body.names],
    function(err, results) {
      res.send(results);
    }
  );
})

app.listen(5000, () => {
    console.log('Expressjs is port 5000!');
});