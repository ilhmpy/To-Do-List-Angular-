import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { trigger, transition, state, style, animate } from '@angular/animations';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";

interface TodoItem {
  text: string;
  checked: boolean;
}

interface EditingItemInputValueInterface {
  value: string | null;
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
   // todoValue: string = "";
    isMenuVisible = false;

    removingItem: TodoItem | null = null;
    editingItem: TodoItem | null = null;
    editingItemInputValue: EditingItemInputValueInterface = { value: null, i: null };
    showNotification: boolean = false;

    notification: NotificationInterface = { text: "", isVisible: false };

    todoItems: TodoItem[] = [];

    todoValueForm: FormGroup;

    isAllowedNewNotificationTimeout: boolean = true;
    
    constructor(private fb: FormBuilder) {
      this.todoValueForm = this.fb.group({
        todoValue: [
          '',
          [ Validators.required, Validators.minLength(5), Validators.maxLength(199) ]
        ]
      })
    }
    
    // сделать так что бы меню закрывалось когда уже нету элементов и открывалось когда появились
    // сделать так что бы и при нажатии на стрелочку тоже менялось положение меню
    // скорее всего проблема в реализации с isMenuVisible && todoItems.length > 0 || todoItems.length > 0
    // разобраться в чем причина и сделать рефакторинг для исправления 

    changeMenuState() {
      this.isMenuVisible = !this.isMenuVisible;
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

    NotificationTimeout() {
      if (this.isAllowedNewNotificationTimeout) {
        this.isAllowedNewNotificationTimeout = false;
        
        setTimeout(() => {
          this.showNotification = false;
          this.isAllowedNewNotificationTimeout = true;
        }, 6000);
      }
    }


    onEnter(event: KeyboardEvent) {
      if (event.key === "Enter" && this.editingItemInputValue.value === null) {
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
      if (!this.editingItem) {
        this.editingItem = this.todoItems[i];
        this.editingItemInputValue = { value: this.todoItems[i].text, i };
      } else {
          if (this.editingItemInputValue.value) {
            if (this.editingItemInputValue.value.length < 200 && this.editingItemInputValue.value.length > 5) {
              this.todoItems = this.todoItems.map((todoItem: TodoItem, idx: number) => {
                if (idx === i) {
                  return { ...todoItem, text: this.editingItemInputValue.value ? this.editingItemInputValue.value : "" }
                }
      
                return todoItem;
              });
          }
        } else {
          //this.UseNotification(1);
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
    
    // реализовать подсветку текста красным в случае того если символов больше 200 
    // с помощью div contentedditable="true"
    // перенести 200 и 5 в константы
    
    get TruncatedText() {
      if (this.editingItemInputValue && this.editingItemInputValue.value) {
        return this.editingItemInputValue.value.length > 200 ? 
          this.editingItemInputValue.value.slice(0, 200) :
          this.editingItemInputValue.value;
      } else {
        return this.editingItemInputValue;
      }
    }

    get ExcessText() {
      const text = this.editingItemInputValue.value ? this.editingItemInputValue.value.slice(200) : "";
      return text;
    }
}
