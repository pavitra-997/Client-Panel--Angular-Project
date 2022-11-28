import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';

import { Client } from 'src/app/models/Client';
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  clients!:Client[]; 
  totalOwed: number | undefined;

  constructor(private clientService:ClientService) { }

  ngOnInit(): void {
    this.clientService.getClients().subscribe(clients=>{
      this.clients=clients;
      this.getTotalOwed();
    })
  }
  // Sometimes the TypeScript compiler isn't able to determine what type of value it may at a certain point. 
  // By adding the exclamation mark ( ! ) at the end, you let the TypeScript compiler that there is no way 
  // this variable will be undefined or null.

  getTotalOwed() {
    this.totalOwed = this.clients.reduce((total, client) => {
   
      return total+ parseFloat(client.balance!.toString());
    }, 0);
  }

}
