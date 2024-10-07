var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var uri = 'mongodb://localhost:27017/Lab02';  // Ajusta la URI según tu base de datos
var db = mongojs(uri, ["Proyectos"]);

// Listar todos los proyectos
router.get('/m_proyectos_listado', function(req, res) {
    db.Proyectos.find().sort({ nombre: 1 }, function(err, records) {
        if (err) {
            console.log('Error al acceder a la base de datos.');
            return;
        }
        res.render('m_proyectos_listado', { records: records });
    });
});

// Mostrar formulario para crear un nuevo proyecto
router.get('/m_proyectos_nuevo', function(req, res) {
    res.render('m_proyectos_nuevo', {});
});

// Grabar un nuevo proyecto
router.post('/m_proyectos_grabar_nuevo', function(req, res) {
    var xnom = req.body['xnom'];
    var xdesc = req.body['xdesc']; // Ejemplo de descripción del proyecto

    db.Proyectos.find().sort({_id: -1}, function(err, records) {
        if (err) {
            console.log('Error al acceder a la base de datos.');
            res.end();
            return;
        }
        var xid = records.length > 0 ? records[0]._id + 1 : 1;
        db.Proyectos.insert({ _id: xid, nombre: xnom, descripcion: xdesc }, function() {
            res.redirect('/m_proyectos_listado');
        });
    });
});

// Editar un proyecto
router.get('/m_proyectos_editar/:xid', function(req, res) {
    var xid = parseInt(req.params.xid);
    db.Proyectos.find({ _id: xid }, function(err, records) {
        if (err) {
            console.log('Error al acceder a la base de datos.');
            res.end();
            return;
        }
        res.render('m_proyectos_editar', { proyecto: records[0] });
    });
});

// Grabar edición del proyecto
router.post('/m_proyectos_grabar_editar', function(req, res) {
    var xid = req.body['xid'] * 1;
    var xnom = req.body['xnom'];
    var xdesc = req.body['xdesc'];

    db.Proyectos.update({ _id: xid }, { $set: { nombre: xnom, descripcion: xdesc } }, function(err) {
        if (err) {
            console.log('Error al actualizar el proyecto.');
            res.end();
            return;
        }
        res.redirect('/m_proyectos_listado');
    });
});

// Eliminar proyecto
router.get('/m_proyectos_eliminar/:xid', function(req, res) {
    var xid = parseInt(req.params.xid);
    db.Proyectos.remove({ _id: xid }, function() {
        res.redirect('/m_proyectos_listado');
    });
});

module.exports = router;
