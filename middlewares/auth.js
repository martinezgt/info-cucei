/**
 * @author: Todos
*/

const bcrypt = require('bcrypt');
const mailer = require('../mail');
const { UserMdl, TokenMdl, ResMdl } = require('../models'); // for model handling

// FIXME Todos los metodos deben estar documentados

class Auth {
  /**
   * [generateToken description: Generates a token by the given parameters; gets
   * an user object and takes the user name a the user code from it to generate
   * a key for hashing. The type parameters specifies what type of token is it
   * (it can be an authentification token, confirmation token or a recovering
   * token)]
   * @param  {[type]}  user          [The generated user object]
   * @param  {String}  [type='auth'] [Specifies the type of token, by default is auth]
   * @return {Promise}               [returns the generated token and the
   *                                  confirmation code (if exists)]
   */
  static async generateToken(user, type = 'auth') {
    return new Promise(async (resolve, reject) => {
      let usercode;
      // This logical validation evaluates if the object received has a JSON
      // format or a RawPackage format
      if (typeof user[0] === 'undefined') {
        this.key = `${user.name}${user.user_code}ky`;
        usercode = user.user_code;
      } else {
        this.key = `${user[0].name}${new Date()}`;
        usercode = user[0].user_code;
      }
      bcrypt.hash(this.key, process.env.SECRET, (hashErr, hash) => { // The hash is generated
        let expire; // A variable for the expiration date is defined
        let code = null; // A variable for the confirmation code is defined
        const creation = new Date(); // The creation date is defined
        // The type of token is evaluated; a recovering token lasts 5 minutes,
        // a confirmation token lasts 30 minutes, and a normal token lasts 15
        // minutes.
        if (type === 'recover') {
          expire = new Date(creation.getTime() + (5 * 60000));
        } else if (type === 'confirm') {
          expire = new Date(creation.getTime() + (30 * 60000));
          code = Math.floor((Math.random() * 99999) + 1);
        } else {
          expire = new Date(creation.getTime() + (15 * 60000));
        }
        TokenMdl.create({
          token: hash,
          created_at: creation,
          expires: expire,
          type: `${type}`,
          exist: 1,
          confirmation: code,
          user_id: usercode,
        })
          .then(() => resolve({ hash, code }))
          .catch((e) => {
            console.error(`.catch(${hashErr})`);
            reject(e);
          });
      });
    });
  }

  /**
   * [register description: This is a method to make a registration. As it's meant
   * to be, the registration method allows to make a user, save it into database
   * and generates a token (a confirmation token). Also, sends an email with a
   * confirmation code. The user cannot do a single request if the account isn't
   * confirmed. Once he/she confirms the email, can access to the other methods]
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {Promise}       [description]
   */
  static async register(req, res, next) {
    const newResponse = new ResMdl();
    // This validates if there's a previous session, if it's true, don't do nothing
    // (does not register the user)
    if (req.session !== undefined && req.session.token.length > 1) {
      newResponse.createResponse('You already have an account', 400, '/users', 'POST');
      newResponse.response.message = newResponse.createMessage();
      next(res.status(newResponse.response.status).send(newResponse.response));
    }
    try {
      const newUser = new UserMdl({ ...req.body });
      await newUser.save();
      // Then, a confirmation token is generated
      await Auth.generateToken(newUser, 'confirm')
        .then((genToken) => {
          const mailOptions = {
            from: 'cuceiayuda@gmail.com',
            to: `${newUser.email}`,
            subject: 'Confirmation code',
            html: `<p>Hello here! Here is your confirmation code: <b></b>${genToken.code}</p>`,
          };
          mailer.sendMail(mailOptions); // send an email with the confirmation info
          newResponse.createResponse('Successfully sign up', 200, '/users', 'POST');
          newResponse.response.message = 'Please check-out your email to confirm your registration...';
          newResponse.response.token = genToken.hash;
          newResponse.response.user = newUser.user_code;
          next(res.status(newResponse.response.status).send(newResponse.response));
        });
    } catch (e) {
      // If something happens, it will mean that the user already has an account,
      // or there are similar information for a unique values
      newResponse.createResponse(`There is an user with that information ${e}`,
        400, '/users', 'POST');
      newResponse.response.message = newResponse.createMessage();
      next(res.status(newResponse.response.status).send(newResponse.response));
    }
  }

/**
 * [validates the login]
 */
  static validateLogin(req, res, next) {
    if (req.body.user_id === undefined || req.body.password === undefined
      || !(/^\d+$/.test(req.body.user_id))) {
      res.send('Escribe el id o el password');
    } else {
      next();
    }
  }

