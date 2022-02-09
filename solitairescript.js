"use strict";

const deck = ['1S', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', '11S', '12S', '13S',
			'1H', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', '11H', '12H', '13H',
			'1C', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', '11C', '12C', '13C',
			'1D', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', '11D', '12D', '13D'];
var stock = [];
var waste = [];
var f0 = [];
var f1 = [];
var f2 = [];
var f3 = [];
var t0 = [];
var t1 = [];
var t2 = [];
var t3 = [];
var t4 = [];
var t5 = [];
var t6 = [];

window.onload = function() {
	document.getElementById("play").onclick = createGame;
	createGame();
}

function createGame() {
	// use the stock as the base for the shuffled deck
	stock = deck.slice();
	//for (var i = 0; i < deck.length; i++) { stock.push(deck[i]); }
	for (var i = stock.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * i);
		var k = stock[i];
		stock[i] = stock[j];
		stock[j] = k;
	}
	// clear any old game and create a new table
	var gameBoard = document.getElementById("gameboard");
	while (gameBoard.hasChildNodes()) { gameBoard.removeChild(gameBoard.firstChild); }
	var gameTable = document.createElement("table");
	gameBoard.appendChild(gameTable);
	for (var i = 0; i < 2; i++) {
		var gameRow = document.createElement("tr");
		gameTable.appendChild(gameRow);
		for (var j = 0; j < 7; j++) {
			var gameCell = document.createElement("td");
			gameRow.appendChild(gameCell);
			if (i === 0) {
				gameCell.stack = [];
				switch (j) {
					case 0:
						gameCell.setAttribute("class", "back");
						gameCell.innerHTML = 24;
						gameCell.onclick = clickStock;
						break;
					case 1:
						gameCell.setAttribute("class", "empty");
						gameCell.setAttribute("id", "wastecell");
						break;
					case 2:
						gameCell.setAttribute("class", "");
						break;
					case 3:
						gameCell.setAttribute("class", "foundation");
						//gameCell.onclick = clickCard;
						break;
					case 4:
						gameCell.setAttribute("class", "foundation");
						//gameCell.onclick = clickCard;
						break;
					case 5:
						gameCell.setAttribute("class", "foundation");
						//gameCell.onclick = clickCard;
						break;
					case 6:
						gameCell.setAttribute("class", "foundation");
						//gameCell.onclick = clickCard;
						break;
				}
			} else if (i === 1) {
				gameCell.setAttribute("class", "back");
				gameCell.onclick = clickCard;
				gameCell.stack = stock.splice(0, j + 1);
				var cardImg = document.createElement("img");
				cardImg.onclick = clickCard;
				cardImg.setAttribute("src", "images/" + gameCell.stack[gameCell.stack.length - 1] + ".jpg");
				cardImg.setAttribute("alt", gameCell.stack[gameCell.stack.length - 1]);
				gameCell.innerHTML = j;
				if (j === 0) {
					gameCell.setAttribute("class", "");
					gameCell.innerHTML = "";
				}
				gameCell.appendChild(cardImg);
			}
		}
	}
}

