"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderTracker = void 0;
// 2. Les trois classes de services (Les Observateurs)
class PushNotificationService {
    update(status) {
        console.log(`[PUSH] Notification envoyée au smartphone : Commande ${status}.`);
    }
}
class CRMService {
    update(status) {
        console.log(`[CRM] Dossier client mis à jour avec le statut : ${status}.`);
    }
}
class EmailNotificationService {
    update(status) {
        console.log(`[EMAIL] Email de confirmation envoyé : Statut ${status}.`);
    }
}
// 3 & 4. Le Sujet (OrderTracker) - Refactoré pour supprimer le couplage
class OrderTracker {
    // Tableau pour stocker les observateurs dynamiquement
    observers = [];
    status = "EN_PREPARATION";
    // Méthode pour attacher (enregistrer) un service
    attach(observer) {
        this.observers.push(observer);
        console.log("Service attaché avec succès au suivi de commande.");
    }
    // Méthode pour notifier tous les services d'un coup
    notifyObservers() {
        for (const observer of this.observers) {
            observer.update(this.status);
        }
    }
    // Modifié pour déclencher la notification automatique
    setStatus(newStatus) {
        this.status = newStatus;
        console.log(`\n--- LOGISTIQUE : Passage au statut ${this.status} ---`);
        this.notifyObservers();
    }
}
exports.OrderTracker = OrderTracker;
// ==========================================================
// 5. PARTIE EXÉCUTION (TESTS)
// ==========================================================
// A. Instancier le tracker (Le Sujet)
const tracker = new OrderTracker();
// B. Instancier les 3 services (Les Observateurs)
const push = new PushNotificationService();
const crm = new CRMService();
const email = new EmailNotificationService();
// C. Attacher les services au tracker
tracker.attach(push);
tracker.attach(crm);
tracker.attach(email);
// D. Changer le statut pour voir les 3 services réagir
tracker.setStatus("EXPEDIEE");
tracker.setStatus("LIVREE");
//# sourceMappingURL=orderTracker.js.map