const R = require('ramda');
const RA = require('ramda-adjunct');
const { path, pipe, keys, intersection } = R;
const { lengthEq } = RA;

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
)(body)

module.exports = {
    newIssueMapper,
    getIssueFromDbResponse,
    hasRequiredFields,
}