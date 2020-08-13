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
const {
    newIssueMapper,
    getIssueFromDbResponse,
    hasRequiredFields,
    updateMapper,
    handleUpdateError,
    handleDeleteError,
} = utils;

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
            if (req.body._id) {
                const updateFields = updateMapper(req.body);

                if (updateFields) {
                    try {
                        db.collection(ISSUES_COLLECTION).updateOne(
                            { _id: { $eq: ObjectId(req.body._id) } },
                            updateFields,
                        ).then(r => {
                                if (r.modifiedCount === 1) {
                                    res.send('successfully updated')
                                }
                            },
                            () => handleUpdateError(res, req.body._id),
                        )
                    } catch {
                        handleUpdateError(res, req.body._id)
                    }
                } else {
                    res.send('no updated field sent')
                }
            } else {
                handleUpdateError(res, req.body._id)
            }
        })

        .delete(function (req, res) {
                if (req.body._id) {
                    try {
                        db.collection(ISSUES_COLLECTION).deleteOne(
                            { _id: { $eq: ObjectId(req.body._id) } },
                        ).then(r => {
                                if (r.deletedCount === 1) {
                                    res.send(`deleted ${req.body._id}`)
                                }
                            },
                            () => handleDeleteError(res, req.body._id),
                        )
                    } catch {
                        handleDeleteError(res, req.body._id)
                    }
                } else {
                    res.send('_id error');
                }
            },
        );
};
