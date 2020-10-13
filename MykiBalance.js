
// 
// Myki Balance V1.0
// Run on Scriptable
// Created by Ricky Li on 2020/10/12
// Last modified on 2020/10/13
// https://github.com/imchlorine/MykiBalance.git
// This Script is used for feching Myki Balance from MyKi website api.
// This script does not suport Myki Pass atm as I do not have a Myki Pass.
// No idea about the myki pass data will be like. 
// For the same reason, the passenger type (Full Fare, Concession, Child etc) may not accurate, feel free to let me know how to fix them
// 

let cardNumber = "Your Card Number"
// 
// Do not Edit below
// 

let ptvWebAuth = await getMykitoken()

let card = await getCard()

let widget = await createWidget(card)

if ( ! config.runsInWidget) {
    await widget.presentMedium()
}

Script.setWidget(widget)
Script.complete()

async function createWidget(card) {

 let currentTime = new Date()
 let df = new DateFormatter()
  df.useMediumDateStyle()
  df.useShortTimeStyle()
 let dateTxt = df.string(currentTime)
 
 let mykiBalance = card["mykiBalance"]
 let rangeTxt = ""
 let rangeColor = ""
 let balanceTxt = mykiBalance < 0 ? "- $" + mykiBalance.replace(/-/, "") : "$" + mykiBalance
 
 switch (true) {
    case (mykiBalance <= 0):
        rangeTxt = "No Money"
        rangeColor = "#ff0000"
        break;
    case (mykiBalance < 10):
        rangeTxt = "Low Balance"
        rangeColor = "#ffcc00"
        break;
    default:
        rangeTxt = "Happy Travel"
        rangeColor = "#b6e037"
        break;
 }
 
 let passengerCode = card["passengerCode"]
 let passengerTxt = ""
 
 switch (passengerCode) {
    case 1:
        passengerTxt = "Full Fare"
        break;
    case 2:
        passengerTxt = "Concession"
        break;
    case 3:
        passengerTxt = "Child"
        break;
    case 4:
        passengerTxt = "Senior"
        break;
     default:
        passengerTxt = "Full Fare"
        break;
 }
 
    let widget = new ListWidget()
    widget.backgroundColor = new Color("#4a525a")

    widget.addSpacer()
    let mykiUpdateTime = widget.addStack()
    let updateTxt =mykiUpdateTime.addText("Last updated ")
        updateTxt.font = Font.boldSystemFont(12)
        updateTxt.textColor = new Color("#eeeeee") 

    let updateTime = mykiUpdateTime.addText(dateTxt)
        updateTime.font = Font.boldSystemFont(12)
        updateTime.textColor = new Color("#eeeeee")  
 
    let mykiTitle = widget.addStack()
    let mykiLogo = mykiTitle.addText("myki")
        mykiLogo.font = Font.boldSystemFont(30)
        mykiLogo.textColor = new Color("#b6e037")  
        mykiTitle.addSpacer()

    let mykiCode= mykiTitle.addText(rangeTxt)
        mykiCode.font = Font.boldSystemFont(16)
        mykiCode.textColor = new Color(rangeColor)
        mykiCode.url = "googlechrome://www.ptv.vic.gov.au/tickets/myki/#topup"
        widget.addSpacer()

    let balanceTex = widget.addText(balanceTxt)
        balanceTex.font = Font.boldSystemFont(40)
        balanceTex.textColor = new Color("#eeeeee")
        balanceTex.url = "googlechrome://www.ptv.vic.gov.au/tickets/myki/#topup"
        widget.addSpacer()
   

    let bottomView = widget.addStack()

    let expireDate = bottomView.addText("expiry date: " + card["mykiCardExpiryDate"])
        expireDate.font = Font.boldSystemFont(10)
        expireDate.textColor = new Color("#eeeeee")
        bottomView.addSpacer()
 
    addSymbol({
    symbol: 'tram.fill',
    stack: bottomView,
    })
    addSymbol({
    symbol: 'tram',
    stack: bottomView,
    })
    addSymbol({
    symbol: 'bus',
    stack: bottomView,
    })
    bottomView.addSpacer()
    let travelType = bottomView.addText(passengerTxt)
        travelType.font = Font.boldSystemFont(10)
        travelType.textColor = new Color("#eeeeee")
        widget.addSpacer()

    return widget
}


function addSymbol({
    symbol = 'applelogo',
    stack,
    color = Color.white(),
    size = 12,
}) {
  const _sym = SFSymbol.named(symbol)
  const wImg = stack.addImage(_sym.image)
  wImg.tintColor = color
  wImg.imageSize = new Size(size, size)
}

async function getMykitoken() {
  let url = "https://www.ptv.vic.gov.au/tickets/myki"
  let req = new Request(url)
  let result = await req.loadString()
  let matchToken = result.match(/"mykiToken":"([^"]+)","mykiTime":([0-9]+)+/)
  let mykiToken = matchToken[1].replace(/\\\//g, "/")
  let mykiTime = matchToken[2]
  return mykiTime + "-" + mykiToken
}

async function getCard() {
  let url = "https://mykiapi.ptv.vic.gov.au/v2/myki/card"
  let req = new Request(url)
  req.method = "POST"
  let defaultHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json"}
  authHeader = {"x-ptvwebauth": ptvWebAuth}
  req.headers = {
    ...defaultHeaders,
    ...authHeader
  }
  let data = {"0": {"mykiCardNumber": cardNumber}}
  req.body = JSON.stringify(data)
  let result = await req.loadJSON()

//   console.log(result)

  if (result["code"] == 1) {
    return result["data"][0]
  }
  let alert = new Alert()
    alert.title = "Error"
    alert.message = result["message"]
    await alert.present()
  return null
}