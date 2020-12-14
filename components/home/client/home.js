(() => {
  const disabledLoading = () => {
    $('#spinner').addClass('d-none');
    $('#buttonNext').attr('disabled', false);
    $('#buttonNext .text').text('Next');
  };

  const enableLoading = () => {
    $('#spinner').removeClass('d-none');
    $('#buttonNext').attr('disabled', true);
    $('#buttonNext .text').text('Saving...');
  };

  const createProject = () => {
    const csrf = $('#csrf').val();
    $.ajax({
      type: 'POST',
      url: '/home/create',
      data: {
        _csrf: csrf
      },
      beforeSend() {
        enableLoading();
      },
      success() {
        disabledLoading();
        Turbolinks.visit(`/draft/editor`);
      },
      error(err) {
        console.log(err);
        Turbolinks.visit(`/draft/editor`);
      }
    });
  };

  //init and events
  $(() => {
    $('#btnDraftTweet').on('click', () => {
      createProject();
    });
  });
})();
