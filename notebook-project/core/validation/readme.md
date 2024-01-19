# How To Use

```js 
const validator = new Validation();

// Validate a required field
validator.validate({name: ''}, {name: 'required'}); // throws an error

// Validate a field with a minimum length
validator.validate({name: 'abc'}, {name: 'minLength:3'}); // throws an error

// Validate a field with a maximum length
validator.validate({name: 'abcdefghijklmnopqrstuvwxy'}, {name: 'maxLength:10'}); // throws an error

// Validate a field with a specific type
validator.validate({name: 123}, {name: 'type:string'}); // throws an error

// Validate a field with a regular expression
validator.validate({name: '123-456-7890'}, {name: 'regex:/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/'}); // throws an error

// Validate a field with a list of possible values
validator.validate({name: 'John Doe'}, {name: 'oneOf:["John Doe", "Jane Doe"]'}); // throws an error
```