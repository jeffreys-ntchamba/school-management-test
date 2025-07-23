const Utils = {
    validateForm: function(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.remove('is-invalid');
            }
        });
        
        return isValid;
    },
    
    resetForm: function(form) {
        form.reset();
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.classList.remove('is-invalid');
        });
    },
    
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    formatDate: function(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }
};