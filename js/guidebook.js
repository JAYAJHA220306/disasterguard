document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('guideSearch');
    const cards = document.querySelectorAll('.guidebook-card');
    const container = document.getElementById('guideContainer');

    // Create a 'No Results' message element once
    const noResults = document.createElement('div');
    noResults.innerHTML = `<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1; padding: 20px;">No matching safety guides found. Try searching for 'Flood' or 'Heat'.</p>`;
    noResults.style.display = 'none';
    container.appendChild(noResults);

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        let hasResults = false;

        cards.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            const content = card.querySelector('ul').innerText.toLowerCase();

            if (title.includes(query) || content.includes(query)) {
                card.style.display = "flex";
                // Adding a small delay for a smooth fade-in effect
                setTimeout(() => { card.style.opacity = "1"; }, 10);
                hasResults = true;
            } else {
                card.style.display = "none";
                card.style.opacity = "0";
            }
        });

        // Show/Hide the 'No Results' message
        noResults.style.display = (hasResults || query === "") ? "none" : "block";
    });
});