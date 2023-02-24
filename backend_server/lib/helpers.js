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
    datesAreOnSameDay(first, second) {
        return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate()
    },


    /**
     * takes a string with hh:mm or h:m or inbetween and justifies it to hh:mm
     * @param {*} s 
     * @returns fixed string
     */
    verifyHourMinuteTimeFormat(s) {
        var parts = s.split(":");
        if (parts[0].length == 1) {
            parts[0] = "0" + parts[0];
        }
        if (parts[1].length == 1) {
            parts[1] = "0" + parts[1];
        }
        return parts.join(":");

    },


    /**
     * 
     * @param {*} a time in the hh:mm format
     * @param {*} b time in the hh:mm format
     * @returns true if a is before b
     */
    isHourMinuteBefore(a, b) {
        var aSplit = a.split(":");
        var bSplit = b.split(":");
        return (parseInt(aSplit[0]) < parseInt(bSplit[0])) || ((parseInt(aSplit[0]) == parseInt(bSplit[0]) && parseInt(aSplit[1]) < parseInt(bSplit[1])));
    },


    /**
     * @returns today's date in the mm/dd/yyyy format
     * https://stackoverflow.com/questions/12409299/how-to-get-current-formatted-date-dd-mm-yyyy-in-javascript-and-append-it-to-an-i
     */
    getTodaysDate() {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const formattedToday = mm + '/' + dd + '/' + yyyy;
        return formattedToday;

    },


    /**
     * @returns the current time in hh:mm format
     */
    getCurrentTime(){
        var date = new Date();
        return "" + date.getHours() + ":" + date.getMinutes();
    }
}