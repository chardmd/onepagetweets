(() => {
  const disableLoading = () => {
    $('#spinner').addClass('d-none');
    $('#buttonPayment').attr('disabled', false);
    $('#buttonPayment .text').text('Unlock Now');
  };

  const enableLoading = () => {
    $('#spinner').removeClass('d-none');
    $('#buttonPayment').attr('disabled', true);
    $('#buttonPayment .text').text('Please wait...');
  };

  const createCheckoutSession = (projectId, publicKey) => {
    $.ajax({
      type: 'POST',
      url: `/billing/projects/${projectId}/create-checkout-session`,
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
        Turbolinks.visit(`/billing/projects/${projectId}`);
      }
    });
  };

  //init and events
  $(() => {
    /* Get your Stripe publishable key to initialize Stripe.js */
    const projectId = $('#projectId').val();
    const publicKey = $('#stripePublicKey').val();

    // reset button state
    disableLoading();

    // Setup event handler to create a Checkout Session when button is clicked
    $('#buttonPayment').on('click', () => {
      createCheckoutSession(projectId, publicKey);
    });
  });
})();
