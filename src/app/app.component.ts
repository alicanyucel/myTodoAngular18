import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoModeL} from './models/todo.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FlexiGridModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
todos=signal<TodoModeL[]>([]);
constructor( private http:  HttpClient){
  this.getAll();
}
getAll(){
  this.http.get<TodoModeL[]>("https://localhost:7032/api/Todos/GetAll").subscribe({
    next:(res)=>{
      this.todos.set(res);
    },
    error:(err:HttpErrorResponse)=>{
      console.log(err);
    }
  })
}
}