(function() {
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

  //init and events
  $(function() {
    disableLoading();

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

    $('#btnConfirm').click(function() {
      $('#confirmDialog').modal('show');
    });
  });
})();
