var sideNavMenu = document.getElementById("side-navbar-activate");
var sideNavbar = document.querySelector(".side-navbar");
var sideNavClose = document.getElementById("side-navbar-close");

if (sideNavMenu && sideNavbar) {
    sideNavMenu.addEventListener("click", function () {
        sideNavbar.style.marginLeft = "0px";
    });
}

if (sideNavClose && sideNavbar) {
    sideNavClose.addEventListener("click", function () {
        sideNavbar.style.marginLeft = "-60%";
    });
}

var contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        alert("Thank you! Your message has been sent.");
        contactForm.reset();
    });
}








