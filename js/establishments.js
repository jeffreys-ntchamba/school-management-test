function renderEstablishmentsTable() {
    const tbody = SchoolManagement.elements.establishmentsTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    if (SchoolManagement.data.establishments.length === 0) {
        tbody.appendChild(SchoolManagement.elements.noEstablishmentsRow);
        return;
    }
    
    SchoolManagement.data.establishments.forEach(establishment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${establishment.name}</td>
            <td>${establishment.district}</td>
            <td>${Utils.formatDate(establishment.creationDate)}</td>
            <td>
                <button class="btn btn-sm btn-secondary edit-establishment me-5" data-id="${establishment.id}">Modifier</button>
                <button class="btn btn-sm btn-danger delete-establishment" data-id="${establishment.id}">Supprimer</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Gestionnaires d'événements
    document.querySelectorAll('.edit-establishment').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            openEstablishmentModal('edit', id);
        });
    });
    
    document.querySelectorAll('.delete-establishment').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            showDeleteConfirmation('establishment', id);
        });
    });
}

function openEstablishmentModal(action, id = null) {
    SchoolManagement.currentState.action = action;
    SchoolManagement.currentState.currentEstablishmentId = id;
    
    Utils.resetForm(SchoolManagement.elements.establishmentForm);
    
    if (action === 'add') {
        SchoolManagement.elements.establishmentModalLabel.textContent = 'Ajouter un établissement';
        SchoolManagement.elements.saveEstablishmentBtn.textContent = 'Enregistrer';
        SchoolManagement.elements.establishmentId.value = '';
    } else {
        SchoolManagement.elements.establishmentModalLabel.textContent = 'Modifier un établissement';
        SchoolManagement.elements.saveEstablishmentBtn.textContent = 'Modifier';
        
        const establishment = SchoolManagement.data.establishments.find(est => est.id === id);
        if (establishment) {
            // Remplir le formulaire avec les données existantes
            SchoolManagement.elements.establishmentId.value = establishment.id;
            SchoolManagement.elements.establishmentName.value = establishment.name;
            SchoolManagement.elements.establishmentDistrict.value = establishment.district;
            SchoolManagement.elements.establishmentDate.value = establishment.creationDate;
        }
    }
    
    // Rafraîchir les classes
    if (action === 'edit' && id) {
        renderClassesTable(id);
    } else {
        const tbody = SchoolManagement.elements.classesTable.querySelector('tbody');
        tbody.innerHTML = '';
        tbody.appendChild(SchoolManagement.elements.noClassesRow);
    }
    
    SchoolManagement.elements.establishmentModal.show();
}

function saveEstablishment() {
    if (!Utils.validateForm(SchoolManagement.elements.establishmentForm)) return;
    
    const establishmentData = {
        id: SchoolManagement.currentState.action === 'add' 
            ? Utils.generateId() 
            : SchoolManagement.elements.establishmentId.value,
        name: SchoolManagement.elements.establishmentName.value,
        district: SchoolManagement.elements.establishmentDistrict.value,
        creationDate: SchoolManagement.elements.establishmentDate.value
    };

    if (SchoolManagement.currentState.action === 'add') {
        SchoolManagement.data.establishments.push(establishmentData);
    } else {
        const index = SchoolManagement.data.establishments.findIndex(est => est.id === establishmentData.id);
        if (index !== -1) {
            // Mise à jour de l'établissement existant
            SchoolManagement.data.establishments[index] = establishmentData;
        } else {
            // Cas où l'ID n'existe pas (ne devrait pas arriver)
            SchoolManagement.data.establishments.push(establishmentData);
        }
    }

    SchoolManagement.saveData();
    renderEstablishmentsTable();
    SchoolManagement.elements.establishmentModal.hide();
}

function showDeleteConfirmation(type, id) {
    SchoolManagement.currentState.deleteType = type;
    SchoolManagement.currentState.itemToDelete = id;
    
    let message = '';
    let itemName = '';
    
    switch (type) {
        case 'establishment':
            const establishment = SchoolManagement.data.establishments.find(est => est.id === id);
            if (establishment) itemName = establishment.name;
            message = `Nom de l'établissement : ${itemName}`;
            break;
        case 'class':
            const cls = SchoolManagement.data.classes.find(c => c.id === id);
            if (cls) itemName = cls.name;
            message = `Nom de la classe: ${itemName}`;
            break;
        case 'student':
            const student = SchoolManagement.data.students.find(s => s.id === id);
            if (student) itemName = `${student.firstName} ${student.lastName}`;
            message = `Nom de l'élève: ${itemName} ?`;
            break;
    }
    
    SchoolManagement.elements.confirmationMessage.textContent = message;
    SchoolManagement.elements.confirmationModal.show();
}

function confirmDelete() {
    const { deleteType, itemToDelete } = SchoolManagement.currentState;
    let classIdToRefresh = null;
    let establishmentIdToRefresh = null;

    switch (deleteType) {
        case 'establishment':
            // Suppression d'un établissement et toutes ses dépendances
            const classIds = SchoolManagement.data.classes
                .filter(cls => cls.establishmentId === itemToDelete)
                .map(cls => cls.id);
            
            SchoolManagement.data.students = SchoolManagement.data.students.filter(student => {
                return !classIds.includes(student.classId);
            });
            
            SchoolManagement.data.classes = SchoolManagement.data.classes.filter(cls => cls.establishmentId !== itemToDelete);
            SchoolManagement.data.establishments = SchoolManagement.data.establishments.filter(est => est.id !== itemToDelete);
            
            renderEstablishmentsTable();
            break;
            
        case 'class':
            // Trouver la classe avant suppression pour connaître l'établissement parent
            const classToDelete = SchoolManagement.data.classes.find(c => c.id === itemToDelete);
            establishmentIdToRefresh = classToDelete?.establishmentId;
            
            SchoolManagement.data.students = SchoolManagement.data.students.filter(student => student.classId !== itemToDelete);
            SchoolManagement.data.classes = SchoolManagement.data.classes.filter(cls => cls.id !== itemToDelete);
            
            if (establishmentIdToRefresh) {
                renderClassesTable(establishmentIdToRefresh);
            }
            break;
            
        case 'student':
            // Trouver l'élève avant suppression pour connaître sa classe
            const studentToDelete = SchoolManagement.data.students.find(s => s.id === itemToDelete);
            classIdToRefresh = studentToDelete?.classId;
            
            // Effectuer la suppression
            SchoolManagement.data.students = SchoolManagement.data.students.filter(s => s.id !== itemToDelete);
            
            // Rafraîchir l'affichage des élèves si on est dans le modal de classe
            if (classIdToRefresh) {
                renderStudentsTable(classIdToRefresh);
            }
            break;
    }

    // Sauvegarder les changements
    SchoolManagement.saveData();
    
    // Fermer le modal de confirmation
    SchoolManagement.elements.confirmationModal.hide();
}