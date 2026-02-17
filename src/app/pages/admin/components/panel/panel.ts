import { Component, EventEmitter, Output, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { ProgramsService, Program } from '../../../../services/programs.service';
import { VacanciesService, Vacancy } from '../../../../services/vacancies.service';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Editor';
}

@Component({
    selector: 'app-admin-panel',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './panel.html'
})
export class AdminPanelComponent {
    @Output() logout = new EventEmitter<void>();

    private authService = inject(AuthService);
    private programsService = inject(ProgramsService);
    private vacanciesService = inject(VacanciesService);
    private ngZone = inject(NgZone);
    private cdr = inject(ChangeDetectorRef);
    user$ = this.authService.user$;

    currentView: 'programas' | 'equipo' | 'vacantes' | 'usuarios' = 'programas';
    isCreatingProgram = false;
    isCreatingVacancy = false;
    isCreatingUser = false;
    isLoading = false;
    editingId: string | null = null;
    editingVacancyId: string | null = null;
    selectedFile: File | null = null;

    toast: { message: string, type: 'success' | 'error', show: boolean } = {
        message: '',
        type: 'success',
        show: false
    };

    showToast(message: string, type: 'success' | 'error' = 'success') {
        this.ngZone.run(() => {
            this.toast = { message, type, show: true };
            this.cdr.detectChanges();
            setTimeout(() => {
                this.toast.show = false;
                this.cdr.detectChanges();
            }, 3000);
        });
    }

    programs: Program[] = [];
    vacancies: Vacancy[] = [];

    // Initialize programs and vacancies
    constructor() {
        this.programsService.getPrograms().subscribe((data: Program[]) => {
            this.programs = data;
            this.cdr.detectChanges();
        });

        this.vacanciesService.getVacancies().subscribe((data: Vacancy[]) => {
            this.vacancies = data;
            this.cdr.detectChanges();
        });
    }

    // User Management
    users: User[] = [
        { id: '1', name: 'Admin Principal', email: 'donaxjimenez00@gmail.com', role: 'Admin' },
        { id: '2', name: 'Editor Web', email: 'editor@fwsa.org', role: 'Editor' }
    ];

    newUser = {
        name: '',
        email: '',
        password: '',
        role: 'Editor' as 'Admin' | 'Editor'
    };

    newProgram: Partial<Program> = {
        title: '',
        description: '',
        category: 'Educación',
        status: 'Activo',
        image: ''
    };

    newVacancy: Partial<Vacancy> = {
        title: '',
        location: '',
        type: 'Tiempo Completo',
        description: '',
        requirements: [],
        status: 'Abierta'
    };

    vacancyRequirementsText: string = '';

