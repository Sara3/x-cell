const fs = require("fs");
const TableModel = require("../table-model");
const TableView = require("../table-view");

describe("table-view", ()=>{
	beforeEach(()=> {
		const fixturePath = "./client/js/test/fixtures/sheet-container.html";
		const html = fs.readFileSync(fixturePath, "utf8");
		document.documentElement.innerHTML = html;
	});

	describe("formula bar", ()=>{

		it("makes changes to the value of the current cell", ()=>{
			//set up initial state
			const model = new TableModel(3,3);
			const view = new TableView(model);
			view.init();
			//inspect initial state
			let trs = document.querySelectorAll("TBODY TR");
			let td = trs[0].cells[0];
			expect(td.textContent).toBe("");
			//simulate user action 
			document.querySelector("#formula-bar").value = "65";
			view.handleFormulaBarChange();
			//inspect user action 
			trs = document.querySelectorAll("TBODY TR");
			expect(trs[0].cells[0].textContent).toBe("65");
		});

		it("updates from the value of the current cell ", ()=>{
			// set up the initial state
			const model = new TableModel(3,3);
			const view = new TableView(model);
			model.setValue({col: 2, row:1}, "123");
			view.init();
			//inpect the initial state
			const formulaBarEl = document.querySelector("#formula-bar");
			expect(formulaBarEl.value).toBe("");
			//simulate user action
			const trs = document.querySelectorAll("TBODY TR");
			trs[1].cells[2].click();
			//inspect the resulting state
			expect(formulaBarEl.value).toBe("123");

		});
	});

	describe("table body", ()=>{

		it("highlights the current cell when clicked", ()=>{
			//set up the initial state
			const model = new TableModel(10, 5);
			const view = new TableView (model);
			view.init();

			//inspect the initial state
			let trs = document.querySelectorAll("TBODY TR");
			let td = trs[2].cells[3];
			expect(td.className).toBe("");
			//simulate user action 
			td.click();
			//inspect the result
			trs = document.querySelectorAll("TBODY TR");
			td = trs[2].cells[3];
			expect(td.className).not.toBe("");
		});


		it("has the right size", ()=>{
			const numCols =6;
			const numRows =10;
			const model = new TableModel(numCols, numRows);
			const view =new TableView(model);
			view.init();

			let ths = document.querySelectorAll("THEAD TH");
			expect(ths.length).toBe(numCols);
		});

		it("fills in values from the model", ()=>{
			const model = new TableModel(3, 3);
			const view = new TableView(model);

			model.setValue({col: 2, row: 1}, "123");
			view.init();

			const trs = document.querySelectorAll("TBODY TR");
			expect(trs[1].cells[2].textContent).toBe("123");
		});
	});

	describe("table header", ()=>{

		it("has valid colum labels", ()=>{
			const numCols = 6;
			const numRows = 10;
			const model = new TableModel(numCols, numRows);
			const view = new TableView(model);
			view.init();

			let ths = document.querySelectorAll("THEAD TH");
			expect(ths.length).toBe(numCols);

			let labelText = Array.from(ths).map(el => el.textContent);
			expect(labelText).toEqual(["A", "B", "C", "D", "E", "F"]);


		});
	});

	describe("table footer", ()=>{
		
		it("has valid number of colums", ()=>{
			const model = new TableModel(3, 3);
			const view = new TableView(model);
			model.setValue({col: 0, row: 1}, 1);
			model.setValue({col: 0, row: 2}, 3);
			view.init();

			const tds = document.querySelectorAll("TFOOT TR");
			expect(tds[0].textContent).toEqual("4");
		});

	 });
});