
class Script{
    constructor(_scriptName){
        this.enabled        = false,
        this.script         = _scriptName,
        this.scriptCommand  = '',
        this.timeOut        = 30,
        this.cost           = 0,
        this.followerOnly   = true,
        this.subscriberOnly = false,
        this.modOnly        = false
    }
}


module.exports = Script;