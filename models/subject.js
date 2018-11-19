/**
 * @author: tyler97
 */

const db = require('../db');
/**
   * [Subject model class used for interaction with subject,
   * and all the querys involving the subject table]
   */
class Subject {
  constructor(args) {
    if (args.nrc !== undefined) {
      this.nrc = args.nrc;
    }
    if (args.name !== undefined) {
      this.name = args.name;
    }
    if (args.first_day !== undefined) {
      this.first_day = args.first_day;
    }
    if (args.sec_day !== undefined) {
      this.sec_day = args.sec_day;
    }
    if (args.classroom !== undefined) {
      this.classroom = args.classroom;
    }
    if (args.section !== undefined) {
      this.section = args.section;
    }
    if (args.credits !== undefined) {
      this.credits = args.credits;
    }
    if (args.building !== undefined) {
      this.building = args.building;
    }
    if (args.exist !== undefined) {
      this.exist = '1';
    }
    if (args.taught_by !== undefined) {
      this.taught_by = args.taught_by;
    }
  }

  /**
   * [processResult description: Processes all the raw data and returns the
   * requested data in a formatted way]
   * @param  {[type]} data [description: the returned data row from database]
   * @return {[type]}      [description: the formatted data]
   */

  static processResult(data) {
    this.result = [];
    data.forEach((res) => {
      this.result.push(new Subject(res));
    });
    return this.result;
  }

  /**
 * [validSubject, this method is used to check
 * and see if a requested subject exists in Database]
 * @method validSubject
 * @param  {Number}     nrc [nrc, is the primary key of subject]
 * @return {Promise}        [returns length of result]
 */

  static async validSubject(nrc) {
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

  /**
 * [getAll method used to obtain all subjects inspect
 * the Database]
 * @method getAll
 * @return {Array} [Array of all the subjects in Database]
 */

  static async getAll() {
    await db.get('subject', ['nrc', 'name', 'first_day', 'sec_day', 'classroom', 'section', 'credits', 'building', 'taught_by'])
      .then((results) => {
        this.result = Subject.processResult(results);
      })
      .catch((e) => {
        throw e;
      });
    return this.result;
  }

  /**
 * [get method used for obtaining subjects, but with specific
 * columns and condition]
 * @method get
 * @param  {[String]}  columns   [columns used in the subject table,
 * with this variable you can specify eaxctly what columns to be returned from query]
 * @param  {[String]}  condition [Specifies the conditions on which to request subjects]
 * @return {Array}           [Array of requested subjects]
 */

  static async get(columns, condition) {
    await db.get('subject', columns, condition)
      .then((results) => {
        this.result = results;
      })
      .catch((e) => {
        throw e;
      });
    return this.result;
  }

  /**
 * [del method used to perform a logical deletion of a specified subject,
 * given a condition]
 * @method del
 * @param  {[String]}  condition [String representing the condition on which the subject
 * is to be logically deleted]
 * @return {Object}           [Returns the response from the database]
 */

  static async del(condition) {
    await db.logicalDel('subject', condition)
      .then((results) => {
        this.result = results;
      })
      .catch((e) => {
        throw e;
      });
    return this.result;
  }

  /**
  * [save method used for saving an instance of the subject model
  * in the database]
  * @method save
  * @return {Promise} [returns results returned from the database]
  */

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

  /**
   * [update method used for updating a subject from the Database
   * on a specified condition which in this case is nrc , and an instance of the subject model]
   * @method update
   * @param  {Number}  nrc [Number representing the primary key nrc of database]
   * @return {Promise}     [returns the results returned from the query performed on the database]
   */

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

  /**
   * [createRelation method used to add a subject to a specified user,
   * basically this method is used to create a schedule]
   * @method createRelation
   * @param  {Number}       userId [Number representing the userId, which is PK of user table]
   * @param  {Number}       nrc    [Number representing nrc from the subject table]
   * @return {Promise}   [returns the results returned from the database when processing the query]
   */

  static async createRelation(userId, nrc) {
    if (await Subject.validSubject(nrc)) {
      const newId = `${userId}${nrc}`;
      const SubjectItem = {
        id: newId,
        exist: 1,
        subject_id: nrc,
        stud_id: userId,
      };
      await db.insert('subject_lists', SubjectItem)
        .then((results) => {
          this.result = results;
          return SubjectItem;
        })
        .catch((e) => {
          throw e;
        });
    }
  }
}

module.exports = Subject;