  /**
   * [login description: This is a method to log-in in the API. It only works if
   * the user already has a confirmed account. If the user is already logged_in,
   * does not do nothing. Unlike, if there is no previous session, creates a
   * common token]
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {Promise}       [description]
   */
  static async login(req, res, next) {
    const newResponse = new ResMdl();
    // This validates if there's a previous session, if it's true, don't do nothing
    // (does not register the user)
    if (req.session !== undefined && req.session.token.length > 1) {
      newResponse.createResponse('Successfully logged in', 201, '/users', 'POST');
      newResponse.response.message = newResponse.createMessage();
      next(res.status(newResponse.response.status).send(newResponse.response));
    }
    // Hash the password
    bcrypt.hash(`${req.body.password}`, process.env.SECRET, (err, hash) => {
      req.body.password = hash;
    });
    // Validates if the user and the password are correct
    const user = await UserMdl.get('*', `${req.body.user_id}`, { password: req.body.password });
    // if the info is not wrong, then generates the data for the token
    if (user[0].user_code !== undefined) {
      const data = {
        user: user[0].user_code,
        token: null,
      };
      await TokenMdl.active(data) // Validates if the token is active
        .then(async (active) => {
          const tokenString = await Auth.generateToken(user); // Save the returned
          // object with the token and confirmation code
          if (active === 'NON-ACTIVE') { // If it's not active, generates a new token
            const response = {
              created_at: new Date(),
              userId: user[0].user_code,
              token: tokenString.hash, // takes only the hash token
            };
            res.send(response);
          } else {
            // if the session is active, does not do nothing
            const response = {
              created_at: new Date(),
              userId: user[0].user_code,
              token: tokenString.hash, // takes only the hash token
            };
            res.send(response);
          }
        })
        .catch(err => console.error(`.catch(${err})`));
    } else {
      // Something goes wrong, surely because of the user
      newResponse.createResponse('Wrong password or user ID', 409, '/users', 'POST');
      newResponse.response.message = newResponse.createMessage();
      console.log('error');
      next(res.status(newResponse.response.status).send(newResponse.response));
    }
  }

  /**
   * [logout description: It's a method to make a logout. Just destroys the
   * token and the active session. Uses the TokenMdl method called "destroy"]
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {Promise}       [description]
   */
  static async logout(req, res, next) {
    const newResponse = new ResMdl();
    if (req.headers.authorization === undefined) {
      newResponse.createResponse('You are not logged in or signed up', 409, '/users', 'POST');
      newResponse.response.message = newResponse.createMessage();
      next(res.status(newResponse.response.status).send(newResponse.response));
    } else {
      const token = Auth.getHeaderToken(req.headers.authorization);
      await TokenMdl.get(token)
        .then(async (result) => {
          if (result === undefined || result.length == 0) {
            newResponse.createResponse('You are not logged in', 409, '/users', 'POST');
            newResponse.response.message = newResponse.createMessage();
            next(res.status(newResponse.response.status).send(newResponse.response));
          } else {
            TokenMdl.destroy(result[0].token);
            newResponse.createResponse('Successfully log-out', 200, '/users', 'POST');
            newResponse.response.message = newResponse.createMessage();
            next(res.status(newResponse.response.status).send(newResponse.response));
          }
        });
    }
  }

  /**
   * [confirm description: Helps to know if the user has already confirm his/her
   * email. Uses the TokenMdl method called "confirm"]
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {Promise}       [description]
   */
  static async confirm(req, res, next) {
    const newResponse = new ResMdl();
    await TokenMdl.confirm(req.body.user_code, req.body.confirmation)
      .then(async (result) => {
        newResponse.createResponse('Email Confirmation', result.status, '/users', 'POST');
        newResponse.response.message = `${result.message}`;
        next(res.status(newResponse.response.status).send(newResponse.response));
      });
  }

