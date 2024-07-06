import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { TodoModeL } from './models/todo.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FlexiGridModule } from 'flexi-grid';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FlexiGridModule, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [DatePipe]
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  todos = signal<TodoModeL[]>([]);
  addModel = signal<TodoModeL>(new TodoModeL());
  updateModel = signal<TodoModeL>(new TodoModeL());
  isUpdateFormActive = signal<boolean>(false);

  @ViewChild("addModalCloseBtn") addModalCloseBtn : ElementRef<HTMLButtonElement> | undefined;
  @ViewChild("updateModalCloseBtn") updateModalCloseBtn : ElementRef<HTMLButtonElement> | undefined;
  
  constructor(
    private http: HttpClient,
    private date: DatePipe
  ){
    this.getAll();
    this.addModel().deadline = this.date.transform(new Date(),"yyyy-MM-dd")!;
  }

  getAll(){
    this.http.get<TodoModeL[]>("https://localhost:7032/api/Todos/GetAll").subscribe({
      next: (res) => {
        this.todos.set(res);
      },
      error: (err: HttpErrorResponse)=> {
        console.log(err);        
      }
    })
  }

  create(){
    this.http.post("https://localhost:7032/api/Todos/Create", this.addModel()).subscribe({
      next: ()=> {
        this.getAll();
        this.addModalCloseBtn!.nativeElement.click();
        this.addModel.set(new TodoModeL());
        this.addModel().deadline = this.date.transform(new Date(),"yyyy-MM-dd")!;
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        })
        Toast.fire('Create is successful', '', 'success')
      },
      error: (err: HttpErrorResponse)=> {
        console.log(err);        
      }
    })
  }

  deleteById(id: string){
    Swal.fire({
      title: "Delete?",
      text: "You want to delete this record?",
      showConfirmButton: true,
      confirmButtonText: "Delete",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      icon: "question"
    }).then(res=> {
      if(res.isConfirmed){
        this.http.delete(`https://localhost:7032/api/Todos/DeleteById?id=${id}`).subscribe({
          next: (res)=> {
            this.getAll();
            const Toast = Swal.mixin({
              toast: true,
              position: 'bottom-end',
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false
            })
            Toast.fire('Delete is successful', '', 'info')
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);        
          }
        });
      }
    });
  }
  
  changeIsCompleted(model: TodoModeL){
    this.http.put("https://localhost:7032/api/Todos/Update", model).subscribe({
      next: ()=> {},
      error: (err: HttpErrorResponse)=> {
        console.log(err);        
      }
    })
  }

  get(item: TodoModeL){
    this.updateModel.set({...item});    
  }

  getWithForm(item: TodoModeL){
    item.isShowUpdateForm = true;
    this.isUpdateFormActive.set(true);
  }

  cancel(){
    this.getAll();
    this.isUpdateFormActive.set(false);
  }

  update(){
    this.http.put("https://localhost:7032/api/Todos/Update", this.updateModel()).subscribe({
      next: ()=> {
        this.getAll();
        this.updateModalCloseBtn!.nativeElement.click();
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-right",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });

        Toast.fire("Update is successful", "","warning");
      },
      error: (err: HttpErrorResponse)=> {
        console.log(err);        
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-right",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });

        Toast.fire("Something went wrong", "","error");
      }
    })
  }

  updateWithForm(item: TodoModeL){
    this.http.put("https://localhost:7032/api/Todos/Update", item).subscribe({
      next: ()=> {
        this.getAll();
        item.isShowUpdateForm = false;
        this.updateModalCloseBtn!.nativeElement.click();
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-right",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });

        Toast.fire("Update is successful", "","warning");
      },
      error: (err: HttpErrorResponse)=> {
        console.log(err);        
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-right",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });

        Toast.fire("Something went wrong", "","error");
      }
    })
  }
  
}