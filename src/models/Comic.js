
const { Schema, model } = require('mongoose');


const comicSchema = new Schema({

    comicName: {
        type: String,
        required: true,
    },
    comicUrl: {
        type: String,
        required: true,
    },
    previousChapter: {
        type: Number,
        default: 0,
    },
    monitored: {
        type: Number,
        default: 0,
    }

});

module.exports = model('Comic', comicSchema);

