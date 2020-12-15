(() => {
  const disabledLoading = () => {
    $('#spinner').addClass('d-none');
    $('#btnDraftTweet').attr('disabled', false);
    $('#btnDraftTweet .text').text('Draft Tweet');
  };

  const enableLoading = () => {
    $('#spinner').removeClass('d-none');
    $('#btnDraftTweet').attr('disabled', true);
    $('#btnDraftTweet .text').text('Loading...');
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
