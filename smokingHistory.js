class SmokingHistory {
    constructor(id, name, issued, histCode, histText, effectivePeriod, code, text, status) {
        this.id = id;
        this.name = name;
        this.issued = issued;
        this.histCode = histCode;
        this.histText = histText;
        this.effectivePeriod = effectivePeriod;
        this.code = code;
        this.text = text;
        this.status = status;
    }


}

module.exports = SmokingHistory;