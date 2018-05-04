
module.exports = {
	check(rules, data) {
        if(!data){
            data = Object.assign({},this.query,this.request.body,this.params)
        }
		return this.app.validator.validate(rules,data)
	}
}