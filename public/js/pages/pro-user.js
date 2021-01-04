(() => {
  //init and events
  $(() => {
    $('#cancelMembershipBtn').on('click', () => {
      $.ajax({
        type: 'POST',
        url: '/billing/cancel',
        data: {
          _csrf: $('#csrf').val()
        },
        success(data) {
          $('#modalCancelMembership').modal('hide');
          Turbolinks.visit(`/billing`);
        },
        error(err) {
          Turbolinks.visit(`/billing`);
        }
      });
    });
  });
})();
