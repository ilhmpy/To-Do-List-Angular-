import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { trigger, transition, state, style, animate } from '@angular/animations';
import { FormsModule } from "@angular/forms";

interface TodoItem {
  text: string;
  checked: boolean;
}

interface EditingItemInputValueInterface {
  value: string;
  i: number | null;
}

interface NotificationInterface {
  text: string;
  isVisible: boolean;
}

const Notifications = [
  "No more than 10 tasks allowed", 
  "you wrote more than 200 charactes"
];

@Component({
  selector: 'app-todo',
  imports: [ 
    CommonModule,
    FormsModule
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
    todoValue: string = "";
    isMenuVisible = false;

    removingItem: TodoItem | null = null;
    editingItem: TodoItem | null = null;
    editingItemInputValue: EditingItemInputValueInterface = { value: "", i: null };

    notification: NotificationInterface = { text: "", isVisible: false };

    todoItems: TodoItem[] = [
      /*{ text: "hmmmRIRa", checked: false },
      { text: "hmmmKOK3", checked: false },
      { text: "hmmmRÖRt", checked: false },
      { text: "hmmmLALfg", checked: false },
      { text: "hmmmRIR1", checked: false },
      { text: "hmmmKOK5t", checked: false },
      { text: "hmmmRÖRfg1", checked: false },
      { text: "hmmmLAL34a", checked: false },
      { text: "hmmmRIR;q", checked: false },
      { text: "hmmmKOK5;42", checked: false },*/
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

    changeCheckedStatus(i: number) {
        const sound = new Audio('/sounds/checkboxsound.mp3');
        sound.play();

        this.todoItems = this.todoItems.map((todoItem: TodoItem, idx: number) => {
          if (idx === i) {
            return { ...todoItem, checked: !todoItem.checked}
          }

          return todoItem;
        })
    } 
    
    deleteItem(i: number) {
      if (this.todoItems[i].checked) {
        const sound = new Audio('/sounds/tothrashsound.mp3');
        sound.play();
        this.removingItem = this.todoItems[i];
  
        setTimeout(() => {
          this.todoItems = this.todoItems.filter((item: TodoItem, idx: number) => idx !== i);
        }, 500);
      }
    }

    UseNotification(notificationsType: number) {
      this.notification = { text: Notifications[notificationsType], isVisible: true };

      setTimeout(() => {
        this.notification = { ...this.notification, isVisible: false };
      }, 4000);
    }

    onEnter(event: KeyboardEvent) {
      if (event.key === "Enter") {
        if (this.todoItems.length < 10) {
          if (this.todoValue.length > 200) {
            this.UseNotification(0);
            return;
          }

          this.todoItems = [{ text: this.todoValue, checked: false }, ...this.todoItems];
          this.todoValue = "";
        } else {
          this.todoValue = "";
        }
      }   
    }

    ChangeItemText(i: number) {
      if (!this.editingItem) {
        this.editingItem = this.todoItems[i];
        this.editingItemInputValue = { value: this.todoItems[i].text, i };
      } else {
        if (this.editingItemInputValue.value.length < 200) {
          this.todoItems = this.todoItems.map((todoItem: TodoItem, idx: number) => {
            if (idx === i) {
              return { ...todoItem, text: this.editingItemInputValue.value }
            }

            this.editingItem = null;
            this.editingItemInputValue = { value: "", i: null };
  
            return todoItem;
          });
        } else {
          this.UseNotification(1);
        }
      }
    } 

    onEdit(i: number) {
      if (
        this.editingItemInputValue.i === i || 
        this.editingItemInputValue.i === null
      ) {
        this.ChangeItemText(i);
      }

      return;
    }

    onEditingInput(event: KeyboardEvent, i: number) {
      if (event.key == "Enter") {
        this.ChangeItemText(i);
      }
    }
}
