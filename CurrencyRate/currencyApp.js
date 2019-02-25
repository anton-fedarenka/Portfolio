fetch('https://www.nbrb.by/API/ExRates/Rates?Periodicity=0')
	.then(response => response.json())
	.then(data => {
		let currenciesData = data;
		Object.defineProperty(currenciesData[0], 'Cur_ID', {enumerable: false});
		return currenciesData;
	})
	.then(currenciesData => {
		currenciesData.forEach(item => {
			createRow();
			createCell(item.Cur_Name); //почему при перебора свойств currenciesData[i] через for...in получаю undefined?
			createCell(item.Cur_Scale, item.Cur_Abbreviation);
			createCell(item.Cur_OfficialRate);
		})
	})

function createRow() {
	const table = document.querySelector('.currency-table');
	const tr = document.createElement('tr');
	tr.className = 'currency-table-row';
	table.appendChild(tr);
}

function createCell(info, addInfo = '') {
	const tr = document.querySelector('.currency-table').lastElementChild;
	const td = document.createElement('td');
	td.innerHTML = `${info}` + ' ' + `${addInfo}`;
	tr.appendChild(td);
}

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

let today = new Date; //get current date
let dd = today.getDate();
let mm = today.getMonth() + 1;
let yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;

const canvasElement = document.getElementById('canvas');
const canvas = canvasElement.getContext('2d');
const x0 = 50;
const y0 = 30;
const width = 804;
const height = 402;
const USDMaxMinValues = [1.9, 2.15];
const EURMaxMinValues = [2.25, 2.55];
const RUBMaxMinValues = [2.9, 3.55];

createGraph();
document.getElementById('btn').addEventListener('click', (e) => createGraph(e));

function createGraph(e) {
	if (e) e.preventDefault();
	canvas.clearRect(0, 0, 900, 550);
	drawCoordinateAxis();
	let dates = getDates();
	let currenciesID = getCurrenciesID();
	let colors = setColors(currenciesID);
	if (currenciesID.length > 1) {
		makeRequest(dates, currenciesID[0])
		.then(data => {
			const dates = data.map(item => item['Date'].slice(0, 10));
			const rates = data.map(item => item['Cur_OfficialRate']);
			drawGraph(dates, rates, colors[0]);
			drawLegendColor(colors[0], 1);
			drawLegendText(currenciesID[0], 1);
		 })
		for (let i = 1; i < currenciesID.length; i++) {
			makeRequest(dates, currenciesID[i])
			.then(data => {
				const dates = data.map(item => item['Date'].slice(0, 10));
				const rates = data.map(item => item['Cur_OfficialRate']);
				let MaxMinValues = formMarkupYValuesArray();
				let markupY = createMarkupYText(MaxMinValues);
				let min = Math.min.apply(null, markupY);
				const graphRates = rates.map(item => height + y0 - (item - min) * height  / markupY.length / 0.05);
				drawGraphLine(dates, graphRates, colors[i]);
				drawLegendColor(colors[i], i + 1);
				drawLegendText(currenciesID[i], i + 1);
			 })
		}
	} else {
		makeRequest(dates, currenciesID[0])
		.then(data => {
			const dates = data.map(item => item['Date'].slice(0, 10));
			const rates = data.map(item => item['Cur_OfficialRate']);
			drawGraph(dates, rates, colors[0]);
			drawLegendColor(colors[0], 1);
			drawLegendText(currenciesID[0], 1);
		 })
	}
}

function drawCoordinateAxis() { //draw coordinate axis for graph
	canvas.strokeStyle = "black";
	canvas.beginPath();
	canvas.moveTo(x0, y0);
	canvas.lineTo(x0, height + y0);
	canvas.lineTo(width + x0, height + y0);
	canvas.stroke();
}

function getDates() { //set period for which data is needed
	let dates = [];
	if (document.querySelector('.first-date').value) {
		if ( ( (+document.querySelector('.first-date').value.slice(-2) < +document.querySelector('.second-date').value.slice(-2)) || (document.querySelector('.first-date').value.slice(-2) === document.querySelector('.second-date').value.slice(-2) && +document.querySelector('.first-date').value.slice(0, 2) < +document.querySelector('.second-date').value.slice(0, 2)) ) && ( document.querySelector('.second-date').value.slice(-2) ===  mm && +document.querySelector('.second-date').value.slice(0, 2) <= +dd) ) {
			let firstDate = document.querySelector('.first-date').value;
			let secondDate =  document.querySelector('.second-date').value;
			dates = [`2018-${firstDate.slice(-2)}-${firstDate.slice(0, 2)}`, `2018-${secondDate.slice(-2)}-${secondDate.slice(0, 2)}`];
		} else {
			alert('Вы ввели неккоректные даты, попробуйте ещё раз');
			document.querySelector('.first-date').value = '';
			document.querySelector('.second-date').value = '';
			dates = ["2018-1-1", `${today}`];
		}
	} else {
		dates = ["2018-1-1", `${today}`];
	}
	return dates;
}

function getCurrenciesID() { //get ID selected currencies for drawing a graph
	let checkbox = document.querySelectorAll('.checkbox');
	let currenciesID = [];
	for (i = 0; i < 3; i++) {
		if (checkbox[i].checked) {
			currenciesID.push(checkbox[i].value);
		}
	}
	return currenciesID;
}

function setColors(currenciesID) {
	let colors = [];
	currenciesID.forEach(item => {
		if (item === "145") {
			colors.push("blue");
		} else if (item === "292") {
			colors.push("red");
		} else {
			colors.push("yellow")
		}
	})
	return colors;
}

