$(document).ready(function () {
    const csvUrl = "https://raw.githubusercontent.com/jgalazka/SB_publications/refs/heads/main/SB_publication_PMC.csv";

    Papa.parse(csvUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            const seen = new Set();
            const uniqueData = [];

            results.data.forEach(row => {
                let title = (row.Title || "").toString();
                let link = (row.Link || "").toString();

                if (!title.trim() || !link.trim()) return;

                const cleanTitle = title
                    .normalize("NFKC")
                    .replace(/[\u0000-\u001F\u007F-\u00A0\u200B-\u200F\uFEFF]/g, "")
                    .replace(/[’‘]/g, "'")
                    .replace(/[“”]/g, '"')
                    .replace(/\s+/g, " ")
                    .replace(/[.,;:!?]+$/g, "")
                    .trim()
                    .toLowerCase();

                const key = cleanTitle.replace(/[^a-z0-9]/g, "");

                if (!seen.has(key)) {
                    seen.add(key);
                    uniqueData.push(row);
                }
            });

            if ($.fn.DataTable.isDataTable('#papers-table')) {
                $('#papers-table').DataTable().clear().destroy();
            }

            const table = $('#papers-table').DataTable({
                data: uniqueData,
                columns: [
                    { data: 'Title', title: 'Title' },
                    {
                        data: 'Link',
                        title: 'Read More',
                        render: data => `<a href="${data}" target="_blank" class="link-button">Read More</a>`,
                        orderable: false,
                        searchable: false
                    }
                ],
                responsive: true,
                lengthChange: false,
                pageLength: 10,
                language: {
                    search: "",
                    searchPlaceholder: "Search publications..."
                }
            });

            const searchContainer = $('#papers-table_filter');
            searchContainer.css({
                display: 'flex',
                'flex-direction': 'column',
                'align-items': 'center'
            });

            const resultCounter = $('<div id="result-count" class="result-counter"></div>');
            resultCounter.css({
                'margin-top': '6px',
                'font-weight': '500',
                'color': '#00bfff',
                'text-align': 'center',
                'font-size': '14px'
            });
            searchContainer.append(resultCounter);

            const updateResultCount = () => {
                const searchVal = table.search().trim();
                if (searchVal === "") {
                    resultCounter.text(""); 
                    return;
                }

                const info = table.page.info();
                const count = info.recordsDisplay;
                const text = count === 0 ? "No results found 🔍" : `${count} results found`;
                resultCounter.text(text);
            };

            updateResultCount();
            table.on('search.dt draw.dt', updateResultCount);
        },
        error: function () {
            $('#papers-table').html(`
                <tr><td colspan="2" style="text-align:center; color:red;">
                    ❌ Failed to load publications.
                </td></tr>
            `);
        }
    });
});
