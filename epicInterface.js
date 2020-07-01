const axios = require('axios');
const Patient = require('./Patient.js');
const LabObservation = require('./LabObservation.js');
const SmokingHistory = require('./smokingHistory');
const Procedure = require('./Procedure.js')
const fs = require('fs')



// Lines 3-12 are to kept in a separate file, as they are the utilities required to interface with Epic. 
let token = "18yIZVXdgurIuaZEyy5AhPGe0IdkeSp_NFNn14MvmpgNfutrfWqlMzKs3L1xi3y1-Jj4T63yG-PaObmepXa-zmtmf7kzDNRKeOnZDCcLDw-bCZj7JUuASg2u7PImdidk"; // Need to automate this.
const baseURL = "https://uscdi.epic.com/interconnect-uscdi-oauth/api/FHIR/DSTU2" // Going to be same for all the endpoints


Headers = {
    'Accept': 'Application/json',
    'Authorization':
        `Bearer ${token}`
}


const instance = axios.create({
    baseURL: 'https://uscdi.epic.com/interconnect-uscdi-oauth/api/FHIR/DSTU2',
    timeout: 1000,
    headers: Headers
});

async function getData(path) {
    try {
        const response = await instance.request(path);
        console.log(response.status + " " + response.statusText)
        data = response.data

        return data;
    } catch (error) {
        console.error(error);
    }
}


async function getPatientData(params) {
    console.log('Hello!')
    //parameters = []
    let path = `/Patient?`;
    for (parameter in params) {
        path += `${parameter}=${params[parameter]}&`
    }

    path = path.substring(0, path.length - 1);
    console.log(path);



    console.log('Fetching Patient')
    data = await getData(path);

    console.log('Fetched Patient')
    //Process the data
    console.log(`Number of patients fetched= ${data['total']}`);


    Patients = []
    for (let i = 0; i < data['entry'].length; i++) {
        curr_patient = data['entry'][i]["resource"];
        name = curr_patient['name'][0]['text'];
        gender = curr_patient['gender'];
        birthdate = curr_patient['birthDate'];
        race = curr_patient['extension'][0]["valueCodeableConcept"]['text']
        id = curr_patient['id'];
        Patients.push(new Patient(name, gender, birthdate, race, id));
    }
    return Patients;

};








//getPatientData({ '_id': "T81lum-5p6QvDR7l6hv7lfE52bAbA2ylWBnv9CZEzNb0B" });
// To be implemented in the test file
async function getPatientsTest(id) {

    let Patient = await getPatientData({ '_id': id }); // Change the parent function to send patient object when ID is the input parameter.

    console.log(Patient[0])

}
//getPatientsTest("T81lum-5p6QvDR7l6hv7lfE52bAbA2ylWBnv9CZEzNb0B");

async function getObservation(params) {

    path = '/Observation?'
    for (parameter in params) {
        path += `${parameter}=${params[parameter]}&`
    }

    path = path.substring(0, path.length - 1);
    console.log(path);

    data = await getData(path);
    console.log('Number of records fetched ' + data['total'])

    observations = [];
    for (let i = 0; i < data['entry'].length; i++) {
        currObs = data['entry'][i]['resource']

        id = currObs['id']
        status = currObs['status'];
        name = currObs["code"]["text"];
        value = currObs["valueQuantity"]["value"];
        code = ""
        if (currObs["code"]["coding"] !== undefined) {
            code = currObs["code"]["coding"][0]["code"];
        }
        effectiveDateTime = currObs["effectiveDateTime"]



        observations.push(new LabObservation(id, name, status, value, code, effectiveDateTime));
    }

    return observations;

}



async function getSmokingHistory(params) {
    path = '/Observation?'
    for (parameter in params) {
        path += `${parameter}=${params[parameter]}&`
    }

    path = path.substring(0, path.length - 1);
    console.log(path);

    data = await getData(path);
    console.log('Number of records fetched ' + data['total'])

    smokingHistory = []


    for (let i = 0; i < data['entry'].length; i++) {
        curr = data['entry'][i]['resource']
        id = curr['id']
        name = curr["category"]["coding"][0]["display"]
        issued = curr["issued"]
        effectivePeriod = curr["effectivePeriod"]["end"]
        histCode = curr["code"]["coding"][0]["code"]
        histText = curr["code"]["coding"][0]["display"]
        code = curr["valueCodeableConcept"]["coding"][0]["code"]
        text = curr["valueCodeableConcept"]["text"]
        status = curr["status"]

        smokingHistory.push(new SmokingHistory(id, name, issued, histCode, histText, effectivePeriod, code, text, status))
    }

    return smokingHistory

}


async function getObservationsTest(currPatient, category) {
    if (category === "laboratory") {
        labEvents = await getObservation({ "patient": currPatient, "category": category });


    }

    else if (category === "social-history") {
        history = await getSmokingHistory({ "patient": currPatient, "category": category });
    }


}


//getObservationsTest("erXuFYUfucBZaryVksYEcMg3", "laboratory")
//getObservationsTest("T81lum-5p6QvDR7l6hv7lfE52bAbA2ylWBnv9CZEzNb0B", "laboratory")
//getObservationsTest("T81lum-5p6QvDR7l6hv7lfE52bAbA2ylWBnv9CZEzNb0B", "social-history")





async function getProcedure(params) {
    path = '/Procedure?'
    for (parameter in params) {

        path += `${parameter}=${params[parameter]}&`

    }

    path = path.substring(0, path.length - 1);
    console.log(path);

    data = await getData(path);
    console.log('Number of records fetched ' + data['total'])

    procedures = []

    for (let i = 0; i < data['entry'].length; i++) {
        curr = data['entry'][i]['resource']

        id = curr['id']
        status = curr['status']
        name = curr['code']['text']
        code = curr['code']['coding'][0]['code']
        date = curr['performedDateTime']
        reason = curr['reasonCodeableConcept']['text']
        reasonCode = curr['reasonCodeableConcept']['coding'][0]['code']

        procedures.push(new Procedure(id, name, code, date, status, reason, reasonCode))

    }

    return procedures

}


async function getProcedureTest(currPatient) {

    procedures = await getProcedure({ "patient": currPatient })



}

//getProcedureTest("T81lum-5p6QvDR7l6hv7lfE52bAbA2ylWBnv9CZEzNb0B")


async function getPatientHistory(patientID) {

    patient = await getPatientData({ '_id': patientID })
    labEvents = await getObservation({ "patient": patientID, "category": "laboratory" });
    smokingHistory = await getSmokingHistory({ "patient": patientID, "category": "social-history" });
    procedures = await getProcedure({ "patient": patientID });

    result = {
        "Demography": patient[0],
        "Lab Events": labEvents,
        "Smoking history": smokingHistory,
        "Procedures": procedures
    }
    //console.log(patient);

    console.log(JSON.stringify(result))

    fs.writeFile("EpicPatientData.json", JSON.stringify(result), function (err) {
        if (err) throw err;
        console.log('complete');
    }
    );
}

getPatientHistory("T81lum-5p6QvDR7l6hv7lfE52bAbA2ylWBnv9CZEzNb0B")
