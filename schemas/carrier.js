var mongoose = require("mongoose");
var addressSchema = require("./address");
var Schema = mongoose.Schema;

var carrierSchema = new Schema({
    dotNumber: Number,
    operationTypeCode: String,
    operationClass: String,
    legalName: String,
    alternativeName: String,
    address: addressSchema,
    phone: String,
    numberOfDrivers: Number,
    isAllowedToOperate: Boolean,
    snapshotTimestamp: Number,
    dockets: [{
        docketNumber: Number,
        prefix: String
    }],
    authority: {
        commonAuthorityStatus: String,
        brokerAuthorityStatus: String,
        contractAuthorityStatus: String,
        isAuthorizedForProperty: Boolean,
        isAuthorizedForPassenger: Boolean,
        isAuthorizedForBroker: Boolean,
        isAuthorizedForHouseholdGoods: Boolean
    },
    insurance: {
        isBipdRequired: Boolean,
        bipdRequiredAmount: Number,
        bipdInsuranceOnFile: Number,
        isCargoInsuranceRequired: Boolean,
        cargoInsuranceOnFile: Number,
        isBondInsuranceRequired: Boolean,
        bondInsuranceOnFile: Number
    },
    inspection: {
        numberOfDriverInspectionInPastTwoYears: Number,
        numberOfDriverOutOfServiceInspectionInPastTwoYears: Number,
        rateOfDriverOutOfServiceInPastTwoYears: Number,
        numberOfVehicleInspectionInPastTwoYears: Number,
        numberOfVehicleOutOfServiceInspectionInPastTwoYears: Number,
        rateOfVehicleOutOfServiceInPastTwoYears: Number,
        numberOfHazmatInspectionInPastTwoYears: Number,
        numberOfHazmatOutOfServiceInspectionInPastTwoYears: Number,
        rateOfHazmatOutOfServiceInspectionInPastTwoYears: Number
    },  
    safety: {
        rating: String,
        ratingDate: Date,
        reviewType: String,
        reviewDate: Date,
        numberOfTotalCrash: Number,
        numberOfFatalCrash: Number,
        numberOfInjuryCrash: Number,
        numberOfTowAwayCrash: Number,
        numberOfTotalPowerUnits: Number
    }
});

module.exports = carrierSchema;