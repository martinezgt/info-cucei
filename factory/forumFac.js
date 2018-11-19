const fakers = require('faker');

const models = require('../models');

class Factory {
  constructor() {
    this.fakeUsers = this.fakeUsers.bind(this);
    fakers.locale = 'es_MX';
  }

  fakeForum(amount) {
    for (let i = 0; i < amount; i += 1) {
      this.topic = {
        name: fakers.lorem.word(),
        descript: fakers.lorem.sentence(),
        exist: 1,
      };
      this.thread = {
        subject: fakers.lorem.sentence(),
        created: fakers.date.past(),
        stud_code: 1,
        topic_id: 1,
        exist: 1,
      };
      this.post = {
        content: fakers.lorem.sentences(),
        date: fakers.date.past(),
        stud_code: 1,
        thread_id: 1,
        exist: 1,
      };
      new models.TopicMdl(this.data).save();
    }
  }
}

module.exports = new Factory();
