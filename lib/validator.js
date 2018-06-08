
const moment = require('moment')

const preChecks = {}

preChecks.string = {
    check:function checkString(rule, value) {
        if (typeof value !== 'string') {
            return 'should be a string';
        }

        if (!rule.allowEmpty && value === '') {
            return 'should not be empty'
        }

        if (rule.allowEmpty && value === '') {
            return
        }

        if ('max' in rule && value.length > rule.max) {
            return 'length should smaller than ' +  rule.max
        }

        if ('min' in rule && value.length < rule.min) {
            return 'length should bigger than ' + rule.min
        }

        if (rule.regexp && !rule.regexp.test(value)) {
            return 'should match ' + rule.regexp;
        }
    },
    conver:function(value,rule){
        return rule.trim === false ? value : value.trim()
    }
}

preChecks.bool = {
    check:function checkBoolean(rule, value) {
      if (typeof value !== 'boolean') {
        return'should be a boolean'
      }
    },
    conver:function(value,rule){
        if(value == 'yes' || value == '1' || value == 'true'){
            return true
        }else if(value == 'no' || value == '0' || value == 'false'){
            return false
        }
        return value
    }
}

preChecks.array = {
    check:function checkArray(rule,value) {
        if (!Array.isArray(value)) {
            return 'should be an array'
        }
        if ('max' in rule && value.length > rule.max) {
            return 'length should smaller than ' + rule.max
        }
        if ('min' in rule && value.length < rule.min) {
            return 'length should bigger than ' + rule.min
        }
        if (!rule.itemType) {
            return
        }
        for(let i=0;i<value.length;i++){
            const errors = this.validate({inner:rule.itemType},{inner:value[i]})
            if(errors){
                return errors.toString()
            }
        }
    },
    conver:function(value,rule) {
        if(value.trim() == ''){
            return []
        }
        let arr = value.split(rule.sp || /[\s,，]+/)
        if(rule.itemType){
            const ir = formatRule(rule.itemType)
            if(preChecks[ir.type]){
                arr = arr.map(item=>preChecks[ir.type].conver(item,ir))
            }
        }
        return arr
    }

}
preChecks.date = {
    check:function checkDate(rule,value) {
        if(value instanceof Date){
            return
        }
        return (value && typeof value.isValid == 'function' && value.isValid() ?  undefined : 'must be date')
    },
    conver:function(value,rule) {
        if(!value || !value.trim()){
            return
        }
        const val =  moment(value,rule.format || 'YYYY-MM-DD HH:mm:ss')
        if(!val.isValid()){
            return
        }
        return rule.moment ? val : val.toDate()  
    }
}
preChecks.json = {
    check:function checkJson(rule, value ,obj){
        return typeof value === 'object' ?  undefined : 'must be json'
    },
    conver:function(value,rule) {
        try{
          return JSON.parse(value)
        }catch(err){}
    }
}
preChecks.int = {
    check:function checkInt(rule, value) {
        if (typeof value !== 'number' || value % 1 !== 0) {
            return 'should be an integer'
        }
        if ('max' in rule && value > rule.max) {
            return 'should smaller than ' + rule.max
        }
        if ('min' in rule && value < rule.min) {
            return 'should bigger than  ' + rule.min
        }
    },
    conver:function(value,rule) {
        return parseInt(value,rule.radix)
    }
}
preChecks.number = {
    check:function checkNumber(rule, value) {
        if (typeof value !== 'number' || isNaN(value)) {
            return  'should be a number'
        }
        if ('max' in rule && value > rule.max) {
            return 'should smaller than ' + rule.max;
        }
        if ('min' in rule && value < rule.min) {
            return 'should bigger than  ' + rule.min;
        }
    },
    conver:function(value,rule) {
        return Number(value)
    }
}
preChecks.enum = {
    check:function checkEnum(rule, value) {
        if (!Array.isArray(rule.values)) {
            throw new TypeError('check enum need array type values')
        }
        if (!rule.values.includes(value)) {
            return 'should be one of ' + rule.values.join(', ')
        }
    }
}
 
function formatRule(rule) {
  if (typeof rule === 'string') {
    return { type: rule }
  }
  if (Array.isArray(rule)) {
    return { type: 'enum', values: rule }
  }
  if (rule instanceof RegExp) {
    return { type: 'string', regexp: rule }
  }
  return rule || {}
}



module.exports = class Validator {
    constructor(opts = {}) {
        this.opts = opts
        this.preChecks =  Object.assign({},preChecks)
    }

    addRule(type, check, conver) {
        if (!type) {
          throw new TypeError('type required');
        }

        if (typeof check === 'function') {
            return this.preChecks[type] = {check,conver}
        }

        throw new TypeError('check must be function')
    }

    getConver(type){
        return this.preChecks[type] && this.preChecks[type].conver
    }

    getChecker(type){
        return this.preChecks[type] && this.preChecks[type].check
    }

    validate(rules, obj) {
        if (typeof rules !== 'object') {
            throw new TypeError('need object type rule');
        }
        //清除干扰的属性
        const ruleKeys = Object.keys(rules)
        Object.keys(obj).forEach(objectKey=>{
            if(!ruleKeys.includes(objectKey)){
                delete obj[objectKey]
            }
        })
        //类型转换
        ruleKeys.forEach(key=>{
            const rule = rules[key] = formatRule(rules[key])
            if(obj[key] != null){
                const type = rule.type
                const hanlder = this.getConver(type)
                if(hanlder){
                    obj[key] = hanlder(typeof obj[key].toString === 'function' ? obj[key].toString() : String(obj[key]),rule)
                }
            }else if('default' in rule){
                obj[key] = typeof (rule.default) === 'function' ? rule.default() : rule.default
                rule.required = false
            }
        })

        const errors = []
        //校验规则
        for (let key in rules) {
          const rule = rules[key]

          if (!obj.hasOwnProperty(key) || obj[key] == null) {
            if (rule.required !== false) {
                errors.push(rule.msg || (key + ':required') )
            }
            continue
          }

          const checker = this.getChecker(rule.type)
          if (!checker) {
            throw new TypeError('rule type must be one of ' + Object.keys(this.preChecks).join(', ') +
              ', but the following type was passed: ' + rule.type)
          }

          let msg = checker.call(this, rule, obj[key], obj)
          if (msg) {
            if(rule.msg){
                msg = rule.msg
            }else{
                msg = key + ':' + msg
            }
            errors.push(msg)
          }
        }

        if (errors.length) {
          return errors
        }
    }


}