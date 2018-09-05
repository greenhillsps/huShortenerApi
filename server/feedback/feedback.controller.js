const db = require('../../_helper/db');
const Feedback = db.Feedback;

module.exports = {
    getAll,
    getById,
    create,
    update,
    // delete: _delete
};

async function create(FeedbackParam) {

    const feedback = new Feedback({
        user : FeedbackParam.user,
        name : FeedbackParam.name,
        email : FeedbackParam.email,
        message : FeedbackParam.message
    });

    // save feedback
    await feedback.save();
}

async function getAll() {
    return await Feedback
    .find()
    .populate('user')
    .select('name user')
    // .sort('-createdAt');
}

async function getById(id) {
    return await Feedback.findById(id);
}

async function update(id, FeedbackParam) {
    const feedback = await Feedback.findById(id);

    // copy FeedbackParam properties to Feedback
    Object.assign(feedback, FeedbackParam);

    await feedback.save();
}