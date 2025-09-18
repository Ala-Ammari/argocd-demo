import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Todo {
  id?: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <h1>Simple Todo App</h1>
      
      <div class="add-todo">
        <input 
          [(ngModel)]="newTodo" 
          placeholder="Enter a new todo..." 
          (keyup.enter)="addTodo()">
        <button (click)="addTodo()">Add</button>
      </div>
      
      <div class="todo-list">
        <div *ngFor="let todo of todos" class="todo-item">
          <input 
            type="checkbox" 
            [checked]="todo.completed" 
            (change)="toggleTodo(todo)">
          <span [class.completed]="todo.completed">{{ todo.title }}</span>
          <button (click)="deleteTodo(todo.id!)" class="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    
    .add-todo {
      margin-bottom: 20px;
    }
    
    .add-todo input {
      padding: 8px;
      margin-right: 10px;
      width: 300px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .add-todo button {
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .todo-item {
      display: flex;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    
    .todo-item input[type="checkbox"] {
      margin-right: 10px;
    }
    
    .todo-item span {
      flex-grow: 1;
      padding: 0 10px;
    }
    
    .completed {
      text-decoration: line-through;
      color: #888;
    }
    
    .delete-btn {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class AppComponent implements OnInit {
  todos: Todo[] = [];
  newTodo = '';
  private apiUrl = '/api/todos';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.http.get<Todo[]>(this.apiUrl).subscribe(
      todos => this.todos = todos,
      error => console.error('Error loading todos:', error)
    );
  }

  addTodo() {
    if (this.newTodo.trim()) {
      const todo: Todo = {
        title: this.newTodo.trim(),
        completed: false
      };
      
      this.http.post<Todo>(this.apiUrl, todo).subscribe(
        newTodo => {
          this.todos.push(newTodo);
          this.newTodo = '';
        },
        error => console.error('Error adding todo:', error)
      );
    }
  }

  toggleTodo(todo: Todo) {
    todo.completed = !todo.completed;
    this.http.put<Todo>(`${this.apiUrl}/${todo.id}`, todo).subscribe(
      updatedTodo => {
        const index = this.todos.findIndex(t => t.id === updatedTodo.id);
        if (index > -1) {
          this.todos[index] = updatedTodo;
        }
      },
      error => console.error('Error updating todo:', error)
    );
  }

  deleteTodo(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(
      () => {
        this.todos = this.todos.filter(todo => todo.id !== id);
      },
      error => console.error('Error deleting todo:', error)
    );
  }
}