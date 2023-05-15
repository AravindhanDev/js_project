const first = document.querySelector("p")
const man1 = document.getElementById("man1")
const man2 = document.getElementById("man2")
const man3 = document.getElementById("man3")
const man4 = document.getElementById("man4")
const pNodes = document.querySelectorAll("p")
const oddNodes = document.querySelectorAll("p:nth-child(odd)")
const evenNodes = document.querySelectorAll("p:nth-child(even)")
for (let i = 0; i < pNodes.length; i++) {
    console.log(pNodes[i].textContent)
    pNodes[i].style.background = "black"
    pNodes[i].style.color = "white"
    pNodes[i].style.fontSize = "1.2rem"
    pNodes[i].style.border = "2px solid red"
}
oddNodes.forEach((node) => (node.style.background = "green"))
evenNodes.forEach((node) => (node.style.background = "red"))
