const Character = require('../models/Character');
const Episode = require('../models/Episode');
const Location = require('../models/Location');

const ITEMS_PER_PAGE = 20;

const getId = url => url.replace(/^\D+/g, '');
const getSkip = page => page * ITEMS_PER_PAGE - ITEMS_PER_PAGE;

const resolvers = {
  Query: {
    character(_, { id }) {
      return Character.findOne({ id });
    },
    characters(_, { page = 1 }) {
      // TODO: add page information?
      return Character.find()
        .skip(getSkip(page))
        .limit(ITEMS_PER_PAGE)
        .sort('id');
    },
    episode(_, { id }) {
      return Episode.findOne({ id });
    },
    episodes(_, { page = 1 }) {
      // TODO: add page information?
      return Episode.find()
        .skip(getSkip(page))
        .limit(ITEMS_PER_PAGE)
        .sort('id');
    },
    location(_, { id }) {
      return Location.findOne({ id });
    },
    locations(_, { page = 1 }) {
      // TODO: add page information?
      return Location.find()
        .skip(getSkip(page))
        .limit(ITEMS_PER_PAGE)
        .sort('id');
    },
  },
  Character: {
    episodes({ episode }) {
      const ids = episode.map(getId);

      return Episode.find({ id: { $in: ids } });
    },
    location({ location }) {
      if (!location.url) {
        return location;
      }

      return Location.findOne({ name: location.name });
    },
    origin({ origin }) {
      if (!origin.url) {
        return origin;
      }

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
