import User from './User'; // Le "./" signifie "ici même"

describe('Tests du modèle User', () => {
    
    test('Vérification de la structure de la classe (Encapsulation)', () => {
        // On crée une instance en mémoire sans toucher à la base de données
        const testUser = User.build({
            name: 'Mon Test',
            email: 'test@exemple.com',
            password: 'password123'
        });

        // On vérifie que les données sont bien présentes
        expect(testUser.name).toBe('Mon Test');
        expect(testUser.email).toBe('test@exemple.com');
    });

    test('L\'ID doit être absent sur un nouvel objet non sauvegardé', () => {
        const testUser = User.build({
            name: 'Sans ID',
            email: 'id@exemple.com',
            password: 'hash'
        });

        // Comme c'est un CreationOptional, l'ID ne doit pas encore exister
        expect(testUser.id).toBeUndefined();
    });
});