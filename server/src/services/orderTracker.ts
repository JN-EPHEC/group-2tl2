// 1. L'interface que tous les services de notification doivent respecter
interface IObserver {
  update(status: string): void;
}

// 2. Les "Observateurs" concrets (les services)
class EmailService implements IObserver {
  update(status: string): void {
    console.log(`[EMAIL] Notification envoyée : Votre commande est désormais "${status}".`);
  }
}

class PushService implements IObserver {
  update(status: string): void {
    console.log(`[PUSH] Alerte mobile : Statut mis à jour -> ${status}`);
  }
}

// 3. Le "Sujet" (l'objet surveillé)
export class OrderTracker {
  private observers: IObserver[] = []; // Liste des abonnés
  private status: string = "EN_ATTENTE";

  // Méthode pour ajouter un abonné
  public subscribe(observer: IObserver): void {
    this.observers.push(observer);
    console.log("Nouveau service abonné aux notifications.");
  }

  // Quand le statut change, on prévient tout le monde
  public setStatus(newStatus: string): void {
    this.status = newStatus;
    console.log(`\n--- CHANGEMENT DE STATUT : ${this.status} ---`);
    this.notifyAll();
  }

  private notifyAll(): void {
    for (const observer of this.observers) {
      observer.update(this.status);
    }
  }
}

// ==========================================================
// --- PARTIE EXÉCUTION (TEST) ---
// ==========================================================

const tracker = new OrderTracker();

// On crée les services
const email = new EmailService();
const push = new PushService();

// On les abonne au tracker
tracker.subscribe(email);
tracker.subscribe(push);

// On change le statut pour déclencher les notifications
tracker.setStatus("EXPÉDIÉE");
tracker.setStatus("LIVRÉE");