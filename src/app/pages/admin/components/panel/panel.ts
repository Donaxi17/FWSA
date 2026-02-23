import { Component, EventEmitter, Output, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';
import { AuthService } from '../../../../services/auth.service';
import { ProgramsService, Program } from '../../../../services/programs.service';
import { VacanciesService, Vacancy } from '../../../../services/vacancies.service';
import { UsersService, AdminUser } from '../../../../services/users.service';
import { TeamService, TeamMember } from '../../../../services/team.service';

// El interface User se reemplaza por AdminUser del servicio


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
    private usersService = inject(UsersService);
    private teamService = inject(TeamService);
    private ngZone = inject(NgZone);
    private cdr = inject(ChangeDetectorRef);
    user$ = this.authService.user$;

    // Listas de datos
    programs: Program[] = [];
    vacancies: Vacancy[] = [];
    team: TeamMember[] = [];
    users: AdminUser[] = [];

    // Estados de UI
    currentView: 'programas' | 'equipo' | 'vacantes' | 'usuarios' = 'programas';
    currentUserRole: 'Admin' | 'Editor' = 'Editor';
    isCreatingProgram = false;
    isCreatingVacancy = false;
    isCreatingMember = false;
    isCreatingUser = false;
    editingId: string | null = null;
    editingVacancyId: string | null = null;
    editingMemberId: string | null = null;
    isLoading = false;
    selectedFile: File | null = null;
    vacancyRequirementsText: string = '';

    // Modelos para formularios
    newProgram: Program = { title: '', description: '', category: 'Educación', status: 'Activo', image: '' };
    newVacancy: Partial<Vacancy> = { title: '', location: '', type: 'Tiempo Completo', description: '', requirements: [], status: 'Abierta' };
    newMember: TeamMember = { name: '', role: '', description: '', image: '', order: 0 };
    newUser = { name: '', email: '', password: '', role: 'Editor' as 'Admin' | 'Editor' };

    toast = { show: false, message: '', type: 'success' as 'success' | 'error' };

    constructor() {
        // Cargar Programas
        this.programsService.getPrograms().subscribe(data => {
            this.programs = data;
            this.cdr.detectChanges();
        });

        // Cargar Vacantes
        this.vacanciesService.getVacancies().subscribe(data => {
            this.vacancies = data;
            this.cdr.detectChanges();
        });

        // Cargar Usuarios
        this.usersService.getUsers().subscribe(data => {
            this.users = data;
            this.updateCurrentRole();
            this.cdr.detectChanges();
        });

        // Cargar Equipo
        this.teamService.getTeam().subscribe(data => {
            this.team = data;
            if (this.team.length === 0) {
                this.seedInitialTeam();
            }
            this.cdr.detectChanges();
        });

        // Suscribirse a cambios de auth
        this.user$.subscribe(fbUser => {
            this.ngZone.run(() => {
                this.updateCurrentRole(fbUser);
            });
        });
    }

    showToast(message: string, type: 'success' | 'error' = 'success') {
        this.ngZone.run(() => {
            this.toast = { show: true, message, type };
            this.cdr.detectChanges();
            setTimeout(() => {
                this.toast.show = false;
                this.cdr.detectChanges();
            }, 3000);
        });
    }

    private updateCurrentRole(fbUser: any = null) {
        const processRole = (user: any) => {
            if (user && user.email) {
                const foundUser = this.users.find(u => u.email.toLowerCase() === user.email?.toLowerCase());
                if (foundUser) {
                    this.currentUserRole = foundUser.role;
                } else {
                    if (user.email === 'donaxjimenez00@gmail.com') {
                        this.currentUserRole = 'Admin';
                        this.usersService.saveUser({
                            id: user.uid,
                            name: user.displayName || 'Admin Principal',
                            email: user.email,
                            role: 'Admin'
                        });
                    } else {
                        this.currentUserRole = 'Editor';
                    }
                }

                if (this.currentUserRole === 'Editor' && (this.currentView === 'usuarios' || this.currentView === 'equipo')) {
                    this.currentView = 'programas';
                }
                this.cdr.detectChanges();
            }
        };

        if (fbUser) {
            processRole(fbUser);
        } else {
            this.authService.user$.pipe(take(1)).subscribe(user => processRole(user));
        }
    }

    async seedInitialTeam() {
        this.isLoading = true;
        this.cdr.detectChanges();

        const initialMembers: TeamMember[] = [
            { name: 'Yisleine Karina Torres Turizo', role: 'Representante Legal', description: 'Representa legalmente a la Fundación y asegura el correcto funcionamiento institucional.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800', order: 1 },
            { name: 'Rodolfo Torres Castillo', role: 'Presidente', description: 'Lidera la dirección estratégica de la Fundación y coordina el desarrollo de planes.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800', order: 2 },
            { name: 'Yaniris Duarte Bula', role: 'Vicepresidente', description: 'Apoya al presidente y fortalece la gestión y seguimiento de las actividades.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800', order: 3 },
            { name: 'Yuranis Bula Espinosa', role: 'Secretaria', description: 'Gestiona la documentación y comunicaciones, apoyando los procesos administrativos.', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800', order: 4 },
            { name: 'Yovert Alberto Duarte Bula', role: 'Tesorero', description: 'Administra los recursos financieros y garantiza su uso transparente.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800', order: 5 },
            { name: 'Yonelis Beatriz Turizo Choles', role: 'Vocal', description: 'Apoya la toma de decisiones y acompaña la ejecución de programas.', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800', order: 6 },
            { name: 'Abigail Yiseth Torres Turizo', role: 'Vocal', description: 'Contribuye con propuestas y apoyo en las actividades institucionales.', image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=800', order: 7 }
        ];

        try {
            await this.teamService.initializeDefaultTeam(initialMembers);
            this.ngZone.run(() => {
                this.showToast('Equipo original restaurado con éxito.', 'success');
                this.isLoading = false;
                this.cdr.detectChanges();
            });
        } catch (error) {
            console.error('Error seeding team:', error);
            this.showToast('Error al restaurar el equipo.', 'error');
            this.isLoading = false;
            this.cdr.detectChanges();
        }
    }

    switchView(view: 'programas' | 'equipo' | 'vacantes' | 'usuarios') {
        // Bloquear switch manual si es editor
        if (this.currentUserRole === 'Editor' && (view === 'usuarios' || view === 'equipo')) {
            this.showToast('No tienes permisos para acceder a esta sección.', 'error');
            return;
        }

        this.currentView = view;
        this.isCreatingProgram = false;
        this.isCreatingVacancy = false;
        this.isCreatingMember = false;
        this.isCreatingUser = false;
        this.editingId = null;
        this.editingVacancyId = null;
        this.editingMemberId = null;
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

    // Team Methods
    showCreateMemberForm() {
        this.isCreatingMember = true;
        this.editingMemberId = null;
        this.newMember = { name: '', role: '', description: '', image: '', order: this.team.length + 1 };
    }

    editMember(member: TeamMember) {
        this.isCreatingMember = true;
        this.editingMemberId = member.id!;
        this.newMember = { ...member };
        this.cdr.detectChanges();
    }

    async deleteMember(id: string) {
        if (confirm('¿Estás seguro de que deseas eliminar a este miembro del equipo?')) {
            try {
                await this.teamService.deleteMember(id);
                this.showToast('Miembro eliminado con éxito.', 'success');
            } catch (error) {
                this.showToast('Error al eliminar el miembro.', 'error');
            }
        }
    }

    async saveMember() {
        if (!this.newMember.name || !this.newMember.role) {
            this.showToast('Por favor completa los campos obligatorios.', 'error');
            return;
        }

        this.isLoading = true;
        this.cdr.detectChanges();

        try {
            let imageUrl = this.newMember.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800';

            if (this.selectedFile) {
                imageUrl = await this.programsService.uploadImage(this.selectedFile);
            }

            const memberData: TeamMember = {
                ...this.newMember,
                image: imageUrl
            };

            if (this.editingMemberId) {
                await this.teamService.updateMember(this.editingMemberId, memberData);
                this.showToast('Miembro actualizado con éxito.', 'success');
            } else {
                await this.teamService.addMember(memberData);
                this.showToast('Miembro añadido con éxito.', 'success');
            }

            this.ngZone.run(() => {
                this.isCreatingMember = false;
                this.editingMemberId = null;
                this.selectedFile = null;
                this.isLoading = false;
                this.cdr.detectChanges();
            });
        } catch (error) {
            console.error('Error saving member:', error);
            this.showToast('Error al guardar el miembro.', 'error');
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

        if (this.newUser.password.length < 6) {
            this.showToast('La contraseña debe tener al menos 6 caracteres.', 'error');
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

            // Persistir rol y datos en Firestore
            await this.usersService.saveUser({
                id: firebaseUser.uid,
                name: this.newUser.name,
                email: this.newUser.email,
                role: this.newUser.role
            });

            this.isCreatingUser = false;
            this.showToast('Usuario creado y persistido con éxito.', 'success');
        } catch (error: any) {
            console.error('Error creating user:', error);
            let msg = 'Error al crear usuario.';
            if (error.code === 'auth/email-already-in-use') msg = 'El correo ya está en uso.';
            if (error.code === 'auth/weak-password') msg = 'La contraseña es muy débil.';
            this.showToast(msg, 'error');
        } finally {
            this.ngZone.run(() => {
                this.isLoading = false;
                this.cdr.detectChanges();
            });
        }
    }

    async deleteUser(id: string) {
        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            try {
                await this.usersService.deleteUser(id);
                this.showToast('Usuario eliminado con éxito.', 'success');
            } catch (error) {
                this.showToast('Error al eliminar usuario.', 'error');
            }
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
