$(start);

function start() {
  $(".hide-menu-link").on("click", function() {
    event.preventDefault();
    console.log('clicked')
    $("#wrapper").toggleClass("toggled");
  });
};
