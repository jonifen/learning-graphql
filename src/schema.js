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

const SalesPersonType = new GraphQLObjectType({
  name: "SalesPerson",
  fields: () => ({
    id: { type: GraphQLString },
    forenames: { type: GraphQLString },
    surname: { type: GraphQLString }
  })
});

const SaleType = new GraphQLObjectType({
  name: "Sale",
  fields: () => ({
    id: { type: GraphQLString },
    saleDateTime: { type: GraphQLString },
    salesPersonId: { type: GraphQLString },
    customerId: { type: GraphQLString },
    vehicleId: { type: GraphQLString },
    salePrice: { type: GraphQLInt }
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
    },
    salesperson: {
      type: SalesPersonType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(value, args) {
        return axios.get(`http://localhost:3000/salespersons/${args.id}`).then(res => res.data);
      }
    },
    salespersons: {
      type: new GraphQLList(SalesPersonType),
      resolve(value, args) {
        return axios.get("http://localhost:3000/salespersons").then(res => res.data);
      }
    },
    sale: {
      type: SaleType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(value, args) {
        return axios.get(`http://localhost:3000/sales/${args.id}`).then(res => res.data);
      }
    },
    sales: {
      type: new GraphQLList(SaleType),
      resolve(value, args) {
        return axios.get("http://localhost:3000/sales").then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: ShowroomRootQuery
});