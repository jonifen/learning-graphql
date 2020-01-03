const { GraphQLObjectType, GraphQLSchema, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLList } = require("graphql");
const axios = require("axios");

const VehicleType = new GraphQLObjectType({
  name: "Vehicle",
  fields: () => ({
    id: { type: GraphQLString },
    make: { type: GraphQLString },
    model: { type: GraphQLString },
    style: { type: GraphQLString },
    colour: { type: GraphQLString }
  })
});

const ShowroomRootQuery = new GraphQLObjectType({
  name: "ShowroomRootQuery",
  fields: {
    vehicle: {
      type: VehicleType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(value, args) {
        return axios.get(`http://localhost:3000/vehicles/${args.id}`).then(res => res.data);
      }
    },
    vehicles: {
      type: new GraphQLList(VehicleType),
      args: {
        style: { type: GraphQLString }
      },
      resolve(value, args) {
        return axios.get(`http://localhost:3000/vehicles`)
        .then(res => {
          const vehicles = res.data;
          return vehicles.filter(vehicle => {
            if (vehicle.style === args.style) {
              return vehicle;
            }
          });
        })
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: ShowroomRootQuery
});