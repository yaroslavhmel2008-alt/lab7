const API_URL = 'https://lab.vntu.org/api-server/lab7.php';
let currentData = []; // Змінна для зберігання поточних даних
let sortDirection = 'asc'; // Початковий напрямок сортування

// -----------------------------------------------------
// Функції для AJAX та Рендерингу Таблиці
// -----------------------------------------------------

function loadAndRenderData() {
    $('#statusMessage').text('Завантаження даних...');
    
    // Використання $.getJSON для HTTPS-запиту
    $.getJSON(API_URL)
        .done(function(data) {
            if (Array.isArray(data) && data.length > 0) {
                currentData = data; // Зберігаємо дані
                renderTable(currentData);
                $('#statusMessage').text('Дані успішно оновлено.');
            } else {
                $('#statusMessage').text('Помилка: API повернув порожній або некоректний набір даних.');
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            // Виводимо більш детальну інформацію про помилку
            $('#statusMessage').text(`Помилка AJAX. Перевірте консоль (F12) та з'єднання.`);
            console.error("AJAX Error: ", textStatus, errorThrown, jqXHR);
        });
}

// Функція для відображення масиву даних у таблиці
function renderTable(data) {
    const $tbody = $('#dataTable tbody');
    $tbody.empty(); // Очищуємо старі дані

    data.forEach(item => {
        const row = `<tr>
                        <td>${item.name}</td>
                        <td>${item.affiliation}</td>
                        <td>${item.level}</td>
                     </tr>`;
        $tbody.append(row);
    });
}

// -----------------------------------------------------
// Функція для Сортування (Завдання 3)
// -----------------------------------------------------

function sortData(sortBy) {
    if (currentData.length === 0) return;

    // Змінюємо напрямок сортування при кожному кліку
    sortDirection = (sortDirection === 'asc') ? 'desc' : 'asc';

    currentData.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        // Якщо сортуємо за числами (level)
        if (sortBy === 'level') {
            valA = parseInt(valA);
            valB = parseInt(valB);
        } else {
            // Для рядків (name, affiliation) - сортування без урахування регістру
            valA = String(valA).toLowerCase();
            valB = String(valB).toLowerCase();
        }

        // Логіка порівняння
        if (valA < valB) {
            return (sortDirection === 'asc') ? -1 : 1;
        }
        if (valA > valB) {
            return (sortDirection === 'asc') ? 1 : -1;
        }
        return 0;
    });

    renderTable(currentData);
}

// -----------------------------------------------------
// Обробники подій (Завдання 2 та 3)
// -----------------------------------------------------

$(document).ready(function() {
    // 1. Завантажити дані при першому відкритті сторінки
    loadAndRenderData(); 

    // 2. Прив'язка оновлення до кнопки
    $('#loadDataButton').on('click', loadAndRenderData);

    // 3. Прив'язка сортування до заголовків таблиці
    $('#dataTable th').on('click', function() {
        const sortBy = $(this).data('sort-by');
        if (sortBy) {
            sortData(sortBy);
        }
    });
});