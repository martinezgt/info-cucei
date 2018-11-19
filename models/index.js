/**
 * @Author: schwarze_falke
 * @Date:   2018-09-21T19:37:53-05:00
 * @Last modified by:   schwarze_falke
 * @Last modified time: 2018-10-21T17:37:20-05:00
 */
const ThreadMdl = require('./thread');
const TopicMdl = require('./topic');
const PostMdl = require('./post');
const UserMdl = require('./user');
const Subject = require('./subject');
const ScheduleMdl = require('./schedule');
const BuildingMdl = require('./building');
const MapsMdl = require('./maps');
const RoadMdl = require('./road');
const ResMdl = require('./response');
const TokenMdl = require('./token');
const ResetPassword = require('./resetPass');

module.exports = {
  UserMdl,
  Subject,
  ThreadMdl,
  TopicMdl,
  PostMdl,
  BuildingMdl,
  MapsMdl,
  ScheduleMdl,
  RoadMdl,
  ResMdl,
  TokenMdl,
  ResetPassword,
};
