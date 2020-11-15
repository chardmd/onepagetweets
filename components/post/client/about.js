/* eslint-disable */

function disableLoading() {
  $('#spinner').addClass('d-none');
  $('#buttonNext').attr('disabled', false);
  $('#buttonNext .text').text('Capture');
}
function enableLoading() {
  $('#spinner').removeClass('d-none');
  $('#buttonNext').attr('disabled', true);
  $('#buttonNext .text').text('Saving...');
}

function initTagify() {
  // The DOM element you wish to replace with Tagify
  const input = $('#techStack').get(0);
  // init Tagify script on the above inputs
  const tagifyInstance = new Tagify(input);
  let techStackValue = $('#techStackValue').val();
  techStackValue = techStackValue === '' ? '' : techStackValue;
  tagifyInstance.addTags(techStackValue);
}

$(function() {
  // init validation
  $('#aboutForm').parsley();

  // reset button state
  disableLoading();

  //init tagify
  initTagify();

  // submit form
  $('#aboutForm').submit(function(e) {
    e.preventDefault();
    // validate form
    if (
      !$('#aboutForm')
        .parsley()
        .validate()
    ) {
      return false;
    }

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
  });
});
