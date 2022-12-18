const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('history.db');

router.get('/', (req, res, next) => {
    db.serialize(() => {
        db.all("select * from historydata", (err, rows) => {
            if (!err) {
                var data = {
                    title: '履歴情報確認',
                    content: rows
                };
                res.render('index', data);
            }
        });
    });
});

router.get('/add', (req, res, next) => {
    var data = {
        title: '履歴情報追加',
        content: '追加する履歴情報を入力してください'
    }
    res.render('add', data);
});

router.post('/add', (req, res, next) => {
    const hi = req.body.history_id;
    const dt = req.body.date;
    const ui = req.body.user_id;
    const un = req.body.user_name;
    const bn = req.body.book_name;
    const bp = req.body.book_price;
    db.serialize(() => {
        db.run('insert into historydata (history_id, date, user_id, user_name, book_name, book_price) values (?, ?, ?, ?, ?, ?)', hi, dt, ui, un, bn, bp);
    });
    res.redirect('/');
});

router.get('/find', (req, res, next) => {
    db.serialize(() => {
        db.all("select * from historydata", (err, rows) => {
            if (!err) {
                var data = {
                    title: 'ユーザ検索',
                    find: '',
                    content: 'user_idを入力してください',
                    historydata: rows
                };
                res.render('find', data);
            }
        });
    });
});

router.post('/find', (req, res, next) => {
    var find = req.query.find;
    db.serialize(() => {
        var q = "select * from historydata where user_id = ";
        db.get(q + find, (err, rows) => {
            if (!err) {
                var data = {
                    title: 'ユーザ検索',
                    find: find,
                    content: 'user_id: ' + find + 'の検索結果',
                    historydata: rows
                }
                res.render('find', data);
            }
        });
    });
});

module.exports = router;