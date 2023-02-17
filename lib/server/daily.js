
/**
 * rates the day on the server
 * @param {*} username username of the day
 * @param {*} day mm/dd/yyyy
 * @param {*} happiness happiness value from 1-5
 */
async function rateDay(username, day, happiness){
    try {
        const resp = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_RATE_DAY, { username: username, day: day, happiness:happiness });
    }
    catch (e) {
        return false;
    }
    return true;
}