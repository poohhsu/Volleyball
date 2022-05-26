const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
// const session = require('express-session');
// const SQLirecordore = require('connect-sqlite3')(session);
const fs = require('fs');

const app = express()
const port = 4114
var db_name = "範例"

app.use(bodyParser.json({ limit: "1mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));
// app.use(session({
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: false,
//     rolling: true,
//     store: new SQLirecordore({
//         db: './database/users.db',
//     }),
//     cookie: {
//         maxAge: 1000 * 60 * 60 * 24,
//     },
// }));

app.listen(process.env.PORT || port, () => {
    console.log(`listening on port: ${port}`);
});

app.use(express.static(`${__dirname}`));

app.get('/', (req, res) => {
    // db.get("SELECT * FROM sessions WHERE sid = ?", req.sessionID, function(err, row) {
    //     if (row == undefined) {
    //         res.redirect('./html/login.html');
    //     } else if (req.session.uid == "admin") {
    //         res.redirect('./html/admin.html');
    //     } else {
    //         res.redirect('./html/index.html');
    //     }
    // })
    res.redirect('./main.html');
});

app.post('/new_game', (req, res) => {
    if (req.body.name == "")
        res.send("請輸入比賽名稱")
    else {
        fs.readdir('./database/', function(err, files) {
            if (err)
                res.send("新增失敗，請稍後再試");
            else if (files.includes(req.body.name + ".db"))
                res.send("此比賽已存在");
            else {
                var db = new sqlite3.Database(`./database/${req.body.name}.db`);
                db.close();
                res.send(["Success", req.body.name])
            };
        });
    }
});

app.post('/game', (req, res) => {
    fs.readdir('./database/', function(err, files) {
        if (err)
            res.send([]);
        res.send(files);
    });
});

app.post('/select_game', (req, res) => {
    db_name = req.body.name;
    res.send(db_name);
});

app.post('/player', (req, res) => {
    var round = "round" + req.body.round
    var db = new sqlite3.Database(`./database/${db_name}.db`);
    db.all(`SELECT DISTINCT player FROM ${round} ORDER BY player`, function(err, row) {
        res.send(row)
    })
    db.close();
});

app.post('/kind', (req, res) => {
    var round = "round" + req.body.round
    var db = new sqlite3.Database(`./database/${db_name}.db`);
    db.all(`SELECT DISTINCT kind FROM ${round} WHERE player = ? ORDER BY kind`, [req.body.player], function(err, row) {
        res.send(row)
    })
    db.close();
});

app.post('/record', (req, res) => {
    var round = "round" + req.body.round
    var db = new sqlite3.Database(`./database/${db_name}.db`);
    db.all(`SELECT DISTINCT choice, count FROM ${round} WHERE player = ? AND kind = ? ORDER BY count`, [req.body.player, req.body.kind], function(err, row) {
        res.send([row, req.body.round, req.body.player, req.body.kind])
    })
    db.close();
});

app.post('/update', (req, res) => {
    if (req.body.round == undefined)
        res.send("請選擇局數")
    else if (req.body.player == "")
        res.send("請輸入選手號碼")
    else if (req.body.choice == undefined)
        res.send("請選擇選項")
    else if (req.body.choice == "")
        res.send("請輸入其他選項")
    else {
        var round = "round" + req.body.round
        var db = new sqlite3.Database(`./database/${db_name}.db`);
        db.run(`CREATE TABLE IF NOT EXISTS ${round} (player INTEGER, kind TEXT, choice TEXT, count INTEGER)`);
        db.get(`SELECT count FROM ${round} WHERE player = ? AND kind = ? AND choice = ?`, [req.body.player, req.body.kind, req.body.choice], function(err, row) {
            if (row == undefined) {
                db.run(`INSERT INTO ${round} (player, kind, choice, count) VALUES (?, ?, ?, ?)`, [req.body.player, req.body.kind, req.body.choice, 1])
            } else
                db.run(`UPDATE ${round} SET count = count + 1 where player = ? AND kind = ? AND choice = ?`, [req.body.player, req.body.kind, req.body.choice])
        })
        res.send(["Success", req.body.round, req.body.player, req.body.kind, req.body.choice])
        db.close();
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.send('jump');
});