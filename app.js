// FIXME Los atributos usados para documentacion son en minusculas y de estos solo author es valido
/**
 * @Author: schwarze_falke
 * @Date:   2018-09-21T19:19:18-05:00
 * @Last modified by:   schwarze_falke
 * @Last modified time: 2018-10-07T20:36:49-05:00
 */
require('dotenv').config();

const express = require('express');

const app = express();

const router = require('./routes');

app.use(router);

app.listen(process.env.PORT, () => console.log(`CUCEI AYUDA IS RUNNING ON PORT ${process.env.PORT}!`));
