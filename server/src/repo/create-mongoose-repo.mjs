const queryTypes = {
  idList: Symbol(),
  id: Symbol(),
  queryObject: Symbol(),
};

const getQueryType = (query) => {
  if (Array.isArray(query) && query.length > 0 && typeof query[0] === "string")
    return queryTypes.idList;
  if (typeof query === "string") return queryTypes.id;
  if (typeof query === "object") return queryTypes.queryObject;
};

const createMongooseRepo = (Model) => {
  const createModel = (entity) => {
    const model = new Model(entity);
    return model.save();
  };

  return {
    create(entities) {
      if (Array.isArray(entities)) {
        return Promise.all(entities.map(createModel));
      }
      return createModel(entities);
    },

    find(query) {
      switch (getQueryType(query)) {
        case queryTypes.id:
          return Model.findById(query).exec();
        case queryTypes.queryObject:
          return Model.find(query).exec();
        case queryTypes.idList:
          return Model.find().where("_id").in(query).exec();
        default:
          return undefined;
      }
    },

    update(query, updates) {
      switch (getQueryType(query)) {
        case queryTypes.id:
          return Model.findByIdAndUpdate(query, updates).exec();
        case queryTypes.queryObject:
          return Model.update(query, updates).exec();
        case queryTypes.idList:
          return Model.updateMany({ _id: { $in: query } }, updates).exec();
        default:
          return undefined;
      }
    },

    del(query) {
      switch (getQueryType(query)) {
        case queryTypes.id:
          return Model.findByIdAndDelete(query).exec();
        case queryTypes.queryObject:
          return Model.deleteMany(query).exec();
        case queryTypes.idList:
          return Model.deleteMany({ _id: { $in: query } }).exec();
        default:
          return undefined;
      }
    },
  };
};

export default createMongooseRepo;
