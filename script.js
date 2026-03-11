const startCapital = 100000

let balance = parseFloat(localStorage.getItem("balance")) || startCapital

let portfolio = JSON.parse(localStorage.getItem("portfolio")) || {}
let stocks = {

Nifty:{price:15000},
Sensex:{price:50000},
TCS:{price:3500},
Infosys:{price:1800},
Wipro:{price:450},

Reliance:{price:2500},
HDFCBank:{price:1650},
ICICIBank:{price:1200},
AxisBank:{price:1100},
KotakBank:{price:1800},
SBI:{price:750},
BhartiAirtel:{price:1400},
ITC:{price:420},
HUL:{price:2500},
AsianPaints:{price:3000},
Maruti:{price:10500},
TataMotors:{price:900},
BajajFinance:{price:7000},
UltraTechCement:{price:9500},
Titan:{price:3800},
SunPharma:{price:1500},
AdaniPorts:{price:1200}

}



let aiPlayers = [
{name:"Riya",score:100000},
{name:"Arjun",score:100000},
{name:"Kabir",score:100000},
{name:"Meera",score:100000},
{name:"Rahul",score:100000}
]

const balanceEl = document.getElementById("balance")
const marketTable = document.getElementById("marketTable")
const portfolioTable = document.getElementById("portfolioTable")
const portfolioValueEl = document.getElementById("portfolio")
const profitEl = document.getElementById("profit")
const lossEl = document.getElementById("loss")
const leaderboardTable = document.getElementById("leaderboardTable")
const badgeList = document.getElementById("badgeContainer")



function scrollToSection(id){
document.getElementById(id).scrollIntoView({
behavior:"smooth"
})
}



function renderMarket(){

marketTable.innerHTML=""

for(let stock in stocks){

let price = stocks[stock].price
let change = (Math.random()*6 -3).toFixed(2)

marketTable.innerHTML += `
<tr>
<td>${stock}</td>
<td>₹${price}</td>
<td class="${change>=0?'gain':'lossColor'}">${change}%</td>

<td>
<input id="qty-${stock}" type="number" value="1" min="1">
</td>

<td>
<button class="buyBtn" onclick="buyStock('${stock}')">
Buy
</button>
</td>

</tr>
`
}

}



function buyStock(stock){

let qty = parseInt(document.getElementById(`qty-${stock}`).value)

if(!qty || qty<=0){
alert("Enter valid quantity")
return
}

let price = stocks[stock].price
let cost = qty * price

if(cost > balance){
alert("Insufficient balance")
return
}

balance -= cost

if(!portfolio[stock]){
portfolio[stock] = {shares:0,avg:0}
}

let p = portfolio[stock]

p.avg = ((p.avg * p.shares) + cost) / (p.shares + qty)
p.shares += qty

updateUI()

}



function sellStock(stock){

let qty = parseInt(document.getElementById(`sell-${stock}`).value)

let p = portfolio[stock]

if(!p || qty > p.shares || qty<=0){
alert("Invalid quantity")
return
}

let price = stocks[stock].price

balance += qty * price

p.shares -= qty

if(p.shares === 0){
delete portfolio[stock]
}

updateUI()

}



function renderPortfolio(){

portfolioTable.innerHTML=""

let portfolioValue = 0

for(let stock in portfolio){

let p = portfolio[stock]

let currentPrice = stocks[stock].price

let value = currentPrice * p.shares

let invested = p.avg * p.shares

let pl = value - invested

portfolioValue += value

portfolioTable.innerHTML += `
<tr>

<td>${stock}</td>

<td>${p.shares}</td>

<td>₹${Math.round(p.avg)}</td>

<td>₹${currentPrice}</td>

<td>₹${Math.round(value)}</td>

<td class="${pl>=0?'gain':'lossColor'}">
₹${Math.round(pl)}
</td>

<td>
<input id="sell-${stock}" type="number" value="1" min="1">
</td>

<td>
<button class="sellBtn" onclick="sellStock('${stock}')">
Sell
</button>
</td>

</tr>
`
let investedTotal = 0
let bestStock = "-"
let bestProfit = -999999
let totalStocks = 0

for(let stock in portfolio){

let p = portfolio[stock]

let currentPrice = stocks[stock].price
let value = currentPrice * p.shares
let invested = p.avg * p.shares
let pl = value - invested

investedTotal += invested
totalStocks += p.shares

if(pl > bestProfit){
bestProfit = pl
bestStock = stock
}

}

document.getElementById("invested").innerText = "₹"+Math.round(investedTotal)
document.getElementById("stocksOwned").innerText = totalStocks
document.getElementById("bestStock").innerText = bestStock
}

portfolioValueEl.innerText = Math.round(portfolioValue)

let totalValue = portfolioValue + balance

let pl = totalValue - startCapital

if(pl>=0){
profitEl.innerText = Math.round(pl)
lossEl.innerText = 0
}else{
lossEl.innerText = Math.abs(Math.round(pl))
profitEl.innerText = 0
}

updateLeaderboard(totalValue)
checkBadges(pl)

}



function fluctuatePrices(){

let advanced = document.getElementById("volatilityMode")?.checked

for(let s in stocks){

let volatility = advanced ? 10 : 6

let change = (Math.random()*volatility - volatility/2)/100

stocks[s].price += stocks[s].price * change

stocks[s].price = Math.max(50,Math.round(stocks[s].price))

}

renderMarket()
renderPortfolio()

}



function simulateAI(){

aiPlayers.forEach(player=>{

let change = (Math.random()*6 -3)/100

player.score += player.score * change

player.score = Math.round(player.score)

if(player.score < 50000){
player.score = 50000
}

})

}



function updateLeaderboard(userValue){

simulateAI()

let data = [...aiPlayers]

data.push({
name:"You",
score:userValue
})

data.sort((a,b)=>b.score-a.score)

leaderboardTable.innerHTML=""

data.forEach((player,index)=>{

leaderboardTable.innerHTML += `
<tr>

<td>${index+1}</td>

<td>${player.name}</td>

<td>₹${Math.round(player.score)}</td>

</tr>
`
})

}
function checkBadges(pl){

badgeContainer.innerHTML=""

if(pl > 10000){
badgeContainer.innerHTML += `<div class="badge">🚀 Rising Investor</div>`
}

if(pl > 50000){
badgeContainer.innerHTML += `<div class="badge">💰 Market Master</div>`
}

if(pl > 100000){
badgeContainer.innerHTML += `<div class="badge">🏆 Stock Market Legend</div>`
}

if(Object.keys(portfolio).length >= 5){
badgeContainer.innerHTML += `<div class="badge">📊 Diversification Expert</div>`
}

if(balance > 200000){
badgeContainer.innerHTML += `<div class="badge">💎 Wealth Builder</div>`
}

if(Object.keys(portfolio).length >= 10){
badgeContainer.innerHTML += `<div class="badge">🔥 Portfolio Giant</div>`
}

}






function updateUI(){

balanceEl.innerText = Math.round(balance)

localStorage.setItem("portfolio",JSON.stringify(portfolio))
localStorage.setItem("balance",balance)

renderPortfolio()

}



renderMarket()
updateUI()



setInterval(fluctuatePrices,3000)
document.getElementById("stockLogo").src = "images/stock.png";

function resetGame(){

if(confirm("Start new trading simulation?")){

localStorage.clear()

balance = startCapital
portfolio = {}

updateUI()

renderMarket()

alert("Simulation Reset Successfully")

}

}