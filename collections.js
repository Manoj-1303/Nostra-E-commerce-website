var offerBar = document.querySelector(".offer-bar")
var offerClose = document.getElementById("offer-close")

if (offerBar && offerClose) {
    offerClose.addEventListener("click", function () {
        offerBar.style.display = "none"
    })
}

var sideNavMenu = document.querySelector(".navbar-menu-toggle")
var sideNavbar = document.querySelector(".side-navbar")
var sideNavClose = document.getElementById("side-navbar-close")

if (sideNavMenu && sideNavbar) {
    sideNavMenu.addEventListener("click", function () {
        sideNavbar.style.marginLeft = "0px"
    })
}

if (sideNavClose && sideNavbar) {
    sideNavClose.addEventListener("click", function () {
        sideNavbar.style.marginLeft = "-60%"
    })
}

var container = document.querySelector(".products")
if (!container || !Array.isArray(products)) {
    throw new Error("Products data or container is missing")
}

var tags = document.getElementsByName("tags")
var searchInput = document.querySelector('.navbar-search input[type="search"]')
var clearFiltersBtn = document.getElementById("clear-filters")
var resultsCount = document.getElementById("results-count")
var activeFiltersContainer = document.getElementById("active-filters")
var sortSelect = document.getElementById("sort-select")
var minPriceInput = document.getElementById("min-price")
var maxPriceInput = document.getElementById("max-price")
var gridViewBtn = document.getElementById("grid-view")
var listViewBtn = document.getElementById("list-view")

var noResultsMessage = document.createElement("p")
noResultsMessage.textContent = "No matching products found"
noResultsMessage.style.display = "none"
noResultsMessage.style.marginTop = "14px"
noResultsMessage.style.fontSize = "1rem"
noResultsMessage.style.color = "#5d646e"
container.insertAdjacentElement("afterend", noResultsMessage)

var selectedTags = []
var selectedView = "grid"

function buildProductCard(product) {
    var createItem = document.createElement("div")
    createItem.classList.add("product")
    createItem.dataset.tags = product.tags.join(",")
    createItem.dataset.name = product.name.toLowerCase()
    createItem.dataset.price = String(product.price)

    createItem.innerHTML = `<img src="img/${product.src}" alt="${product.name}">
    <h1>${product.name}</h1>
    <p>₹${product.price}</p>
    <span class="product-tags" aria-hidden="true">${product.tags.join(" | ")}</span>`

    return createItem
}

function matchesTagFilter(product) {
    if (selectedTags.length === 0) {
        return true
    }

    return selectedTags.some(function (tag) {
        return product.tags.indexOf(tag) > -1
    })
}

function matchesSearchFilter(product, searchText) {
    if (!searchText) {
        return true
    }

    return product.name.toLowerCase().indexOf(searchText) > -1
}

function matchesPriceFilter(product) {
    var minPrice = minPriceInput && minPriceInput.value ? Number(minPriceInput.value) : null
    var maxPrice = maxPriceInput && maxPriceInput.value ? Number(maxPriceInput.value) : null

    if (minPrice !== null && product.price < minPrice) {
        return false
    }

    if (maxPrice !== null && product.price > maxPrice) {
        return false
    }

    return true
}

function sortProducts(filteredProducts) {
    var selectedSort = sortSelect ? sortSelect.value : "default"
    var list = filteredProducts.slice()

    if (selectedSort === "price-asc") {
        list.sort(function (a, b) { return a.price - b.price })
    } else if (selectedSort === "price-desc") {
        list.sort(function (a, b) { return b.price - a.price })
    } else if (selectedSort === "name-asc") {
        list.sort(function (a, b) { return a.name.localeCompare(b.name) })
    }

    return list
}

function renderActiveFilters(searchText) {
    if (!activeFiltersContainer) {
        return
    }

    var activeItems = []

    if (searchText) {
        activeItems.push(`Search: ${searchText}`)
    }

    selectedTags.forEach(function (tag) {
        activeItems.push(`Tag: ${tag}`)
    })

    if (minPriceInput && minPriceInput.value) {
        activeItems.push(`Min: ₹${minPriceInput.value}`)
    }

    if (maxPriceInput && maxPriceInput.value) {
        activeItems.push(`Max: ₹${maxPriceInput.value}`)
    }

    if (activeItems.length === 0) {
        activeFiltersContainer.innerHTML = ""
        return
    }

    activeFiltersContainer.innerHTML = activeItems.map(function (item) {
        return `<span>${item}</span>`
    }).join("")
}

function applyViewMode() {
    if (selectedView === "list") {
        container.classList.add("products-list-view")
        if (gridViewBtn) {
            gridViewBtn.classList.remove("active")
            gridViewBtn.setAttribute("aria-pressed", "false")
        }
        if (listViewBtn) {
            listViewBtn.classList.add("active")
            listViewBtn.setAttribute("aria-pressed", "true")
        }
    } else {
        container.classList.remove("products-list-view")
        if (listViewBtn) {
            listViewBtn.classList.remove("active")
            listViewBtn.setAttribute("aria-pressed", "false")
        }
        if (gridViewBtn) {
            gridViewBtn.classList.add("active")
            gridViewBtn.setAttribute("aria-pressed", "true")
        }
    }
}

function update() {
    var searchText = searchInput ? searchInput.value.trim().toLowerCase() : ""

    var filteredProducts = products.filter(function (product) {
        return matchesTagFilter(product) && matchesSearchFilter(product, searchText) && matchesPriceFilter(product)
    })

    var sortedProducts = sortProducts(filteredProducts)
    container.innerHTML = ""

    sortedProducts.forEach(function (product) {
        container.append(buildProductCard(product))
    })

    if (resultsCount) {
        resultsCount.textContent = sortedProducts.length + " Product" + (sortedProducts.length === 1 ? "" : "s")
    }

    noResultsMessage.style.display = sortedProducts.length === 0 ? "block" : "none"
    renderActiveFilters(searchText)
    applyViewMode()
}

tags.forEach(function (tag) {
    tag.addEventListener("change", function (e) {
        if (e.target.checked) {
            if (selectedTags.indexOf(e.target.value) === -1) {
                selectedTags.push(e.target.value)
            }
        } else {
            selectedTags = selectedTags.filter(function (item) { return item !== e.target.value })
        }
        update()
    })
})

if (searchInput) {
    searchInput.addEventListener("input", update)
    var searchForm = searchInput.closest("form")
    if (searchForm) {
        searchForm.addEventListener("submit", function (e) {
            e.preventDefault()
            update()
        })
    }
}

if (sortSelect) {
    sortSelect.addEventListener("change", update)
}

if (minPriceInput) {
    minPriceInput.addEventListener("input", update)
}

if (maxPriceInput) {
    maxPriceInput.addEventListener("input", update)
}

if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", function () {
        selectedTags = []
        tags.forEach(function (tag) {
            tag.checked = false
        })

        if (searchInput) {
            searchInput.value = ""
        }
        if (sortSelect) {
            sortSelect.value = "default"
        }
        if (minPriceInput) {
            minPriceInput.value = ""
        }
        if (maxPriceInput) {
            maxPriceInput.value = ""
        }

        update()
    })
}

if (gridViewBtn) {
    gridViewBtn.addEventListener("click", function () {
        selectedView = "grid"
        applyViewMode()
    })
}

if (listViewBtn) {
    listViewBtn.addEventListener("click", function () {
        selectedView = "list"
        applyViewMode()
    })
}

update()