const {getLetterRange} = require ("./array-util");
const {removeChildren, createTR, createTH, createTD} = require("./dom-util");


class TableView {
	constructor (model){
		this.model = model;
	}
	init(){
		this.initDomeReferences();
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
	}
	initCurrentCell(){
		this.currentCellLocation = {col: 0, row: 0};
		this.renderFormulaBar();
	}

	


	attachEventHandlers(){
		this.sheetBodyEl.addEventListener("click", this.handleSheetClick.bind(this));
	}
	isColumnHeaderRow(row){
		return row <1;
	}
	handleSheetClick(evt){
		const col = evt.target.cellIndex;
		const row = evt.target.parentElement.rowIndex -1;

		if(!this.isColumnHeaderRow(row)){
			this.currentCellLocation = {col: col, row: row};
			this.renderTableBody();
		}
	}


	initDomeReferences(){
		this.headerRowEl = document.querySelector("THEAD TR");
		this.sheetBodyEl = document.querySelector("TBODY");
		this.formulaBarEl = document.querySelector("#formula-bar");
	}

	renderTable(){
		this.renderTableHeader();
		this.renderTableBody();
	}

	renderTableHeader(){
		removeChildren(this.headerRowEl); 
		getLetterRange("A", this.model.numCols)
		.map(colLebel => createTH(colLebel))
		.forEach(th => this.headerRowEl.appendChild(th));
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