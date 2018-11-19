// FIXME Los atributos usados para documentacion son en minusculas y de estos solo author es valido
/**
 * @Author: schwarze_falke
 * @Date:   2018-09-23T22:45:17-05:00
 * @Last modified by:   schwarze_falke
 * @Last modified time: 2018-09-24T10:23:03-05:00
 */

const { Router } = require('express');

// FIXME se pueden cargar los dos controllers en una sola linea
const { mapCtrl } = require('../controllers');
const { buildingCtrl } = require('../controllers');
const middleWares = require('../middlewares');

const router = Router();

/*These is Get methods needing for routes maps
 * Get/map
 * Get/map/building/:buildingId
 */
 //this method return all buildings
router.get('/', mapCtrl.get);

/*this get method need a middleware for validate
 *if id building is a int and return a buildings with id specific
 */
router.get('/building/:buildingId', (req, res, next) => {
    const request = middleWares.validator.code(req.params.buildingId);
    if(!request) {
      next();
    }else {
      res.send(request);
      console.log(request);
    }

},buildingCtrl.getBuild);

//esport routes maps
module.exports = router;
