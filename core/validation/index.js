class Validation {
	static rules = {
		required: (value, more) => value !== null && value !== undefined && value !== '',
		type: (value, expectedType) => typeof value === expectedType,
		regex: (value, regex) => regex.test(value),
		isEmail: (value, more) => /^\w+@\w+\.\w+$/.test(value),
		minLength: (value, min) => value.length >= min,
		oneOf: (value, values) => values.includes(value),
	};

	static validate(data, validationRules) {
		const validatedData = {};
		for (const key in validationRules) {
			const value = data[key];
			const rules = validationRules[key];

			if (rules) {
				for (const rule in rules) {
					const ruleFunc = this.rules[rule];

					if (!ruleFunc(value, rules[rule])) {
						throw new Error(`${key} validation failed ! error: ${rule}`);
					} else {
						validatedData[key] = value;
						break;
					}
				}
			}
		}

		return validatedData;
	}
}

module.exports = Validation;