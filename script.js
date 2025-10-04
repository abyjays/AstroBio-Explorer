$(document).ready(function () {
    const csvUrl = "https://raw.githubusercontent.com/jgalazka/SB_publications/refs/heads/main/SB_publication_PMC.csv";
   
    Papa.parse(csvUrl, {
        download: true,  
        header: true,     
        complete: function (results) {

            $('#papers-table').DataTable({
                responsive: true,
                lengthChange: false,
                language: {
                    search: "", 
                    searchPlaceholder: "Search publications..." 
                },

                data: results.data, 
                columns: [
                    { data: 'Title' },

                    { 
                        data: 'Link',
                        render: function (data, type, row) {
                            return `<a href="${data}" target="_blank" class="link-button">Read More</a>`;
                        },
                        orderable: false,
                        searchable: false
                    }

                ],
                paging: true,
                searching: true,
                "pageLength": 10

            });

        },

        error: function (error) {
            console.error("Error parsing CSV from URL:", error);
            $('#papers-table tbody').html('<tr><td colspan="2" style="text-align:center; color: red;">❌ Failed to load publications from the source.</td></tr>');
        }

    });
    
});