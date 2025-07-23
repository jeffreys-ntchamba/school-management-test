function renderStudentsTable(classId) {
    const tbody = SchoolManagement.elements.studentsTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    const students = SchoolManagement.data.students.filter(student => student.classId === classId);
    
    if (students.length === 0) {
        tbody.appendChild(SchoolManagement.elements.noStudentsRow);
        return;
    }
    
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.lastName}</td>
            <td>${student.firstName}</td>
            <td>${Utils.formatDate(student.birthDate)}</td>
            <td>${student.gender}</td>
            <td>
                <button class="btn btn-sm btn-secondary edit-student me-5" data-id="${student.id}">Modifier</button>
                <button class="btn btn-sm btn-danger delete-student" data-id="${student.id}">Supprimer</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    document.querySelectorAll('.edit-student').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            openStudentModal('edit', id);
        });
    });
    
    document.querySelectorAll('.delete-student').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            showDeleteConfirmation('student', id);
        });
    });
}

function openStudentModal(action, id = null) {
    SchoolManagement.currentState.action = action;
    SchoolManagement.currentState.currentStudentId = id;
    
    Utils.resetForm(SchoolManagement.elements.studentForm);
    
    if (action === 'add') {
        SchoolManagement.elements.studentModalLabel.textContent = 'Ajouter un élève';
        SchoolManagement.elements.saveStudentBtn.textContent = 'Enregistrer';
        SchoolManagement.elements.studentClassId.value = SchoolManagement.currentState.currentClassId;
    } else {
        SchoolManagement.elements.studentModalLabel.textContent = 'Modifier un élève';
        SchoolManagement.elements.saveStudentBtn.textContent = 'Modifier';
        
        const student = SchoolManagement.data.students.find(s => s.id === id);
        if (student) {
            SchoolManagement.elements.studentId.value = student.id;
            SchoolManagement.elements.studentClassId.value = student.classId;
            SchoolManagement.elements.studentLastName.value = student.lastName;
            SchoolManagement.elements.studentFirstName.value = student.firstName;
            SchoolManagement.elements.studentBirthDate.value = student.birthDate;
            SchoolManagement.elements.studentGender.value = student.gender;
        }
    }
    
    SchoolManagement.elements.studentModal.show();
}

function saveStudent() {
    if (!Utils.validateForm(SchoolManagement.elements.studentForm)) return;
    
    const studentData = {
        id: SchoolManagement.currentState.action === 'add' ? Utils.generateId() : SchoolManagement.elements.studentId.value,
        classId: SchoolManagement.elements.studentClassId.value,
        lastName: SchoolManagement.elements.studentLastName.value,
        firstName: SchoolManagement.elements.studentFirstName.value,
        birthDate: SchoolManagement.elements.studentBirthDate.value,
        gender: SchoolManagement.elements.studentGender.value
    };
    
    if (SchoolManagement.currentState.action === 'add') {
        SchoolManagement.data.students.push(studentData);
    } else {
        const index = SchoolManagement.data.students.findIndex(s => s.id === studentData.id);
        if (index !== -1) {
            SchoolManagement.data.students[index] = studentData;
        }
    }
    
    SchoolManagement.saveData();
    renderStudentsTable(studentData.classId);
    SchoolManagement.elements.studentModal.hide();
}