/**
 * @Author: schwarze_falke
 * @Date:   2018-09-20T09:45:40-05:00
 * @Last modified by:   schwarze_falke
 * @Last modified time: 2018-10-07T20:38:59-05:00
 */

const fakers = require('faker');

const models = require('../models');

class Factory {
  constructor() {
    this.fakeUsers = this.fakeUsers.bind(this);
    fakers.locale = 'es_MX';
  }

  fakeUsers(amount) {
    for (let i = 0; i < amount; i += 1) {
      this.data = {
        user_code: fakers.random.number(),
        name: fakers.name.findName(),
        middle_name: fakers.name.findName(),
        flastname: fakers.name.lastName(),
        mlastname: fakers.name.lastName(),
        email: fakers.internet.email(),
        password: fakers.internet.password(),
        privilages: 'USER',
        exist: 1,
      };
      new models.UserMdl(this.data).save();
    }
  }
}

module.exports = new Factory();
