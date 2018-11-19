/**
 * @Author: schwarze_falke
 * @Date:   2018-10-07T20:34:36-05:00
 * @Last modified by:   schwarze_falke
 * @Last modified time: 2018-10-07T22:16:29-05:00
 */

const db = require('../db');

/**
 * [BuildingMdl Controller used for buildings]
 */

class BuildingMdl {
  constructor(args) {
    this.building_id = args.building_id;
    this.name = args.name;
    this.num_class = args.num_class;
    this.longitude = args.longitude;
    this.latitude = args.latitude;
    this.exist = args.exist;
  }

  /**
   * [params returns an array the contains the valido
   * column names for the building table]
   * @type {Array}
   */

  static get validColumns() {
    const params = [
      'building_id',
      'name',
      'num_class',
      'latitude',
      'longitude',
      'exist',
    ];
    return params;
  }

  /**
 * [processResult Method used for processing items
 * that are building objects]
 * @method processResult
 * @param  {Array}      data [is an array that represents different
 *                  building objects, normally obtained form the DB]
 * @return {Array}           [An array containing all the building objects
 *                            normally from DB]
 */

  static processResult(data) {
    this.result = [];
    data.forEach((res) => {
      this.result.push(new BuildingMdl(res));
    });
    return this.result;
  }

  /**
   * [validBuilding method used for validating a building id]
   * @method validBuilding
   * @param  {Number}      id [represents a building id]
   * @return {Promise}        [returns diferent then undefined if found]
   */

  static async validBuilding(id) {
    await db.get('building', 'building_id', `building_id = ${id}`)
      .then((results) => {
        this.result = results.length;
      })
      .catch(e => console.error(`We have a error!(${e})`));
    return this.result;
  }

  /**
   * [getAll method used for obtaining all the buildings
   * from the building table from the DB]
   * @method getAll
   * @return {Promise} [Returns an array containing all the building objects]
   */

  static async getAll() {
    const condition = '';
    await db.get('building', '*', condition)
      .then((results) => {
        this.result = BuildingMdl.processResult(results);
      })
      .catch(e => console.error(`We have a error!(${e})`));
    return this.result;
  }

  /**
   * [get Method used to retrieve building form the DB
   * on specified conditions and columns]
   * @method get
   * @param  {[String]}  columns    [A string array the represents the columns from the
   *                                 building table]
   * @param  {Number}  id          [Number representing the id form building]
   * @param  {[String]}  condition [An array of strings that represents the specified conditions
   *                                for obtaining buildings form the building table]
   * @return {Promise}            [returns the specified building or buildings]
   */

  static async get(columns, id, condition) {
    let query = `building_id = ${id}`;
    if (condition) {
      query += condition;
    }
    await db.get('building', columns, query)
      .then((results) => {
        this.result = results;
      })
      .catch(e => console.error(`We have a error!(${e})`));
    return this.result;
  }

  /**
   * [save method used for saving a building object
   * into the building table in the DB]
   * @method save
   * @return {Promise} [if diferent then undefined there were no problems
   *                    saving into the DB]
   */

  async save() {
    console.log(this);
    await db.insert('building', this)
      .then((results) => {
        this.result = results;
        return this.result;
      })
      .catch(e => console.error(`We have a error!(${e})`));
    return this.result;
  }

  /**
   * [update method used for updating a building object
   * from the DB on s specified id]
   * @method update
   * @param  {Number}  id [represents the id of a specified building]
   * @return {Promise}    [if diferent then undefined, signifies it was succesfull]
   */

  async update(id) {
    const condition = `building_id = ${id}`;
    await db.update('building', this, condition)
      .then((results) => {
        this.result = results;
        return this.result;
      })
      .catch(e => console.error(`We have a error!(${e})`));
    return this.result;
  }

  /**
   * [logicalDel method used for deleting a specified building
   * object from the DB logically, it makes exist = 0]
   * @method logicalDel
   * @param  {Number}   id [represents the id of a specified building]
   * @return {Promise}     [if diferent then undefined, signifies it was succesfull]
   */

  async logicalDel(id) {
    const condition = `building_id = ${id}`;
    await db.logicalDel('building', condition)
      .then((results) => {
        this.result = results;
        return this.result;
      })
      .catch(e => console.error(`We have a error!(${e})`));
    return this.result;
  }
}

module.exports = BuildingMdl;
