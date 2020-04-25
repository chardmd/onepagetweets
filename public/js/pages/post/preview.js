/* eslint-disable */

function disableLoading() {
  $('#spinner').addClass('d-none');
  $('#btnPublish').attr('disabled', false);
  $('#btnPublish .text').text('Publish');
}

function enableLoading() {
  $('#spinner').removeClass('d-none');
  $('#btnPublish').attr('disabled', true);
  $('#btnPublish .text').text('Publishing...');
}

function initTagify() {
  // The DOM element you wish to replace with Tagify
  const input = $('#techStack').get(0);
  // init Tagify script on the above inputs
  const tagifyInstance = new Tagify(input);
  const techStackValue = $('#techStackValue').val();
  tagifyInstance.addTags(techStackValue);
}

$(function() {
  // init tagify
  initTagify();

  // reset button state
  disableLoading();

  $('#btnConfirm').click(function() {
    $('#confirmDialog').modal('show');
  });

  $('#btnPublish').click(function() {
    const csrf = $('#csrf').val();
    $.ajax({
      type: 'PATCH',
      data: {
        _csrf: csrf
      },
      url: `/post/publish`,
      beforeSend() {
        enableLoading();
      },
      success() {
        $('#confirmDialog').modal('hide');
        Turbolinks.visit(`/post/success`);
      },
      error() {
        Turbolinks.visit(`/post/preview`);
      }
    });
  });
});
