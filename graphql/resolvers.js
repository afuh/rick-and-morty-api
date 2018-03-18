const Character = require('../models/Character');
const Episode = require('../models/Episode');
const Location = require('../models/Location');

const ITEMS_PER_PAGE = 20;

const getId = url => url.replace(/^\D+/g, '');
const getSkip = page => page * ITEMS_PER_PAGE - ITEMS_PER_PAGE;
const findAndCount = async (model, { page = 1, ...args }) => {
  const skip = getSkip(page);
  const limit = ITEMS_PER_PAGE;

  const { results, count } = await model.findAndCount({ skip, limit, ...args });

  const pages = Math.ceil(count / limit);

  // if the user makes a request that has results,
  // but the page asked doesn't exists, we return the last page
  if (page > pages && count) {
    return findAndCount(model, { page: pages, ...args });
  }

  return {
    count,
    pages,
    results,
    nextPage: page < pages ? page + 1 : null,
    prevPage: count && page > 1 ? page - 1 : null,
  };
};

const resolvers = {
  Query: {
    character(_, { id }) {
      return Character.findOne({ id });
    },
    characters(_, args) {
      return findAndCount(Character, args);
    },
    episode(_, { id }) {
      return Episode.findOne({ id });
    },
    episodes(_, args) {
      return findAndCount(Episode, args);
    },
    location(_, { id }) {
      return Location.findOne({ id });
    },
    locations(_, args) {
      return findAndCount(Location, args);
    },
  },
  Character: {
    episodes({ episode }) {
      const ids = episode.map(getId);

      return Episode.find({ id: { $in: ids } });
    },
    location({ location }) {
      return Location.findOne({ name: location.name });
    },
    origin({ origin }) {
      return Location.findOne({ name: origin.name });
    },
  },
  Episode: {
    characters({ characters }) {
      const ids = characters.map(getId);

      return Character.find({ id: { $in: ids } });
    },
  },
  Location: {
    residents({ residents }) {
      const ids = residents.map(getId);

      return Character.find({ id: { $in: ids } });
    },
  },
};

module.exports = resolvers;
