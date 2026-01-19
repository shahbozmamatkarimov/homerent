import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Error } from "../error/error";
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SubmitBtn } from "./submit-btn.component";

@Component({
  selector: 'app-upload-dialog',
  imports: [MatStepperModule, MatIconModule, ReactiveFormsModule, FormsModule, Error, MatFormFieldModule, MatSelectModule, SubmitBtn],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  templateUrl: './upload-dialog.html',
  styleUrl: './upload-dialog.css',
})
export class UploadDialog {
  currentStep = 6;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cdr: ChangeDetectorRef) { }

  amenitiesList: any = [
    { key: 'ac', label: 'Air Conditioning' },
    { key: 'heating', label: 'Heating' },
    { key: 'parking', label: 'Parking' },
    { key: 'washer', label: 'Washer/Dryer' },
    { key: 'dishwasher', label: 'Dishwasher' },
    { key: 'balcony', label: 'Balcony/Patio' },
    { key: 'pet', label: 'Pet Friendly' },
    { key: 'gym', label: 'Gym/Fitness' },
    { key: 'pool', label: 'Pool' },
  ];

  mainForm = new FormGroup({
    property: new FormGroup({
      title: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      bedrooms: new FormControl(0, [Validators.required, Validators.min(0)]),
      bathrooms: new FormControl(0, [Validators.required, Validators.min(0)]),
      squareFeet: new FormControl(0, [Validators.required, Validators.min(0)])
    }),
    rental: new FormGroup({
      monthly: new FormControl(null, Validators.required),
      deposit: new FormControl(null, Validators.required),
      available_date: new FormControl(null, Validators.required),
      lease_duration: new FormControl(null, [Validators.required, Validators.min(0)]),
    }),
    description: new FormGroup({
      description: new FormControl(null, Validators.required),
    }),
    amenities: new FormGroup(
      Object.fromEntries(
        this.amenitiesList.map((option: any) => [option.key, new FormControl(false, Validators.nullValidator)])
      )
    ),
    photos: new FormGroup({
      photos: new FormControl([], Validators.required),
    }),
    contact: new FormGroup({
      fullname: new FormControl(null, Validators.required),
      phone_number: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
    }),
    tenantPreferences: new FormGroup({
      tenantPreferences: new FormControl([], Validators.required),
    }),
    utilities: new FormGroup({
      utilities: new FormControl([], Validators.required),
    }),
  })

  canShowThisStep(step: number) {
    // return step == this.currentStep;
    return true
  }


  onToggle(mainKey: string, key: string, event: any) {
    this.getForm('amenities')!.get(key)!.setValue(event.target.checked);
    this.cdr.detectChanges();
  }
  getForm(type: string): FormGroup | null {
    const group = this.mainForm.get(type);
    if (group instanceof FormGroup) {
      return group;
    }
    return null;
  }

  submit(type: string) {
    const currentGroup = this.mainForm.get(type) as FormGroup;
    if (currentGroup?.invalid) {
      currentGroup.markAllAsTouched();
      return
    };
    this.currentStep++;
  }

  cancel(type: string) {
    const currentGroup = this.mainForm.get(type) as FormGroup;
    currentGroup.reset();
  }
}
