/**
 * @Author: schwarze_falke
 * @Date:   2018-10-22T21:03:42-05:00
 * @Last modified by:   schwarze_falke
 * @Last modified time: 2018-10-27T05:42:19-05:00
 */


const mysql = require('mysql');

// FIXME La conexion a la base de datos deberia hacerse solo una vez

/**
  * [DB class used for connection to the Database,
  * the credentials used for accesing are environment variables]
  */

class DB {
  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
  }

  /**
 * [get method used to obtain an array or an object from the database, using the
 * following parameters]
 * @method get
 * @param  {[String]} table     [A string used to represent the table from the database]
 * @param  {[String]} columns   [used to specify the columns to get from a specified table]
 * @param  {[String]} condition [a condition on which the query is to be made]
 * @param  {[String]} order     [the way in which the query is ordered, is passed as a string]
 * @return {[Array]}           [Returns an array of the specified objects
 *                              formed from a table]
 */

  get(table, columns, condition, order) {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    return new Promise((resolve, reject) => {
      // const data = [columns, table];
      try {
        let query = 'SELECT ?? FROM ??'; // avoid logical deleted data
        if (columns === '*') {
          query = 'SELECT * FROM ??';
        } else {
          query = `SELECT ${columns} FROM ??`;
        }
        query += ' WHERE exist = TRUE';
        if (condition) {
          query += ` && ${condition}`;
        }
        if (order) {
          query += order;
        }
        query += ';';
        this.connection.query(query, table, (err, results) => {
          if (err) {
            reject(err);
          }
          this.connection.destroy();
          try {
            resolve(JSON.parse(JSON.stringify(results)));
          } catch (e) {
            reject(e);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * [insert method used for inserting into the database an object,
   * specefied by the following parameters]
   * @method insert
   * @param  {[String]} table     [a string that specefies the table to insert into the database]
   * @param  {[Object]} data      [object that is the model to be inserted into the database]
   * @param  {[String]} condition [string representing the condition on which the
   *                                 object is to be inserted]
   * @return {[Object]}     [returns an array of objects representing the results from the query]
   */

  insert(table, data, condition) {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    return new Promise((resolve, reject) => {
      try {
        let query = 'INSERT INTO ?? SET ?';
        if (condition) {
          query += `WHERE ${condition};`;
        } else { query += ';'; }
        this.connection.query(query, [table, data], (err, results) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          this.connection.destroy();
          try {
            resolve(JSON.parse(JSON.stringify(results)));
          } catch (e) {
            reject(e);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * [update method used for updating an object in the database,
   * specified with the following parameters]
   * @method update
   * @param  {[String]} table     [string that represents the table from the database]
   * @param  {[Object]} data      [object representing the model from the specefied table]
   * @param  {[String]} condition [string that specifies the condition on which
   *                               the update is to be made]
   * @return {[Object]}           [returns an array of objects specified from the
   *                               results obtained from the query]
   */

  update(table, data, condition) {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    return new Promise((resolve, reject) => {
      try {
        let query = 'UPDATE ?? SET ?';
        if (condition) {
          query += ` WHERE ${condition} && exist = 1;`;
        } else {
          query += ';';
        }
        this.connection.query(query, [table, data], (err, results) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          this.connection.destroy();
          try {
            resolve(JSON.parse(JSON.stringify(results)));
          } catch (e) {
            reject(e);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * [physicalDel method used to physically delete an object from the database
   * specified by the following parameters]
   * @method physicalDel
   * @param  {[String]}    table     [string representing a table from the database]
   * @param  {[String]}    condition [string representing the condition on which the
   *                                  elimination is to take place]
   * @return {[Object]}              [returns the results processed from the query]
   */

  physicalDel(table, condition) {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    return new Promise((resolve, reject) => {
      try {
        let query = 'DELETE FROM ??';
        if (condition) {
          query += ` WHERE ${condition};`;
        } else {
          query += ';';
        }
        this.connection.query(query, table, (err, results) => {
          if (err) {
            reject(err);
          }
          this.connection.destroy();
          try {
            resolve(JSON.parse(JSON.stringify(results)));
          } catch (e) {
            reject(e);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * [logicalDel method used to logically delete an object from the database
   * specified by the following parameters]
   * @method logicalDel
   * @param  {[String]}    table     [string representing a table from the database]
   * @param  {[String]}    condition [string representing the condition on which the
   *                                  elimination is to take place]
   * @return {[Object]}              [returns the results processed from the query]
   */

  logicalDel(table, condition) {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    return new Promise((resolve, reject) => {
      try {
        let query = 'UPDATE ?? SET exist = 0';
        if (condition) {
          query += ` WHERE ${condition}`;
        }
        this.connection.query(query, table, (err, results) => {
          if (err) {
            reject(err);
          }
          this.connection.destroy();
          try {
            resolve(JSON.parse(JSON.stringify(results)));
          } catch (e) {
            reject(e);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = new DB();
