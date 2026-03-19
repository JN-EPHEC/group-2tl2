// 1. Interface IOrderObserver (Le contrat imposé)
interface IOrderObserver {
  update(status: string): void;
}

// 2. Les trois classes de services (Les Observateurs)
class PushNotificationService implements IOrderObserver {
  public update(status: string): void {
    console.log(`[PUSH] Notification envoyée au smartphone : Commande ${status}.`);
  }
}

class CRMService implements IOrderObserver {
  public update(status: string): void {
    console.log(`[CRM] Dossier client mis à jour avec le statut : ${status}.`);
  }
}

class EmailNotificationService implements IOrderObserver {
  public update(status: string): void {
    console.log(`[EMAIL] Email de confirmation envoyé : Statut ${status}.`);
  }
}

// 3 & 4. Le Sujet (OrderTracker) - Refactoré pour supprimer le couplage
export class OrderTracker {
  // Tableau pour stocker les observateurs dynamiquement
  private observers: IOrderObserver[] = [];
  private status: string = "EN_PREPARATION";

  // Méthode pour attacher (enregistrer) un service
  public attach(observer: IOrderObserver): void {
    this.observers.push(observer);
    console.log("Service attaché avec succès au suivi de commande.");
  }

  // Méthode pour notifier tous les services d'un coup
  private notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this.status);
    }
  }

  // Modifié pour déclencher la notification automatique
  public setStatus(newStatus: string): void {
    this.status = newStatus;
    console.log(`\n--- LOGISTIQUE : Passage au statut ${this.status} ---`);
    this.notifyObservers();
  }
}

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