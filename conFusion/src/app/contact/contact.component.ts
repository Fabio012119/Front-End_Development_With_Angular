import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { expand, flyInOut } from '../animations/app.animations';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm!: FormGroup;
  feedback!: Feedback;
  contactType: string[] = ContactType;
  submitting: boolean = false;
  submitted: boolean = false;

  @ViewChild('fform') feedbackFormDirective: any;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required': 'First name is required',
      'minlength': 'First name must be at least 2 characters long',
      'maxlength': 'First name must be at most 25 characters long'
    },
    'lastname': {
      'required': 'Last name is required',
      'minlength': 'Last name must be at least 2 characters long',
      'maxlength': 'Last name must be at most 25 characters long'
    },
    'telnum': {
      'required': 'Tel. number is required',
      'pattern': 'Tel. number must contain numbers only'
    },
    'email': {
      'required': 'Email is required',
      'email': 'Email not in valid format'
    },
  };

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService
  ) {
    this.createForm();
   }

  ngOnInit(): void {
  }

  createForm(): void {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) return;

    const form = this.feedbackForm;
    const formErrors = this.formErrors;
    const validationMessages = this.validationMessages;

    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field as keyof typeof formErrors] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field as keyof typeof validationMessages];
          for (const key in control.errors) {
            if (control.errors && control.errors.hasOwnProperty(key)) {
              this.formErrors[field as keyof typeof formErrors] += messages[key as keyof typeof messages] + ' ';
            }
          }
        }
      }
    }
  }
  onSubmit() {
    this.submitting = true;
    this.feedbackService.submitFeedback(this.feedbackForm.value)
      .subscribe(
        feedbackWithId => {
          this.feedback = {...this.feedback, ...feedbackWithId}
          this.submitting = false;
          this.submitted = true;
        },
        errMsg => {
          console.error(errMsg);
      });
    setTimeout(() => {
      this.submitted = false;
    }, 5000);

    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }
}
