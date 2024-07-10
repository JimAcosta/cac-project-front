const toggleBtn = document.querySelector('.nav-toggle')
const toggleIcon = document.querySelector('.nav-toggle i')
const dropDownMenu = document.querySelector('.nav-dropdown')

toggleBtn.onclick = function () {
    dropDownMenu.classList.toggle('open')
    const isOpen = dropDownMenu.classList.contains('open')
    toggleIcon.classList = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'
}