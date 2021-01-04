(() => {
  const disableLoading = () => {
    $('#spinner').addClass('d-none');
    $('#buttonPayment').attr('disabled', false);
    $('#buttonPayment .text').text('Subscribe Now');
  };

  const enableLoading = () => {
    $('#spinner').removeClass('d-none');
    $('#buttonPayment').attr('disabled', true);
    $('#buttonPayment .text').text('Please wait...');
  };

  const createCheckoutSession = (publicKey) => {
    $.ajax({
      type: 'POST',
      url: `/billing/create-checkout-session`,
      data: {
        _csrf: $('#csrf').val()
      },
      beforeSend() {
        enableLoading();
      },
      success(data) {
        // Call Stripe.js method to redirect to the new Checkout page
        const stripe = Stripe(publicKey);
        stripe.redirectToCheckout({ sessionId: data.sessionId });
      },
      error(err) {
        Turbolinks.visit(`/billing`);
      }
    });
  };

  //init and events
  $(() => {
    /* Get your Stripe publishable key to initialize Stripe.js */
    const publicKey = $('#stripePublicKey').val();

    // reset button state
    disableLoading();

    // Setup event handler to create a Checkout Session when button is clicked
    $('#buttonPayment').on('click', () => {
      createCheckoutSession(publicKey);
    });
  });
})();
