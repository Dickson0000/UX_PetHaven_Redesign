/* Pet Haven Filtering System */
/* Implements multi-select checkbox filtering to resolve 75% of filter problems identified in usability testing */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize filtering system
    initializeFilters();
    
    // Set up event listeners
    setupFilterEventListeners();
    
    // Show initial counts
    updatePetCounts();
});

function initializeFilters() {
    console.log('Pet Haven filtering system initialized');
    
    // Get all filter checkboxes
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    
    // Add change event listeners to all checkboxes
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });
    
    // Initialize with all pets visible
    showAllPets();
}

function setupFilterEventListeners() {
    // Clear all filters button
    const clearButton = document.getElementById('clearFilters');
    if (clearButton) {
        clearButton.addEventListener('click', clearAllFilters);
    }
    
    // Search functionality
    const searchInput = document.getElementById('petSearch');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

function handleFilterChange(event) {
    console.log('Filter changed:', event.target.name, event.target.value, event.target.checked);
    
    // Apply all active filters
    applyFilters();
    
    // Update counts
    updatePetCounts();
}

function applyFilters() {
    // Get all pet cards
    const petCards = document.querySelectorAll('.pet-card');
    
    // Get active filters
    const activeFilters = getActiveFilters();
    
    console.log('Active filters:', activeFilters);
    
    // Filter each pet card
    petCards.forEach(card => {
        const shouldShow = petMatchesFilters(card, activeFilters);
        
        if (shouldShow) {
            card.classList.remove('hidden');
            card.style.display = 'block';
        } else {
            card.classList.add('hidden');
            card.style.display = 'none';
        }
    });
}

function getActiveFilters() {
    const filters = {
        species: [],
        age: [],
        size: [],
        personality: []
    };
    
    // Get checked checkboxes for each filter category
    const speciesCheckboxes = document.querySelectorAll('input[name="species"]:checked');
    const ageCheckboxes = document.querySelectorAll('input[name="age"]:checked');
    const sizeCheckboxes = document.querySelectorAll('input[name="size"]:checked');
    const personalityCheckboxes = document.querySelectorAll('input[name="personality"]:checked');
    
    // Collect active filter values
    speciesCheckboxes.forEach(cb => filters.species.push(cb.value));
    ageCheckboxes.forEach(cb => filters.age.push(cb.value));
    sizeCheckboxes.forEach(cb => filters.size.push(cb.value));
    personalityCheckboxes.forEach(cb => filters.personality.push(cb.value));
    
    return filters;
}

function petMatchesFilters(petCard, filters) {
    // Get pet data attributes
    const petSpecies = petCard.getAttribute('data-species');
    const petAge = petCard.getAttribute('data-age');
    const petSize = petCard.getAttribute('data-size');
    const petPersonality = petCard.getAttribute('data-personality') || '';
    const petStatus = petCard.getAttribute('data-status');
    
    // Check species filter
    if (filters.species.length > 0) {
        if (!filters.species.includes(petSpecies)) {
            return false;
        }
    }
    
    // Check age filter
    if (filters.age.length > 0) {
        if (!filters.age.includes(petAge)) {
            return false;
        }
    }
    
    // Check size filter
    if (filters.size.length > 0) {
        if (!filters.size.includes(petSize)) {
            return false;
        }
    }
    
    // Check personality filter
    if (filters.personality.length > 0) {
        const hasMatchingPersonality = filters.personality.some(trait => 
            petPersonality.toLowerCase().includes(trait.toLowerCase())
        );
        if (!hasMatchingPersonality) {
            return false;
        }
    }
    
    return true;
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const petCards = document.querySelectorAll('.pet-card');
    
    petCards.forEach(card => {
        const petName = card.querySelector('.pet-name').textContent.toLowerCase();
        const petDescription = card.querySelector('.pet-description') ? 
            card.querySelector('.pet-description').textContent.toLowerCase() : '';
        
        const matches = petName.includes(searchTerm) || petDescription.includes(searchTerm);
        
        if (searchTerm === '' || matches) {
            // Don't show if hidden by other filters
            if (!card.classList.contains('hidden')) {
                card.style.display = 'block';
            }
        } else {
            card.style.display = 'none';
        }
    });
    
    updatePetCounts();
}

function clearAllFilters() {
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Clear search input
    const searchInput = document.getElementById('petSearch');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Show all pets
    showAllPets();
    
    // Update counts
    updatePetCounts();
    
    console.log('All filters cleared');
}

function showAllPets() {
    const petCards = document.querySelectorAll('.pet-card');
    petCards.forEach(card => {
        card.classList.remove('hidden');
        card.style.display = 'block';
    });
}

function updatePetCounts() {
    // Count visible pets in each section
    const availablePets = document.querySelectorAll('.available-section .pet-card:not(.hidden)');
    const adoptedPets = document.querySelectorAll('.adopted-section .pet-card:not(.hidden)');
    
    // Update count displays
    const availableCount = document.querySelector('.available-section .section-count');
    const adoptedCount = document.querySelector('.adopted-section .section-count');
    
    if (availableCount) {
        availableCount.textContent = `${availablePets.length} Available`;
    }
    
    if (adoptedCount) {
        adoptedCount.textContent = `${adoptedPets.length} Adopted`;
    }
    
    // Update total count if exists
    const totalCount = document.querySelector('.total-count');
    if (totalCount) {
        totalCount.textContent = `${availablePets.length + adoptedPets.length} Total`;
    }
    
    console.log(`Updated counts: ${availablePets.length} available, ${adoptedPets.length} adopted`);
}

// Utility function to get pet data from card
function getPetDataFromCard(card) {
    return {
        name: card.querySelector('.pet-name')?.textContent || '',
        species: card.getAttribute('data-species') || '',
        age: card.getAttribute('data-age') || '',
        size: card.getAttribute('data-size') || '',
        personality: card.getAttribute('data-personality') || '',
        status: card.getAttribute('data-status') || ''
    };
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeFilters,
        applyFilters,
        getActiveFilters,
        petMatchesFilters,
        clearAllFilters,
        updatePetCounts
    };
}
