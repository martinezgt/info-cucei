/**
 * @Author: schwarze_falke
 * @Date:   2018-10-09T02:37:14-05:00
 * @Last modified by:   schwarze_falke
 * @Last modified time: 2018-10-09T03:55:52-05:00
 */

const db = require('../db'); // for database handling

/**
 * [RoadMdl model used for road objects]
 */

class RoadMdl {
  /**
   * [getBuildings method used to obtain all building objects
   * from the building table in // DEBUG: ]
   * @method getBuildings
   * @param  {String}     column    [specifies the columns to obtain
   *                                from the database]
   * @param  {String}     condition [specifies the condition on which to
   *                                 obtain building objects]
   * @return {Promise}              [returns building objects]
   */

  static async getBuildings(column, condition) {
    return new Promise(async (resolve, reject) => {
      this.information = [];
      await db.get('subject_lists', column, condition)
        .then(async (results) => {
          for (const data of results) {
            this.information.push(await db.get('subject', '*', `nrc = ${data.subject_id}`));
          }
          return resolve(this.information);
        })
        .catch(e => reject(e));
    });
  }

  /**
   * [getRoad method used to obtain roads based on buildings]
   * @method getRoad
   * @param  {[Number]}  data [an array of numbers representing the
   *                          building ids]
   * @return {Promise}      [returns specified roads]
   */

  static async getRoad(data) {
    return new Promise(async (resolve, reject) => {
      this.information = [];
      for(const bld of data) {
        await db.get('building', 'latitude, longitude', `building_id = ${bld[0].building}`)
          .then((result) => {
            this.information.push(result);
          })
          .catch(e => reject(e));
      }
      return resolve(this.information);
    });
  }
}

module.exports = RoadMdl;
