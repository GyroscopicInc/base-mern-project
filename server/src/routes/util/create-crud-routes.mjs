import express from 'express';
import createMongooseRepo from '../../repo/create-mongoose-repo.mjs';

/**
 * option
 *  baseUrl
 *  create
 *    create many
 *    create one
 *  read
 *    get one by id
 *    get many by ids
 *    get many by query
 *  update
 *    update one by id
 *    update many by ids
 *    update many by query
 *  delete
 *    delete one by id
 *    delete many by ids
 *    delete many by query
 */

const canCreate = ({ include, exclude }) => include.canCreateOne || !exclude.canCreateOne;
const canGetOne = ({ include, exclude }) => include.getOneById || !exclude.getOneById;
const canGetMany = ({ include, exclude }) =>
  include.getManyByIds || include.getManyByQuery || !exclude.getManyById || execlude.getManyByQuery;
const canUpdateOne = ({ include, exclude }) => include.updateOneById || !exclude.updateOneById;
const canUpdateMany = ({ include, exclude }) =>
  include.updateManyIds ||
  include.updateManyByQuery ||
  !exclude.updateManyIds ||
  !exclude.updateManyByQuery;
const canDeleteOne = ({ include, exclude }) => include.deleteOneById || !exclude.deleteOneById;
const canDeleteMany = ({ include, exclude }) =>
  include.deleteManyByIds ||
  include.deleteManyByQuery ||
  !exclude.deleteManyByIds ||
  !exclude.deleteManyByQuery;

const validateId = (id) => {};
const validateBody = (body) => {};

export const createCrudRoutes = (Model, options) => {
  const { baseUrl } = options;
  const repo = createMongooseRepo(Model);

  const router = express.Router;

  if (canGetOne(options)) {
    router.get(baseUrl + '/:id', (req, res) => {
      validateId(req.param.id);
      const entity = repo.get(req.param.id);
      res.send(entity);
    });
  }
  if (canGetMany(options)) {
    router.get(baseUrl, (req, res) => {
      const { ids, query, options } = req.body;
      validateBody(req.body);
      res.send(repo.get(ids ?? query, options));
    });
  }
  if (canCreate(options)) {
    router.post(baseUrl, (req, res) => {
      // TODO: validate create DTO
      res.send(repo.create(req.body));
    });
  }
  if (canUpdateOne(options)) {
    router.update(baseUrl + '/:id', (req, res) => {
      validateId(req.param.id);
      const entity = repo.update(req.param.id);
      res.send(entity);
    });
  }
  if (canUpdateMany(options)) {
    router.update(baseUrl, (req, res) => {
      const { ids, query, options } = req.body;
      validateBody(req.body);
      res.send(repo.update(ids ?? query, options));
    });
  }
  if (canDeleteOne(options)) {
    router.delete(baseUrl + '/:id', (req, res) => {
      validateId(req.param.id);
      const entity = repo.delete(req.param.id);
      res.send(entity);
    });
  }
  if (canDeleteMany(options)) {
    router.delete(baseUrl, (req, res) => {
      const { ids, query, options } = req.body;
      validateBody(req.body);
      res.send(repo.delete(ids ?? query, options));
    });
  }
};
