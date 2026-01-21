import { ChangeDetectorRef, Component, effect, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Error } from "../error/error";
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SubmitBtn } from "./submit-btn.component";
import { ApiService } from '../services/api.service';
import { GlobalService } from '../global/global';

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
  currentStep = 1;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cdr: ChangeDetectorRef, private apiService: ApiService, public global: GlobalService) {
    this.buildForm();
    effect(() => {
      const options = this.global.formOptions();

      if (options) {
        this.initOptions(options);
      }
    });
  }

  imagePreview: string[] = [];
  mainForm: FormGroup = new FormGroup({});

  private buildForm() {
    this.mainForm = new FormGroup({
      property: new FormGroup({
        title: new FormControl('', Validators.required),
        type: new FormControl('', Validators.required),
        address: new FormControl('', Validators.required),
        bedrooms: new FormControl(0, [Validators.required, Validators.min(0)]),
        bathrooms: new FormControl(0, [Validators.required, Validators.min(0)]),
        sqft: new FormControl(0, [Validators.required, Validators.min(0)])
      }),
      rental: new FormGroup({
        monthlyRent: new FormControl(null, Validators.required),
        securityDeposit: new FormControl(null, Validators.required),
        availableFrom: new FormControl(null, Validators.required),
        leaseDuration: new FormControl(null, [Validators.required, Validators.min(0)]),
      }),
      description: new FormGroup({
        description: new FormControl(null, Validators.required),
      }),
      amenities: new FormGroup({}),
      uploaded: new FormGroup({
        uploaded: new FormArray([]),
      }),
      contact: new FormGroup({
        contactName: new FormControl(null, Validators.required),
        contactPhone: new FormControl(null, Validators.required),
        contactEmail: new FormControl(null, Validators.required),
      }),
      tenantpreferences: new FormGroup({
        tenantpreferences: new FormControl([], Validators.required),
      }),
      utilities: new FormGroup({
        utilities: new FormControl([], Validators.required),
      }),
    });
  }

  initOptions(options: any) {
    const amenitiesGroup = new FormGroup({});
    const tenantpreferencesGroup = new FormGroup({});
    const utilitiesGroup = new FormGroup({});

    options.amenities.forEach((item: any) => {
      amenitiesGroup.addControl(
        item.id.toString(),
        new FormControl(false)
      );
    });
    options.tenantpreferences.forEach((item: any) => {
      tenantpreferencesGroup.addControl(
        item.id.toString(),
        new FormControl(false)
      );
    });
    options.utilities.forEach((item: any) => {
      utilitiesGroup.addControl(
        item.id.toString(),
        new FormControl(false)
      );
    });

    this.mainForm.setControl('amenities', amenitiesGroup);
    this.mainForm.setControl('tenantpreferences', tenantpreferencesGroup);
    this.mainForm.setControl('utilities', utilitiesGroup);
  }

  canShowThisStep(step: number) {
    return step == this.currentStep;
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

  prevBtn() {
    this.currentStep--;
  }

  cancel(type: string) {
    const currentGroup = this.mainForm.get(type) as FormGroup;
    currentGroup.reset();
  }

  onDragOver(event: Event) {
    event.preventDefault();
  }

  // From drag and drop
  onDropSuccess(event: any) {
    event.preventDefault();

    this.onFileChange(event.dataTransfer.files);    // notice the "dataTransfer" used instead of "target"
  }

  // From attachment link
  onChange(event: any) {
    this.onFileChange(event.target?.files[0]);    // "target" is correct here
  }

  private onFileChange(file: File) {
    const control: any = this.mainForm.get('uploaded.uploaded');
    control?.push(new FormControl(file));
    control?.markAsDirty();

    const imageUrl: string = URL.createObjectURL(file);
    this.imagePreview.push(imageUrl);
  }

  getIdsFromObj(obj: any) {
    return Object.entries(obj || {})?.filter(item => item[1])?.map(item => +item[0])
  }

  async storePost() {
    try {
      const amenities = this.getIdsFromObj(this.mainForm.value.amenities);
      const utilities = this.getIdsFromObj(this.mainForm.value.utilities);
      const tenantpreferences = this.getIdsFromObj(this.mainForm.value.tenantpreferences);
      console.log(amenities, utilities, tenantpreferences);
      
      const subcategory_id = this.global.getParams()?.get('id');
      let data: any = { amenities, utilities, tenantpreferences, ...this.mainForm.value.property, ...this.mainForm.value.rental, ...this.mainForm.value.description, ...this.mainForm.value.contact, ...this.mainForm.value.uploaded, subcategory_id }

      const formData: any = new FormData();
      Object.keys(data).map(item => {
        if (item == 'uploaded') {
          console.log(data[item]);
          for (let i = 0; i < data[item]?.length; i++) {
            formData.append('images', data[item][i]);
          }

        } else if (data[item]) {
          formData.append(item, data[item]);
        }
      })
      data = await this.apiService.post<any>('/post/create', formData);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Xatolik yuz berdi:', error);
    } finally {
      this.cdr.detectChanges();
    }
  }
}
