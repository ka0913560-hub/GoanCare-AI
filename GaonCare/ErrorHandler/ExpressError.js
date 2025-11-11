class ExpressError extends Error{   //extends means inheritance
    constructor(status , message){
        super();
        this.message= message;
        this.status= status;
    }


}
module.exports =ExpressError;