  /**
  * validate that the confirm email has the correct body
  */
  static validateRegister(req, res, next) {
    if (req.body.user_code === undefined || !(/^\d+$/.test(req.body.user_code))
       || req.body.confirmation === undefined || req.body.user_code) {
      res.send('Escribe el id o el password');
    } else {
      next();
    }
  }

  /**
 * validate that the confirm email has the correct body
 */
  static validateConfirmEmail(req, res, next) {
    if (req.body.user_code === undefined || !(/^\d+$/.test(req.body.user_code))
       || req.body.confirmation === undefined || req.body.user_code) {
      res.send('Escribe el id o el password');
    } else {
      next();
    }
  }
  /**
   * [haveSession description: This is one of the most fundamentals method of this
   * middleware; allows to know at any time if the session is active. For every
   * request, checks if the token has not expired. If the token has already expired
   * then kills it]
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {Promise}       [description]
   */


  static async haveSession(req, res, next) {
    // this method does not apply to the login, logout, registration and confirmation of email
    if (req.path === '/' || req.path === '/users/login' || req.path === '/users/logout'
      || req.path === '/users/register' || req.path === '/users/confirmEmail'
      || req.path === '/auth/password_reset' || req.path === '/auth/recover/'
    || req.path === '/users/confirmEmail') {
      next();
    } else {
      const newResponse = new ResMdl();
      // If there's no token, then it means the user hasn't log in or sign up
      if (req.headers.authorization === undefined) {
        newResponse.createResponse('You need to log in or sign up', 409, '/users', 'POST');
        newResponse.response.message = newResponse.createMessage();
        next(res.status(newResponse.response.status).send(newResponse.response));
      } else {
        // Checks the headers looking for a token
        const token = Auth.getHeaderToken(req.headers.authorization);
        try {
          // se busca el token
          const tok = await TokenMdl.get(token);
          // si el token no existe manda error.
          if (tok === undefined || tok.length == 0) {
            newResponse.createResponse('You need to log in or sign up', 409, '/users', 'POST');
            newResponse.response.message = newResponse.createMessage();
            next(res.status(newResponse.response.status).send(newResponse.response));
          } else {
            // revisas si esta activo el token
            const active = await TokenMdl.active(tok);
            // si no esta activo se manda respuesta de loggin
            if (active === 'NON-ACTIVE') {
              newResponse.createResponse('You need to log in or sign up', 409, '/users', 'POST');
              newResponse.response.message = newResponse.createMessage();
              next(res.status(newResponse.response.status).send(newResponse.response));
            } else if (Auth.isActive(tok)) { // se revusa su el token esta activo
              req.session = {
                token: tok[0].token,
                user: await UserMdl.get('*', tok[0].user_id),
              };
              next();
            } else {
              newResponse.createResponse('You need to log in or sign up', 409, '/users', 'POST');
              newResponse.response.message = active;
              next(res.status(newResponse.response.status).send(newResponse.response));
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  static async havePermission(req, res, next) {
    const newResponse = new ResMdl();
    if (req.session === undefined || req.session.user === undefined) {
      newResponse.createResponse('You dont have permissions', 401, req.baseUrl, req.method);
      res.status(newResponse.response.status).send(newResponse.response);
    } else {
      const user = new UserMdl(...req.session.user);
      if (await user.canDo(req.method, req.baseUrl, req.params)) {
        next();
      } else {
        newResponse.createResponse('You dont have permissions', 401, req.baseUrl, req.method);
        res.status(newResponse.response.status).send(newResponse.response);
      }
    }
  }

  // checks if the token hasn't expired
  static async isActive(token) {
    const time = new Date();
    const tokenTime = new Date(token[0].expires);
    if (time.getTime() > tokenTime.getTime()) { // if the expiration time is lesser
      // than the current time, it means the token has expired
      await TokenMdl.destroy(token[0].token);
      return false;
    }
    return true;
  }

  static getHeaderToken(bearer) {
    this.bearerToken = bearer.replace('Bearer ', '');
    return this.bearerToken;
  }
}

module.exports = Auth;
