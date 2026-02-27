import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-imc-card',
  templateUrl: './imc-card.component.html',
  styleUrls: ['./imc-card.component.scss'],
  standalone: false
})
export class ImcCardComponent implements OnInit, OnChanges {
  @Input() bmi: number = 0;
  @Input() height: number = 0; // cm
  @Input() weight: number = 0;
  @Input() weightUnit: string = 'kg'; // 'kg' or 'lb'

  @Output() onEdit = new EventEmitter<void>();

  category: string = '';
  categoryColor: string = '';
  indicatorPosition: string = '0%';

  ngOnInit() {
    this.calculateCategory();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['bmi']) {
      this.calculateCategory();
    }
  }

  // Categories based on standard BMI
  // < 18.5: Bajo peso (Azul)
  // 18.5 - 24.9: Peso saludable (Cyan)
  // 25 - 29.9: Sobrepeso (Amarillo)
  // 30 - 34.9: Obesidad I (Naranja)
  // >= 35: Obesidad II+ (Rojo)
  calculateCategory() {
    if (this.bmi < 18.5) {
      this.category = 'Bajo peso';
      this.categoryColor = '#4169E1'; // RoyalBlue
    } else if (this.bmi < 25) {
      this.category = 'Peso saludable';
      this.categoryColor = '#66CDAA'; // MediumAquamarine (Cyan-ish)
    } else if (this.bmi < 30) {
      this.category = 'Sobrepeso';
      this.categoryColor = '#F4D03F'; // Yellow
    } else if (this.bmi < 35) {
      this.category = 'Obesidad I';
      this.categoryColor = '#F0B27A'; // Orange
    } else {
      this.category = 'Obesidad II+';
      this.categoryColor = '#E74C3C'; // Red
    }

    // Calcular posición del indicador (mínimo 15, máximo 40 en la barra visual de la imagen)
    // Para simplificar, la barra va de un factor ~13 hasta ~42.
    // Haremos regla de 3 simple o limitarlo visualmente.
    const minVal = 13;
    const maxVal = 42;
    let percent = ((this.bmi - minVal) / (maxVal - minVal)) * 100;

    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    // Add offset specifically for the visual bar 
    this.indicatorPosition = `${percent}%`;
  }

  edit() {
    this.onEdit.emit();
  }
}