    switchView(view: 'programas' | 'equipo' | 'vacantes' | 'usuarios') {
        this.currentView = view;
        this.isCreatingProgram = false;
        this.isCreatingVacancy = false;
        this.isCreatingUser = false;
        this.editingId = null;
        this.editingVacancyId = null;
        this.selectedFile = null;
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
        }
    }

    // Program methods ...
    showCreateProgramForm() {
        this.isCreatingProgram = true;
        this.editingId = null;
        this.newProgram = { title: '', description: '', category: 'Educación', status: 'Activo', image: '' };
    }

    editProgram(program: Program) {
        this.isCreatingProgram = true;
        this.editingId = program.id!;
        this.newProgram = { ...program };
        this.cdr.detectChanges();
    }

    async deleteProgram(id: string) {
        if (confirm('¿Estás seguro de que deseas eliminar este programa?')) {
            try {
                await this.programsService.deleteProgram(id);
                this.showToast('Programa eliminado con éxito.', 'success');
            } catch (error) {
                this.showToast('Error al eliminar el programa.', 'error');
            }
        }
    }

    async saveProgram() {
        if (!this.newProgram.title || !this.newProgram.description) {
            this.showToast('Por favor completa los campos obligatorios.', 'error');
            return;
        }

        this.isLoading = true;
        this.cdr.detectChanges(); // Asegura que el spinner se muestre

        try {
            let imageUrl = this.newProgram.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000';

            if (this.selectedFile) {
                imageUrl = await this.programsService.uploadImage(this.selectedFile);
            }

            const programData: Program = {
                title: this.newProgram.title,
                description: this.newProgram.description,
                category: this.newProgram.category || 'Varios',
                status: this.newProgram.status || 'Activo',
                image: imageUrl
            };

            if (this.editingId) {
                await this.programsService.updateProgram(this.editingId, programData);
                this.showToast('Programa actualizado con éxito.', 'success');
            } else {
                await this.programsService.addProgram(programData);
                this.showToast('Programa creado con éxito.', 'success');
            }

            // Forzamos el cierre y la actualización de la UI dentro de la zona de Angular
            this.ngZone.run(() => {
                this.isCreatingProgram = false;
                this.editingId = null;
                this.selectedFile = null;
                this.isLoading = false;
                this.newProgram = { title: '', description: '', category: 'Educación', status: 'Activo', image: '' };
                this.cdr.detectChanges();
            });

        } catch (error) {
            console.error('Error saving program:', error);
            this.showToast('Error al guardar el programa.', 'error');
            this.ngZone.run(() => {
                this.isLoading = false;
                this.cdr.detectChanges();
            });
        }
    }

    // Vacancy Methods
    showCreateVacancyForm() {
        this.isCreatingVacancy = true;
        this.editingVacancyId = null;
        this.newVacancy = { title: '', location: '', type: 'Tiempo Completo', description: '', requirements: [], status: 'Abierta' };
        this.vacancyRequirementsText = '';
    }

    editVacancy(vacancy: Vacancy) {
        this.isCreatingVacancy = true;
        this.editingVacancyId = vacancy.id!;
        this.newVacancy = { ...vacancy };
        this.vacancyRequirementsText = vacancy.requirements.join(', ');
        this.cdr.detectChanges();
    }

    async deleteVacancy(id: string) {
        if (confirm('¿Estás seguro de que deseas eliminar esta vacante?')) {
            try {
                await this.vacanciesService.deleteVacancy(id);
                this.showToast('Vacante eliminada con éxito.', 'success');
            } catch (error) {
                this.showToast('Error al eliminar la vacante.', 'error');
            }
        }
    }

    async saveVacancy() {
        if (!this.newVacancy.title || !this.newVacancy.description) {
            this.showToast('Por favor completa los campos requeridos.', 'error');
            return;
        }

        this.isLoading = true;
        this.cdr.detectChanges();

        try {
            const reqs = this.vacancyRequirementsText ? this.vacancyRequirementsText.split(',').map(r => r.trim()).filter(r => r !== '') : [];

            const vacancyData: Vacancy = {
                title: this.newVacancy.title!,
                location: this.newVacancy.location || 'La Guajira',
                type: this.newVacancy.type || 'Tiempo Completo',
                description: this.newVacancy.description!,
                requirements: reqs,
                status: (this.newVacancy.status as 'Abierta' | 'Cerrada') || 'Abierta'
            };

            if (this.editingVacancyId) {
                await this.vacanciesService.updateVacancy(this.editingVacancyId, vacancyData);
                this.showToast('Vacante actualizada con éxito.', 'success');
            } else {
                await this.vacanciesService.addVacancy(vacancyData);
                this.showToast('Vacante creada con éxito.', 'success');
            }

            this.ngZone.run(() => {
                this.isCreatingVacancy = false;
                this.editingVacancyId = null;
                this.isLoading = false;
                this.newVacancy = { title: '', location: '', type: 'Tiempo Completo', description: '', requirements: [], status: 'Abierta' };
                this.vacancyRequirementsText = '';
                this.cdr.detectChanges();
            });

        } catch (error) {
            console.error('Error saving vacancy:', error);
            this.showToast('Error al guardar la vacante.', 'error');
            this.isLoading = false;
            this.cdr.detectChanges();
        }
    }

    // User Methods
    showCreateUserForm() {
        this.isCreatingUser = true;
        this.newUser = { name: '', email: '', password: '', role: 'Editor' };
    }


    async saveUser() {
        if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
            this.showToast('Por favor completa todos los campos.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.newUser.email)) {
            this.showToast('Por favor ingresa un correo electrónico válido.', 'error');
            return;
        }

        this.isLoading = true;
        this.cdr.detectChanges();

        try {
            const firebaseUser = await this.authService.adminCreateUser(
                this.newUser.name,
                this.newUser.email,
                this.newUser.password
            );

            this.users.push({
                id: firebaseUser.uid,
                name: this.newUser.name,
                email: this.newUser.email,
                role: this.newUser.role
            });

            this.isCreatingUser = false;
            this.showToast('Usuario creado con éxito.', 'success');
        } catch (error: any) {
            console.error('Error creating user:', error);
            let msg = 'Error al crear usuario.';
            if (error.code === 'auth/email-already-in-use') msg = 'El correo ya está en uso.';
            if (error.code === 'auth/weak-password') msg = 'La contraseña es muy débil (mínimo 6 caracteres).';
            this.showToast(msg, 'error');
        } finally {
            this.ngZone.run(() => {
                this.isLoading = false;
                this.cdr.detectChanges();
            });
        }
    }

    deleteUser(id: string) {
        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            this.users = this.users.filter(u => u.id !== id);
        }
    }

    get activeProgramsCount() {
        return this.programs.filter(p => p.status === 'Activo').length;
    }

    get finishedProgramsCount() {
        return this.programs.filter(p => p.status === 'Finalizado').length;
    }

    onLogout() {
        this.logout.emit();
    }
}