function createURL(dates, currencyID) { //create URL for API
	let startDate = dates[0];
	let endDate = dates[1];
	let url = `https://www.nbrb.by/API/ExRates/Rates/Dynamics/${currencyID}?startDate=${startDate}&endDate=${endDate}`;
	return url;
}

function makeRequest(dates, currencyID) {
	let url = createURL(dates, currencyID);
	return fetch(`${url}`)
		.then(response => response.json())
}

function drawGraph(dates, rates, color) {
	let markupX = createMarkupXText(dates);
	let MaxMinValues = formMarkupYValuesArray();
	let markupY = createMarkupYText(MaxMinValues);
	drawMarkupX(markupX);
	drawMarkupY(markupY);
	let min = Math.min.apply(null, markupY);
	const graphRates = rates.map(item => height + y0 - (item - min) * height  / markupY.length / 0.05);
	drawGraphLine(dates, graphRates, color);
}

function createMarkupXText(dates) { //create text-labels for axe X
	let markupX = [];
	if (dates.length < 15) {
		markupX = dates.map(item => item = `${item.slice(-2)}.${item.slice(5, 7)}.${item.slice(0, 4)}`);
	} else if (dates.length < 46) {
		for (let i = 0; i < dates.length; i += 3) {
			dates[i] = `${dates[i].slice(-2)}.${dates[i].slice(5, 7)}.${dates[i].slice(0, 4)}`
			markupX.push(dates[i]);
		}
	} else if (dates.length < 151) {
		for (let i = 0; i < dates.length; i += 10) {
			dates[i] = `${dates[i].slice(-2)}.${dates[i].slice(5, 7)}.${dates[i].slice(0, 4)}`
			markupX.push(dates[i]);
		}
	} else {
		for (let i = 0; i < dates.length; i += 30) {
			dates[i] = `${dates[i].slice(-2)}.${dates[i].slice(5, 7)}.${dates[i].slice(0, 4)}`
			markupX.push(dates[i]);
		}
	}
	return markupX;
}

function formMarkupYValuesArray() { //form array of text-labels for axe Y taking selected currencies into account
	let checkbox = document.querySelectorAll('.checkbox');
	const MaxMinValues = [USDMaxMinValues, EURMaxMinValues, RUBMaxMinValues];
	let checked = [];
	for (i = 0; i < 3; i++) {
		if (checkbox[i].checked) {
			checked.push(MaxMinValues[i]);
		}
	}
	return checked;
}

function createMarkupYText(MaxMinValues) { //create text-labels for axe X
	let markupY = [];
	switch (MaxMinValues.length) {
		case 1:
			for(let i = MaxMinValues[0][0]; i <= MaxMinValues[0][1]; i += 0.05) {
				markupY.push(i.toFixed(2));
			}
			break;
		case 2:
			min = Math.min(MaxMinValues[0][0], MaxMinValues[1][0]);
			max = Math.max(MaxMinValues[0][1], MaxMinValues[1][1]);
			for(let i = min; i <= max; i += 0.05) {
				markupY.push(i.toFixed(2));
			}
			break;
		case 3:
			min = Math.min(MaxMinValues[0][0], MaxMinValues[1][0], MaxMinValues[2][0]);
			max = Math.max(MaxMinValues[0][1], MaxMinValues[1][1], MaxMinValues[2][1]);
			for(let i = min; i <= max; i += 0.05) {
				markupY.push(i.toFixed(2));
			}
			break;
	}
	return markupY;
}

function drawMarkupX(markupText) { // draw markup for axe X
	canvas.strokeStyle = "black";
	let x_min = 0;
	let x_max = markupText.length;
	let stepX = Math.round(width / x_max);
	for (var i = x0; x_min < x_max; i += stepX) {
	     canvas.moveTo(i, height + y0);
	     canvas.lineTo(i, height + y0 + 10);
	     canvas.fillText(markupText[x_min], i - 3, height + y0 + 20);
			 x_min++;
	}
	canvas.lineWidth = 2;
	canvas.stroke();
	canvas.closePath();
}

function drawMarkupY(markupText) { // draw markup for axe Y
	let y_min = 0;
	let y_max = markupText.length;
	let stepY = Math.round(height / y_max);
	for (var i = height + y0; y_min < y_max; i -= stepY) {
	     canvas.moveTo(x0, i);
	     canvas.lineTo(x0 - 10, i);
	     canvas.fillText(markupText[y_min], x0 - 35, i + 3);
			 y_min++;
	}
	canvas.lineWidth = 2;
	canvas.stroke();
	canvas.closePath();
}

function drawGraphLine(dates, graphRates, color) { // draw graph line for selected currency
	canvas.strokeStyle = color;
	canvas.beginPath();
	canvas.moveTo(x0, graphRates[0]);
	for (let i = 0; i < dates.length; i++) {
		let stepX = width / dates.length;
		let x = x0 + i*stepX;
		let y = graphRates[i];
		canvas.lineTo(x, y);
	}
	canvas.stroke();
}

function drawLegendColor(color, number) {
	canvas.strokeStyle = color;
	canvas.lineWidth = 10;
	canvas.beginPath();
	canvas.moveTo(width / 2, height + y0 + 30 + number * 20);
	canvas.lineTo(width / 2 + 30, height + y0 + 30 + number * 20);
	canvas.stroke();
	canvas.lineWidth = 2;
}

function drawLegendText(currencyID, number) {
	switch (currencyID) {
		case "145":
			canvas.fillText("1 USD", width / 2 + 40, height + y0 + 30 + number * 20 + 5);
			break;
		case "292":
			canvas.fillText("1 EUR", width / 2 + 40, height + y0 + 30 + number * 20 + 5);
			break;
		case "298":
			canvas.fillText("100 RUB", width / 2 + 40, height + y0 + 30 + number * 20 + 5);
			break;
	}
}
