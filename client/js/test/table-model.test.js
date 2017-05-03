const TableModel = require("../table-model");

describe ("table-model", ()=>{
	it("can set then get the value", ()=>{
		// set up the initial state 
		const model = new TableModel();
		const location = {row: 3, col: 5};
		//inspect the initail state 
		expect(model.getValue(location)).toBeUndefined();
		// execute code unde test
		model.setValue(location, "foo");
		//inspect the resulting state 
		expect(model.getValue(location)).toBe("foo");

	});
});