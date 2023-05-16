const idInput = document.getElementById("idInput")
const nameInput = document.getElementById("name")
const priceInput = document.getElementById("price")
const fileName = document.querySelector(".fileName")
const fileSize = document.querySelector(".fileSize")
// all divs
const productIdDiv = document.getElementById("productIdDiv")
const productNameDiv = document.getElementById("productNameDiv")
const productPriceDiv = document.getElementById("productPriceDiv")
const uploadImgBtnDiv = document.getElementById("uploadImgBtnDiv")
const productDescriptionDiv = document.getElementById("productDescriptionDiv")
// all inputs
const noData = document.querySelector(".no-data")
const productIdInput = document.getElementById("productId")
const fileInput = document.getElementById("fileInput")
const uploadImgBtn = document.getElementById("uploadImgBtn")
const descriptionInput = document.getElementById("description")
const mainDiv = document.getElementById("mainDiv")
const addProductBtn = document.getElementById("addProductBtn")
const saveProductBtn = document.getElementById("saveProductBtn")
const replaceProductBtn = document.getElementById("replaceProductBtn")
const insertBeforeBtn = document.getElementById("insertBeforeBtn")
const deleteProductBtn = document.getElementById("deleteProductBtn")
const errorMessage = document.querySelectorAll(".error-message")
const listings = document.getElementById("listings")
const deleteProduct = document.querySelectorAll(".delete-product")
const fileDetails = document.querySelector(".fileDetails")
let currentOperation = "addProduct"
let products = []
let imgUrl = ""

window.addEventListener("load", () => {
    products = JSON.parse(localStorage.getItem("products")) || []
    if (products.length === 0) {
        noData.classList.remove("d-none")
    } else {
        noData.classList.add("d-none")
    }
    renderProductsOnLoad(products)
})

function showAllInput() {
    productIdDiv.classList.remove("d-none")
    productNameDiv.classList.remove("d-none")
    productPriceDiv.classList.remove("d-none")
    uploadImgBtnDiv.classList.remove("d-none")
    productDescriptionDiv.classList.remove("d-none")
}

addProductBtn.addEventListener("click", () => {
    showAllInput()
    currentOperation = "addProduct"
    productIdDiv.classList.add("d-none")
    mainDiv.classList.remove("d-none")
})

replaceProductBtn.addEventListener("click", () => {
    showAllInput()
    currentOperation = "replaceProduct"
    productIdDiv.classList.remove("d-none")
    mainDiv.classList.remove("d-none")
})

insertBeforeBtn.addEventListener("click", () => {
    showAllInput()
    currentOperation = "insertBeforeProduct"
    productIdDiv.classList.remove("d-none")
    mainDiv.classList.remove("d-none")
})

deleteProductBtn.addEventListener("click", () => {
    showAllInput()
    productNameDiv.classList.add("d-none")
    productPriceDiv.classList.add("d-none")
    productDescriptionDiv.classList.add("d-none")
    uploadImgBtnDiv.classList.add("d-none")
    currentOperation = "deleteProduct"
    mainDiv.classList.remove("d-none")
})

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}

listings.addEventListener("click", async function (e) {
    const key1 = parseInt(e.currentTarget.lastElementChild.id)
    const key2 = parseInt(e.target.innerText.slice(1))
    if (key1 === key2) {
        await navigator.clipboard.writeText(parseInt(key1))
    }
})

listings.addEventListener("click", function (e) {
    const target = e.target.closest(".delete-product")
    if (target === null) return
    let id = target.parentElement.parentElement.parentElement.id
    deleteData(parseInt(id))
})

function deleteData(id) {
    products = products.filter((product) => product.id !== id)
    console.log(products, id)
    localStorage.setItem("products", JSON.stringify(products))
    document.getElementById(id).remove()
}

function hideErrorMessage() {
    errorMessage.forEach((error) => {
        error.classList.add("d-none")
    })
}

idInput.addEventListener("keypress", hideErrorMessage)

nameInput.addEventListener("keypress", (event) => {
    if (!/[a-zA-Z\s]/.test(event.key)) {
        event.preventDefault()
    }
    hideErrorMessage()
})

priceInput.addEventListener("keypress", hideErrorMessage)

uploadImgBtn.addEventListener("click", () => {
    hideErrorMessage()
    fileInput.click()
})

fileInput.addEventListener("change", async (event) => {
    fileDetails.classList.remove("d-none")
    let { name, size } = event.target.files[0]
    fileName.innerText = `${name}`
    fileSize.innerText = `${(size / 1024).toFixed(2)}KB`
    imgUrl = await fileToBase64(event.target.files[0])
})

