$(document).ready(function () {
  $('.delete-recipe').on('click',function () {
    var id = $(this).data('id');
    var url = '/delete/' + id;
    if(confirm('Delete Recipe')){
      $.ajax({
        url: url,
        type: 'DELETE',
        success: function (result) {
          console.log('Deleting Recipe...');
          window.location.href= '/';
        },
        error: function (err) {
          console.log(err);
        }
      })
    }
  })

  $('.edit-recipe').on('click', function () {
    $('#edit-recipeName').val($(this).data('name'));
    $('#edit-ingredients').val($(this).data('ingredients'));
    $('#edit-directions').val($(this).data('directions'));
    $('#edit-id').val($(this).data('id'));
  })
})
