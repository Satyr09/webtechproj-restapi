const express = require("express");
const studyPlanItemRouter = express.Router();

const StudyPlanItem = require("../models/studyplanitem");
const StudyPlan = require("../models/studyplan");

studyPlanItemRouter.get("/:id", (req, res, next) => {
    console.log(req.params.id, " searching for study plan item");
    StudyPlanItem
        .findOne({ _id: req.params.id })
        .then(data => res.send(data))
        .catch(err => console.error(err));
})

studyPlanItemRouter.post("/", async (req, res, next) => {
    const data = await StudyPlanItem.create({ ...req.body });
    const studyPlan = await StudyPlan.findOne({ _id: req.body.studyPlanID });

    const newStudyPlanItems = studyPlan.studyPlanItems;
    newStudyPlanItems.push(data._id);

    const studyPlanUpdateResult =
        await StudyPlan
            .findOneAndUpdate({ _id: data.studyPlanID }, {studyPlanItems: newStudyPlanItems}, {new:true}, function (err, doc) {
                if (err) return res.send(500, { error: err });
                return res.send(doc);
            })

})

studyPlanItemRouter.put("/", (req,res,next) => {
    const query = { _id : req.body._id};

    const newData = req.body;
    delete newData._id;

    StudyPlanItem.findOneAndUpdate(query,newData, {upsert: true}, function(err, doc) {
        if (err) return res.send(500, {error: err});
        return res.send('Succesfully saved new study plan item.');
    })
})
module.exports = studyPlanItemRouter;