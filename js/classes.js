function renderClassesTable(establishmentId) {
    const tbody = SchoolManagement.elements.classesTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    const classes = SchoolManagement.data.classes.filter(cls => cls.establishmentId === establishmentId);
    
    if (classes.length === 0) {
        tbody.appendChild(SchoolManagement.elements.noClassesRow);
        return;
    }
    
    classes.forEach(cls => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cls.name}</td>
            <td>${cls.field}</td>
            <td>${cls.teacher}</td>
            <td>
                <button class="btn btn-sm btn-secondary edit-class me-5" data-id="${cls.id}">Modifier</button>
                <button class="btn btn-sm btn-danger delete-class" data-id="${cls.id}">Supprimer</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    document.querySelectorAll('.edit-class').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            openClassModal('edit', id);
        });
    });
    
    document.querySelectorAll('.delete-class').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            showDeleteConfirmation('class', id);
        });
    });
}

function openClassModal(action, id = null) {
    // Vérifier qu'on a bien un établissement parent avant d'ouvrir le modal
    if (action === 'add' && !SchoolManagement.currentState.currentEstablishmentId) {
        alert("Vous devez d'abord créer ou sélectionner un établissement");
        return;
    }

    // Réinitialiser l'état avant toute action
    SchoolManagement.currentState.action = action;
    SchoolManagement.currentState.currentClassId = id;
    
    Utils.resetForm(SchoolManagement.elements.classForm);
    
    if (action === 'add') {
        SchoolManagement.elements.classModalLabel.textContent = 'Ajouter une classe';
        SchoolManagement.elements.saveClassBtn.textContent = 'Enregistrer';
        SchoolManagement.elements.classEstablishmentId.value = SchoolManagement.currentState.currentEstablishmentId;
        // Désactiver le bouton d'ajout d'élève si on est en mode ajout
        SchoolManagement.elements.addStudentBtn.disabled = true;
    } else {
        SchoolManagement.elements.classModalLabel.textContent = 'Modifier une classe';
        SchoolManagement.elements.saveClassBtn.textContent = 'Modifier';
        // Activer le bouton d'ajout d'élève si on est en mode édition
        SchoolManagement.elements.addStudentBtn.disabled = false;
        
        const cls = SchoolManagement.data.classes.find(c => c.id === id);
        if (cls) {
            SchoolManagement.elements.classId.value = cls.id;
            SchoolManagement.elements.classEstablishmentId.value = cls.establishmentId;
            SchoolManagement.elements.className.value = cls.name;
            SchoolManagement.elements.classField.value = cls.field;
            SchoolManagement.elements.classTeacher.value = cls.teacher;
        }
    }
    
    if (action === 'edit' && id) {
        renderStudentsTable(id);
    } else {
        const tbody = SchoolManagement.elements.studentsTable.querySelector('tbody');
        tbody.innerHTML = '';
        tbody.appendChild(SchoolManagement.elements.noStudentsRow);
    }
    
    SchoolManagement.elements.classModal.show();
}

function saveClass() {
    if (!Utils.validateForm(SchoolManagement.elements.classForm)) return;
    
    // Vérifier explicitement le mode d'action
    const isEditMode = SchoolManagement.currentState.action === 'edit' && 
                       SchoolManagement.elements.classId.value;
    
    const classData = {
        id: isEditMode ? SchoolManagement.elements.classId.value : Utils.generateId(),
        establishmentId: SchoolManagement.elements.classEstablishmentId.value,
        name: SchoolManagement.elements.className.value,
        field: SchoolManagement.elements.classField.value,
        teacher: SchoolManagement.elements.classTeacher.value
    };
    
    if (isEditMode) {
        const index = SchoolManagement.data.classes.findIndex(cls => cls.id === classData.id);
        if (index !== -1) {
            SchoolManagement.data.classes[index] = classData;
        }
    } else {
        SchoolManagement.data.classes.push(classData);
    }
    
    // Sauvegarder l'état après l'opération
    SchoolManagement.currentState.currentClassId = classData.id;
    SchoolManagement.currentState.action = 'edit';
    
    SchoolManagement.saveData();
    renderClassesTable(classData.establishmentId);
    SchoolManagement.elements.classModal.hide();
}