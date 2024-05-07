
/**
 * Setup
 */


let total = JSON.parse(localStorage.getItem("user")).balance;
let totalBalanceElem = document.getElementById("balance");
let currentUser = JSON.parse(localStorage.getItem("user"));
totalBalanceElem.innerText = Number(total);

let balanceBtn = document.getElementById("balanceBtn");


const debugEl = document.getElementById('debug'),
			// Mapping of indexes to icons
			iconMap = ["40%", "50%", "35%", "10%", "15%", "20%", "25%", "30%", "5%"],
			// Width of the icons
			icon_width = 79,	
			// Height of one icon in the strip
			icon_height = 79,	
			// Number of icons in the strip
			num_icons = 9,	
			// Max-speed in ms for animating one icon down
			time_per_icon = 100,
			// Holds icon indexes
			indexes = [0, 0, 0];


/** 
 * Roll one reel
 */
const roll = (reel, offset = 0) => {
	// Minimum of 2 + the reel offset rounds
	const delta = (offset + 2) * num_icons + Math.round(Math.random() * num_icons); 
	
	// Return promise so we can wait for all reels to finish
	return new Promise((resolve, reject) => {
		
		const style = getComputedStyle(reel),
					// Current background position
					backgroundPositionY = parseFloat(style["background-position-y"]),
					// Target background position
					targetBackgroundPositionY = backgroundPositionY + delta * icon_height,
					// Normalized background position, for reset
					normTargetBackgroundPositionY = targetBackgroundPositionY%(num_icons * icon_height);
		
		// Delay animation with timeout
		setTimeout(() => { 
			// Set transition properties
			reel.style.transition = `background-position-y ${(8 + 1 * delta) * time_per_icon}ms cubic-bezier(.41,-0.01,.63,1.09)`;
			// Set background position
			reel.style.backgroundPositionY = `${backgroundPositionY + delta * icon_height}px`;
		}, offset * 150);
			
		// After animation
		setTimeout(() => {
			// Reset position, so that it doesn't get higher without limit
			reel.style.transition = `none`;
			reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;
			// Resolve this promise
			resolve(delta%num_icons);
		}, (8 + 1 * delta) * time_per_icon + offset * 150);
		
	});
};


/**
 * Roll all reels, when promise resolves roll again
 */
function rollAll() {
	
	
	
	const reelsList = document.querySelectorAll('.slots > .reel');

	if (total >= 100) {
		updateBalanceAfterRoll()
	
	Promise
		
		// Activate each reel
		.all( [...reelsList].map((reel, i) => roll(reel, i)) )	
		
		// When all reels done animating (all promises solve)
		.then((deltas) => {
			// add up indexes
			deltas.forEach((delta, i) => indexes[i] = (indexes[i] + delta)%num_icons);
			debugEl.textContent = indexes.map((i) => iconMap[i]).join(' - ');
			// Win conditions
			if (indexes[0] == indexes[1] || indexes[1] == indexes[2] || indexes[0] == indexes[2]) {

				const winCls = indexes[0] == indexes[2] ? "win2" : "win1";
				document.querySelector(".slots").classList.add(winCls);
				
				if (winCls == "win1") {
					alert("Вы получаете скидку в " + iconMap[indexes[1]])
				} else if (winCls == "win2") {
					alert("Вы получаете скидку в " + iconMap[indexes[0]])
				}
				
				setTimeout(() => document.querySelector(".slots").classList.remove(winCls), 2000)
				
			}
			console.log(indexes);
			// Run Againw
			//setTimeout(rollAll, 3000);
		});
	} else {
		alert("У Вас недостаточно средств. Пополните баланс")
	}
};

function updateBalanceAfterRoll(){
	total = Number(total) - 100;
	totalBalanceElem.innerText = total;
	currentUser.balance = totalBalanceElem.innerText;
	localStorage.setItem("user", JSON.stringify(currentUser))
}

document.body.onkeyup = function(e) {
    if (e.key == " " ||
        e.code == "Space" ||      
        e.keyCode == 32      
    ) {
			setTimeout(rollAll, 100);
		
    }
}

balanceBtn.addEventListener("click", updateBalanceAfterPayment, false)

function updateBalanceAfterPayment(){
	let paid = prompt("Пополнить баланс на: ", 0);
	total = paid == null ? 0 : Number(total)+Number(paid);
	totalBalanceElem.innerText = total;
	currentUser.balance = totalBalanceElem.innerText;
	localStorage.setItem("user", JSON.stringify(currentUser))
}



