var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var uri = 'mongodb://localhost:27017/Lab02';
var db = mongojs(uri, ["Areas"]);

router.get('/m_areas_listado', function(req, res) {
    db.Areas.find().sort({ nombre: 1 }, function(err, records) {
        if (err) {
            console.log('Error al acceder a la base de datos.');
            return;
        }
        res.render('m_areas_listado', { records: records });
    });
});

router.get('/m_areas_nuevo', function(req, res) {
    res.render('m_areas_nuevo', {});
});

router.post('/m_areas_grabar_nuevo', function(req, res) {
    var xnom = req.body['xnom'];

    db.Areas.find().sort({_id: -1}, function(err, records) {
        if (err) {
            console.log('Error al acceder a la base de datos.');
            res.end();
            return;
        }
        var xid = records.length > 0 ? records[0]._id + 1 : 1;
        db.Areas.insert({ _id: xid, nombre: xnom }, function() {
            res.redirect('/m_areas_listado');
        });
    });
});

router.get('/m_areas_editar/:xid', function(req, res) {
    var xid = parseInt(req.params.xid);
    db.Areas.find({ _id: xid }, function(err, records) {
        if (err) {
            console.log('Error al acceder a la base de datos.');
            res.end();
            return;
        }
        res.render('m_areas_editar', { area: records[0] });
    });
});

router.post('/m_areas_grabar_editar', function(req, res) {
    var xid = req.body['xid'] * 1;
    var xnom = req.body['xnom'];

    db.Areas.update({ _id: xid }, { $set: { nombre: xnom } }, function(err) {
        if (err) {
            console.log('Error al actualizar el área.');
            res.end();
            return;
        }
        res.redirect('/m_areas_listado');
    });
});

router.get('/m_areas_eliminar/:xid', function(req, res) {
    var xid = parseInt(req.params.xid);
    db.Areas.remove({ _id: xid }, function() {
        res.redirect('/m_areas_listado');
    });
});

module.exports = router;
