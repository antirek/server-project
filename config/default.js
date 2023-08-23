require("dotenv").config();

module.exports = {
  apps: {
    web: {
      port: 3000,
    },
  },
  mongodb: `mongodb+srv://eageevets:${process.env.PASSWORD}@cluster0.dbshknz.mongodb.net/?retryWrites=true&w=majority`,
};
