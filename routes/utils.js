const R = require('ramda');
const RA = require('ramda-adjunct');
const { path, mapObjIndexed, pipe, keys, intersection, reject, isEmpty, omit } = R;
const { lengthEq } = RA;
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectID;

/**
 *
 * @param { {issue_title, issue_text, created_by, assigned_to, status_text: "open" | "closed", created_on? } } body
 * @param {string} project
 */
const newIssueMapper = (body, project) => {
    return {
        project,
        ...body,
        assigned_to: body.assigned_to || '',
        status_text: body.status_text || '',
        created_on: new Date(),
        updated_on: new Date(),
        open: body.status_text !== "closed",
    }
};
const getIssueFromDbResponse = path(['ops', 0]);

const REQUIRED_FIELDS = ['issue_title', 'issue_text', 'created_by'];
const hasRequiredFields = body => pipe(
    keys,
    intersection(REQUIRED_FIELDS),
    lengthEq(REQUIRED_FIELDS.length),
)(body);

const setOpenStringToBool = mapObjIndexed((val, key) => key === 'open' ? (val !== 'false') : val);
const parseMongoId = mapObjIndexed((val, key) => key === '_id' ?  { $eq: ObjectId(val) } : val);

const parseQueryFields = pipe(
    setOpenStringToBool,
    parseMongoId
)

const getFilledFields = pipe(
    reject(isEmpty),
    setOpenStringToBool,
    omit(['_id']),
);
/**
 *
 * @param { {_id,issue_title, issue_text, created_by, assigned_to, status_text,open } } body
 */
const updateMapper = (body) => {
    const filledFields = getFilledFields(body);

    return !isEmpty(filledFields) && {
        $set: {
            ...filledFields,
            updated_on: new Date(),
        },
    }
};

const handleUpdateError = (res, issueId) => {
    res.send(`could not update ${issueId}`)
}

const handleDeleteError = (res, issueId) => {
    res.send(`could not delete ${issueId}`)
}

module.exports = {
    newIssueMapper,
    getIssueFromDbResponse,
    hasRequiredFields,
    updateMapper,
    handleUpdateError,
    handleDeleteError,
    parseQueryFields,
}
