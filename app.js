var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    consolidate = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express();

//DB connection string
var connectionString = "postgres://sa:sqluser10$@localhost/recipebookdb";

//Assign Dust Engine to .dust files
app.engine('dust', consolidate.dust);

//Set default Ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


    const { Pool } = require('pg')
    const pool = new Pool({
      connectionString  : connectionString,
    });
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })

app.get('/', function (req, res) {

    // callback - checkout a client
    pool.connect((err, client, done) => {
      if (err) throw err
      client.query('SELECT * FROM recipe', (err, result) => {
        done()
        if (err) {
          console.log(err.stack)
        } else {
          res.render('index', {recipe: result.rows})
        }
      })
    })

});

app.post('/add', function (req, res) {
    pool.connect((err, client, done) => {
      if (err) throw err
      client.query('INSERT INTO recipe(name, ingredients, directions) VALUES($1, $2, $3)', [req.body.recipeName, req.body.ingredients, req.body.directions], (err, result) => {
        done()
        res.redirect('/');
        if (err) {console.log(err.stack)};
      })
    })
  })

  app.delete('/delete/:id', function (req, res) {
    pool.connect((err, client, done) => {
      if (err) throw err
      client.query('DELETE FROM recipe WHERE id=$1', [req.params.id], (err, result) => {
        done()
        res.sendStatus(200);
        if (err) {console.log(err.stack)};
      })
    })
  })

  app.post('/edit', function (req, res) {
    pool.connect((err, client, done) => {
      if (err) throw err
      client.query('UPDATE recipe SET name=$1, ingredients=$2, directions=$3 WHERE id=$4', [req.body.recipeName, req.body.ingredients, req.body.directions, req.body.id], (err, result) => {
        done()
        res.redirect('/');
        if (err) {console.log(err.stack)};
      })
    })
  })

app.listen(3000, function () {
  console.log('Server started on port 3000')
});
