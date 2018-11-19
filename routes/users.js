// FIXME Los atributos usados para documentacion son en minusculas y de estos solo author es valido
/**
 * @Author: root
 * @Date:   2018-09-18T09:45:53-05:00
 * @Last modified by:   schwarze_falke
 * @Last modified time: 2018-10-27T04:06:52-05:00
 */

const { Router } = require('express');

const middleWares = require('../middlewares');

const { usersCtrl } = require('../controllers');

const userFaker = require('../factory');

const router = Router();

/**
 The next block code reffers to all GET methods of USERS resource, which
 includes the next resources:
 GET /users
 GET /users/userId
 GET /users/userId/routes
 GET /users/userId/schedule
 GET /users/userId/posts
*/

router.post('/register', middleWares.Auth.register);

router.post('/confirmEmail', middleWares.Auth.validateLogin, middleWares.Auth.confirm);

router.post('/login', middleWares.Auth.validateLogin, middleWares.Auth.login);

router.get('/logout', middleWares.Auth.logout);

// FIXME Falta un middleware para validar que el param :amount sea un numero valido
router.get('/fakeData/:amount', (req, res) => {
  userFaker.fakeUsers(req.params.amount);
  res.send('Ok');
});

/**
 * GET users/
 * @type {Array} Return all users from database
 */
router.get('/', [middleWares.Auth.haveSession,
  middleWares.Auth.havePermission],
usersCtrl.getAll);

/**
 * GET users/userId
 * @type {Object} Returns a specific user through its identifier
 */
router.get('/:userId', [middleWares.Auth.haveSession,
  middleWares.Auth.havePermission,
  (req, res, next) => {
    const request = middleWares.validator.code(req.params.userId);
    if (!request) {
      next();
    } else { res.send(request); console.log(request); }
  }],
usersCtrl.getUser);

/**
 * GET users/userId/routes
 * @type {Array} Returns all routes from a specific user through its identifier
 * "start" and "end" attributes reffers to a starting point and an ending point
 */
// FIXME Falta un middleware para validar que el param :userId
router.get('/:userId/roads', [middleWares.Auth.haveSession,
  middleWares.Auth.havePermission],
usersCtrl.getRoads);

/**
 * GET users/userId/schedule
 * @type {Object} Returns the schedule's identifier from an specific user
 */
// FIXME Falta un middleware para validar que el param :userId
router.get('/:userId/schedule', [middleWares.Auth.haveSession,
  middleWares.Auth.havePermission],
usersCtrl.getSchedule);

/**
 * GET users/userId/posts
 * @type {Array} Returns all publications by the given user
 */
// FIXME Falta un middleware para validar que el param :userId es un
// identificador valido, ejem: un numero en cierto rango
router.get('/:userId/posts', [middleWares.Auth.haveSession,
  middleWares.Auth.havePermission],
usersCtrl.getPosts);

/**
 * The next block code reffers to all modification methods of USERS resource,
 * which includes the next resources:
 * POST /users
 * PUT /users
 * DELETE /users
 */

/**
 * POST /users
 * @type {Object} Create a new user by given name, middle name, last name, email
 * and a password. Returns an ok response.
 */
// FIXME Falta un middleware para validar que el cuerpo del request
router.post('/', middleWares.Auth.register);

// FIXME Falta un middleware para validar que el cuerpo del request
// FIXME Falta un middleware para validar que el param :userId es un
// identificador valido, ejem: un numero en cierto rango
router.post('/:userId/schedule', [middleWares.Auth.haveSession,
  middleWares.Auth.havePermission],
usersCtrl.insertSchedule);

// FIXME Falta un middleware para validar que el cuerpo del request
// FIXME Falta un middleware para validar que el param :userId es un
// identificador valido, ejem: un numero en cierto rango
router.put('/:userId', [middleWares.Auth.haveSession,
  middleWares.Auth.havePermission],
usersCtrl.updatePUT);

router.patch('/:userId', [middleWares.Auth.haveSession,
  middleWares.Auth.havePermission],
usersCtrl.updatePATCH);

// FIXME Falta un middleware para validar que el param :userId es un
// identificador valido, ejem: un numero en cierto rango
router.delete('/:userId', [middleWares.Auth.haveSession,
  middleWares.Auth.havePermission],
usersCtrl.del);

module.exports = router;
