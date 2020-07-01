const date = require('date-and-time');

class Patient {
    constructor(name, gender, dateOfBirth, race, id) {
        this.id = id;
        this.name = name
        this.dateOfBirth = dateOfBirth;
        this.age = Patient.calculateAge(this.dateOfBirth);
        this.gender = gender;
        this.race = race;
        //this.labEvents = null;
        //this.smokingHistory = null;
        //this.diagnosticReports = null;
        //this.procedures = null;

    };

    static calculateAge = (dateOfBirth) => {

        // To be modified.
        const now = new Date().getFullYear();
        //return now - date.parse(this.dateOfBirth, 'YYYY-MM-DD').getFullYear();
        return now - date.parse(dateOfBirth, 'YYYY-MM-DD').getFullYear();

    }

}


module.exports = Patient;


