const db = require('../../config/db');
const Feedback = db.Feedback;

module.exports = {
    getAll,
    getById,
    create,
    update
};

async function create(FeedbackParam) {

    const feedback = new Feedback({
        user: FeedbackParam.user,
        name: FeedbackParam.name,
        email: FeedbackParam.email,
        message: FeedbackParam.message
    });

    // save feedback
    await feedback.save();
}

async function getAll(req, res) {
    const { skip, limit } = req.query;
    return await Feedback
        .find(null, null, { skip: (parseInt(skip)), limit: (parseInt(limit)) })
        // .populate('user')
        // .select('name user')
        .sort('-createdAt');
}

async function getById(id) {
    return await Feedback.findById(id);
}

function update(id, FeedbackParam) {
    return new Promise((resolve, reject) => {
        Feedback.findById(id, function (err, doc) {
            if (err) {
                reject(err)
            } else {
                Object.assign(doc, FeedbackParam);
                doc.save()
                resolve(doc)
            }
        });
    })
}
