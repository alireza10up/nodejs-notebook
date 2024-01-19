class Validation {

	static rules = {
		required: (value) => value !== null && value !== undefined && value !== '',
		minLength: (value, min) => value.length >= min,
		maxLength: (value, max) => value.length <= max,
		type: (value, type) => typeof value === type,
		regex: (value, regex) => regex.test(value),
		oneOf: (value, values) => values.includes(value),
	};

	static validate(data, rules) {
		for (const rule in rules) {
			const value = data[rule];
			const ruleFunc = rules[rule];

			if (value === undefined) {
				continue;
			}

			if (!ruleFunc(value)) {
				throw new Error(`${rule} validation failed for value ${value}`);
			}
		}

		return data;
	}

}

module.exports = Validation;