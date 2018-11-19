/**
 * @Author: brandonmdiaz
 */
const bcrypt = require('bcrypt');
const { Router } = require('express');
const mailer = require('../mail');
const { ResetPassword } = require('../models');
const { Auth } = require('../middlewares');
const { UserMdl, TokenMdl } = require('../models'); // for model handling

const router = Router();


router.get('/password_reset', (req, res) => {
  const userEmail = req.query.email;
  // validar email.
  if (ResetPassword.validEmail(userEmail)) {
    // revisamos que el usuario exista usando su email
    ResetPassword.findUser(userEmail).then((result) => {
      this.user = result;
      if (this.user === undefined) {
        res.send('error');
      } else {
        // creamos token
        Auth.generateToken(this.user, 'recover').then((results) => {
          const token = results.hash;
          const mailOptions = {
            to: `${userEmail}`,
            subject: 'Reset Password',
            text: `/auth/recover/?q=${token}`,
            html: `<b>Recuperando contraseña, espera un segundo
            /auth/recover/?q=${token} </b>`,
          }; // fin mailOptions
          mailer.sendMail(mailOptions);
          res.send('lo logramos');
        }).catch((e) => {
          console.log(e);
        });
      } // fin else
    }).catch((e) => {
      console.log(e);
    });
  } else {
    res.send('error');
  }
});

router.post('/recover', async (req, res) => {
  try {
    const token = {
      token: req.query.q,
    };
    const tokenStatus = await TokenMdl.active(token);
    if (tokenStatus === 'ACTIVE') {
      // obtenemos el id del usuario
      this.userId = await TokenMdl.get(token);
      this.userId = this.userId[0].user_id;
      // Obtenemos todos los datos del usuario
      let user = await UserMdl.get('*', this.userId);
      // cambiamos el password del usuario
      bcrypt.hash(`${req.body.password}`, process.env.SECRET, (err, hash) => {
        req.body.password = hash;
      });
      console.log(req.body.password);
      user.password = req.body.password;
      // creamos un modelo con todos los datos del usuario
      user = new UserMdl(user);
      // modificamos el usuario
      await user.update(this.userId);// validar esta parte
      res.send('Modificado con exito');
    } else {
      res.send('token no existe');
    }
  } catch (e) {
    res.send(e);
  }
});
module.exports = router;
