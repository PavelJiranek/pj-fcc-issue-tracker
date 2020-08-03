/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const mongodb = require('mongodb');
const mongo = mongodb.MongoClient;
const ObjectId = require('mongodb').ObjectID;

module.exports = function (app) {
  let db;
  mongo.connect(process.env.MONGO_URI, (err, client) => {
        if (err) {
          console.log("Database error: " + err);
        } else {
          console.log("Successful database connection");
          db = client.db(process.env.MONGO_DB);
        }
      },
  );

  app.route('/api/issues/:project')

      .get(function (req, res) {
        const project = req.params.project;
        console.log('called get', project)
      })

      .post(function (req, res) {
        const project = req.params.project;
        console.log('called post', project)
      })

      .put(function (req, res) {
        const project = req.params.project;

      })

      .delete(function (req, res) {
        const project = req.params.project;

      });


};
