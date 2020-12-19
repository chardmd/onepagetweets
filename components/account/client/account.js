(() => {
  const cancelSubscription = () => {
    const isCancel = confirm('Do you want to cancel your subscription?');
    if (isCancel) {
      const csrf = $('#csrf').val();
      $.ajax({
        type: 'PUT',
        data: {
          _csrf: csrf
        },
        url: `/account/cancel`
      });
    }
  };
  const subscribeBack = () => {
    const isSubscribe = confirm('Do you want to subscribe back?');
    if (isSubscribe) {
      const csrf = $('#csrf').val();
      $.ajax({
        type: 'PUT',
        data: {
          _csrf: csrf
        },
        url: `/account/resubscribe`
      });
    }
  };
  //init and events
  $(() => {
    $('#btnCancelSubscription').on('click', () => {
      cancelSubscription();
    });
    $('#linkSubscribe').on('click', () => {
      subscribeBack();
    });
  });
})();
