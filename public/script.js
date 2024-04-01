// document.addEventListener("DOMContentLoaded", function() {
//     const searchBar = document.getElementById('searchBar');
//     const dietitianList = document.getElementById('dietitianList').getElementsByTagName('li');
//
//     searchBar.addEventListener('input', function() {
//         const searchText = searchBar.value.toLowerCase();
//
//         Array.from(dietitianList).forEach(function(item) {
//             const name = item.getAttribute('data-name').toLowerCase();
//             if (name.indexOf(searchText) !== -1) {
//                 item.style.display = '';
//             } else {
//                 item.style.display = 'none';
//             }
//         });
//     });
// });

document.addEventListener("DOMContentLoaded", function() {
    const searchBar = document.getElementById('searchBar');
    const dietitianList = document.getElementById('dietitianList').getElementsByTagName('li');
    const modal = document.getElementById('dietitianModal');
    const closeModal = document.getElementById('closeModal');

    searchBar.addEventListener('input', function() {
        const searchText = searchBar.value.toLowerCase();
        Array.from(dietitianList).forEach(function(item) {
            const name = item.getAttribute('data-name').toLowerCase();
            item.style.display = name.indexOf(searchText) !== -1 ? '' : 'none';
        });
    });

    Array.from(dietitianList).forEach(function(item) {
        item.addEventListener('click', function() {
            const name = item.getAttribute('data-name');
            const dietType = item.getAttribute('data-dietType'); // Assuming these attributes exist
            const gender = item.getAttribute('data-gender'); // Assuming these attributes exist

            document.getElementById('dietitianName').innerText = `Name: ${name}`;
            document.getElementById('dietitianDietType').innerText = `Diet Type: ${dietType}`;
            document.getElementById('dietitianGender').innerText = `Gender: ${gender}`;

            modal.style.display = "block";
        });
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = "none";
    });

    // Close the modal if the user clicks anywhere outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});

function assignDietitian() {
    const dietitianId = document.getElementById('dietitianModal').getAttribute('data-id');
    fetch('/assign-dietitian', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dietitianId: dietitianId }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            document.getElementById('currentActiveDietitian').innerText = `Current Active Dietitian: ${data.dietitianName}`;
            document.getElementById('dietitianModal').style.display = 'none';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

