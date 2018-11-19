// FIXME Los atributos usados para documentacion son en minusculas y de estos solo author es valido
/**
 * @Author: schwarze_falke
 * @Date:   2018-10-07T20:34:36-05:00
 * @Last modified by:   schwarze_falke
 * @Last modified time: 2018-10-07T21:56:50-05:00
 */

const { Router } = require('express');

const { buildingCtrl } = require('../controllers');
const middleWares = require('../middlewares');

const router = Router();

/**
 * These is Get methods needing for routes building
 * Get/building
 * Get/building/:buildingId
 */

// this method return all buildings
router.get('/', [middleWares.Auth.haveSession,
  middleWares.Auth.havePermission],
buildingCtrl.getAll);

/**
 * This get method need a middleware for validate
 * if id building is a int and return a building with id specific
 */
router.get('/:buildingId', [(req, res, next) => {
  const request = middleWares.validator.code(req.params.buildingId);
  if (!request) {
    next();
  } else {
    res.send(request);
    console.log(request);
  }
}, middleWares.Auth.haveSession,
middleWares.Auth.havePermission], buildingCtrl.getBuild);

/**
 * This POST method for routes building
 * this method insert data in db
 */
// FIXME Falta middleware para validar el cuerpo del request
router.post('/', [middleWares.Auth.haveSession,
  middleWares.Auth.havePermission],
buildingCtrl.insert);

/**
 * This POST method for routes building
 * this method modify data in db
 */
// FIXME Falta validar el param buildingId
router.put('/:buildingId', [middleWares.Auth.haveSession,
  middleWares.Auth.havePermission],
buildingCtrl.modify);

/**
 * This POST method for routes building
 * this method logic delete data in db
 */
// FIXME Falta validar el param buildingId
router.delete('/:buildingId', [middleWares.Auth.haveSession,
  middleWares.Auth.havePermission],
buildingCtrl.logDel);

module.exports = router;
