class TableModel {
	constructor(numCols=10, numRows=20){
		this.numCols = numCols;
		this.numRows = numRows;
		this.data = {};
	}

	_getCellId(location){
		return `${location.col}: ${location.row}`;
	}

	getValue(location){
		return this.data[this._getCellId(location)];
	}

	setValue(location, value){
		this.data[this._getCellId(location)] = value;
	}
	addRow(){
		this.numRows=this.numRows+1;
		return this.numRows;
	}
	addColumn(){
		this.numCols =this.numCols+1;
		return this.numCols;
	}
}


module.exports = TableModel;