import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { trigger, transition, state, style, animate } from '@angular/animations';

interface TodoItem {
  text: string;
  checked: boolean;
}

@Component({
  selector: 'app-todo',
  imports: [ 
    CommonModule,
  ],
  standalone: true,
  animations: [
    trigger('fadeOutRight', [
      state('default', style({ transform: 'translateX(0)', opacity: 1 })),
      state('removing', style({ transform: 'translateX(100%)', opacity: 0 })),
      transition('default => removing', [animate('500ms ease')])
    ])
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})



export class TodoComponent {
    @ViewChild('todoItemsElement') todoItemsElement?: ElementRef<HTMLDivElement>;
    removingItem: TodoItem | null = null;

    isMenuVisible = false;
    // максимум 10 элементов сделать
    todoItems: TodoItem[] = [
      { text: "hmmmRIRa", checked: false },
      { text: "hmmmKOK3", checked: false },
      { text: "hmmmRÖRt", checked: false },
      { text: "hmmmLALfg", checked: false },
      { text: "hmmmRIR1", checked: false },
      { text: "hmmmKOK5t", checked: false },
      { text: "hmmmRÖRfg1", checked: false },
      { text: "hmmmLAL34a", checked: false },
      { text: "hmmmRIR;q", checked: false },
      { text: "hmmmKOK5;42", checked: false },
    ];

    changeMenuState() {
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

        const sound = new Audio('/sounds/checkboxsound.mp3');
        sound.play();

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
      const sound = new Audio('/sounds/tothrashsound.mp3');
      sound.play();
      this.removingItem = this.todoItems[i];

      setTimeout(() => {
        this.todoItems = this.todoItems.filter((item: TodoItem, idx: number) => idx !== i);
      }, 500);
    }
}
