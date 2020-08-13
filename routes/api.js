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
const utils = require('./utils');
const { newIssueMapper, getIssueFromDbResponse, hasRequiredFields } = utils;

const ISSUES_COLLECTION = "issueTracker.issues";

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
            const body = req.body;
            console.log('called get', project, body);
        })

        .post((req, res) => {
                if (hasRequiredFields(req.body)) {
                    db.collection(ISSUES_COLLECTION).insertOne(
                        newIssueMapper(req.body, req.params.project),
                    ).then(r => res.send(getIssueFromDbResponse(r)));
                } else {
                    res.status(400)
                    res.send('Missing required field(s)')
                }
            },
        )

        .put(function (req, res) {
            const project = req.params.project;

        })

        .delete(function (req, res) {
            const project = req.params.project;

        });


}
;
