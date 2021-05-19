const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType,
} = require('graphql');
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const { getAppById, getApps, setApp } = require('../db/app');
const { addEvent, getEventById, getEventByName, updateEvent, getEvents, getEventsInApp, getEventsAtStage, deleteEvent } = require('../db/event');
const { getStageById, getStageByName, getStages, addStage, deleteStage, updateStage } = require('../db/stage');

let data = require('../db/data');

const appType = new GraphQLObjectType({
  name: 'app',
  description: 'Details about an app',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    events: {
      type: new GraphQLList(eventType),
      resolve: async (app) => (await getEventsInApp(app.id)),
    },
    stages: {
      type: new GraphQLList(stageType),
      resolve: async (app) => {
        const events = await getEventsInApp(app.id);
        console.log(events);
        return _.uniqBy(events, 'stageId');
      },
    },
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
      resolve: async (stage) => (await getEventsAtStage(stage.id)),
    }
  }),
});

const newStageInput = new GraphQLInputObjectType({
  name: 'newStageInput',
  description: 'Input a new stage',
  fields: () => ({
    name: { type: GraphQLNonNull(GraphQLString) },
  }),
});

const eventType = new GraphQLObjectType({
  name: 'event',
  description: 'Details about an event',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    appId: { type: GraphQLNonNull(GraphQLString) },
    stageId: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    image: { type: GraphQLNonNull(GraphQLString) },
    startsAt: { type: GraphQLNonNull(GraphQLFloat) },
    endsAt: { type: GraphQLNonNull(GraphQLFloat) },
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

const newEventInput = new GraphQLInputObjectType({
  name: 'newEventInput',
  description: 'New event object definition',
  fields: () => ({
    appId: { type: GraphQLNonNull(GraphQLString) },
    stageId: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    image: { type: GraphQLNonNull(GraphQLString) },
    startsAt: { type: GraphQLNonNull(GraphQLString) },
    endsAt: { type: GraphQLNonNull(GraphQLString) },
  }),
});

const updateEventType = new GraphQLInputObjectType({
  name: 'updateEventType',
  description: 'Update an event',
  fields: () => ({
    appId: { type: GraphQLString },
    stageId: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    image: { type: GraphQLString },
    startsAt: { type: GraphQLString },
    endsAt: { type: GraphQLString },
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
      resolve: async (_parent, args) => {
        console.log('Querying db');
        return await getAppById(args.id);
      },
    },
    apps: {
      type: GraphQLList(appType),
      resolve: async () => (await getApps()),
    },
    stage: {
      type: stageType,
      args: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
      },
      resolve: async (_parent, args) => {
        if (args.id) { return await getStageById(args.id); }
        if (args.name) { return await getStageByName(args.name); }
      },
    },
    stages: {
      type: GraphQLList(stageType),
      resolve: async () => (await getStages()),
    },
    event: {
      type: eventType,
      args: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
      },
      resolve: async (_parent, args) => {
        if (args.id) { return await getEventById(args.id); }
        if (args.name) { return await getEventByName(args.name); }
      },
    },
    events: {
      type: GraphQLList(eventType),
      args: {
        name: { type: GraphQLString },
        dates: { type: new GraphQLList(GraphQLString) }
      },
      resolve: async (_parent, args) => {
        if (args.dates) {
          return await getEvents(args.dates);
        } else {
          return await getEvents();
        }
      },
    },
  },
});

const rootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'root mutation',
  fields: () => ({
    addStage: {
      type: stageType,
      description: 'Add a new stage.',
      args: {
        stage: { type: GraphQLNonNull(newStageInput) },
      },
      resolve: async (_parent, args) => {
        return await addStage(args.stage);
      },
    },
    deleteStage: {
      type: stageType,
      description: 'Delete a stage',
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_parent, args) => (await deleteStage(args.id)),
    },
    updateStage: {
      type: stageType,
      description: 'Update a stage by passing in an id and new stage object',
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        stage: { type: GraphQLNonNull(newStageInput) },
      },
      resolve: async (_parent, args) => (await updateStage(args.id, args.stage)),
    },
    addEvent: {
      type: eventType,
      description: 'Add a new event.',
      args: {
        event: { type: GraphQLNonNull(newEventInput) },
      },
      resolve: async (_parent, args) => {
        const cleanedEvent = {...args.event};
        cleanedEvent.startsAt = new Date(cleanedEvent.startsAt).getTime();
        cleanedEvent.endsAt = new Date(cleanedEvent.endsAt).getTime();
        return await addEvent(cleanedEvent);
      },
    },
    updateEvent: {
      type: eventType,
      description: 'Update a stage by passing in an id and new stage object',
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        event: { type: GraphQLNonNull(updateEventType) },
      },
      resolve: async (_parent, args) => (await updateEvent(args.id, args.event)),
    },
    deleteEvent: {
      type: eventType,
      description: 'Delete an event',
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_parent, args) => (await deleteEvent(args.id)),
    }
  }),
});

module.exports = schema = new GraphQLSchema({
  query: rootQueryType,
  mutation: rootMutationType,
});