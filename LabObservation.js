class LabObservation {
    constructor(id, name, status, value, code, effectiveDateTime) {

        this.id = id;
        this.name = name;
        this.status = status;
        this.value = value;
        this.code = code;
        this.effectiveDateTime = effectiveDateTime;
    }

}


module.exports = LabObservation;