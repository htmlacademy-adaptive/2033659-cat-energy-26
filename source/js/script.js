let navMain = document.querySelector('.main-header__logo-wrapper');
let navToggle = document.querySelector('.main-header__toggle');

navMain.classList.remove('main-header__logo-wrapper--nojs');

navToggle.addEventListener('click', function () {
  if (navMain.classList.contains('main-header__logo-wrapper--nav-closed')) {
    navMain.classList.remove('main-header__logo-wrapper--nav-closed');
    navMain.classList.add('main-header__logo-wrapper--nav-opened');
  } else {
    navMain.classList.add('main-header__logo-wrapper--nav-closed');
    navMain.classList.remove('main-header__logo-wrapper--nav-opened');
  }
});
