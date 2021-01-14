import {FormArray, FormControl, FormGroup} from '@angular/forms';

export interface FormState {
  context: string;
  formState: any;
}

/**
 * Used for ModelData forms
 * This class handles an local auto-save feature on every input, allowing the user to restore the state of the form in case of
 * accidental refresh of network issues.
 * This keeps the last form opened in memory, across the all website
 */
export abstract class FormStateSaver {

  /**
   *  Local Storage Key for the saved form state
   */
  static LS_KEY_FORMSTATE = 'cm-formstate';

  public form: FormGroup;

  protected constructor(private context: string) {
  }

  abstract notifyExistingFormState(): void;
  abstract registerFormChanges(): void;

  setContextId(id: string): void {
    this.context += '.' + id;
  }

  formStateChanged(): void {
    if (this.form.dirty) {
      const item: FormState = {
        context: this.context,
        formState: this.form.getRawValue()
      };
      window.localStorage.setItem(FormStateSaver.LS_KEY_FORMSTATE, JSON.stringify(item));
    }
  }

  checkFormState(): void {
    const savedState = this.getFormState();
    if (!!savedState && savedState.context === this.context) {
      this.notifyExistingFormState();
    } else {
      this.registerFormChanges();
    }
  }

  restoreFormState(): void {
    try {
      const saved = this.getFormState();
      this.propagateFormState(saved.formState, this.form);
    } catch (err) {
      this.clearSavedState();
      console.error(err);
    }
  }

  clearSavedState(): void {
    window.localStorage.removeItem(FormStateSaver.LS_KEY_FORMSTATE);
  }

  abstract restoreFormArray(controlName: string, state: any[]): void;

  private propagateFormState(state: any, formGroup: FormGroup): void {
    Object.keys(state).forEach((controlKey) => {
      if (formGroup.get(controlKey) instanceof FormControl) {
        formGroup.get(controlKey).patchValue(state[controlKey]);
      } else if (formGroup.get(controlKey) instanceof FormGroup) {
        this.propagateFormState(state[controlKey], formGroup.get(controlKey) as FormGroup);
      } else if (formGroup.get(controlKey) instanceof FormArray) {
        this.restoreFormArray(controlKey, state[controlKey]);
      }
    });
  }

  private getFormState(): FormState {
    try {
      const saved = window.localStorage.getItem(FormStateSaver.LS_KEY_FORMSTATE);
      if (!saved) { return undefined; }
      return JSON.parse(saved) as FormState;
    } catch (err) {
      this.clearSavedState();
      return undefined;
    }
  }
}

