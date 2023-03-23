/**
 * general constants for the server. hard coded and cannot be changed during runtime
 */

module.exports = {
    DATABASE_FILE: "test_db.sqlite",
    SERVER_ENDPOINTS: {
        GOOGLE_CALENDAR_IMPORT_ENDPOINT:  "/api/calendar/import/google/id",
        GOOGLE_CALENDAR_OAUTH_BEGIN: "/api/calendar/import/google/oauth/begin",
        GOOGLE_CALENDAR_OAUTH_RESPONSE: "/api/calendar/import/google/oauth/response",
        GOOGLE_CALENDAR_LIST_CALENDARS:  "/api/calendar/import/google/list",

        OUTLOOK_CALENDAR_OAUTH_BEGIN: "/api/calendar/import/outlook/oauth/begin",
        OUTLOOK_CALENDAR_OAUTH_RESPONSE: "/api/calendar/import/outlook/oauth/response",
        OUTLOOK_CALENDAR_LIST_CALENDARS: "/api/calendar/import/outlook/list",
        OUTLOOK_CALENDAR_IMPORT_ENDPOINT: "/api/calendar/import/outlook/id",

        USER_TASKS_BY_DAY: "/api/user/tasks/day",
        USER_ADD_TASK: "/api/user/tasks/add",
        USER_UPDATE_TASK: "/api/user/tasks/update",
        USER_DELETE_TASK: "/api/user/tasks/delete",
        
        USER_COMPLETE_TASK: "/api/user/tasks/completed/complete",

        USER_CREATE: "/api/user/create",
        USER_EXISTS: "/api/user/exists",
        USER_LOGIN: "/api/user/login",

        USER_RATE_DAY: "/api/user/day/rate",
        USER_GET_DAY_RATING: "/api/user/day/rating"


    },
    /**
     * template html pages used for specific purposes
     */
    DUMMY_PAGES:{
        FINISHED_PAGE: "<h1>You May Now Close This Page</h1>" //substitue with a close page if possible. however, not all browsers support window.close by the script
    }
}