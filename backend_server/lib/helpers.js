module.exports = {

    /**
     * check if a string is in the mm/dd/yyyy format
     * @param {*} s 
     * @return true if the string is in the correct format
     */
    isDateFormat(s) {
        return s.length == 10 && this.isNumeric(s.substring(0, 2)) && this.isNumeric(s.substring(3, 5)) && this.isNumeric(s.substring(6, 10)) && s.substring(2, 3) == "/" && s.substring(5, 6);
    },


    /**
     * checks if a string is in the hh:mm format
     * @param {*} s 
     * @return true if the string is in the correct format
     */
    isTimeFormat(s) {
        return s.length == 5 && this.isNumeric(s.substring(0, 2)) && this.isNumeric(s.substring(3, 5)) && s.substring(2, 3) == ":";
    },



    /**
     * checks if a value is numeric
     * @param {*} value 
     * @returns true if the value is numeric
     * taken from: https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
     */
    isNumeric(value) {
        return /^-?\d+$/.test(value);
    },


    /**
     * checks if two days are on the same day
     * @param {*} first 
     * @param {*} second 
     * @returns true or false
     * taken from https://flaviocopes.com/how-to-check-dates-same-day-javascript/
     */
    datesAreOnSameDay(first, second){
        return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate()
    },


    /**
     * takes a string with hh:mm or h:m or inbetween and justifies it to hh:mm
     * @param {*} s 
     * @returns fixed string
     */
    verifyHourMinuteTimeFormat(s){
        var parts = s.split(":");
        if(parts[0].length == 1){
            parts[0] = "0" + parts[0];
        }
        if(parts[1].length == 1){
            parts[1] = "0" + parts[1];
        }
        return parts.join(":");

    }
}