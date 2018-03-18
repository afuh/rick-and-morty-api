const Character = require('../models/Character');
const Episode = require('../models/Episode');
const Location = require('../models/Location');

const ITEMS_PER_PAGE = 20;

const getId = url => url.replace(/^\D+/g, '');
const getSkip = page => page * ITEMS_PER_PAGE - ITEMS_PER_PAGE;
const findAndCount = async (model, page) => {
  const skip = getSkip(page);
  const limit = ITEMS_PER_PAGE;

  const { results, count } = await model.findAndCount({ skip, limit });

  const pages = Math.ceil(count / limit);

  // if the user requests a page that doesn't exist,
  // we return the last page
  if (!results.length) {
    return findAndCount(model, pages);
  }

  return {
    count,
    pages,
    results,
    nextPage: page < pages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
};

const resolvers = {
  Query: {
    character(_, { id }) {
      return Character.findOne({ id });
    },
    characters(_, { page = 1 }) {
      return findAndCount(Character, page);
    },
    episode(_, { id }) {
      return Episode.findOne({ id });
    },
    episodes(_, { page = 1 }) {
      return findAndCount(Episode, page);
    },
    location(_, { id }) {
      return Location.findOne({ id });
    },
    locations(_, { page = 1 }) {
      return findAndCount(Location, page);
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
