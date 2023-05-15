document.body.style.fontFamily = "sans-serif"
const completedChallenge = document.querySelectorAll("li:nth-child(-n+3)")
const onGoingChallenge = document.querySelectorAll(
    "li:nth-child(4), li:nth-child(5)"
)
const comingChallenge = document.querySelectorAll("li:nth-last-child(-n+2)")
completedChallenge.forEach((node) => (node.style.background = "green"))
onGoingChallenge.forEach((node) => (node.style.background = "yellow"))
comingChallenge.forEach((node) => (node.style.background = "red"))

document.querySelector("h3").innerText = new Intl.DateTimeFormat("en-us", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Australia/Sydney",
}).format(new Date())

setInterval(changeYearColor, 2000)

setInterval(changeDateTimeBackgroundColor, 1000)

function changeYearColor() {
    const yearElement = document.querySelector("h3")
    const colors = ["red", "green", "blue", "orange"] // Add more colors if needed
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    yearElement.style.color = randomColor
}

function changeDateTimeBackgroundColor() {
    const dateTimeElement = document.querySelector("h1")
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16)
    dateTimeElement.style.backgroundColor = randomColor
}