function resetForm() {
    idInput.value = ""
    nameInput.value = ""
    priceInput.value = ""
    descriptionInput.value = ""
    fileInput.value = null
    if (products.length === 0) noData.classList.remove("d-none")
    else noData.classList.add("d-none")
}

saveProductBtn.addEventListener("click", async () => {
    let id = idInput.valueAsNumber
    let name = nameInput.value.trim()
    let price = priceInput.valueAsNumber
    let description = descriptionInput.value.trim()
    let isError = false
    if (currentOperation !== "addProduct") {
        if (isNaN(id)) {
            isError = true
            idInput.nextElementSibling.classList.remove("d-none")
        }
    }
    if (currentOperation !== "deleteProduct") {
        if (name === "") {
            nameInput.nextElementSibling.classList.remove("d-none")
            isError = true
        }
        if (isNaN(price)) {
            priceInput.nextElementSibling.classList.remove("d-none")
            isError = true
        }
        if (imgUrl === "") {
            uploadImgBtn.nextElementSibling.classList.remove("d-none")
        }
    }
    if (isError) return
    if (currentOperation === "addProduct") {
        let product = {
            id: Date.now(),
            name,
            price,
            description,
            imgUrl,
        }
        products.push(product)
        renderProduct(product)
    }
    if (currentOperation === "replaceProduct") {
        let replacedProduct = {
            id,
            name,
            price,
            description,
            imgUrl,
        }
        products = products.map((product) => {
            if (product.id === parseInt(id)) {
                return replacedProduct
            } else {
                return product
            }
        })
        renderProduct(replacedProduct)
    }
    if (currentOperation === "insertBeforeProduct") {
        let productIndex = products.findIndex((product) => product.id == id)
        console.log(productIndex, "product index")
        let newProduct = {
            id: Date.now(),
            name,
            price,
            description,
            imgUrl,
        }
        products.splice(productIndex, 0, newProduct)
        renderProduct(newProduct, id)
    }
    if (currentOperation === "deleteProduct") {
        products = products.filter((product) => product.id !== id)
        deleteProductOperation(id)
    }
    localStorage.setItem("products", JSON.stringify(products))
    resetForm()
})

function deleteProductOperation(id) {
    let element = document.getElementById(id)
    console.log(element)
    element.parentNode.removeChild(element)
}

function renderProduct(product, id = 0) {
    let existingDiv = null
    if (currentOperation === "replaceProduct") {
        existingDiv = document.getElementById(product.id)
    }
    if (currentOperation === "insertBeforeProduct") {
        existingDiv = document.getElementById(id)
    }
    let productDiv = document.createElement("div")
    productDiv.classList.add("product-listing")
    productDiv.id = product.id
    let productImg = document.createElement("img")
    productImg.classList.add("product-img")
    productImg.src = product.imgUrl
    productImg.alt = product.name
    let productDetailsDiv = document.createElement("div")
    productDetailsDiv.classList.add("product-details")
    let productDetailMain = document.createElement("div")
    productDetailMain.classList.add("product-main")
    let productDetailName = document.createElement("p")
    productDetailName.classList.add("product-name")
    let productDetailPrice = document.createElement("p")
    productDetailPrice.classList.add("product-price")
    let productId = document.createElement("p")
    productId.classList.add("product-hash-id")
    let productDescription = document.createElement("p")
    productDescription.classList.add("product-description")
    // let deletePara = document.createElement("p")
    // let deleteLink = document.createElement("a")
    // deleteLink.classList.add("delete-product")
    productDiv.appendChild(productImg)
    productDetailName.appendChild(document.createTextNode(product.name))
    productDetailPrice.appendChild(document.createTextNode("₹" + product.price))
    productId.appendChild(document.createTextNode("#" + product.id))
    productDetailMain.appendChild(productDetailName)
    productDetailMain.appendChild(productDetailPrice)
    productDetailsDiv.appendChild(productDetailMain)
    productDescription.appendChild(
        document.createTextNode(product.description.slice(0, 50) + "...")
    )
    productDetailsDiv.appendChild(productId)
    productDetailsDiv.appendChild(productDescription)
    // deleteLink.appendChild(document.createTextNode("Delete Product"))
    // deletePara.appendChild(deleteLink)
    // productDetailsDiv.append(deletePara)
    productDiv.appendChild(productDetailsDiv)
    if (currentOperation === "addProduct") {
        listings.appendChild(productDiv)
    }
    if (currentOperation === "replaceProduct") {
        existingDiv.parentNode.replaceChild(productDiv, existingDiv)
    }
    if (currentOperation === "insertBeforeProduct") {
        existingDiv.parentNode.insertBefore(productDiv, existingDiv)
    }
}

function renderProductsOnLoad(products) {
    for (let product of products) {
        renderProduct(product)
    }
}
