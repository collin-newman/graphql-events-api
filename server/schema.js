const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');

let data = require('../db/data');

const appType = new GraphQLObjectType({
  name: 'app',
  description: 'Details about an app',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    events: {
      type: new GraphQLList(eventType),
      resolve: (app) => {
        return data.events.filter(event => event.appId === app.id);
      }
    },
    stages: {
      type: new GraphQLList(stageType),
      resolve: (app) => {
        const events = data.events.filter(event => event.appId === app.id);
        return _.uniqBy(events, 'stageId');
      }
    }
  }),
});

const stageType = new GraphQLObjectType({
  name: 'stage',
  description: 'Details about a stage',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    events: {
      type: new GraphQLList(eventType),
      resolve: (stage) => (data.events.filter(event => event.stageId === stage.id)),
    }
  }),
});

const eventType = new GraphQLObjectType({
  name: 'event',
  description: 'Details about an event',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    appid: { type: GraphQLNonNull(GraphQLString) },
    stageId: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    image: { type: GraphQLNonNull(GraphQLString) },
    startsAt: { type: GraphQLNonNull(GraphQLInt) },
    endsAt: { type: GraphQLNonNull(GraphQLInt) },
    app: {
      type: appType,
      resolve: (event) => (data.apps.find(app => app.id === event.appId)),
    },
    stage: {
      type: stageType,
      resolve: (event) => (data.stages.find(stage => stage.id === event.stageId)),
    },
  }),
});

const rootQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    app: {
      type: appType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: (_parent, args) => (data.apps.find(app => app.id === args.id)),
    },
    apps: {
      type: GraphQLList(appType),
      resolve: () => (data.apps),
    },
    stage: {
      type: stageType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: (_parent, args) => (data.stages.find(stage => stage.id === args.id)),
    },
    stages: {
      type: GraphQLList(stageType),
      args: {
        name: { type: GraphQLString },
      },
      resolve: (_parent, args) => {
        if (args.name) {
          return data.stages.filter(stage => stage.name === args.name);
        } else {
          return data.stages;
        }
      },
    },
    event: {
      type: eventType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: (_parent, args) => (data.events.find(event => event.id === args.id)),
    },
    events: {
      type: GraphQLList(eventType),
      args: {
        name: { type: GraphQLString },
        dates: { type: new GraphQLList(GraphQLString) }
      },
      resolve: (_parent, args) => {
        if (args.dates) {
          return data.events.filter(event => {
            const date0 = new Date(args.dates[0]).getTime();
            const date1 = new Date(args.dates[1]).getTime();
            if (date0 <= event.startsAt && date1 >= event.endsAt) {
              if (args.name) {
                if (event.name === args.name) { return event; }
              } else {
                return event;
              }
            }
          });
        } else if (args.name) {
          return data.events.filter(event => event.name === args.name);
        } else {
          return data.events;
        }
      },
    },
  },
});

const rootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "root mutation",
  fields: () => ({
    addEvent: {
      type: eventType,
      description: 'Add a new event.',
      args: {
        appId: { type: GraphQLNonNull(GraphQLString) },
        stageId: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        image: { type: GraphQLNonNull(GraphQLString) },
        startsAt: { type: GraphQLNonNull(GraphQLString) },
        endsAt: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const { appId, stageId, name, description, image } = args;
        const event = {
          id: uuidv4(),
          appId,
          stageId,
          name,
          description,
          image,
          startsAt: new Date(args.startsAt).getTime(),
          endsAt: new Date(args.endsAt).getTime(),
        };

      },
    },
    addStage: {
      type: stageType,
      description: 'Add a new stage.',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {

      },
    },
    deleteEvent: {
      type: eventType,
      description: 'Delete an existing event.',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {

      },
    },
    deleteStage: {
      type: stageType,
      description: 'Delete an existing stage.',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {

      },
    },
    editEvent: {
      type: eventType,
      description: 'Edit an existing event.',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {

      },
    },
    editStage: {
      type: stageType,
      description: 'Edit an existing stage.',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {

      },
    },
  }),
});

module.exports = schema = new GraphQLSchema({
  query: rootQueryType,
  mutation: rootMutationType,
});