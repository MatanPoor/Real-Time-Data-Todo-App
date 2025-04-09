import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private readonly serverUrl: string = 'http://localhost:5000'; // Adjust to your backend URL

  constructor() {
    this.socket = io(this.serverUrl);
  }

  // Listen for the "taskCreated" event
  onTaskCreated(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('taskCreated', (task) => {
        observer.next(task);
      });
    });
  }

  // Listen for the "taskUpdated" event
  onTaskUpdated(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('taskUpdated', (task) => {
        observer.next(task);
      });
    });
  }

  // Listen for the "taskDeleted" event
  onTaskDeleted(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('taskDeleted', (task) => {
        observer.next(task);
      });
    });
  }
}