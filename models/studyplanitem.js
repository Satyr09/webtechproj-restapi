const mongoose = require("mongoose");
const StudyPlan = require("./studyplan");
const Schema = mongoose.Schema;

const studyPlanItemSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title must be specified"]
    },
    status: {
        type: String,
        lowercase:true,
        trim:true,
        required: [true, "Status must be specified"]
    },
    completeBy: {
        type: String,
        required : [true, "Completion date must be specified"]
    },
    inProgressList : {
        type: Array,
        required : [true, "List of members currently pursuing must be provided"]
    },
    completedList : {
        type: Array,
        required : [true, "List of members who have completed must be provided"]
    },
    studyPlanID : {
        type: String,
        required : [true, "ID of Study Plan to which it belongs must be specified"]
    }
})

const StudyPlanItem = mongoose.model("studyPlanItem", studyPlanItemSchema);

module.exports = StudyPlanItem;