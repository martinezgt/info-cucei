/**
 * @Author: schwarze_falke
 * @Date:   2018-10-21T17:36:28-05:00
 * @Last modified by:   schwarze_falke
 * @Last modified time: 2018-10-21T21:09:02-05:00
 */

/**
 * [ResMdl a model used for defining responses]
 */

class ResMdl {
  constructor() {
    this.response = {
      status: null,
      response: null,
      method: null,
      path: null,
      message: null,
      data: null,
    };

    this.codeStatus = {
      200: 'OK',
      201: 'Created',
      204: 'No Content',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      405: 'Method Not Allowed',
      409: 'Conflict',
      500: 'Internal Server Error',
      501: 'Not Implemented',
    };

    this.codeMessage = {
      200: 'Successful request; ',
      201: 'New resource created successfully; ',
      204: 'There is no content in ',
      400: 'Wrong parameters in the request at ',
      401: 'The user must be logged in or sign up to  ',
      403: 'The user is not allowed to ',
      404: 'The path does not exist; ',
      405: 'The user does not have the necessary permissions for ',
      409: 'There are missing fields! ',
      500: 'Oops! Something unexpected just happened, there are overqualified'
      + ' monkeys working in this issue. ',
      501: 'Well, this is not finished yet, but we are working day and night'
      + ' at this:) ',
    };
  }

  /**
   * [createMessage method used for creating responses]
   * @method createMessage
   * @return {String}      [returns a string for the specified response code]
   */

  createMessage() {
    let message = this.codeMessage[this.response.status];
    switch (this.response.method) {
      case 'GET':
        switch (this.response.status) {
          case 200: case 400: case 405:
            message += 'retrieving data. ';
            break;
          case 204:
            message += 'there is nothing in database. ';
            break;
          case 404:
            message += 'it seems we do not have what you are looking for. ';
            break;
          case 409:
            message += 'Please fix that and try again...';
            break;
          default:
            message += 'Unknown';
        }
        break;
      case 'POST':
        switch (this.response.status) {
          case 201:
            message += 'there is a new ';
            break;
          case 400: case 405:
            message += 'creating a new ';
            break;
          case 404:
            message += 'I do not know what are you trying to create. ';
            break;
          case 409:
            message += 'Please fix that and try again...';
            break;
          default:
            message += 'Unknown';
        }
        break;
      case 'PUT': case 'PATCH':
        switch (this.response.status) {
          case 200:
            message += 'updated resource. ';
            break;
          case 400: case 405:
            message += 'updating a new ';
            break;
          case 404:
            message += 'I do not know what are you trying to update. ';
            break;
          case 409:
            message += 'Please fix that and try again...';
            break;
          default:
            message += 'Unknown';
        }
        break;
      case 'DELETE':
        switch (this.response.status) {
          case 200:
            message += 'deleted resource. ';
            break;
          case 404:
            message += 'it seems we do not have what you are looking for. ';
            break;
          case 405:
            message += 'deleting the requested ';
            break;
          default:
            message += 'Unknown';
        }
        break;
      default:
        message += 'UNKOWN!';
    }

    if (this.response.path.includes('users')) {
      message += 'USER | ';
    }
    if (this.response.path.includes('schedule')) {
      message += 'SCHEDULE';
    }
    if (this.response.path.includes('subject')) {
      message += 'SUBJECT';
    }
    if (this.response.path.includes('topics')) {
      message += 'TOPIC';
    }
    if (this.response.path.includes('building')) {
      message += 'BUILDING';
    }
    if (this.response.path.includes('post')) {
      message += 'POST';
    }

    return message;
  }

  /**
 * [createResponse method used for creating a response]
 * @method createResponse
 * @param  {[Object]}     data   [an object that represents the data to be returned]
 * @param  {String}       reason [the reason of the response, a String]
 * @param  {String}       path   [the path of the request]
 * @param  {String}       method [the method used for the request]
 * @return {String}              [returns a string representing the response]
 */

  createResponse(data, reason, path, method) {
    this.response.status = reason;
    this.response.response = this.codeStatus[reason];
    this.response.data = data;
    this.response.path = path;
    this.response.method = method;
  }
}

module.exports = ResMdl;
