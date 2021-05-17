const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const data = require('../testing/data.js');

const appType = new GraphQLObjectType({
  name: 'app',
  description: 'Details about an app',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
  }),
});

const stageType = new GraphQLObjectType({
  name: 'stage',
  description: 'Details about a stage',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
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

module.exports = schema = new GraphQLSchema({
  query: rootQueryType,
});