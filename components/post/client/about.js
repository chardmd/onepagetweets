(function() {
  class About {
    disabledLoading() {
      $('#spinner').addClass('d-none');
      $('#buttonNext').attr('disabled', false);
      $('#buttonNext .text').text('Capture');
    }

    enableLoading() {
      $('#spinner').removeClass('d-none');
      $('#buttonNext').attr('disabled', true);
      $('#buttonNext .text').text('Saving...');
    }

    submitForm() {
      let _this = this;
      $.ajax({
        type: 'POST',
        url: '/post/about',
        data: $('#aboutForm').serialize(),
        beforeSend() {
          _this.enableLoading();
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

    setButtonActive(text) {
      let empty = text.length == 0;
      if (empty) {
        $('#buttonNext').attr('disabled', true);
      } else {
        $('#buttonNext').attr('disabled', false);
      }
    }
  }

  //init and events
  $(function() {
    const postAbout = new About();

    //on input press
    $('#summary').on('keyup', function() {
      let text = $(this).val();
      postAbout.setButtonActive(text);
    });

    //submit form
    $('#aboutForm').on('submit', function(e) {
      e.preventDefault();
      postAbout.submitForm();
    });
  });
})();
