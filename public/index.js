const fetchUrl = () => {
  var value = $("#box").val().replace(/.*?:\/\//g, "").replace(/^www./, "");
  $.ajax({
    method: "POST",
    url: `./site/${value}`,
    success: function(resp) {
      $("#status").html(resp);
    }
  });
  $('#box').val('');
};

const checkJob = () => {
  var value = $("#box").val();
  $.ajax({
    method: "GET",
    url: `./job/${value}`,
    success: function(resp) {
      $("html").html(resp);
    }
  });
  $('#box').val('');
};
