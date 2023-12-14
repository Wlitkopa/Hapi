
const { Double, Decimal128 } = require('mongodb');
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
        type: Decimal128,
        default: 1,
    },
    monitored: {
        type: Number,
        default: 1,
    }

});

module.exports = model('Comic', comicSchema);

