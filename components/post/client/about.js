const disabledLoading = () => {
  $('#spinner').addClass('d-none');
  $('#buttonNext').attr('disabled', false);
  $('#buttonNext .text').text('Capture');
};

const enableLoading = () => {
  $('#spinner').removeClass('d-none');
  $('#buttonNext').attr('disabled', true);
  $('#buttonNext .text').text('Saving...');
};

const submitForm = () => {
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
};

$(() => {
  $('#aboutForm').on('submit', e => {
    e.preventDefault();
    submitForm();
  });
});
