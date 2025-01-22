import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

interface TodoItem {
  text: string;
  checked: boolean;
}

@Component({
  selector: 'app-todo',
  imports: [ CommonModule ],
  standalone: true,
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})

export class TodoComponent {
    @ViewChild('todoItemsElement') todoItemsElement?: ElementRef<HTMLDivElement>;

    isMenuVisible = false;
    // максимум 10 элементов сделать
    todoItems: TodoItem[] = [
      { text: "hmmmRIR", checked: false },
      { text: "hmmmKOK", checked: false },
      { text: "hmmmRÖR", checked: false },
      { text: "hmmmLAL", checked: false },
      { text: "hmmmRIR", checked: false },
      { text: "hmmmKOK", checked: false },
      { text: "hmmmRÖR", checked: false },
      { text: "hmmmLAL", checked: false },
      { text: "hmmmRIR", checked: false },
      { text: "hmmmKOK", checked: false },
    ];

    async changeMenuState() {
      this.isMenuVisible = !this.isMenuVisible;

      if (this.isMenuVisible) {
        setTimeout(() => {
          if (this.todoItemsElement) {
            this.todoItemsElement.nativeElement.style.zIndex = "0";
          }
        }, 1000);
      }
    }

    changeChackedStatus(i: number) {
        let newTodoItems: TodoItem[] = [];

        this.todoItems.forEach((todoItem: TodoItem, idx: number) => {
           if(idx === i) {
              newTodoItems.push({ ...todoItem, checked: !todoItem.checked });
           } else {
              newTodoItems.push(todoItem);
           }
        });

        this.todoItems = newTodoItems;
    } 

    // сделать анимацию при удалении(в чатгпт помощь маленькая)
    deleteItem(i: number) {
      this.todoItems = this.todoItems.filter((item: TodoItem, idx: number) => idx !== i);
    }
}
