function disabledLoading() {
  $('#spinner').addClass('d-none');
  $('#buttonNext').attr('disabled', false);
  $('#buttonNext .text').text('Capture');
}

function enableLoading() {
  $('#spinner').removeClass('d-none');
  $('#buttonNext').attr('disabled', true);
  $('#buttonNext .text').text('Saving...');
}

function submitForm() {
  $.ajax({
    type: 'POST',
    url: '/post/about',
    data: $('#aboutForm').serialize(),
    beforeSend() {
      enableLoading();
    },
    success() {
      Turbolinks.visit(`/post/preview`);
    },
    error(err) {
      console.log(err);
      Turbolinks.visit(`/post/about`);
    }
  });
}

function setButtonActive(text) {
  let empty = text.length == 0;
  if (empty) {
    $('#buttonNext').attr('disabled', true);
  } else {
    $('#buttonNext').attr('disabled', false);
  }
}

$(function() {
  //on input press
  $('#summary').on('keyup', function() {
    let text = $(this).val();
    setButtonActive(text);
  });

  //submit form
  $('#aboutForm').on('submit', function(e) {
    e.preventDefault();
    submitForm();
  });
});
