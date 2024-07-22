$(document).ready(function () {
    $('.datatable').DataTable({
        language: {
            url:'javascripts/pt-br.json'
          }
    });

    
    setTimeout(function(){
        $('.dataTables_wrapper .dataTables_length select').select2({

            theme: "dtable"
        });

        $('.dataTables_wrapper .dataTables_filter input').attr('placeholder', 'Pesquisar...')
    }, 400);

});