const express = require("express");
const expressGraphQL = require("express-graphql");
const schema = require("./schema.js");

const app = express();

app.use("/graphql", expressGraphQL({
  schema: schema,
  graphiql: true
}));

app.listen(7000, () => {
  console.log("The server is running on port 7000");
});