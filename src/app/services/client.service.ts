import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection,AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';//everything returning from a firestore to a component is observable
import{Client} from '../models/Client';


@Injectable({
  providedIn: 'root'
})


export class ClientService {
  clientsCollection!: AngularFirestoreCollection<Client>;
  clientsDoc!: AngularFirestoreDocument<Client>;
  clients!: Observable<Client[]>;
  client!: Observable<Client>;
  
  constructor(private afs:AngularFirestore) { 
  this.clientsCollection= this.afs.collection('clients', ref=>ref.orderBy('lastName','asc'));
  }
//study snapshots in angular documentation
//purpose is to get clients with ID. This can be implemented in 2 ways. 
//Value changes returns without id. But bcz we need, we use snapshot changes.
//refer angular collections
getClients(): Observable<Client[]> {
  //Get Clients with id
  this.clients = this.clientsCollection.snapshotChanges().pipe(
    map((changes: any[]) => {
      return changes.map((action: { payload: { doc: { data: () => Client; id: string | undefined; }; }; }) => {
        const data = action.payload.doc.data() as Client;
        data.id = action.payload.doc.id;
        return data;
      });
    })
  );
  return this.clients;
  }


  newClient(client: Client) {
    this.clientsCollection.add(client);
  }

  getClient(id: string): Observable<Client> {
    this.clientsDoc = this.afs.doc<Client>(`clients/${id}`);
    this.client = this.clientsDoc.snapshotChanges().pipe(map(action => {
      if(action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as Client;
        data.id = action.payload.id;
        return data;
      }
    })
    );
    return this.client;
  }

  updateClient(client: Client) {
    this.clientsDoc = this.afs.doc(`clients/${client.id}`);
    this.clientsDoc.update(client);
  }
}
