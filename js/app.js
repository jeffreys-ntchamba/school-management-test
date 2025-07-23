function init() {
    renderEstablishmentsTable();
    setupEventListeners();
}

function setupEventListeners() {
    // Établissements
    SchoolManagement.elements.addEstablishmentBtn.addEventListener('click', () => {
        openEstablishmentModal('add');
    });
    
    SchoolManagement.elements.saveEstablishmentBtn.addEventListener('click', saveEstablishment);
    
    // Classes
    SchoolManagement.elements.addClassBtn.addEventListener('click', () => {
        openClassModal('add');
    });
    
    SchoolManagement.elements.saveClassBtn.addEventListener('click', saveClass);
    
    // Élèves
    SchoolManagement.elements.addStudentBtn.addEventListener('click', () => {
        openStudentModal('add');
    });
    
    SchoolManagement.elements.saveStudentBtn.addEventListener('click', saveStudent);
    
    // Confirmation
    SchoolManagement.elements.confirmDeleteBtn.addEventListener('click', confirmDelete);
}

// Initialisation lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', init);