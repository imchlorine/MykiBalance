// Myki Balance V2.0
// Run on Scriptable
// Created by Ricky Li on 2020/10/12
// Last modified on 2021/02/08
// https://github.com/imchlorine/MykiBalance.git
// This Script is used for feching Myki Balance from MyKi website.
// The passenger type (Concession, Child etc) may not accurate, cos I only have a full fare Card.
// Important! This Widget is not affiliated to PTV or Myki. For personal use only.

let cardNumber = args.widgetParameter

//let cardNumber = "308425123456789"
let ptvWebAuth = await getMykitoken()

let card = await getCard()

let widget = await createWidget(card)

if (!config.runsInWidget) {
    await widget.presentMedium()
}

Script.setWidget(widget)
Script.complete()

async function createWidget(card) {

    let widget = new ListWidget()

    if (card["code"] != 1) {
        let alertMessage = widget.addText(card["message"])
        alertMessage.font = new Font("AppleSDGothicNeo-bold", 14)
        alertMessage.textColor = new Color("#ff0000")
        return widget
    }

    card = card["data"][0]

    let currentTime = new Date()
    let df = new DateFormatter()
    df.useMediumDateStyle()
    df.useShortTimeStyle()
    let dateTxt = df.string(currentTime)

    let mykiBalance = card["mykiBalance"]
    // force balance to be 2 decimal places
    let mykiBalanceValue = parseFloat(mykiBalance).toFixed(2).toString()
    let balanceSign = mykiBalance < 0 ? "- $" + mykiBalance.replace(/-/, "") : "$"
    let balanceTxt = balanceSign + mykiBalance
    let mykiPass = card["Product"] || []

    if (config.runsWithSiri) {
        Speech.speak("You have " + balanceTxt + " left in your Myki money!")
        if (mykiPass.length > 0) {
            Speech.speak("You have " + mykiPass[0]["daysRemaining"] + " days remaining in your Myki pass!")
        }
    }

    let passengerCode = card["passengerCode"]
    let passengerTxt = ""

    switch (passengerCode) {
        case 1: // Verified
            passengerTxt = "Full Fare"
            break;
        case 2: // Unverified
            passengerTxt = "Concession"
            break;
        case 3: // Unverified
            passengerTxt = "Child"
            break;
        case 4: // Unverified
            passengerTxt = "Senior"
            break;
        case 7: // Verified
            passengerTxt = "Student Concession"
        default:
            passengerTxt = "Full Fare"
            break;
    }


    // Set gradient background
    let startColor = new Color("333434")
    let midColor = new Color("333434")
    let endColor = new Color("#ffffff")
    let gradient = new LinearGradient()
    gradient.colors = [startColor, midColor, endColor]
    gradient.locations = [0.0, 0.72, 0.721]
    widget.backgroundGradient = gradient

    widget.addSpacer()

    let mykiUpdateTime = widget.addStack()
    let updateTxt = mykiUpdateTime.addText("")
    // updateTxt.font = new Font("AppleSDGothicNeo-bold", 10)
    updateTxt.font = new Font("AppleSDGothicNeo-Light", 10)
    updateTxt.textColor = new Color("#eeeeee")

    let updateTime = mykiUpdateTime.addText(dateTxt)
    updateTime.font = new Font("AppleSDGothicNeo-bold", 10)
    updateTime.textColor = new Color("#eeeeee")

    let mykiTitle = widget.addStack()
    mykiTitle.centerAlignContent()

    let mykiLogo = mykiTitle.addText("•••• " + cardNumber.slice(-5,-1) + " " + cardNumber.slice(-1))
    mykiLogo.font = new Font("AppleSDGothicNeo-bold", 16)
    mykiLogo.textColor = new Color("#ffffff")
    mykiTitle.addSpacer()

    let mykiCode = mykiTitle.addText("Top Up")
    let mykiSymbol = mykiTitle.addText(" >")
    mykiCode.font = new Font("AppleSDGothicNeo-bold", 16)
    mykiSymbol.font = new Font("AppleSDGothicNeo-bold", 16)
    mykiSymbol.textColor = new Color("#d92b26")
    mykiCode.textColor = new Color("#ffffff")
    mykiCode.url = "googlechrome://www.ptv.vic.gov.au/tickets/myki/#topup"

    widget.addSpacer()

    if (mykiPass.length > 0) {
        let middleViewTitle = widget.addStack()
        let moneyTitle = middleViewTitle.addText("myki money")
        moneyTitle.font = new Font("AppleSDGothicNeo-bold", 12)
        moneyTitle.textColor = new Color("#eeeeee")
        middleViewTitle.addSpacer()

        let passTitle = middleViewTitle.addText("myki pass")
        passTitle.font = new Font("AppleSDGothicNeo-bold", 12)
        passTitle.textColor = new Color("#eeeeee")
    }

    let middleView = widget.addStack()
    let balanceTitleSign = middleView.addText(balanceSign)
    balanceTitleSign.textColor = new Color("#c2d840")
    balanceTitleSign.font = new Font("AppleSDGothicNeo-Regular", 30)
    let balanceTitle = middleView.addText(mykiBalanceValue)
    balanceTitle.font = new Font("AppleSDGothicNeo-Regular", 30)
    balanceTitle.textColor = new Color("#ffffff")
    middleView.addSpacer()

    if (mykiPass.length > 0) {
        let daysRemaining = mykiPass[0]["daysRemaining"].toString()
        let daysRemainingTitle = middleView.addText(daysRemaining)
        daysRemainingTitle.font = new Font("AppleSDGothicNeo-bold", 40)
        daysRemainingTitle.textColor = new Color("#eeeeee")
    }

    middleView.bottomAlignContent()

    widget.addSpacer()

    let bottomView = widget.addStack()

    let expireText = bottomView.addText("Expiry: ")
    expireText.textColor = new Color("#000000")
    expireText.font = new Font("AppleSDGothicNeo-regular", 10)
    expire_df = new DateFormatter()
    expire_df.useMediumDateStyle()
    let expireDateStr = expire_df.string(new Date(card["mykiCardExpiryDate"]))
    let expireDate = bottomView.addText(expireDateStr)
    expireDate.font = new Font("AppleSDGothicNeo-bold", 10)
    expireDate.textColor = new Color("#000000")
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
    travelType.font = new Font("AppleSDGothicNeo-bold", 10)
    travelType.textColor = new Color("#000000")
    widget.addSpacer()

    return widget
}


function addSymbol({
    symbol = 'applelogo',
    stack,
    color = Color.black(),
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
        "Content-Type": "application/json"
    }
    authHeader = { "x-ptvwebauth": ptvWebAuth }
    req.headers = {
        ...defaultHeaders,
        ...authHeader
    }
    let data = { "0": { "mykiCardNumber": cardNumber } }
    req.body = JSON.stringify(data)
    let result = await req.loadJSON()
    log(result)
    return result
}