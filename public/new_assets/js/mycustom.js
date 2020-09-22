// form slide transition manager
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
var pageSeclector;

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

// simple radio buttons
$('.simple-radio li').each(function(index) {
  if ($('input', this).prop('checked')) {
    $(this).addClass('checked');
  }
});

// simple radio buttons
$('.simple-radio li').click(function() {

  $('.simple-radio input').removeAttr('checked');
  $('input', this).attr('checked', 'checked');
  $('input', this).prop({
    checked: true
  });
  $('.simple-radio li').removeAttr('class');
  $(this).addClass('checked');


  // get the checked value
  selected_value = $("input[name='my_options']:checked").val();
  // alert(selected_value);

  if (selected_value == "Individual") {
    $("#show_Individual_form").show()
    $("#show_coporate_form").hide()

    // redirect
    // window.location.href = "/register_individual";
    window.location.href = "/individual_toKnow";


  } else if (selected_value == "Corporate") {
    $("#show_Individual_form").hide()
    $("#show_coporate_form").show()

    // redirect
    // window.location.href = "/register_corperate";
    window.location.href = "/corperate_toKnow";

  }


  

});

// multipage Forms
$(document).ready(function() {
  $(document).foundation();
  $('.next-tab').click(function() {
      $('.tabs li.is-active').next().children('a').click();
    });

    $('.prev-tab').click(function() {
      $('.tabs li.is-active').prev().children('a').click();
    });
  });





function removeAttrDisable(id) {

	let edit = document.querySelector(id);

	if (edit) {
		 edit.removeAttribute('disabled');
	}
  edit = 'n';
}

function addAttrDisable(id) {

	let save = document.querySelector(id);

	if (save) {
		 save.setAttribute('disabled','disabled');
	}
	save = 'n';
}
