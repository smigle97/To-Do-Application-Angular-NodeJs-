import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject, debounceTime, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  tasksArray: { taskName: string, isCompleted: boolean }[] = [];
  private saveTrigger$ = new Subject<void>();
  private unsubscribe$ = new Subject<void>();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.loadTasks();
    // Auto-save changes after a brief delay of user inactivity
    this.saveTrigger$
      .pipe(
        debounceTime(3000), 
        switchMap(async () => this.saveTasks())
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit(form: NgForm) {
    this.tasksArray.push({
      taskName: form.controls['task'].value,
      isCompleted: false
    })
    this.saveTasks();
    form.reset();
  }

  onDelete(index: number) {
    this.tasksArray.splice(index, 1);
    this.saveTasks();
  }

  onCheck(index: number) {
    console.log(index);
    this.tasksArray[index].isCompleted = !this.tasksArray[index].isCompleted;
    console.log(this.tasksArray);
    this.saveTrigger$.next();
  }

  loadTasks() {
    this.http.get<{ taskName: string, isCompleted: boolean }[]>('http://localhost:3000/tasks').subscribe({
      next: (data) => {
        this.tasksArray = data;
        console.log(this.tasksArray);
      },
      error: (e) => console.error('Error loading tasks', e),
      complete: () => console.info('complete')
    });
  }

  saveTasks() {
    this.http.put('http://localhost:3000/tasks', this.tasksArray).subscribe(
      {
        error: (e) => console.error('Error loading tasks', e),
        complete: () => {
          console.log('Tasks saved successfully');
          this.snackBar.open('Tasks saved successfully!', 'Close', {
            duration: 2000,
          });
        }
      });
  }

}