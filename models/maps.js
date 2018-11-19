const db = require('../db');

class mapsMdl{
  constructor({building_id, name, num_class, longitude, latitude, exist}) {
    this.building_id = building_id;
    this.name = name;
    this.num_class = num_class;
    this.longitude = longitude;
    this.latitude = latitude;
    this.exist = exist;
  }

  //Processes result sent by database
  static processResult(data) {
   this.result = [];
   data.forEach((res) => {
     this.result.push(new mapsMdl(res));
   });
   return this.result;
  }

  //request all data in table buildings
  static async get() {
    let condition = '';
    await db.get('building', '*',  condition)
      .then((results) => {
        this.result = mapsMdl.processResult(results);
     })
     .catch(e => console.error(`We have a error!(${e})`));
     return this.result;
  }

}
module.exports = mapsMdl;