function clickCard(e) {
	if (e.target.getAttribute("id") === "selected") {
		// if clicking on the already selected card, unselect it
		e.target.setAttribute("id", "");
	} else if (e.target.getAttribute("class") === "back" && !e.target.hasChildNodes()) {
		if (e.target.stack.length === 1) {
			e.target.innerHTML = "";
			e.target.setAttribute("class", "");
		} else {
			e.target.innerHTML = e.target.stack.length -1;
		}
		var cardImg = document.createElement("img");
		cardImg.onclick = clickCard;
		cardImg.setAttribute("src", "images/" + e.target.stack[e.target.stack.length - 1] + ".jpg");
		cardImg.setAttribute("alt", e.target.stack[e.target.stack.length - 1]);
		e.target.appendChild(cardImg);
	} else {
		var lastCard = document.getElementById("selected");
		if (lastCard) {
			// if last card can be placed on target, then move it
			var lastStr = lastCard.getAttribute("alt");
			var lastNum = parseInt(lastStr);
			var lastSuit = lastStr.substr(-1);
			var targetStr = "";
			var targetNum = 14;
			var targetSuit = "";
			if (e.target.getAttribute("alt")) {
				targetStr = e.target.getAttribute("alt");
				targetNum = parseInt(targetStr);
				targetSuit = targetStr.substr(-1);
			}
			if ((e.target.parentNode.getAttribute("id") !== "wastecell")
				&& (e.target.parentNode.getAttribute("class") !== "behind")
				&& (lastNum === targetNum - 1)
				&& (
					((lastSuit === "S" || lastSuit === "C") && (targetSuit === "H" || targetSuit === "D"))
					|| ((lastSuit === "H" || lastSuit === "D") && (targetSuit === "S" || targetSuit === "C"))
				)
				)
			{
				var lastCell = lastCard.parentNode;
				if (lastCell.getAttribute("class") === "behind") {
					lastCell = lastCell.parentNode;
				}
				var targetCell = e.target.parentNode;
				var lastIndex = lastCell.stack.indexOf(lastStr);
				var lastLength = lastCell.stack.length - lastIndex;
				// move cards from last array to target array
				targetCell.stack = targetCell.stack.concat(lastCell.stack.splice(lastIndex));
				//for (var i = lastIndex; i < lastCell.stack.length; i++) {
				//	targetCell.stack.push(lastCell.stack.pop());
				//}
				// rebuild the last cell
				for (var i = 0; i < lastLength; i++) {
					lastCell.removeChild(lastCell.lastChild);
				}
				if (lastCell.childNodes > 1
					|| (lastCell.getAttribute("id") === "wastecell" && lastCell.stack.length > 0)) {
					if (lastCell.getAttribute("id") !== "wastecell") {
						lastCell.removeChild(lastCell.lastChild);
					}
					var cardImg = document.createElement("img");
					cardImg.onclick = clickCard;
					cardImg.setAttribute("src", "images/" + lastCell.stack[lastCell.stack.length - 1] + ".jpg");
					cardImg.setAttribute("alt", lastCell.stack[lastCell.stack.length - 1]);
					lastCell.appendChild(cardImg);
				}
				// rebuild the target cell
				targetCell.removeChild(targetCell.lastChild);
				for (var i = targetCell.stack.length - lastLength - 1; i < targetCell.stack.length - 1; i++) {
					var cardDiv = document.createElement("div");
					cardDiv.setAttribute("class", "behind");
					targetCell.appendChild(cardDiv);
					var cardImg = document.createElement("img");
					cardImg.onclick = clickCard;
					cardImg.setAttribute("src", "images/" + targetCell.stack[i] + ".jpg");
					cardImg.setAttribute("alt", targetCell.stack[i]);
					cardDiv.appendChild(cardImg);
				}
				var cardImg = document.createElement("img");
				cardImg.onclick = clickCard;
				cardImg.setAttribute("src", "images/" + targetCell.stack[targetCell.stack.length - 1] + ".jpg");
				cardImg.setAttribute("alt", targetCell.stack[targetCell.stack.length - 1]);
				targetCell.appendChild(cardImg);
			} else {
				lastCard.setAttribute("id", "");
				e.target.setAttribute("id", "selected");
			}
		} else {
			e.target.setAttribute("id", "selected");
		}
	}
}

function clickStock(e) {
	if (document.getElementById("selected")) {
		document.getElementById("selected").setAttribute("id", "");
	}
	var wasteCell = document.getElementById("wastecell");
	if (stock.length > 0) {
		wasteCell.stack.push(stock.pop());
		var wasteImg;
		if (wasteCell.hasChildNodes()) {
			wasteImg = wasteCell.firstChild;
		} else {
			wasteImg = document.createElement("img");
			wasteCell.appendChild(wasteImg);
			wasteImg.onclick = clickCard;
		}
		wasteImg.setAttribute("src", "images/" + wasteCell.stack[wasteCell.stack.length - 1] + ".jpg");
		wasteImg.setAttribute("alt", wasteCell.stack[wasteCell.stack.length - 1]);
		if (stock.length > 0) {
			e.target.innerHTML = stock.length;
		} else {
			e.target.innerHTML = "";
			e.target.setAttribute("class", "empty");
		}
	} else if (wasteCell.stack.length > 0) {
		stock = wasteCell.stack.splice(0, wasteCell.stack.length);
		stock.reverse();
		e.target.setAttribute("class", "back");
		e.target.innerHTML = stock.length;
		wasteCell.removeChild(wasteCell.firstChild);
	}
}