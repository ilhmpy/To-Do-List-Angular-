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
  "you wrote more than 200 charactes or less than 5 charactes"
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

    todoItems: TodoItem[] = [];
    
    // сделать так что бы меню закрывалось когда уже нету элементов и открывалось когда появился
    // сделать так что бы и при нажатии на стрелочку тоже менялось положение меню
    // скорее всего проблема в реализации с isMenuVisible && todoItems.length > 0 || todoItems.length > 0
    // разобраться в чем причина и сделать рефакторинг для исправления 

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
      if (event.key === "Enter" && this.editingItemInputValue.value === "") {
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
        if (this.editingItemInputValue.value.length < 200 && this.editingItemInputValue.value.length > 5) {
          this.todoItems = this.todoItems.map((todoItem: TodoItem, idx: number) => {
            if (idx === i) {
              return { ...todoItem, text: this.editingItemInputValue.value }
            }
  
            return todoItem;
          });
        } else {
          this.UseNotification(1);
        }

        this.editingItem = null;
        this.editingItemInputValue = { value: "", i: null };
      }
    } 

    onEdit(i: number) {
      console.log(this.editingItemInputValue)
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
    
    get TruncatedText() {
      if (this.editingItemInputValue) {
        return this.editingItemInputValue.value.length > 200 ? 
          this.editingItemInputValue.value.slice(0, 200) :
          this.editingItemInputValue.value;
      } else {
        return this.editingItemInputValue;
      }
    }

    get ExcessText() {
      return this.editingItemInputValue.value.slice(200);
    }
}
