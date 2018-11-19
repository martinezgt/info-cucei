/**
 * @author: brandonmdDiaz
 */

const { Router } = require('express');
// FIXME los controladores se pueden cargar en una sola linea const { threadCtrl, topicCtrl } = require('../controllers');
const { threadCtrl } = require('../controllers');
const { topicCtrl } = require('../controllers');
const { forumMid } = require('../middlewares');
const middleWares = require('../middlewares');

const router = Router();

/**
 * ALL GET methods for the forum
 */

// FIXME para los casos de muchos middlewares, deberia ir uno por linea
router.get('/', [
  forumMid.noEmptySearch,
  middleWares.Auth.haveSession,
  middleWares.Auth.havePermission,],
topicCtrl.getAll);

router.get('/:topicId', [forumMid.validateNumberParams,
  middleWares.Auth.haveSession,
  middleWares.Auth.havePermission],
topicCtrl.get);

router.get('/:topicId/threads', [
  forumMid.noEmptySearch,
  forumMid.validateNumberParams,
  middleWares.Auth.haveSession,
  middleWares.Auth.havePermission],
threadCtrl.getAll);

router.get('/:topicId/threads/:threadId', [
  forumMid.validateNumberParams,
  forumMid.validateNumberParamsThread,
  middleWares.Auth.haveSession,
  middleWares.Auth.havePermission],
threadCtrl.get);

router.get('/:topicId/threads/:threadId/posts', [
  forumMid.noEmptySearch,
  forumMid.validateNumberParams,
  forumMid.validateNumberParamsThread,
  middleWares.Auth.haveSession,
  middleWares.Auth.havePermission],
threadCtrl.getAllPosts);

router.get('/:topicId/threads/:threadId/posts/:postId', [
  forumMid.validateNumberParams,
  forumMid.validateNumberParamsThread,
  forumMid.validateNumberParamsPost,
  middleWares.Auth.haveSession,
  middleWares.Auth.havePermission],
threadCtrl.getPost);

/**
 * ALL POST methods for the forum
 */

router.post('/', [forumMid.noEmptyPostTopic,
  middleWares.Auth.haveSession,
  middleWares.Auth.havePermission],
topicCtrl.create);

router.post('/:topicId/threads', [middleWares.Auth.haveSession,
  forumMid.noEmptyPostThread,
  forumMid.validateNumberParams,
  middleWares.Auth.havePermission],
threadCtrl.create);

router.post('/:topicId/threads/:threadId/posts', [middleWares.Auth.haveSession,
  forumMid.noEmptyPost,
  forumMid.validateNumberParams,
  forumMid.validateNumberParamsThread,
  middleWares.Auth.havePermission],
threadCtrl.createPost);

/**
 * This are all the PUT methods for the forum page.

 * PUT /:topicId
 * PUT /:topicId/threads/:threadId
 * PUT /:topicId/threads/:threadId/posts/:postId

 */

router.put('/:topicId', [forumMid.validateNumberParams,
  forumMid.noEmptyUT,
  middleWares.Auth.havePermission], topicCtrl.modify);
router.put('/:topicId/threads/:threadId', [forumMid.validateNumberParams,
  forumMid.validateNumberParamsThread,
  forumMid.noEmptyUTh,
  middleWares.Auth.havePermission], threadCtrl.modify);
router.put('/:topicId/threads/:threadId/posts/:postId', [forumMid.validateNumberParams,
  forumMid.validateNumberParamsThread,
  forumMid.validateNumberParamsPost,
  forumMid.noEmptyUP,
  middleWares.Auth.havePermission],
threadCtrl.updatePost);

/**
 * delete routes
 * DELETE /:topicId
 * DELETE /:topicId/threads/:threadId
 * DELETE /:topicId/threads/:threadId/posts/:postId
 */

router.delete('/:topicId',
  [forumMid.validateNumberParams,
    middleWares.Auth.havePermission], topicCtrl.deleteAll);
router.delete('/:topicId/threads/:threadId', [forumMid.validateNumberParams,
  forumMid.validateNumberParamsThread,
  middleWares.Auth.havePermission], threadCtrl.delete);
router.delete('/:topicId/threads/:threadId/posts/:postId',
  [forumMid.validateNumberParams,
    forumMid.validateNumberParamsThread,
    forumMid.validateNumberParamsPost,
    middleWares.Auth.havePermission], threadCtrl.deletePost);


module.exports = router;
