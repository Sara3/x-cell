const {getLetterRange} = require ('./array-util');
const {removeChildren, createTR, createTH, createTD} = require('./dom-util');
const TableModel = require('./table-model');


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
		return value || '';
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
		this.sheetBodyEl.addEventListener('click', this.handleSheetClick.bind(this));
		this.formulaBarEl.addEventListener('keyup', this.handleFormulaBarChange.bind(this));
		this.addRow.addEventListener('click', this.addRowButton.bind(this));
		this.addCol.addEventListener('click', this.addColButton.bind(this));
	}

	addColButton(){
		this.model.addColumn();
		this.renderTable();
	}

	addRowButton(){
		this.model.addRow();
		this.renderTable();
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
		this.headerRowEl  = document.querySelector('THEAD TR');
		this.sheetBodyEl  = document.querySelector('TBODY');
		this.formulaBarEl = document.querySelector('#formula-bar');
		this.footerRowEl  = document.querySelector('TFOOT TR');
		this.addRow       = document.querySelector('#addRow');
		this.addCol       = document.querySelector('#addCol');
	}

	renderTable(){
		this.renderTableHeader();
		this.renderTableBody();
		this.renderTableFooter();
	}

	renderTableHeader(){
		removeChildren(this.headerRowEl); 
		getLetterRange('A', this.model.numCols)
		.map(colLebel => createTH(colLebel))
		.forEach(th => this.headerRowEl.appendChild(th));
	}

	renderTableFooter(){
		removeChildren(this.footerRowEl);
		for(let column = 0; column < this.model.numCols; column++){
			let sum = 0; 
			for(let row = 0; row < this.model.numRows; row++){
				const value = parseInt(this.model.getValue({'col': column, 'row': row}), 10);
				if(!isNaN(value)){
					sum += value; 	
				}
			}
			this.footerRowEl.appendChild(createTD(sum));
		}
	}

	isCurrentCell(col, row){
		return  this.currentCellLocation.col === col &&
			    	this.currentCellLocation.row === row;
	}

	renderTableBody(){
		const fragment = document.createDocumentFragment();
		for(let row = 0; row < this.model.numRows; row++){
			const tr = createTR();
			for(let col = 0; col < this.model.numCols; col++){
				const position = {col: col, row: row};
				const value = this.model.getValue(position);
				const td = createTD(value);

				if(this.isCurrentCell(col, row)){
					td.className = 'current-cell';
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
