// FIXME Los atributos usados para documentacion son en minusculas y de estos solo author es valido
/**
 * @Author: schwarze_falke
 * @Date:   2018-10-09T01:15:15-05:00
 * @Last modified by:   schwarze_falke
 * @Last modified time: 2018-10-09T02:00:14-05:00
 */

const badRequestJSON = {
  status: 400,
  response: 'Bad request', // FIXME el status code para un input incorrecto no es 400
  message: null,
  data: null,
};

// FIXME Probably unify the validator for forum, and subject in validator will create a more generic validator for future resources
// FIXME Todos los metodos deben estar documentados

class ForumMid {
  static validateNumberParams(req, res, next) {
    if (req.params.topicId === undefined) {
      badRequestJSON.message = 'topic id undefined';
      res.status(400).send(badRequestJSON);
    } else if (req.params.topicId <= 0 || !(/^\d+$/.test(req.params.topicId))) {
      badRequestJSON.message = 'invalid topic id';
      res.status(400).send(badRequestJSON);
    } else {
      next();
    }
  }

  static validateNumberParamsThread(req, res, next) {
    if (req.params.threadId === undefined) {
      badRequestJSON.message = 'thread id undefined';
      res.status(400).send(badRequestJSON);
    } else if (req.params.threadId <= 0 || !(/^\d+$/.test(req.params.threadId))) {
      badRequestJSON.message = 'invalid thread id';
      res.status(400).send(badRequestJSON);
    } else {
      next();
    }
  }

  static validateNumberParamsPost(req, res, next) {
    if (req.params.postId === undefined) {
      badRequestJSON.message = 'post id undefined';
      res.status(400).send(badRequestJSON);
    } else if (req.params.postId <= 0 || !(/^\d+$/.test(req.params.postId))) {
      badRequestJSON.message = 'invalid post id';
      res.status(400).send(badRequestJSON);
    } else {
      next();
    }
  }

  static noEmptyPostTopic(req, res, next) {
    let empty = 0;
    if (req.body.name === undefined || req.body.descript === undefined) {
      empty = 1;
    }
    for (var i in req.body){
      if (i === 'name' && req.body[i] === '') {
        empty = 1;
      }
      if (i === 'descript' && req.body[i] === '') {
        empty = 1;
      }
    }
    if (empty > 0) {
      badRequestJSON.message = 'dejaste un campo vacio';
      res.status(400).send(badRequestJSON);
    } else {
      next();
    }
  }

  static noEmptyPostThread(req, res, next) {
    let empty = 0;
    if (req.body.subject === undefined || req.body.user_code === undefined) {
      empty = 1;
    }
    for (var i in req.body){
      if (i === 'subject' && req.body[i] === '') {
        badRequestJSON.message = 'b';
        empty = 1;
      }
      if (i === 'user_code' && req.body[i] === '') {
        empty = 1;
      }
    }
    if (empty > 0) {
      badRequestJSON.message += 'dejaste un campo vacio';
      res.status(400).send(badRequestJSON);
    } else {
      next();
    }
  }

  static noEmptyPost(req, res, next) {
    let empty = 0;
    if (req.body.content === undefined || req.body.user_code === undefined) {
      empty = 1;
    }
    for (var i in req.body){
      if (i === 'content' && req.body[i] === '') {
        empty = 1;
      }
      if (i === 'user_code' && req.body[i] === '') {
        empty = 1;
      }
    }
    if (empty > 0) {
      badRequestJSON.message = 'dejaste un campo vacio';
      res.status(400).send(badRequestJSON);
    } else {
      next();
    }
  }

  static noEmptySearch(req, res, next) {
    if (Object.keys(req.query).length > 0) {
      if (req.query.q === '') {
        badRequestJSON.message = 'Letters not allow and numbers equal or below 0';
        res.status(400).send(badRequestJSON);
        return;
      }
      if (req.query.count) {
        if (req.query.count <= 0 || !(/^\d+$/.test(req.query.count))) {
          badRequestJSON.message = 'Letters not allow and numbers equal or below 0';
          res.status(400).send(badRequestJSON);
          return;
        }
      }
      if (req.query.page) {
        if (req.query.page <= 0 || !(/^\d+$/.test(req.query.page))) {
          badRequestJSON.message = 'Letters not allow and numbers equal or below 0';
          res.status(400).send(badRequestJSON);
          return;
        }
      }
      if (req.query.sort) {
        let lower = req.query.sort
        lower = lower.toLowerCase();
        if (lower === 'asc' || lower === 'desc') {
        } else {
          badRequestJSON.message = 'We just accept asc or desc';
          res.status(400).send(badRequestJSON);
        }
      }
      next();
    } else {
      next();
    }
  }

  static noEmptyUT(req, res, next) {
    if (req.body.name === undefined || req.body.descript === undefined) {
      badRequestJSON.message = 'you are missing a field';
      res.status(400).send(badRequestJSON);
    } else {
      next();
    }
  }

  static noEmptyUTh(req, res, next) {
    if (req.body.subject === undefined) {
      badRequestJSON.message = 'you are missing a field';
      res.status(400).send(badRequestJSON);
    } else {
      next();
    }
  }

  static noEmptyUP(req, res, next) {
    if (req.body.content === undefined) {
      badRequestJSON.message = 'you are missing a field';
      res.status(400).send(badRequestJSON);
    } else {
      next();
    }
  }
}

module.exports = ForumMid;
