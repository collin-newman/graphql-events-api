# graphql-events-api

# types:

Apps:
- appType =
```json
{
  id: { type: GraphQLNonNull(GraphQLString) },
  name: { type: GraphQLNonNull(GraphQLString) },
  events: [eventType],
  stages: [stageType],
}
```
- newAppInput =
```json
{
  name: { type: GraphQLNonNull(GraphQLString) },
}
```

Stages:
- stageType =
```json
{
  id: { type: GraphQLNonNull(GraphQLString) },
  name: { type: GraphQLNonNull(GraphQLString) },
  events: [eventType],
}
```
- newStageInput =
```json
{
  name: { type: GraphQLNonNull(GraphQLString) },
}
```

Events:
- eventType =
```json
{
  id: { type: GraphQLNonNull(GraphQLString) },
  appId: { type: GraphQLNonNull(GraphQLString) },
  stageId: { type: GraphQLNonNull(GraphQLString) },
  name: { type: GraphQLNonNull(GraphQLString) },
  description: { type: GraphQLNonNull(GraphQLString) },
  image: { type: GraphQLNonNull(GraphQLString) },
  startsAt: { type: GraphQLNonNull(GraphQLFloat) },
  endsAt: { type: GraphQLNonNull(GraphQLFloat) },
}
```
- newEventInput =
```json
{
  appId: { type: GraphQLNonNull(GraphQLString) },
  stageId: { type: GraphQLNonNull(GraphQLString) },
  name: { type: GraphQLNonNull(GraphQLString) },
  description: { type: GraphQLNonNull(GraphQLString) },
  image: { type: GraphQLNonNull(GraphQLString) },
  startsAt: { type: GraphQLNonNull(GraphQLString) },
  endsAt: { type: GraphQLNonNull(GraphQLString) },
}
```
- updateEventType =
```json
{
  appId: { type: GraphQLNonNull(GraphQLString) },
  stageId: { type: GraphQLNonNull(GraphQLString) },
  name: { type: GraphQLNonNull(GraphQLString) },
  description: { type: GraphQLNonNull(GraphQLString) },
  image: { type: GraphQLNonNull(GraphQLString) },
  startsAt: { type: GraphQLNonNull(GraphQLString) },
  endsAt: { type: GraphQLNonNull(GraphQLString) },
}
```




Querys:
- app (id: String)
- apps ()
- stage (id: String || name: String)
- stages ()
- event (id: String || name: String)
- events (name: String, &&|| Dates: [String, String])

Mutations
- addApp (app: newAppInput)
- addStage (stage: newStageInput)
- deleteStage (id: String)
- updateStage (id: String, stage: newStageInput)
- addEvent (event: newEventInput)
- updateEvent (id: String, event: updateEventType)
- deleteEvent (id: String)