module.exports = {
  /**
   * check if a string is in the mm/dd/yyyy format
   * @param {*} s
   * @return true if the string is in the correct format
   */
  isDateFormat(s) {
    return (
      s.length == 10 &&
      this.isNumeric(s.substring(0, 2)) &&
      this.isNumeric(s.substring(3, 5)) &&
      this.isNumeric(s.substring(6, 10)) &&
      s.substring(2, 3) == '/' &&
      s.substring(5, 6)
    );
  },

  /**
   * checks if a string is in the hh:mm format
   * @param {*} s
   * @return true if the string is in the correct format
   */
  isTimeFormat(s) {
    return (
      s.length == 5 &&
      this.isNumeric(s.substring(0, 2)) &&
      this.isNumeric(s.substring(3, 5)) &&
      s.substring(2, 3) == ':'
    );
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
    return (
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate()
    );
  },

  /**
   * takes a string with hh:mm or h:m or inbetween and justifies it to hh:mm
   * @param {*} s
   * @returns fixed string
   */
  verifyHourMinuteTimeFormat(s) {
    var parts = s.split(':');
    if (parts[0].length == 1) {
      parts[0] = '0' + parts[0];
    }
    if (parts[1].length == 1) {
      parts[1] = '0' + parts[1];
    }
    return parts.join(':');
  },

  verifyMMDDYYYformat(s){
    var parts = s.split('/');
    if (parts[0].length == 1) {
      parts[0] = '0' + parts[0];
    }
    if (parts[1].length == 1) {
      parts[1] = '0' + parts[1];
    }
    return parts.join('/');
  },


  /**
   * checks if a date is before another
   * @param {*} d1 
   * @param {*} d2 
   */
  MMDDYYYYbeforeMMDDYYYY(d1, d2) {
    var parts = d1.split("/");
    var dt1 = new Date(parts[2], parts[0] - 1, parts[1]);
    

    parts = d2.split("/");
    var dt2 = new Date(parts[2], parts[0] - 1, parts[1]);

    return dt1 <= dt2;

  },

  /**
   * converts an epoch timestamp to the hh:mm format
   * https://stackoverflow.com/questions/41015272/display-epoch-time-as-hhmm-format-in-javascript
   * @param {*} epoch 
   * @returns 
   */
  epochToHHMM(epoch) {
    let epoch_time = 1234567890 * 1000;
    var date_obj = new Date(epoch_time);
    const hrs = date_obj.getHours();
    const mins = date_obj.getMinutes();
    let hhmm = (hrs < 10 ? "0" + hrs : hrs) + ":" + (mins < 10 ? "0" + mins : mins);
    return hhmm;
  },

  epochToMMDDYYY(epoch) {
    var date = new Date(Math.round(Number(epoch)));
    var formattedDate = + (date.getUTCMonth() + 1) + '/' + date.getUTCDate() + "/" + date.getUTCFullYear();
    return verifyMMDDYYYformat(formattedDate);


  },

  /**
   *
   * @param {*} a time in the hh:mm format
   * @param {*} b time in the hh:mm format
   * @returns true if a is before b
   */
  isHourMinuteBefore(a, b) {
    var aSplit = a.split(':');
    var bSplit = b.split(':');
    return (
      parseInt(aSplit[0]) < parseInt(bSplit[0]) ||
      (parseInt(aSplit[0]) == parseInt(bSplit[0]) &&
        parseInt(aSplit[1]) < parseInt(bSplit[1]))
    );
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
   * @returns today's date in the yyy-mm--dd format for RN_Cal Agenda
   * Similar to getTodaysDate()
   */
  getTodaysDateAgendaFormat() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = yyyy + '-' + mm + '-' + dd;
    return formattedToday;
  },

  /**
   * @returns the current time in hh:mm format
   */
  getCurrentTime() {
    var date = new Date();
    var stringed = '' + date.getHours() + ':' + date.getMinutes();
    return this.verifyHourMinuteTimeFormat(stringed);
  },

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  },


  /**
   * allows the program to sleep for milliseconds. await this function  
   * @param {*} ms 
   * @returns 
   */
  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  },


  /**
   * capitalizes the first letter of a string
   * @param {*} s 
   * @return capitalized string
   */
  capitalizeFirstLetter(s) {
    if (s.length == 0) {
      return s;
    }
    return s.charAt(0).toUpperCase() + s.slice(1); //https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript

  },


  //https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }
};


