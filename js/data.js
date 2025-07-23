// Structure de données globale
const SchoolManagement = {
    data: {
        establishments: [],
        classes: [],
        students: []
    },
    
    elements: {
        // Les éléments DOM seront initialisés dans initElements()
    },
    
    currentState: {
        action: null,
        currentEstablishmentId: null,
        currentClassId: null,
        currentStudentId: null,
        itemToDelete: null,
        deleteType: null
    },
    
    initElements: function() {
        this.elements = {
            addEstablishmentBtn: document.getElementById('addEstablishmentBtn'),
            addClassBtn: document.getElementById('addClassBtn'),
            addStudentBtn: document.getElementById('addStudentBtn'),
            saveEstablishmentBtn: document.getElementById('saveEstablishmentBtn'),
            saveClassBtn: document.getElementById('saveClassBtn'),
            saveStudentBtn: document.getElementById('saveStudentBtn'),
            confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
            
            establishmentsTable: document.getElementById('establishmentsTable'),
            classesTable: document.getElementById('classesTable'),
            studentsTable: document.getElementById('studentsTable'),
            
            noEstablishmentsRow: document.getElementById('noEstablishmentsRow'),
            noClassesRow: document.getElementById('noClassesRow'),
            noStudentsRow: document.getElementById('noStudentsRow'),
            
            establishmentForm: document.getElementById('establishmentForm'),
            classForm: document.getElementById('classForm'),
            studentForm: document.getElementById('studentForm'),
            
            establishmentId: document.getElementById('establishmentId'),
            establishmentName: document.getElementById('establishmentName'),
            establishmentDistrict: document.getElementById('establishmentDistrict'),
            establishmentDate: document.getElementById('establishmentDate'),
            
            classId: document.getElementById('classId'),
            classEstablishmentId: document.getElementById('classEstablishmentId'),
            className: document.getElementById('className'),
            classField: document.getElementById('classField'),
            classTeacher: document.getElementById('classTeacher'),
            
            studentId: document.getElementById('studentId'),
            studentClassId: document.getElementById('studentClassId'),
            studentLastName: document.getElementById('studentLastName'),
            studentFirstName: document.getElementById('studentFirstName'),
            studentBirthDate: document.getElementById('studentBirthDate'),
            studentGender: document.getElementById('studentGender'),
            
            establishmentModalLabel: document.getElementById('establishmentModalLabel'),
            classModalLabel: document.getElementById('classModalLabel'),
            studentModalLabel: document.getElementById('studentModalLabel'),
            
            confirmationMessage: document.getElementById('confirmationMessage')
        };
        
        // Initialisation des modaux
        this.elements.establishmentModal = new bootstrap.Modal(document.getElementById('establishmentModal'));
        this.elements.classModal = new bootstrap.Modal(document.getElementById('classModal'));
        this.elements.studentModal = new bootstrap.Modal(document.getElementById('studentModal'));
        this.elements.confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    },
    
    loadData: function() {
        const savedData = localStorage.getItem('schoolManagementData');
        if (savedData) {
            this.data = JSON.parse(savedData);
        }
    },
    
    saveData: function() {
        localStorage.setItem('schoolManagementData', JSON.stringify(this.data));
    }
};

// Initialisation lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    SchoolManagement.initElements();
    SchoolManagement.loadData();
});