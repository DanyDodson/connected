const mongoose = require('mongoose')

const EmailSchema = new mongoose.Schema({
    to: String,
    from: String,
    subject: String,
    text: { type: String, optional: true },
    html: { type: String, optional: true },
    userId: { type: String, optional: true },
    jobId: String,
    type: { type: String, optional: true },
    status: String,
    created: { type: Date, autoValue: createdAtAutoValue },
    updated: { type: Date, autoValue: updatedAtAutoValue, optional: true },
})

// ------------------------------------------------------
// check color inputs

EmailSchema.methods.checkHex = function (hex) {
    const hexRegex = /^[#]*([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i
    if (hexRegex.test(hex)) {
        return true;
    }
}

EmailSchema.methods.checkRgb = function (rgb) {
    const rgbRegex = /([R][G][B][A]?[(]\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])(\s*,\s*((0\.[0-9]{1})|(1\.0)|(1)))?[)])/i
    if (rgbRegex.test(rgb)) {
        return true
    }
}

// ------------------------------------------------------
// parse functions

EmailSchema.methods.modifyHex = function (hex) {
    if (hex.length == 4) {
        hex = hex.replace('#', '');
    }
    if (hex.length == 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    return hex;
}

// ------------------------------------------------------
// converting functions

EmailSchema.methods.hexToRgb = function (hex) {
    let x = [];
    hex = hex.replace('#', '')
    if (hex.length != 6) {
        hex = modifyHex(hex)
    }
    x.push(parseInt(hex.slice(0, 2), 16))
    x.push(parseInt(hex.slice(2, 4), 16))
    x.push(parseInt(hex.slice(4, 6), 16))
    return "rgb(" + x.toString() + ")"
}

EmailSchema.methods.rgbToHex = function (rgb) {
    let y = rgb.match(/\d+/g).map(function (x) {
        return parseInt(x).toString(16).padStart(2, '0')
    });
    return y.join('').toUpperCase()
}

// ------------------------------------------------------
// Helper Functions

EmailSchema.methods.addPound = function (x) {
    return '#' + x;
}

mongoose.model('Email', EmailSchema)
