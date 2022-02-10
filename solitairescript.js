"use strict";

var stock = [];

window.onload = function() {
	document.getElementById("play").onclick = createGame;
	createGame();
}

function createGame() {
	// use the stock as the base for the shuffled deck
	stock = ['1S', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', '11S', '12S', '13S',
	'1H', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', '11H', '12H', '13H',
	'1C', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', '11C', '12C', '13C',
	'1D', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', '11D', '12D', '13D'];
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
						gameCell.addEventListener("click", clickFoundation);
						break;
					case 4:
						gameCell.setAttribute("class", "foundation");
						gameCell.addEventListener("click", clickFoundation);
						break;
					case 5:
						gameCell.setAttribute("class", "foundation");
						gameCell.addEventListener("click", clickFoundation);
						break;
					case 6:
						gameCell.setAttribute("class", "foundation");
						gameCell.addEventListener("click", clickFoundation);
						break;
				}
			} else if (i === 1) {
				gameCell.setAttribute("class", "back");
				gameCell.stack = stock.splice(0, j + 1);
				var cardImg = document.createElement("img");
				cardImg.onclick = clickCard;
				cardImg.setAttribute("src", "images/" + gameCell.stack[gameCell.stack.length - 1] + ".jpg");
				cardImg.setAttribute("alt", gameCell.stack[gameCell.stack.length - 1]);
				gameCell.innerHTML = j;
				if (j === 0) {
					gameCell.setAttribute("class", "tableau");
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
		e.target.removeAttribute("id");
	} else {
		var lastCard = document.getElementById("selected");
		if (lastCard) {
			// if last card can be placed on target, then move it
			var lastStr = lastCard.getAttribute("alt");
			var lastNum = parseInt(lastStr);
			var lastSuit = lastStr.substr(-1);
			var targetStr = e.target.getAttribute("alt");
			var targetNum = parseInt(targetStr);
			var targetSuit = targetStr.substr(-1);
			//if (e.target.getAttribute("alt")) {
			//	targetStr = e.target.getAttribute("alt");
			//	targetNum = parseInt(targetStr);
			//	targetSuit = targetStr.substr(-1);
			//}
			if ((e.target.parentNode.getAttribute("id") !== "wastecell")
				&& (e.target.parentNode.getAttribute("class") !== "behind")
				&& (
					(
						(lastNum === targetNum - 1)
						&& (
							((lastSuit === "S" || lastSuit === "C") && (targetSuit === "H" || targetSuit === "D"))
							|| ((lastSuit === "H" || lastSuit === "D") && (targetSuit === "S" || targetSuit === "C"))
							)
					)
					||
					(
						(e.target.parentNode.getAttribute("class") === "foundation")
						&& (lastCard.parentNode.getAttribute("class") !== "behind")
						&& (lastNum === targetNum + 1)
						&& (lastSuit === targetSuit)
					)
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
				// rebuild the last cell
				for (var i = 0; i < lastLength; i++) {
					lastCell.removeChild(lastCell.lastChild);
				}
				if (lastCell.childElementCount > 0
					|| (lastCell.getAttribute("id") === "wastecell" && lastCell.stack.length > 0)
					|| (lastCell.getAttribute("class") === "foundation" && lastCell.stack.length > 0)) {
					if (lastCell.getAttribute("id") !== "wastecell"
					&& lastCell.getAttribute("class") !== "foundation") {
						lastCell.removeChild(lastCell.lastChild);
					}
					var cardImg = document.createElement("img");
					cardImg.onclick = clickCard;
					cardImg.setAttribute("src", "images/" + lastCell.stack[lastCell.stack.length - 1] + ".jpg");
					cardImg.setAttribute("alt", lastCell.stack[lastCell.stack.length - 1]);
					lastCell.appendChild(cardImg);
				} else if (lastCell.getAttribute("class") === "foundation") {
					lastCell.addEventListener("click", clickFoundation);
				} else if (lastCell.getAttribute("class") === "back") {
					lastCell.addEventListener("click", clickBack);
				} else if (lastCell.getAttribute("class") === "tableau") {
					lastCell.addEventListener("click", clickTableau);
				}
				// rebuild the target cell
				if (targetCell.getAttribute("class") === "foundation") {
					e.target.setAttribute("src", "images/" + targetCell.stack[targetCell.stack.length - 1] + ".jpg");
					e.target.setAttribute("alt", targetCell.stack[targetCell.stack.length - 1]);
					var allTab = document.querySelectorAll(".tableau");
					var winState = 7;
					for (var i = 0; i < allTab.length; i++) {
						if (allTab[i].stack.length === 0) { winState -= 1; }
					}
					if (winState === 0) {
						alert("You win!");
					}
				} else {
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
				}
			} else {
				lastCard.removeAttribute("id");
				e.target.setAttribute("id", "selected");
			}
		} else {
			e.target.setAttribute("id", "selected");
		}
	}
}

function clickStock(e) {
	if (document.getElementById("selected")) {
		document.getElementById("selected").removeAttribute("id");
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

function clickBack(e) {
	if (document.getElementById("selected")) {
		document.getElementById("selected").removeAttribute("id");
	}
	if (e.target.stack.length === 1) {
		e.target.innerHTML = "";
		e.target.setAttribute("class", "tableau");
	} else {
		e.target.innerHTML = e.target.stack.length - 1;
	}
	var cardImg = document.createElement("img");
	cardImg.onclick = clickCard;
	cardImg.setAttribute("src", "images/" + e.target.stack[e.target.stack.length - 1] + ".jpg");
	cardImg.setAttribute("alt", e.target.stack[e.target.stack.length - 1]);
	e.target.appendChild(cardImg);
	e.target.removeEventListener("click", clickBack);
}

function clickTableau(e) {
	var lastCard = document.getElementById("selected");
	if (lastCard && parseInt(lastCard.getAttribute("alt")) === 13) {
		var lastCell = lastCard.parentNode;
		if (lastCell.getAttribute("class") === "behind") {
			lastCell = lastCell.parentNode;
		}
		var lastStr = lastCard.getAttribute("alt");
		var lastIndex = lastCell.stack.indexOf(lastStr);
		var lastLength = lastCell.stack.length - lastIndex;
		// move card between arrays
		e.target.stack = e.target.stack.concat(lastCell.stack.splice(lastIndex));
		// rebuild last cell
		for (var i = 0; i < lastLength; i++) {
			lastCell.removeChild(lastCell.lastChild);
		}
		if (lastCell.childElementCount > 0
			|| (lastCell.getAttribute("id") === "wastecell" && lastCell.stack.length > 0)
			|| (lastCell.getAttribute("class") === "foundation" && lastCell.stack.length > 0)) {
			if (lastCell.getAttribute("id") !== "wastecell"
			&& lastCell.getAttribute("class") !== "foundation") {
				lastCell.removeChild(lastCell.lastChild);
			}
			var cardImg = document.createElement("img");
			cardImg.onclick = clickCard;
			cardImg.setAttribute("src", "images/" + lastCell.stack[lastCell.stack.length - 1] + ".jpg");
			cardImg.setAttribute("alt", lastCell.stack[lastCell.stack.length - 1]);
			lastCell.appendChild(cardImg);
		} else if (lastCell.getAttribute("class") === "back") {
			lastCell.addEventListener("click", clickBack);
		} else if (lastCell.getAttribute("class") === "tableau") {
			lastCell.addEventListener("click", clickTableau);
		}
		// build target cell
		for (var i = e.target.stack.length - lastLength; i < e.target.stack.length - 1; i++) {
			var cardDiv = document.createElement("div");
			cardDiv.setAttribute("class", "behind");
			e.target.appendChild(cardDiv);
			var cardImg = document.createElement("img");
			cardImg.onclick = clickCard;
			cardImg.setAttribute("src", "images/" + e.target.stack[i] + ".jpg");
			cardImg.setAttribute("alt", e.target.stack[i]);
			cardDiv.appendChild(cardImg);
		}
		var cardImg = document.createElement("img");
		cardImg.onclick = clickCard;
		cardImg.setAttribute("src", "images/" + e.target.stack[e.target.stack.length - 1] + ".jpg");
		cardImg.setAttribute("alt", e.target.stack[e.target.stack.length - 1]);
		e.target.appendChild(cardImg);
		e.target.removeEventListener("click", clickTableau);
	}
}

function clickFoundation(e) {
	var lastCard = document.getElementById("selected");
	if (lastCard
		&& parseInt(lastCard.getAttribute("alt")) === 1
		&& lastCard.parentNode.getAttribute("class") !== "behind")
	{
		var lastCell = lastCard.parentNode;
		// move card between arrays
		e.target.stack.push(lastCell.stack.pop());
		// rebuild last cell
		lastCell.removeChild(lastCell.lastChild);
		if (lastCell.childElementCount > 0
			|| (lastCell.getAttribute("id") === "wastecell" && lastCell.stack.length > 0))
		{
			if (lastCell.getAttribute("id") !== "wastecell") {
				lastCell.removeChild(lastCell.lastChild);
			}
			var cardImg = document.createElement("img");
			cardImg.onclick = clickCard;
			cardImg.setAttribute("src", "images/" + lastCell.stack[lastCell.stack.length - 1] + ".jpg");
			cardImg.setAttribute("alt", lastCell.stack[lastCell.stack.length - 1]);
			lastCell.appendChild(cardImg);
		} else if (lastCell.getAttribute("class") === "back") {
			lastCell.addEventListener("click", clickBack);
		} else if (lastCell.getAttribute("class") === "foundation") {
			lastCell.addEventListener("click", clickFoundation);
		} else if (lastCell.getAttribute("class") === "tableau") {
			lastCell.addEventListener("click", clickTableau);
		}
		// put moved card onto foundation
		var cardImg2;
		if (e.target.hasChildNodes()) {
			cardImg2 = e.target.firstChild;
		} else {
			cardImg2 = document.createElement("img");
			e.target.appendChild(cardImg2);
			cardImg2.onclick = clickCard;
		}
		cardImg2.setAttribute("src", "images/" + e.target.stack[e.target.stack.length - 1] + ".jpg");
		cardImg2.setAttribute("alt", e.target.stack[e.target.stack.length - 1]);
		e.target.removeEventListener("click", clickFoundation);
	}
}

function winGame() {

}
