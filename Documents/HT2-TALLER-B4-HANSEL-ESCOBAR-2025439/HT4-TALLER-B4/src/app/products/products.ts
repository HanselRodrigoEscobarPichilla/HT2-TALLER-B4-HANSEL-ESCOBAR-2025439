import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../service/productService';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-products',
  styleUrl: './products.scss',
  templateUrl: './products.html',
})
export class Products implements OnInit{

  productForm!: FormGroup;
  categories: string[] = ['Electrónica', 'Ropa', 'Hogar', 'Alimentos', 'Deportes'];
  successMessage: string | null = null;
  charging: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService

  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      category: ['', [Validators.required]],
      stock: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]]
    });
  }

  isInvalid(field: string): boolean {
    const control = this.productForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  getErrors(field: string): string[] {
    const control = this.productForm.get(field);
    const error: string[] = [];

    if (!control || !control.errors) return error;
    
    if (control.errors['required']) error.push('Este campo es obligatorio');
    
    if (control.errors['minlength']){
      error.push(`Minimo ${control.errors['minlength'].requiredLength} caracteres.`);
    }
    if (control.errors['maxlength']){
      error.push(`Maximo ${control.errors['maxlength'].requiredLength} caracteres.`);
    }
    if (control.errors['min']){
      error.push(`El valor debe ser igual o igual a ${control.errors['min'].min}.`);
    }
    if (control.errors['pattern']){
      error.push(`Solo se permiten numeros enteros positivos.`)
    }

    return error;
  }
  
  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.charging = true;
    this.successMessage = null;

    this.productService.saveProduct(this.productForm.value).subscribe({
      next: (answer) => {
        this.charging = false;
        this.successMessage = `Producto guardado con exito con ID: ${answer.data.id}`;
        console.log('[Componente] Respuesta recibida del servidor: ', answer);
        this.productForm.reset({ stock: 0});
      },
      error: (err) => {
        this.charging =  false;
        console.error('[Componente] Error al guardar el producto: ', err);
      }
    });
  }
}
