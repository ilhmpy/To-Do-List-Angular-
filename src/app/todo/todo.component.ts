import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { trigger, transition, state, style, animate } from '@angular/animations';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";

interface TodoItem {
  text: string;
  checked: boolean;
}

@Component({
  selector: 'app-todo',
  imports: [ 
    CommonModule,
    FormsModule,
    ReactiveFormsModule
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
    editingItemID: number | null = null;
    showNotification: boolean = false;
    isAllowedNewNotificationTimeout: boolean = true;
    todoValueForm: FormGroup;

    todoItems: TodoItem[] = [];

    constructor(private fb: FormBuilder) {
      this.todoValueForm = this.fb.group({
        todoValue: [
          '',
          [ Validators.required, Validators.minLength(5), Validators.maxLength(199) ]
        ],

        editingItemValue: [
          null,
          [ Validators.required, Validators.minLength(5), Validators.maxLength(199) ]
        ]
      });
    }

    // проработать появление уведомления о пустом поле, 
    // что бы уведомление не показывалось сразу же после очистки поля так как я добавил новый элемент
    // сделать так что бы когда человек загружался его клавиатура сразу же был сфокусированна на главном инпуте
    // сделать уведомления также и при редактировании

    NotificationTimeout() {
      if (this.isAllowedNewNotificationTimeout) {
        this.isAllowedNewNotificationTimeout = false;
        
        setTimeout(() => {
          this.showNotification = false;
          this.isAllowedNewNotificationTimeout = true;
        }, 6000);
      }
    }

    changeCheckedStatus(i: number) {
        new Audio('/sounds/checkboxsound.mp3').play();

        this.todoItems = this.todoItems.map((todoItem: TodoItem, idx: number) => {
          if (idx === i) {
            return { ...todoItem, checked: !todoItem.checked}
          }

          return todoItem;
        })
    } 
    
    deleteItem(i: number) {
      if (this.todoItems[i].checked) {
        new Audio('/sounds/tothrashsound.mp3').play();
        this.removingItem = this.todoItems[i];
  
        setTimeout(() => {
          this.todoItems = this.todoItems.filter((item: TodoItem, idx: number) => idx !== i);
        }, 500);
      }
    }

    onEnter(event: KeyboardEvent) {
      if (event.key === "Enter" && this.todoValueForm.get('editingItemValue')?.value === null) {
        this.showNotification = true;

        if (this.todoItems.length < 10) {
          const text = this.todoValueForm.get('todoValue')?.value; 

          if (!this.todoValueForm.get('todoValue')?.errors) {
            this.todoItems = [{ text, checked: false }, ...this.todoItems];  

            this.todoValueForm.reset();
          }

          this.NotificationTimeout();

        } else {
          this.todoValueForm.reset();
        }
      }   
    }

    ChangeItemText(i: number) {
      const valueForm = this.todoValueForm.get('editingItemValue');

      if (valueForm?.value === null) {
        this.editingItemID = i;
        valueForm.setValue(this.todoItems[i].text)
      } else {
        if (!valueForm?.errors) {
          this.todoItems = this.todoItems.map((todoItem: TodoItem, idx: number) => {
            if (idx === i) {
              return { ...todoItem, text: valueForm?.value ? valueForm.value : "" }
            }

            return todoItem;
          });

          this.editingItemID = null;
          valueForm?.reset();
        }

        console.log("ASDSD")
        this.NotificationTimeout();
      }
    } 

    onEdit(i: number) {
      if (
        this.editingItemID === i || 
        this.editingItemID === null
      ) {
        this.ChangeItemText(i);
      }

      return;
    }
}
