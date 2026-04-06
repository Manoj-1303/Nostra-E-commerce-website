// import {products} from "./products.js";


var offerBar = document.querySelector(".offer-bar")

document.getElementById("offer-close").addEventListener("click",

function(){
    offerBar.style.display="none"
}
)

var sideNavMenu=document.querySelector(".navbar-menu-toggle")
var sidenavbar = document.querySelector(".side-navbar")
sideNavMenu.addEventListener("click",function(){
   
    sidenavbar.style.marginLeft="0px"
})

document.getElementById("side-navbar-close").addEventListener("click",()=>{
    document.querySelector(".side-navbar").style.marginLeft = "-60%"
})


    
   



var container=document.querySelector(".products")
products.forEach((product)=>{
    var createItem = document.createElement("div")
    createItem.classList.add("product")
    createItem.innerHTML=` <img style="width: 20vw;" src="img/${product.src}">
    <h1>${product.name}</h1>
    <p>₹${product.price}</p>
    <tags style="visibility:hidden;">${product.tags}</tags>`

    container.append(createItem)
})

var noResultsMessage = document.createElement("p")
noResultsMessage.textContent = "No matching products found"
noResultsMessage.style.display = "none"
noResultsMessage.style.marginTop = "14px"
noResultsMessage.style.fontSize = "1rem"
noResultsMessage.style.color = "#5d646e"
container.insertAdjacentElement("afterend", noResultsMessage)

var filterList =[]
var tags = document.getElementsByName("tags")
var searchInput = document.querySelector('.navbar-search input[type="search"]')
console.log(tags)

tags.forEach((tag)=>{
    tag.addEventListener("change",(e)=>{

        if(e.target.checked)
        {
        filterList.push(e.target.value)
        console.log(filterList)
        update()
        
        }
        else{
            filterList = filterList.filter(item => item !== e.target.value);
            update()

        }

        
       
    })
})

if (searchInput) {
    searchInput.addEventListener("input", function () {
        update()
    })

    // Keep filtering in place when user presses Enter in the search field.
    var searchForm = searchInput.closest("form")
    if (searchForm) {
        searchForm.addEventListener("submit", function (e) {
            e.preventDefault()
            update()
        })
    }
}

function update()
{

    

    

    
    var searchText = searchInput ? searchInput.value.trim().toLowerCase() : ""
    var productList = document.querySelectorAll(".product")
    var visibleCount = 0
    for(var i=0;i<productList.length;i++){
        var matchesTagFilter = false
        var product=productList[i]
        console.log(product)
        var temp=product.querySelector("tags").innerHTML
        var productName = product.querySelector("h1").innerText.toLowerCase()
       
        console.log("elemen"+temp)
        

        const tempFilterArray = temp.split(',');
        
        console.log("tempfilterarray"+tempFilterArray)
        console.log("filterlist"+filterList)
       
            filterList.forEach((j)=>{
                tempFilterArray.forEach((i)=>{
                if(j==i)
                {
                    matchesTagFilter=true
                }
            })
        })


        var matchesSearchFilter = productName.indexOf(searchText) > -1

        if((!matchesTagFilter && filterList.length>0) || !matchesSearchFilter)
        {
            product.style.display="none"
        }
        else{
            product.style.display="block"
            visibleCount++
        }

        
    };

    noResultsMessage.style.display = visibleCount === 0 ? "block" : "none"


}

update()