/**
 * @Author: schwarze_falke
 * @Date:   2018-10-07T23:16:18-05:00
 * @Last modified by:   schwarze_falke
 * @Last modified time: 2018-10-09T02:38:53-05:00
 */

const db = require('../db');

class ScheduleMdl {
  static displaySubjects(data) {
    const result = [];
    data.forEach(async (res) => {
      result.push(await ScheduleMdl.getSubject(res));
    });
    console.log(result);
    return this.result;
  }

  static async getSubject(data) {
    return new Promise(async (resolve, reject) => {
      await db.get('subject', '*', `nrc = ${data.subject_id}`)
        .then((results) => {
          this.result = results;
        })
        .catch(e => reject(e));
      return resolve(this.result);
    });
    return this.result;
  }

  static async validSchedule(nrc) {
    await db.get('subject', 'nrc', `nrc = ${nrc}`)
      .then((results) => {
        this.result = results.length;
      })
      .catch((e) => {
        console.log(e);
      });
    console.log(this.result);
    return this.result;
  }

  static async getAll() {
    await db.get('subject', ['nrc','name','first_day','sec_day','classroom','section','credits','building','exist','taught_by'])
      .then((results) => {
        this.result = Schedule.processResult(results);
      })
      .catch((e) => {
        throw e;
      });
    return this.result;
  }

  static async del(condition) {
    await db.del('subject', condition)
      .then((results) => {
        this.result = results;
      })
      .catch((e) => {
        throw e;
      });
    return this.result;
  }

  async save() {
    await db.insert('subject', this)
      .then((results) => {
        this.result = results;
        return this.result;
      })
      .catch((e) => {
        throw e;
      });
    return this.result;
  }

  async update(nrc) {
    const condition = `nrc = ${nrc}`;
    await db.update('subject', this, condition)
      .then((results) => {
        this.result = results;
        return this.result;
      })
      .catch((e) => {
        throw e;
      });
    return this.result;
  }

  static async get(column, condition) {
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
}

module.exports = ScheduleMdl;
