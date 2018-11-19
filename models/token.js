/**
 * @Author: Carlos Vara
 * @Date:   2018-10-11T09:26:08-05:00
 * @Last modified by:   schwarze_falke
 * @Last modified time: 2018-10-27T06:07:01-05:00
 */


const db = require('../db'); // for database handling

class Token {
  constructor(args) {
    this.token = args.token;
    this.created_at = args.created_at;
    this.expires = args.expires;
    this.type = args.type;
    this.active = args.active;
    this.confirmation = args.confirmation;
    this.user_id = args.user_id;
  }

  static async get(token) {
    return new Promise(async (resolve, reject) => {
      const query = `token = '${token}'`;
      await db.get('token', '*', query)
        .then((results) => {
          resolve(results);
        })
        .catch(e => reject(e));
    });
  }

  static async sessionTimeOut(token) {
    const query = `token = ${token}`;
    await db.get('token', 'expires', query)
      .then((result) => {
        this.session = 'VALID';
        if (result.expires < new Date()) {
          Token.destroy(token);
          this.session = 'EXPIRED';
        }
        return this.session;
      })
      .catch(e => console.error(`.catch(${e})`));
  }

  // regresar si esta activo o no, ningun otro dato
  static async active(args) {
    return new Promise(async (resolve, reject) => {
      let query;
      let answer;
      if (args.user) {
        query = `user_id = ${args.user}`;
      } else if (args.token) {
        query = `token = '${args.token}'`;
      }
      console.log(query);
      try {
        await db.get('token', '*', query)
          .then(async (results) => {
            console.log(results);
            if ((typeof results[0] === 'undefined')) {
              answer = 'NON-ACTIVE';
            } else {
              answer = 'ACTIVE';
            }
            await db.get('token', 'confirmation', query)
              .then((result) => {
                if (typeof result[0] === 'undefined') { // this helps to know if the
                  // user has already confirm the email or not
                  resolve('NON-ACTIVE');
                } else if (result[0].confirmation !== null) {
                  answer += ' | PLEASE CONFIRM EMAIL!';
                  resolve(answer);
                } else {
                  resolve(answer);
                }
              })
              .catch((e) => {
                reject(e);
              });
          })
          .catch(e => reject(e));
      } catch (e) {
        console.log(e);
      }
    });
  }

  static async confirmed(token, query) {
    const tok = await db.get('token', 'confirmation', query);
    console.log(tok);
    console.log(tok[0]);
    let answer;
    if (typeof tok[0] === 'undefined') { // this helps to know if the
      // user has already confirm the email or not
      answer = 'NON-ACTIVE';
    } else if (tok[0].confirmation !== null) {
      answer = ' | PLEASE CONFIRM EMAIL!';
    }
    return answer;
  }

  static async create(data) {
    return new Promise(async (resolve, reject) => {
      await db.insert('token', data)
        .then(() => {
          resolve(data.token);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  static async isConfirmed(args) {
    return new Promise(async (resolve, reject) => {
      const query = `token = '${args.token}'`;
      await db.get('token', 'confirmation', query)
        .then((result) => {
          if (result[0].confirmation !== 0) {
            resolve('TRUE');
          } else {
            resolve('FALSE');
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  static async destroy(token) {
    await db.logicalDel('token', `token = '${token}'`)
      .then((result) => {
        if (result.affectedRows === undefined) {
          this.response = 'Cannot end session; token does not exist!';
        } else if (result.affectedRows === 1) {
          this.response = 'Successfully ended session';
        } else {
          this.response = 'Cannot end session; token does not exist!';
        }
        return this.response;
      });
  }

  static async confirm(userCode, code) {
    return new Promise(async (resolve, reject) => {
      await db.update('token', { confirmation: null }, `user_id = ${userCode} && confirmation = ${code}`)
        .then((result) => {
          if (result.affectedRows === 1) {
            this.response = {
              message: 'Account successfully confirmed',
              status: 200,
            };
          } else {
            this.response = {
              message: 'Cannot confirm session; confirmation code is wrong!',
              status: 401,
            };
          }
          resolve(this.response);
        }).catch(err => reject(err));
    });
  }
}

module.exports = Token;
