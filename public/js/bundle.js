(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const TableModel = require("./table-model");
const TableView = require("./table-view");

const model = new TableModel();
const tableView = new TableView(model);
tableView.init();


},{"./table-model":4,"./table-view":5}],2:[function(require,module,exports){
const getRange = function (fromName, toNum){
	return Array.from({ length: toNum - fromName +1},
		(unused, i) => i + fromName);
};

const getLetterRange = function(firstLetter ="A", numLetters){
const rangeStart = firstLetter.charCodeAt(0);
const rangeEnd = rangeStart+numLetters-1;
return getRange(rangeStart, rangeEnd)
		.map(charCode =>String.fromCharCode(charCode));
};

module.exports ={
	getRange: getRange, 
	getLetterRange: getLetterRange
};
},{}],3:[function(require,module,exports){
const removeChildren = function(parentEl){
	while(parentEl.firstChild){
		parentEl.removeChild(parentEl.firstChild);
	}
};

const createEl = function(tagName){
	return function(text){
		const el = document.createElement(tagName);
		if(text){
			el.textContent = text;
		}
		return el;
	};
};

const createTR = createEl("TR");
const createTH = createEl("TH");
const createTD = createEl("TD");

module.exports = {
	createTR: createTR,
	createTH: createTH,
	createTD: createTD,
	removeChildren: removeChildren
};
},{}],4:[function(require,module,exports){
class TabeModel {
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
	add(){
		this.numRows=this.numRows+1;
		return this.numRows;
	}
}


module.exports = TabeModel;
},{}],5:[function(require,module,exports){
const {getLetterRange} = require ("./array-util");
const {removeChildren, createTR, createTH, createTD} = require("./dom-util");
const TableModel = require("./table-model");
const app = require("./app.js");

class TableView {

	constructor (model){
		this.model = model;
	}

	init(){
		this.initDomReferences();
		this.initCurrentCell();
		this.renderTable();
		this.attachEventHandlers();
	}

	normalizeValueForRendering(value){
		return value || "";
	}

	renderFormulaBar(){
		const currenCellValue = this.model.getValue(this.currentCellLocation);
		this.formulaBarEl.value = this.normalizeValueForRendering(currenCellValue); 
		this.formulaBarEl.focus();
	}

	initCurrentCell(){
		this.currentCellLocation = {col: 0, row: 0};
		this.renderFormulaBar();
	}

	attachEventHandlers(){
		this.sheetBodyEl.addEventListener("click", this.handleSheetClick.bind(this));
		this.formulaBarEl.addEventListener("keyup", this.handleFormulaBarChange.bind(this));
		this.addRow.addEventListener("click", this.add.bind(this));
	}
	add(){
		console.log("clicked");
		this.model.add();
		
	}
	
	handleFormulaBarChange(evt){
		const value = this.formulaBarEl.value;
		this.model.setValue(this.currentCellLocation, value);
		this.renderTableBody();
		this.renderTableFooter();
	}

	handleSheetClick(evt){
		const col = evt.target.cellIndex;
		const row = evt.target.parentElement.rowIndex -1;
		this.currentCellLocation = {col: col, row: row};
		this.renderTableBody();
		this.renderFormulaBar();

	}


	initDomReferences(){
		this.headerRowEl =  document.querySelector("THEAD TR");
		this.sheetBodyEl =  document.querySelector("TBODY");
		this.formulaBarEl = document.querySelector("#formula-bar");
		this.footerRowEl =  document.querySelector("TFOOT TR");
		this.addRow      = document.querySelector("#addRow");

	}


	renderTable(){
		this.renderTableHeader();
		this.renderTableBody();
		this.renderTableFooter();
	}

	renderTableHeader(){
		removeChildren(this.headerRowEl); 
		getLetterRange("A", this.model.numCols)
		.map(colLebel => createTH(colLebel))
		.forEach(th => this.headerRowEl.appendChild(th));
	}

	renderTableFooter(){
		removeChildren(this.footerRowEl);
		for(var column=0; column <this.model.numCols; column++){
			let sum =0; 
			for(var row=0; row<this.model.numRows; row++){
				const value = parseInt(this.model.getValue({"col": column, "row": row}), 10);
				if(!isNaN(value)){
					sum += value; 	
				}
			}
			this.footerRowEl.appendChild(createTD(sum));
		}
	}

	isCurrentCell(col, row){
		return  this.currentCellLocation.col ===col &&
			    this.currentCellLocation.row ===row;
	}

	renderTableBody(){
		const fragment = document.createDocumentFragment();
		for(let row=0; row<this.model.numRows; row++){
			const tr = createTR();
			for(let col =0; col<this.model.numCols; col++){
				const position = {col: col, row: row};
				const value = this.model.getValue(position);
				const td = createTD(value);

				if(this.isCurrentCell(col, row)){
					td.className = "current-cell";
				}

				tr.appendChild(td);
			}
			fragment.appendChild(tr);
		}
		removeChildren(this.sheetBodyEl);
		this.sheetBodyEl.appendChild(fragment);
	}
}

module.exports = TableView;

},{"./app.js":1,"./array-util":2,"./dom-util":3,"./table-model":4}]},{},[1]);
