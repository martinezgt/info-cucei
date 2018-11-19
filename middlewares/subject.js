// middleware class for subject error handling

const forbiddenJSON = {
  status: 403,
  response: 'Forbidden', // FIXME un campo con un formato no valido o vacio no es Forbidden
  message: null,
  data: null,
};

// FIXME Todos los metodos deben estar documentados

class subjectM {
  static validateNrc(req, res, next) {
    const test = /^\d+$/;
    try {
      if (req.body.nrc === undefined) {
        next();
      }
      if (test.test(req.body.nrc)) {
        if (Number(req.body.nrc) < 1) {
          forbiddenJSON.message = 'Invalid Nrc';
          res.status(forbiddenJSON.status).send(forbiddenJSON);
        } else {
          next();
        }
      } else {
        forbiddenJSON.message = 'Invalid Nrc';
        res.status(forbiddenJSON.status).send(forbiddenJSON);
      }
    } catch (e) {
      console.log(`error in validate NRC ${e}`);
    }
  }

  static validateNrcP(req, res, next) {
    const test = /^\d+$/;
    try {
      if (req.params.nrc === undefined) {
        forbiddenJSON.message = 'Invalid Nrc';
        res.status(forbiddenJSON.status).send(forbiddenJSON);
      }
      if (test.test(req.params.nrc)) {
        if (Number(req.params.nrc) < 1) {
          forbiddenJSON.message = 'Invalid Nrc';
          res.status(forbiddenJSON.status).send(forbiddenJSON);
        } else {
          next();
        }
      } else {
        forbiddenJSON.message = 'Invalid Nrc';
        res.status(forbiddenJSON.status).send(forbiddenJSON);
      }
    } catch (e) {
      console.log(`error in validate NRC ${e}`);
    }
  }

  static validateName(req, res, next) {
    const test = /^[A-Za-z]+$/;
    try {
      if (req.body.name === undefined) {
        next();
      }
      if (test.test(req.body.name)) {
        next();
      } else {
        forbiddenJSON.message = 'Invalid Name';
        res.status(forbiddenJSON.status).send(forbiddenJSON);
      }
    } catch (e) {
      console.log(`error in validate Name ${e}`);
    }
  }

  static validateFirstDay(req, res, next) {
    const test = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    try {
      if (req.body.first_day === undefined) {
        next();
      }
      if (test.test(req.body.first_day)) {
        next();
      } else {
        forbiddenJSON.message = 'Invalid first_day';
        res.status(forbiddenJSON.status).send(forbiddenJSON);
      }
    } catch (e) {
      console.log(`error in validate first_day ${e}`);
    }
  }

  static validateSecDay(req, res, next) {
    const test = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    try {
      if (req.body.sec_day === undefined) {
        next();
      }
      if (test.test(req.body.sec_day)) {
        const fday = new Date(req.body.first_day);
        const sday = new Date(req.body.sec_day);
        if (fday >= sday) {
          forbiddenJSON.message = 'Invalid dates';
          res.status(forbiddenJSON.status).send(forbiddenJSON);
        } else {
          next();
        }
      } else {
        forbiddenJSON.message = 'Invalid sec_day';
        res.status(forbiddenJSON.status).send(forbiddenJSON);
      }
    } catch (e) {
      console.log(`error in validate second day ${e}`);
    }
  }

  static validateClass(req, res, next) {
    const test = /^\d+$/;
    try {
      if (req.body.classroom === undefined) {
        next();
      }
      if (test.test(req.body.classroom)) {
        if (Number(req.body.classroom) < 1 || Number(req.body.classroom) > 30) {
          forbiddenJSON.message = 'Invalid Classroom';
          res.status(forbiddenJSON.status).send(forbiddenJSON);
        } else {
          next();
        }
      } else {
        forbiddenJSON.message = 'Invalid Classroom';
        res.status(forbiddenJSON.status).send(forbiddenJSON);
      }
    } catch (e) {
      console.log(`error in validate class ${e}`);
    }
  }

  static validateSection(req, res, next) {
    const test = /^D\d\d$/;
    try {
      if (req.body.section === undefined) {
        next();
      }
      if (test.test(req.body.section)) {
        next();
      } else {
        forbiddenJSON.message = 'Invalid Section';
        res.status(forbiddenJSON.status).send(forbiddenJSON);
      }
    } catch (e) {
      console.log(`error in validate section ${e}`);
    }
  }

  static validateCR(req, res, next) {
    const test = /^\d+$/;
    try {
      if (req.body.credits === undefined) {
        next();
      }
      if (test.test(req.body.credits)) {
        if (Number(req.body.credits < 4) || Number(req.body.credits > 30)) {
          forbiddenJSON.message = 'Invalid Credits';
          res.status(forbiddenJSON.status).send(forbiddenJSON);
        } else {
          next();
        }
      } else {
        forbiddenJSON.message = 'Invalid Credits';
        res.status(forbiddenJSON.status).send(forbiddenJSON);
      }
    } catch (e) {
      console.log(`error in validate CR ${e}`);
    }
  }

  static validateBuilding(req, res, next) {
    const test = /^\d+$/;
    try {
      if (req.body.building === undefined) {
        console.log('exiting building middleware');
        next();
      }
      if (test.test(req.body.building)) {
        if (Number(req.body.building < 1) || Number(req.body.building > 40)) {
          forbiddenJSON.message = 'Invalid Building';
          res.status(forbiddenJSON.status).send(forbiddenJSON);
        } else {
          next();
        }
      } else {
        forbiddenJSON.message = 'Invalid Building';
        res.status(forbiddenJSON.status).send(forbiddenJSON);
      }
    } catch (e) {
      console.log(`error in validate building ${e}`);
    }
  }

  static validateTeacher(req, res, next) {
    const test = /^[A-Za-z]+$/;
    try {
      if (req.body.taught_by === undefined) {
        next();
      }
      if (test.test(req.body.taught_by)) {
        if (Number(req.body.taught_by < 1)) {
          forbiddenJSON.message = 'Invalid Teacher';
          res.status(forbiddenJSON.status).send(forbiddenJSON);
        } else {
          next();
        }
      } else {
        forbiddenJSON.message = 'Invalid Teacher';
        res.status(forbiddenJSON.status).send(forbiddenJSON);
      }
    } catch (e) {
      console.log(`error in validate Teacher ${e}`);
    }
  }
}


module.exports = subjectM;
