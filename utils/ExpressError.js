class ExpressError extends Error {
    constructor(status, message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}