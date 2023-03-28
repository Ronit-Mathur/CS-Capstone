module.exports = class Operation{
    /**
     * an operation is something which can be executed by the database handler. it has a priority
     */

    constructor(priority){
        this.priority = priority;
    
    } 

    getPriority(){
        return this.priority;
    }

    getId(){
        return this.id;
    }

    setId(id){
        this.Id = id;
    }
}