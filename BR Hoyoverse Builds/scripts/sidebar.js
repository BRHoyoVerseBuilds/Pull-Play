document.addEventListener("DOMContentLoaded", function () {
    const sideMenu = document.getElementById("side-menu");
    const menuBtn = document.getElementById("menu-btn");
    const closeBtn = document.getElementById("close-btn");

    menuBtn.addEventListener("click", function () {
        sideMenu.classList.add("open");
        document.querySelector(".menu-logo").classList.add("open");
    });

    closeBtn.addEventListener("click", function () {
        sideMenu.classList.remove("open");
        document.querySelector(".menu-logo").classList.remove("open");
    });
});
